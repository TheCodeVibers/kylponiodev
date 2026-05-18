# 10 — Asset Manifest

Everything that must be produced or sourced before launch.

---

## 3D Models (GLB, Draco-compressed)

| Asset | File | Source | Notes |
|---|---|---|---|
| Chibi character | `character.glb` | Custom / commission | Humanoid, Mixamo-compatible rig, ~10k tris |
| Desk | `desk.glb` | Custom (Blender) | Low-poly, emissive trim baked-in |
| Monitor | `monitor.glb` | Custom | Reused 3× with material variations |
| Guitar | `guitar.glb` | Custom or CC0 (Sketchfab) | Solid-body electric, stand included |
| Chair | `chair.glb` | Custom or CC0 | Used during guitar sit |
| Room props | `room_props.glb` | Custom | Optional ambient props (cables, mug, plant) |

### Recommended Sourcing
- **Mixamo** for animations (free, Adobe ID required)
- **Sketchfab** filtered by CC0 / CC-BY for prop meshes
- **Blender** for custom desk/monitor/guitar low-poly
- **Quaternius** kits (CC0) as backup

---

## Animation Clips
Separate GLB clips (smaller, easier to swap) or inside `character.glb`:

| Clip | Length | Loop | Description |
|---|---|---|---|
| `idle_hologram` | 4s | ✅ | Gentle breath + slow 360° Y rotation |
| `walk` | 1.2s | ✅ | Walk cycle |
| `sit_down` | 0.8s | one-shot | Transition into seated |
| `stand_up` | 0.8s | one-shot | Reverse of sit_down |
| `play_guitar` | 8s | ✅ | Strumming idle |
| `wave` | 1.5s | one-shot | Easter-egg greeting |

> Source via Mixamo (free) and re-target if commissioning the character mesh elsewhere.

---

## Textures (KTX2 / WebP)

| Asset | Notes |
|---|---|
| Floor reflection normal | tileable, 1024² |
| Floor reflection roughness | tileable, 1024² |
| Hologram noise/dither | 512² |
| Monitor bezel material | 512² |
| Desk emissive trim | 512² |
| Game sprite atlas | `vibe-striker-sprites.png` (also 1× source) |
| Environment HDRI | "warehouse" preset (~1MB) — Poly Haven CC0 |

---

## Audio

### Music (loops)
| File | Length | Bitrate | Use |
|---|---|---|---|
| `ambient_drone.opus` | 60s loop | 64kbps | Hero ambient |
| `guitar_loop.opus` | 32-bar / ~20s | 90kbps | Guitar interaction |
| `chiptune_level1.opus` | 60s loop | 90kbps | Mini-game L1 |
| `chiptune_level2.opus` | 75s loop | 90kbps | Mini-game L2 |
| `chiptune_level3.opus` | 90s loop | 90kbps | Mini-game L3 |
| `chiptune_boss.opus` | 60s loop | 96kbps | Boss fight |

### SFX (one-shots, each < 30KB Opus)
- `ui_hover.opus`
- `ui_click.opus`
- `whoosh.opus`
- `laser.opus`
- `enemy_hit.opus`
- `explosion.opus`
- `powerup.opus`
- `game_over.opus`
- `transmit_success.opus`
- `glitch.opus` (easter-egg)
- `vibe_overload.opus` (5-click easter-egg)

### Sourcing
- **Freesound.org** (CC0 / CC-BY)
- **Pixabay Audio** (royalty-free)
- **BeepBox** for custom chiptunes
- **Tone.js** for synthesized SFX if you want runtime-generated

---

## Fonts (via `next/font/google`)
- **Orbitron** (700, 900)
- **Rajdhani** (500, 600)
- **JetBrains Mono** (400, 500)
- **Inter** (400, 500, 600)

All variable / latin subset only. Self-hosted via `next/font` for no third-party request.

---

## Images

### Branding
- OG / social share (1200×630) — hero shot of the scene with name overlay
- Twitter / X card (same, with adjustments)
- Favicon set — 16, 32, 48, 96, 192, apple-touch 180, maskable 512
  - Generate with **realfavicongenerator.net**

### Profile / Bio
- Profile photo (optional, used in Contact panel) — 512² WebP

### Project Previews
3–6 images or short MP4s per project:

#### Chat System
- UI screenshots: chat list, conversation, settings, mobile view
- 8s mp4 walkthrough (typing → message arrives → optimistic UI)

#### Admin Dashboard
- UI screenshots: dashboard overview, analytics charts, user management, role editor
- 8s mp4 walkthrough (filter changes → chart animates)

#### Frontend Developer Projects
- Collection thumbnail grid (6–9 cards)
- Highlight mp4: 12s reel of motion experiments

---

## Copy

### Bio
Three lengths:
1. **1-liner** — "Vibe Coder building cinematic web realities."
2. **280-char** — "Passionate Vibe Coder and Full Stack Developer who builds immersive digital experiences. I combine code, motion, sound, and play to turn imagination into interactive systems. Specializing in modern frontend animations and 3D web experiences."
3. **600-char** — Longer About section paragraph (write fresh, hits all identity bullets from [01_VISION_AND_SCOPE.md](./01_VISION_AND_SCOPE.md))

### Project Descriptions
Each project needs:
- Title
- 1-line tagline
- 2–3 paragraph longer description
- Tech stack chips list (8–12 items)
- Live demo URL (or "Coming soon")
- Source URL (or "Private")

### Voice-Line Bubbles
5–10 options for character click reactions:
- "Welcome to my workspace."
- "Ready to vibe?"
- "Pick a monitor. Or the guitar."
- "I built this room for you."
- "Coffee. Code. Repeat."
- "Press play. Vibe loaded."
- "The browser is my stage."
- "Care for a game?"
- "Want to hear something?"
- "Glitch in the matrix? Cool."

### 404 Page
- Headline: "SIGNAL LOST"
- Body: "Looks like that endpoint doesn't exist in this dimension. Let's get you back to the workspace."
- CTA: "↶ RETURN TO HERO"

---

## Misc
- `LICENSE` (MIT or All Rights Reserved — pick before launch)
- `README.md` (the dev-facing one, not this planning README)
- `humans.txt` (fun for the vibe — credits, easter eggs, build notes)
- `robots.txt` + `sitemap.xml`
- Press kit folder (optional) — high-res hero shot, logos, bio text, headshots

---

## Sourcing Checklist
Use this as a build-list before going live:

- [ ] Character commissioned / sourced
- [ ] Mixamo animations downloaded + retargeted
- [ ] Models compressed with Draco
- [ ] Textures converted to KTX2 / WebP
- [ ] HDRI sourced from Poly Haven
- [ ] Audio loops composed / sourced (CC-compatible licenses verified)
- [ ] SFX gathered (license tracking sheet maintained)
- [ ] Project preview videos captured (1080p min, 30fps)
- [ ] Project screenshots taken on retina display
- [ ] OG image rendered
- [ ] Favicons generated
- [ ] Bio copy finalized (all 3 lengths)
- [ ] Voice-line bubble copy finalized
- [ ] 404 copy finalized

---

## License Tracking
Maintain a `LICENSES.md` in the repo:

```
| Asset | License | Source | URL | Attribution required? |
|---|---|---|---|---|
| character.glb | Commissioned | (artist name) | — | — |
| desk.glb | Custom | self | — | — |
| guitar.glb | CC0 | Sketchfab | <link> | No |
| ambient_drone.opus | CC-BY | Freesound | <link> | Yes |
| ... |
```
