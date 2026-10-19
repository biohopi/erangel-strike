# ERANGEL STRIKE — Tactical 3D Shooter Prototype

A high-fidelity **Team Deathmatch** 3D shooter built entirely with Three.js. Features an Erangel-style open map, three weapon classes, AI bots, procedural rendering, and a tactical PUBG-mobile-inspired UI. Runs at 60–90 FPS on capable hardware.

**All 3D models, textures, and audio are procedurally generated at runtime — the entire game ships in a single self-contained HTML file.** Three.js is loaded from a CDN (with a local copy served by the included Express server).

---

## How to Run

### Offline (bots only — no server needed)
Simply open `index.html` in a modern browser (Chrome, Edge, Firefox, or Brave):
```
open index.html
```
Works from `file://` protocol too. No internet required after the first load (Three.js is fetched from a CDN on first open; your browser will cache it).

### LAN / BroadcastChannel Demo
Serve the folder via any static HTTP server and open the same URL in two browser tabs:
```bash
# Option A: Node's built-in server
npx http-server . -p 3000 -c-1

# Option B: Python
python3 -m http.server 3000
```
Then click **DEPLOY** in both tabs using "LAN" mode. Tabs discover each other (full state sync is documented in the roadmap).

### Online Multiplayer (Socket.io)
```bash
# 1. Install the server dependencies
npm install

# 2. Start the game server
node server.js

# 3. Open the printed URL (default http://localhost:3000) in 2+ browser tabs
# 4. In each tab set Mode → "Online (Socket.io)" and hit DEPLOY
```
Real-time sync uses **client-authoritative relay** — each client broadcasts its position/state at ~25 Hz and interpolates remote players. The server relays messages between clients (no authoritative simulation; see roadmap for planned upgrade).

### Mobile Play
- **Desktop:** WASD + mouse + number keys (1/2/3 for weapons)
- **Mobile (Android / iOS):** left virtual joystick + right-side touch drag to look. Gyroscope support is available (enable in the menu). Touch buttons for fire, aim, jump, sprint, reload. Weapon switching via on-screen buttons (top-right of the touch area).
- **Fullscreen:** Tap the "F" key on desktop or the Fullscreen button in the Profile tab.

---

## Controls Reference

| Action        | Desktop              | Mobile               |
|---------------|----------------------|----------------------|
| Move          | WASD                 | Left joystick        |
| Look          | Mouse (click to lock)| Right drag + gyro(opt)|
| Fire          | Left click           | FIRE button          |
| Aim down sight| Right click          | 🔍 AIM button        |
| Jump          | Space                | JUMP button          |
| Sprint        | Shift                | RUN button           |
| Reload        | R                    | ⟳ button             |
| Weapon 1/2/3  | 1 2 3                | RIFLE / SMG / PISTOL |
| Pause / Menu  | P or Esc             | ☰ button             |
| Fullscreen    | F                    | Profile tab          |
| Crouch        | C                    | —                    |
| Mute          | M                    | —                    |

---

## Asset List (all free / royalty‑free)

All 3D assets are **procedurally generated at runtime** via Three.js geometry + canvas textures. No external files are needed. The sources of inspiration and final-usage art direction:

| Asset                | Method / Source of Inspiration                   |
|----------------------|--------------------------------------------------|
| Terrain (Erangel)    | Perlin value noise heightfield, vertex-coloured, procedural grass/dirt/sand canvas texture |
| Buildings (village)  | Procedural box geometry + canvas window texture, colour palettes inspired by PUBG Erangel (brick, concrete, red-roof) |
| Vegetation/trees     | Procedural cone + trunk InstancedMeshes (~420 trees) |
| Bushes/rocks         | Instanced spheres / dodecahedra                  |
| Sky dome             | Gradient sphere vertex-shader + procedural cloud positions |
| Water (river)        | Semi-transparent plane with animated vertical bob |
| Soldier characters   | Modular box-fixture "mecha" hero style, team-coloured uniform, helmet, vest |
| Weapon models        | Procedural box + cylinder silhouettes (rifle / SMG / pistol) |
| Muzzle flash / fx    | Shader‑based particle system (AdditiveBlending, GL_POINTS) |
| UI textures          | Pure CSS (dark tactical, gradients, SVGs)        |
| Audio / SFX          | Web Audio API — procedurally generated oscillator + noise (shots, reloads, footsteps, hitmarker, UI clicks, ambient drone) |
| Map / level design   | Procedural placement tuned to evoke Erangel's layout — central river, hills, village cluster, open fields |

> **If you prefer real external models:** swap in models from Sketchfab, TurboSquid FREE, or the Three.js examples repository (`FBXLoader`, `GLTFLoader`). The procedural art is a bootstrap — the build roadmap below covers the asset-replacement path.

---

## Build Roadmap

### Phase 1 — Polish & Performance (next)
- [ ] **LOD system** — Replace all-distance InstancedMesh with distance-based discarding for grass/bush details beyond 80 m
- [ ] **Object pooling** — Full reuse of particles, tracers, and bullet-impact decals (already partially pooled; extend pooling to match projectiles)
- [ ] **Dynamic lighting** — Switch from baked-follow to cascaded shadow maps for far-reaching architecture shadows
- [ ] **Post-processing** — Tone‑mapping, bloom on muzzle flashes, vignette on low health (Three.js EffectComposer)
- [ ] **Mobile vulkan path** — WebGPU renderer when available

### Phase 2 — Gameplay Depth
- [ ] **Additional weapons** — Shotgun, sniper rifle, grenades, melee
- [ ] **Armor / loot** — Equipment pickups scattered on the map (helmet levels, armor vests, scopes)
- [ ] **Map improvements** — More buildings, predictable loot spawn points, compound navigation
- [ ] **Sound** — Spatial audio (three-dimensional `PannerNode`), footstep surface detection
- [ ] **Damage model** — Limb-specific damage, hit‑location feedback, knock‑down state

### Phase 3 — Real Multiplayer
- [ ] **Server-authoritative simulation** — Replace current client-authoritative relay with a deterministic sim-loop on the server; clients send only inputs
- [ ] **Full player sync** — Pose snapshots + interpolation + lag compensation (rewind hit‑scan for distant shooters)
- [ ] **WebRTC side‑channel** — Use WebRTC data channels for P2P latency reduction with server fallback
- [ ] **Matchmaking / Lobbies** — Room browser, friend invites, spectator mode
- [ ] **Anti‑cheat basics** — Server-side movement validation, shot-rate enforcement

### Phase 4 — Art & Content
- [ ] **Replace procedural models** — Import high‑quality static meshes (FBX/GLTF) from free libraries:
  - Sketchfab `CC0` / `CC-BY` soldier rigs (mixamo.com for animations)
  - TurboSquid free weapons (or poly.pizza low‑poly packs)
  - OpenGameArt.org building / tree assets
- [ ] **Animation** — Replace elbow/knee bob with full keyframe / blend‑tree animations (mixamo or three-bot)
- [ ] **Terrain texture splatting** — Multi‑layer splat map (grass, dirt, asphalt, sand) instead of vertex colours
- [ ] **Weather / time of day** — Cloud cover, dynamic sun position, rain particle system

### Phase 5 — Full Game Features
- [ ] **Battle Royale mode** — Large 100‑player map, circle system, parachuting, inventory UI
- [ ] **Vehicles** — Jeep / Dacia physics via `Cannon-es` or `Ammo.js`
- [ ] **Social features** — Friends, voice chat, in-game clan tags
- [ ] **Replay system** — Demos of completed matches

---

## Project Structure

```
erangel-shooter/
├── index.html          ← Single-file game client (all code, CSS, HTML)
├── server.js           ← Socket.io + Express dev server for online play
├── package.json        ← Server dependencies (express, socket.io, three)
├── README.md           ← This file
└── smoke.js / match_sim.js ← Automated smoke/regression test harnesses (dev-only)
```

The game client is **a single `index.html`** — you can copy it anywhere and it works offline. The server is optional (needed only for real-time online multiplayer).

---

## Technical Summary

| Component              | Technology / Approach                                  |
|------------------------|-------------------------------------------------------|
| 3D Engine              | Three.js r160 (WebGL / WebGPU)                        |
| Rendering              | ACES filmic tone‑mapping, PCFSoft shadows, fog        |
| Maps / Levels          | Procedural noise heightfield, instanced vegetation     |
| Characters             | Boxy modular soldier + weapon hierarchy               |
| Particles / FX         | Custom shader particles (additive), tracer lines       |
| Audio                  | Web Audio API (oscillator + noise nodes)              |
| Networking             | Socket.io (online) or BroadcastChannel (LAN)          |
| Input                  | PointerLock + keyboard (desktop), Touch + gyro (mobile) |
| Storage                | localStorage for profile persistence                  |
| Performance            | InstancedMesh for vegetation, auto shadow follow, LOD planned |

---

## License

MIT. The game, procedural assets, and code are free to use, modify, and distribute. Three.js, Express, and Socket.io are MIT‑licensed open source.