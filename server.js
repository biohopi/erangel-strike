#!/usr/bin/env node
/**
 * ============================================================================
 * ERANGEL STRIKE — Socket.io dev server
 *
 * Serves the game over HTTP and provides real-time multiplayer rooms.
 *
 * USAGE
 *   npm install            (installs express + socket.io + three for bundling)
 *   node server.js
 *   -> open the printed URL (default http://localhost:3000)
 *
 * Then open the same URL in 2+ browser tabs and set mode = "Online (Socket.io)"
 * to play together. AI bots still fill empty slots for each connected player.
 * ============================================================================
 */
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 1e6, pingInterval: 1000, pingTimeout: 4000 });

const ROOT = __dirname;

// Serve the (socket.io-injected) game page first, then static files.
app.get('/', (req, res) => {
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const tag = '<script src="/socket.io/socket.io.js"></script>\n';
  html = html.replace('<noscript>', tag + '<noscript>');
  return res.send(html);
});
app.use(express.static(ROOT));
// Serve a local copy of Three.js so offline/Intranet clients never depend on the CDN.
app.get('/three.min.js', (req, res) => {
  const p = path.join(ROOT, 'node_modules', 'three', 'build', 'three.min.js');
  res.sendFile(p, (err) => { if (err) res.status(404).end(); });
});

// ---------------------------------------------------------------------------
// Game rooms. Simplest robust model for a prototype:
//   - One room per "team size + accent" is created on demand (named "room-<n>").
//   - When a client joins, they get the room roster and a spawned server entity.
//   - Clients send their own move/aim/shoot intents; the server relays them to
//     the other clients in the room. Each client runs the simulation with
//     remote players interpolated. This is "client-authoritative sync" for a
//     prototype — acceptable for LAN/demo, documented in the roadmap.
// ---------------------------------------------------------------------------
const rooms = new Map(); // roomId -> { clients:Set }

function joinRoom(socket, roomId) {
  let room = rooms.get(roomId);
  if (!room) { room = { clients: new Set() }; rooms.set(roomId, room); }
  room.clients.add(socket);
  socket.data.roomId = roomId;
  socket.join('room:' + roomId);
  // tell the newcomer who is here
  const roster = [...room.clients].filter(c => c !== socket).map(c => ({
    id: c.data.uid, name: c.data.name, team: c.data.team
  }));
  socket.emit('room:enter', { roomId, roster });
  // tell existing clients a new peer joined
  socket.to('room:' + roomId).emit('player:join', { id: socket.data.uid, name: socket.data.name, team: socket.data.team });
  console.log(`[${roomId}] + ${socket.data.name} (total ${room.clients.size})`);
}

function leaveRoom(socket) {
  const roomId = socket.data.roomId;
  if (!roomId) return;
  socket.to('room:' + roomId).emit('player:leave', { id: socket.data.uid });
  const room = rooms.get(roomId);
  if (room) {
    room.clients.delete(socket);
    if (room.clients.size === 0) rooms.delete(roomId);
  }
  socket.leave('room:' + roomId);
}

io.on('connection', (socket) => {
  // Client sends { name, team, teamSize, roomName? } as handshake.
  socket.data.uid = 'p_' + Math.random().toString(36).slice(2, 10);
  socket.data.name = 'Player';

  socket.on('join', (opts = {}) => {
    socket.data.name = (opts.name || 'Player').slice(0, 12);
    socket.data.team = (opts.team === 0 || opts.team === 1) ? opts.team : (Math.random() < 0.5 ? 0 : 1);
    const roomId = 'room_' + (opts.roomId ? String(opts.roomId) : 'default');
    joinRoom(socket, roomId);
  });

  // Relay control state at ~20-30 Hz from each client to the room.
  socket.on('state', (data) => {
    if (!socket.data.roomId) return;
    // tag with author
    socket.to('room:' + socket.data.roomId).emit('remote:state', {
      id: socket.data.uid, ...data
    });
  });

  // Fire events (optional; state already carries aim but triggers are nice for fx).
  socket.on('shoot', (data) => {
    if (!socket.data.roomId) return;
    socket.to('room:' + socket.data.roomId).emit('remote:shoot', { id: socket.data.uid, ...data });
  });

  socket.on('name', (n) => { socket.data.name = String(n).slice(0, 12); });

  socket.on('disconnect', () => leaveRoom(socket));
});

server.listen(PORT, () => {
  const addrs = [];
  const os = require('os');
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) addrs.push(net.address);
    }
  }
  console.log('\n  ERANGEL STRIKE dev server running');
  console.log('  --------------------------------');
  console.log('  Local:     http://localhost:' + PORT);
  addrs.forEach(a => console.log('  Network:   http://' + a + ':' + PORT));
  console.log('  Open the same URL in 2+ tabs and choose "Online (Socket.io)".\n');
});