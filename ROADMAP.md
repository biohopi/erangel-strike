# ERANGEL STRIKE — Art & Content Roadmap

## Phase 1: Polish & Performance (Next)
- [ ] LOD system for vegetation at 80m+ distance
- [ ] Object pooling for particles/traces
- [ ] Dynamic shadow follow + post-processing (bloom, vignette)
- [ ] Mobile WebGPU path when available

## Phase 2: Gameplay Depth
- [ ] Additional weapons (shotgun, sniper, grenades)
- [ ] Armor/equipment pickups (helmet levels, scopes)
- [ ] Sound design (spatial audio, footstep surfaces)
- [ ] Hit location damage + knock-down state

## Phase 3: Real Multiplayer
- [ ] Server-authoritative simulation
- [ ] Lag compensation & interpolation
- [ ] WebRTC P2P data channels
- [ ] Matchmaking & friend system

## Phase 4: Art & Content
- [ ] Import real 3D models (Sketchfab, TurboSquid CC0)
- [ ] Full animations (Mixamo rigs)
- [ ] Multi-layer terrain textures (grass/dirt/asphalt)
- [ ] Weather system (clouds, rain, time of day)

## Phase 5: Full Game Features
- [ ] Battle Royale mode (100p map, circle, parachuting)
- [ ] Vehicles (jeep/dacia physics)
- [ ] Social features (voice chat, clans)
- [ ] Replay system

---

**How to upgrade graphics:**
Replace the procedural assets with real GLTF/FBX models. The current code already supports loaders — just drop in new files and update the asset generation functions in `index.html`.