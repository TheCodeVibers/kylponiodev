# 07 — Mini-Game: VIBE STRIKER

A retro side-scrolling shooter inspired by Nokia's *Space Impact*, dressed in neon-cyberpunk.

---

## Concept
You pilot the **VBR-01 "Vibe Runner"** through three short waves of corrupted code-monsters. Score, survive, beat the boss in Level 3.

---

## Visual Style
- Pixel art at logical **320×180**, scaled 3× to **960×540** (or fit container, integer scaling preferred)
- CRT shader overlay on the canvas (scanlines + slight curvature + RGB split)
- Palette: deep purple background, **cyan** player, **magenta** enemies, **acid green** powerups, **yellow** bullets
- Parallax starfield (3 layers) + slow nebula gradient sweep
- Hit flashes (white frame on hit), screen shake on big hits
- Particle bursts on explosions

---

## Controls
| Input | Action |
|---|---|
| ↑ ↓ / W S | Move ship up / down |
| ← → / A D | Move ship left / right (limited horizontal zone — left half of screen) |
| Space / Z | Fire primary |
| X | Bomb (limited, clears screen) |
| P / Esc | Pause |
| Touch swipe | Move ship |
| Touch tap | Fire |
| Two-finger tap | Bomb |

Pointer Lock is **not** used (player needs cursor for the rest of the page after exit).

---

## Game Loop
- Fixed timestep 60 Hz using accumulator pattern
- Variable rendering frame
- ECS-lite: typed arrays of entities filtered by component flags

```ts
const STEP = 1000 / 60;
let acc = 0;
let last = performance.now();

function frame(now: number) {
  acc += now - last;
  last = now;
  while (acc >= STEP) {
    update(STEP);
    acc -= STEP;
  }
  render(acc / STEP); // alpha for interpolation
  raf = requestAnimationFrame(frame);
}
```

---

## Systems
1. **Input** — keyboard, touch, gamepad (optional)
2. **Spawner** — wave-scripted enemy spawns per level
3. **Physics** — simple AABB collision, no gravity
4. **Combat** — bullet vs ship, hit/damage, particle FX
5. **Powerups** — drops with random chance: rapid-fire, triple-shot, shield, extra-life
6. **Score** — display + multiplier on no-hit streak (×2 at 10 kills, ×3 at 25)
7. **HUD** — lives, score, hi-score, bomb count, boss HP bar
8. **Audio** — chiptune music + SFX (laser, hit, explosion)
9. **Render** — layered canvas: background → entities → particles → HUD

---

## Levels

| Level | Theme | Length | Music | Boss |
|---|---|---|---|---|
| 1 | "Subnet 0x01" | 60s | `chiptune_level1.opus` | None — mid-level mini-boss |
| 2 | "Memory Leak" | 75s | `chiptune_level2.opus` | Mid-boss: the **WORM** |
| 3 | "Kernel Panic" | 90s | `chiptune_level3.opus` | **THE COMPILER** — 3 phases |

Levels are scripted as wave timelines:
```ts
// src/components/game/engine/levels.ts
export const LEVEL_1 = [
  { at: 1000,  spawn: 'bit',     pattern: 'wave',  count: 5 },
  { at: 4000,  spawn: 'bit',     pattern: 'line',  count: 4 },
  { at: 8000,  spawn: 'glitch',  pattern: 'zigzag',count: 3 },
  { at: 15000, spawn: 'loader',  pattern: 'solo' },
  // ...
];
```

---

## Enemies

| Type | Behavior | HP | Score |
|---|---|---|---|
| **Bit** | Small drone, single shot, straight line | 1 | 10 |
| **Glitch** | Zigzag, fast | 1 | 20 |
| **Loader** | Bullet-sponge, slow, drops powerup | 5 | 100 |
| **Phisher** | Homing missile, slow turn | 2 | 50 |
| **Sentinel** | Mid-boss, mini turret pattern | 30 | 500 |
| **The Compiler** | Final boss, 3 phases | 150 | 2500 |

### The Compiler — Phases
1. **Phase 1 — Turret**: stationary, 4-way bullet spread
2. **Phase 2 — Swarm Spawner**: drops 3 Bits every 2s; player must clear adds
3. **Phase 3 — Beam**: telegraphed wide laser sweep; vulnerable window between sweeps

---

## Powerups (drop from Loaders + 5% chance from regular enemies)
| Powerup | Effect | Duration |
|---|---|---|
| **R** | Rapid-fire (2× fire rate) | 10s |
| **T** | Triple-shot (3 bullets fan) | 10s |
| **S** | Shield (1 hit absorbed) | until consumed |
| **❤** | Extra life | permanent |
| **B** | +1 bomb | permanent |

---

## Persistence
- LocalStorage key: `vibe-striker:hiscore`
- Last 5 scores list under `vibe-striker:scores`
- Settings (sound, music volume) under `vibe-striker:settings`

---

## Code Structure
```
src/components/game/
├── GameCanvas.tsx                # mounts when expandGame() fires
├── engine/
│   ├── loop.ts                   # fixed-step game loop
│   ├── input.ts                  # keyboard + touch normalization
│   ├── audio.ts                  # WebAudio sfx + music bus
│   ├── ecs.ts                    # tiny entity helpers
│   ├── entities/
│   │   ├── player.ts
│   │   ├── enemy.ts
│   │   ├── bullet.ts
│   │   ├── powerup.ts
│   │   └── particle.ts
│   ├── systems/
│   │   ├── spawn.ts
│   │   ├── physics.ts
│   │   ├── combat.ts
│   │   ├── ai.ts
│   │   └── render.ts
│   ├── levels.ts                 # wave scripts
│   └── shaders/
│       └── crt.glsl              # WebGL CRT pass (optional)
└── ui/
    ├── HUD.tsx
    ├── PauseMenu.tsx
    └── GameOver.tsx
```

---

## Integration With Scene
- Game state lives in `useGameStore`
- When `expandGame()` fires from the scene:
  1. Scene store sets `camera: 'GAME_FULLSCREEN'`
  2. `<GameCanvas/>` mounts (lazy chunk), takes over keyboard events
  3. Game music ducks ambient drone (Tone.js bus, -12dB)
- On exit:
  - Cleanup RAF + audio nodes
  - Push hi-score (if any) to scene store for an overhead announcement
  - Camera lerps back to HERO

---

## Performance Notes
- Single **offscreen canvas** for static sprites (background); main canvas for dynamic
- **Sprite atlas** (one PNG) for all enemies/bullets — single texture upload
- **Object pooling** for bullets/particles — never allocate during frame
- Cap particles at 400; cull off-screen
- Pause RAF when game window not focused (`document.visibilityState`)

---

## Mobile-Specific
- On-screen virtual joystick (bottom-left)
- Fire button (bottom-right)
- Bomb button (above fire button)
- Layout adapts to landscape vs portrait
- Vibration on hit (if API + user permission)

---

## Accessibility
- Color is not the only cue (enemies have distinct shapes)
- Pause hotkey + button always reachable
- Game-over screen announces score via live region
- Optional "no-flash" mode (disables hit flash) for photosensitive players
- Difficulty toggle: Normal / Chill (slower enemies, more powerups)
