# 06 — Features & Interactions

Section-by-section, beat-by-beat. Each beat describes what the user sees, hears, and can do.

---

## 1. Hero — Landing Room
**Goal**: 2-second wow. The visitor should not be able to look away.

### Boot Sequence
1. Page loads → SSR shell shows neon wordmark `KYL.DEV` + a single horizontal scan
2. Canvas mounts → fade in over 1.2s with bloom warm-up
3. Camera dollies in from behind character (1.6s, easeOutQuint)
4. Character emerges with a vertical hologram-materialize shader (sweep up + flicker)
5. Floating name + title text fades in above the character's head:
   - **`Jayson Ponio Mallari`** — Orbitron 900, neon-cyan
   - `A.K.A Kyl Ponio` — Rajdhani 600, ink-200, smaller
   - **`Vibe Coder`** — neon cyan-magenta gradient, with subtle glitch on hover
6. Ambient drone fades in (if audio enabled)
7. Particle field activates
8. Subtle "scroll" prompt at bottom-center: `↓ ENTER WORKSPACE`

### Interactions
- **Mouse**: camera parallax + character head tracks cursor slightly (limited cone)
- **Click character**: character plays `wave` animation + a text bubble appears with a voice line (e.g., `"Welcome to my workspace."`)
- **Hover wordmark**: text shows a brief glitch effect

---

## 2. Computer Setup
A futuristic desk on one side of the room with 3 monitors arranged in a slight curve (toed in).

### Default State (Attract Mode)
- **Monitor L** — code typing loop (cycling through TypeScript / TSX snippets — a React component, a custom hook, a small Zustand store)
- **Monitor C** — terminal with build animation:
  ```
  > pnpm dev
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  ✓ Ready in 1.2s
  ✓ Compiled / in 312ms
  ```
  Periodically throws fake errors that get auto-fixed in real time (typing animation removes red squiggle, prints `✓ Compiled`)
- **Monitor R** — looping retro mini-game attract mode (player ship + scrolling background + flashing `PRESS START`)

### Interactions
- **Hover desk**: subtle camera nudge toward desk + RGB ambient light intensifies
- **Hover any monitor**: monitor frame glows; "[ CLICK TO PLAY ]" overlay on R
- **Click R monitor** →
  1. Camera dollies into monitor (1.0s, easeOutQuint)
  2. Other monitors dim
  3. Monitor mesh scales to fill viewport
  4. DOM `<GameCanvas/>` fades in (300ms) overlaying the 3D
  5. HUD appears: score, lives, hi-score, pause, exit (X)
- **Click X / press Esc** →
  1. GameCanvas fades out
  2. Camera reverses (1.0s)
  3. Returns to attract mode

---

## 3. Guitar — Vibe Mode
A futuristic glowing electric guitar on the opposite side of the room, floating on a stand.

### Interactions
- **Hover guitar**: aura intensifies + a soft chord stinger plays
- **Click guitar** →
  1. Camera transitions to `GUITAR_FOCUS` (1.2s, easeOutQuint)
  2. Character `walk` animation plays; position lerps along a 3-waypoint path
  3. Character plays `sit_down` one-shot (0.8s)
  4. State → `PLAYING_GUITAR` → `play_guitar` loop animation starts
  5. Tone.js plays a 16-bar dreamy synth-guitar loop (`guitar_loop.opus`)
  6. Audio analyzer drives:
     - Bloom intensity (0.9 → up to 1.4)
     - Particle emission rate (1× → 2×)
     - Ring pulse amplitude under character
  7. Floating equalizer bars appear in the HUD overlay
- **Click anywhere else / "Stop" button**:
  1. Character `stand_up` (0.8s)
  2. Walks back to center via `RETURNING_TO_CENTER`
  3. Resumes `IDLE_HOLOGRAM`
  4. Camera lerps back to `HERO`

---

## 4. Scroll-Driven Sections
GSAP ScrollTrigger pins the canvas and orchestrates camera + section reveals as the user scrolls. The 3D scene remains visible the entire time; sections are 2D glass HUDs that compose on top.

### Section: About
- Camera repositions to look at character from 3/4 angle, desk visible
- Right side: glass panel slides in (slide + blur + fade) with bio copy
- Stats counters animate (years coding, projects shipped, coffee consumed — playful, real-ish numbers)
- Identity bullet list reveals one-by-one with stagger (200ms each)
- Background particles slow down (signals "focus" moment)

**Copy** (from `01_VISION_AND_SCOPE.md`):
> Passionate **Vibe Coder**. Creative **Full Stack Developer**. I build immersive digital experiences that combine code, motion, sound, and play. I turn imagination into interactive systems.

### Section: Projects
- Camera pulls back high; world tilts isometric-ish
- 3 cards float in from below with staggered delay (200ms each):
  1. **Chat System** — real-time, websockets, optimistic UI
  2. **Admin Dashboard** — analytics, role-based access control
  3. **Frontend Developer Projects** — collection of motion experiments
- Each card:
  - Glassmorphism + animated conic-gradient border (neon rotating — see [03_DESIGN_SYSTEM.md](./03_DESIGN_SYSTEM.md))
  - Hover: lift `translateY(-8px)`, glow intensifies, scanline ripple sweeps across
  - Click: opens modal with:
    - Image/video carousel (3–6 frames)
    - Tech stack chips
    - "Live demo" + "Source" links (or "Coming soon" placeholder)
- Background: code-rain particle pass (Matrix-style but rare characters)

### Section: Contact
- Camera tilts down to a holographic terminal
- Form fields styled as terminal inputs (prompt `>` prefix, monospace, blinking cursor)
- Fields: name, email, message
- Submit triggers:
  - `TRANSMITTING...` (text typewriter)
  - Then `CONNECTION ESTABLISHED ✓` (green flash)
- Social icons in a glowing dock at bottom (GitHub, LinkedIn, X, email)

---

## 5. Persistent HUD
Floating UI that stays across all sections:
- **Top-left** — animated `KYL.DEV` wordmark logo
- **Top-right** — audio mute toggle, motion-level slider (Low / Medium / High)
- **Bottom-right** — "MENU" radial that opens to quick-jumps: Hero · About · Projects · Contact · Mini-game
- **Custom cursor** everywhere (replaced on touch devices)

---

## 6. Accessibility Layer
- `prefers-reduced-motion` → switch to motion=LOW automatically
  - Character idle stops rotating
  - Particles snap to static positions
  - Scroll-driven camera disabled — sections become standard vertical scroll
  - All cinematic transitions become simple fades
- High-contrast mode toggle → drops bloom, raises text alpha, swaps glass for solid panels
- All 3D interactive objects also exist as **invisible focusable buttons** in DOM (Tab order)
  - Each emits the same store action as the 3D click
  - Visible focus ring (neon outline) on focus
- Screen-reader landmarks per section + descriptive `aria-label` on canvas
- Skip-to-content link visible on focus
- Esc closes modals / exits game
- `?` opens a shortcuts cheatsheet
- All audio is optional (mute toggle, off by default until first user interaction)
- Captions / subtitles for any character voice-line bubbles
- Live region announces game score milestones + game-over

---

## 7. Mobile Experience
Different, lighter, but still on-brand:
- Scene swaps to a lighter build:
  - 1 monitor instead of 3
  - Particle count halved
  - Post FX = bloom-only
  - Character on a static pedestal, slow rotation only
- Guitar interaction simplified (tap-only, no walk path — character just shifts pose)
- Mini-game uses on-screen joystick + fire button overlay
- Project cards become a horizontal swipe carousel
- Custom cursor disabled; native finger UX
- Sections become standard vertical scroll with fade reveals (no pinning)

---

## 8. Easter Eggs
- Click character 5 times in a row → confetti particle burst + "VIBE OVERLOAD" flash
- Konami code (↑↑↓↓←→←→BA) → unlock a hidden "developer commentary" mode in the mini-game
- Type "matrix" anywhere → screen briefly enters green code-rain mode
- Click the logo 3 times → reveal a meta panel: build hash, scene poly count, frame time
