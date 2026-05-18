# 04 — Architecture

## Project Structure
```
kyl-portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # root layout, fonts, providers
│   │   ├── page.tsx                # landing route (the cinematic scene)
│   │   ├── globals.css             # tailwind base + scanline utilities
│   │   └── api/                    # reserved (contact form, etc.)
│   │
│   ├── components/
│   │   ├── hud/                    # 2D UI overlay
│   │   │   ├── HologramText.tsx
│   │   │   ├── GlassPanel.tsx
│   │   │   ├── NeonButton.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── SectionReveal.tsx
│   │   │   ├── MotionToggle.tsx
│   │   │   ├── AudioToggle.tsx
│   │   │   └── Cursor.tsx
│   │   ├── scene/                  # all R3F components
│   │   │   ├── Stage.tsx           # canvas + post FX setup
│   │   │   ├── Scene.tsx           # scene graph composition
│   │   │   ├── Room.tsx
│   │   │   ├── Character.tsx
│   │   │   ├── Desk.tsx
│   │   │   ├── Monitor.tsx
│   │   │   ├── Guitar.tsx
│   │   │   ├── Particles.tsx
│   │   │   ├── HologramRing.tsx
│   │   │   ├── CameraRig.tsx
│   │   │   └── Lights.tsx
│   │   ├── game/                   # retro mini-game
│   │   │   ├── GameCanvas.tsx
│   │   │   ├── engine/
│   │   │   │   ├── loop.ts
│   │   │   │   ├── input.ts
│   │   │   │   ├── audio.ts
│   │   │   │   ├── ecs.ts
│   │   │   │   ├── entities/
│   │   │   │   ├── systems/
│   │   │   │   └── levels.ts
│   │   │   └── ui/
│   │   │       ├── HUD.tsx
│   │   │       ├── PauseMenu.tsx
│   │   │       └── GameOver.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Projects.tsx
│   │   │   └── Contact.tsx
│   │   └── shared/
│   │       ├── ScanlineOverlay.tsx
│   │       └── ScrollSync.tsx
│   │
│   ├── state/
│   │   ├── useSceneStore.ts        # zustand: scene/camera/character FSM
│   │   ├── useAudioStore.ts        # audio toggle, master gain
│   │   ├── useGameStore.ts         # game lifecycle
│   │   └── useMotionStore.ts       # motion-level (low/med/high)
│   │
│   ├── lib/
│   │   ├── animations/             # framer / gsap presets
│   │   ├── shaders/                # custom GLSL (hologram, scanline)
│   │   ├── audio/                  # tone.js helpers
│   │   └── utils/
│   │
│   └── content/
│       ├── projects.ts             # project metadata
│       ├── identity.ts             # bio / tagline copy
│       └── monitorCode.ts          # snippets shown on monitors
│
├── public/
│   ├── models/                     # *.glb (character, desk, guitar)
│   ├── textures/                   # *.ktx2 / *.webp
│   ├── audio/                      # *.opus / *.m4a
│   └── images/                     # OG, favicons, project previews
│
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## State Machine

### Character + Scene FSM
```ts
// src/state/useSceneStore.ts
import { create } from 'zustand';

export type CharacterState =
  | 'IDLE_HOLOGRAM'        // default — rotating hero pose
  | 'WALKING_TO_GUITAR'
  | 'SITTING_GUITAR'
  | 'PLAYING_GUITAR'
  | 'RETURNING_TO_CENTER';

export type CameraMode =
  | 'HERO'                 // orbit-locked, mouse parallax
  | 'ABOUT'                // scroll-driven dolly
  | 'PROJECTS'             // pulled back, isometric-ish
  | 'CONTACT'              // tilt down to terminal
  | 'GAME_FULLSCREEN'      // monitor expanded
  | 'GUITAR_FOCUS';        // cinematic guitar cam

interface SceneStore {
  character: CharacterState;
  camera: CameraMode;
  mouse: { x: number; y: number };

  setCharacter: (s: CharacterState) => void;
  setCamera: (m: CameraMode) => void;
  setMouse: (x: number, y: number) => void;

  // High-level actions
  triggerGuitar: () => void;        // walks → sits → plays
  stopGuitar: () => void;
  expandGame: () => void;
  exitGame: () => void;
}

export const useSceneStore = create<SceneStore>((set, get) => ({
  character: 'IDLE_HOLOGRAM',
  camera: 'HERO',
  mouse: { x: 0, y: 0 },

  setCharacter: (s) => set({ character: s }),
  setCamera: (m) => set({ camera: m }),
  setMouse: (x, y) => set({ mouse: { x, y } }),

  triggerGuitar: () => {
    set({ camera: 'GUITAR_FOCUS', character: 'WALKING_TO_GUITAR' });
    // Character.tsx handles the timed transitions via its animation manager
  },
  stopGuitar: () => set({ character: 'RETURNING_TO_CENTER', camera: 'HERO' }),

  expandGame: () => set({ camera: 'GAME_FULLSCREEN' }),
  exitGame:   () => set({ camera: 'HERO' }),
}));
```

### Audio Store
```ts
interface AudioStore {
  enabled: boolean;
  masterGain: number;
  toggle: () => void;
  setGain: (v: number) => void;
}
```

### Game Store
```ts
interface GameStore {
  status: 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';
  score: number;
  hiScore: number;
  lives: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  end: () => void;
}
```

### Motion Store
```ts
type MotionLevel = 'LOW' | 'MEDIUM' | 'HIGH';
interface MotionStore {
  level: MotionLevel;
  set: (l: MotionLevel) => void;
}
```

---

## Component Hierarchy
```
<RootLayout>
  ├─ <Providers> (Theme, Audio, MotionConfig)
  └─ <main>
       ├─ <Cursor/>
       ├─ <ScanlineOverlay/>
       ├─ <Stage>                       ← R3F Canvas
       │    └─ <Scene>
       │         ├─ <Lights/>
       │         ├─ <CameraRig/>
       │         ├─ <Particles/>
       │         ├─ <Room>
       │         │    ├─ <Character/>
       │         │    ├─ <HologramRing/>
       │         │    ├─ <Desk>
       │         │    │    └─ <Monitor x3/>
       │         │    └─ <Guitar/>
       │         └─ <PostProcessing/>
       ├─ <HUD>
       │    ├─ <HologramText/> (name/title)
       │    └─ <Sections>
       │         ├─ <Hero/>
       │         ├─ <About/>
       │         ├─ <Projects/>
       │         └─ <Contact/>
       ├─ <MotionToggle/> <AudioToggle/>
       └─ <GameCanvas/> (mounted only when expanded)
```

---

## Data Flow

### Inputs → Store → Scene
- **Scroll** drives camera position via GSAP ScrollTrigger that updates `useSceneStore.camera`
- **Mouse** parallax updates `mouse` in store, consumed by `CameraRig` via `useFrame` lerp
- **Click events** on 3D objects (raycasted via R3F's `onClick`) dispatch store actions
- **Keyboard** focus on shadow buttons (a11y) dispatches the same actions

### Audio
- Suspended until first user gesture (browser autoplay policy)
- One-time `Tone.start()` on document click
- Mute toggle persisted in localStorage

---

## Rendering Strategy

### Server vs Client
- `app/layout.tsx` — server component (fonts, metadata, OG tags)
- `app/page.tsx` — server component shell + dynamic client import:
  ```tsx
  const Stage = dynamic(() => import('@/components/scene/Stage'), {
    ssr: false,
    loading: () => <HeroShell />, // static hero + wordmark + scan
  });
  ```
- All scene, game, and motion components are `'use client'`

### Streaming + Suspense
- Wrap heavy GLB loads in `<Suspense fallback={<SkeletonHologram/>}>` so the user sees a glowing placeholder while assets stream

---

## Routing
- `/` — landing (everything in one scroll experience)
- `/404` — themed not-found ("Signal lost in the void…")
- Optional future: `/projects/[slug]` for deep dives

---

## Asset Loading Order
1. **Immediate** — fonts, critical CSS, HeroShell
2. **First paint** — Stage chunk + minimal scene (lights, particles, placeholder character)
3. **Idle** — character GLB, animations, environment HDRI
4. **On-demand** — desk + monitors (visible by default but lower priority than character)
5. **Lazy** — GameCanvas chunk + game audio (only on first expand)
6. **Lazy** — Guitar loop audio (only on first guitar click)

Use `<Preload all/>` from Drei carefully — only on assets visible in viewport.

---

## Error Boundaries
- Wrap `<Stage/>` in an error boundary that falls back to a static hero if WebGL initialization fails
- Wrap `<GameCanvas/>` in an error boundary that returns the user to the scene with a "Game crashed — restarting" message
