# Progress Tracker

> Live status of the Vibe Coder portfolio build. Update this file every session.

**Last updated**: 2026-05-18
**Current phase**: Phase 3 partial complete — hologram shader + wave interaction done; Phase 5 (Mini-game core) ready next
**Overall progress**: ~52%

---

## Status at a Glance

| Area | Status | Notes |
|---|---|---|
| Vision & scope | ✅ Done | `01_VISION_AND_SCOPE.md` |
| Tech stack | ✅ Done | `02_TECH_STACK.md` (note: Next 16 + Tailwind 4 actually used, not 15 + 3.4) |
| Design system | ✅ Done | Tokens live in `globals.css` via `@theme` (Tailwind 4 style) |
| Architecture | ✅ Done | Folder tree + Zustand FSM implemented |
| 3D scene spec | ✅ Done | Spec doc still valid |
| Interactions | 🟡 Partial | Hero static, mouse parallax wired, click interactions pending |
| Mini-game spec | ✅ Drafted | Not implemented |
| Roadmap | ✅ Drafted | Day estimates are ballparks |
| Perf + a11y plan | ✅ Drafted | Reduced-motion CSS in place, more pending |
| Asset manifest | ✅ Drafted | No assets sourced yet |
| **Phase 0 — Foundation** | ✅ Done | Scaffold + deps + tokens + fonts + stores |
| **Phase 1 — Static Hero** | ✅ Done | Hero, cursor, scanlines, toggles, glass/neon prims |
| **Phase 2 — 3D Skeleton** | ✅ Done | Stage, Scene, Lights, CameraRig, Particles, Floor, HologramRing, Character (placeholder), PostFX |
| Phase 3 — Character | 🟡 Partial | Hologram shader + wave done; GLB + Mixamo animations still blocked |
| **Phase 4 — Desk + Monitors** | ✅ Done | Desk + 3 monitors (CodeMonitor, TerminalMonitor, GamePreviewMonitor) + RGB glow |
| Phase 5 — Mini-Game Core | ⏳ Pending | |
| Phase 6 — Game Integration | ⏳ Pending | |
| Phase 7 — Guitar Vibe Mode | ⏳ Pending | |
| Phase 8 — Scroll Sections | ⏳ Pending | About/Projects/Contact |
| Phase 9 — Game L2+3 | ⏳ Pending | |
| Phase 10 — Polish | ⏳ Pending | |
| Phase 11 — Launch | ⏳ Pending | |

---

## What Currently Works

Build verified clean (`pnpm build`). Dev server serves at `http://localhost:3000` (or 3001 if 3000 is busy).

The landing page renders:
- **Fixed full-viewport 3D scene** with:
  - Reflective floor (`MeshReflectorMaterial`)
  - Animated rotating hologram placeholder character (cyan capsule body + purple sphere head + cyan visor)
  - Pulsing hologram ring under character
  - 500 instanced particles drifting upward
  - Bloom, chromatic aberration, vignette post-processing
  - 3-light setup (cyan key, purple+magenta fill)
  - Mouse-parallax camera
  - **Developer desk (left of character)** with:
    - Low-poly dark chrome desk + 4 legs + cyan emissive front trim
    - 3 monitors arranged in slight toed-in curve
    - **L monitor**: scrolling, syntax-highlighted TS/GLSL code (5 cycling snippets)
    - **C monitor**: terminal with typewriter `pnpm dev` output + blinking cursor + traffic-light window controls
    - **R monitor**: VIBE STRIKER attract loop (parallax stars, scrolling enemies, bobbing player ship, "► CLICK TO PLAY" blink)
    - RGB ambient point lights (magenta + purple + blue) behind monitors
- **HUD overlay**:
  - Top-left `KYL.DEV` wordmark (Orbitron, neon-cyan)
  - Top-right motion toggle (cycle L/M/H) + audio toggle (mute/unmute), both glass panels
  - Floating hologram name + title:
    - "JAYSON PONIO MALLARI" (Orbitron 900, neon-cyan)
    - "A.K.A Kyl Ponio" (Rajdhani 600, ink-200)
    - "Vibe Coder" (Orbitron 700, cyan→purple→magenta gradient)
  - "↓ Enter Workspace" prompt at bottom
- **Scanline overlay** on top of everything
- **Custom cursor** (cyan ring + dot, color-shifts on hover over links/objects)

Persistence:
- Audio enabled state persisted to localStorage (`kyl:audio`)
- Motion level persisted to localStorage (`kyl:motion`)
- Game high score key reserved (`kyl:vibe-striker:hiscore`)

---

## Phase Checklist

### Phase 0 — Foundation ✅
- [x] `pnpm create next-app` (TS + Tailwind + ESLint + App + src)
- [x] Install deps (three, R3F, drei, postprocessing, framer, gsap, @gsap/react, zustand, tone, clsx, tailwind-merge, @types/three)
- [x] Tailwind 4 theme tokens (colors, fonts, animations) — via `@theme` in globals.css
- [x] Fonts via `next/font` (Orbitron, Rajdhani, JetBrains Mono, Inter)
- [x] `globals.css` (scanlines, neon utilities, cursor, conic-border, reduced-motion)
- [x] Zustand stores skeleton (Scene, Audio, Game, Motion)
- [ ] Vercel preview deploy wired (do when ready to share)

### Phase 1 — Static Hero ✅
- [x] SSR hero with wordmark + tagline (in `Hero.tsx` + `HologramText.tsx`)
- [x] `<GlassPanel/>`, `<NeonButton/>`, `<HologramText/>`
- [x] `<ScanlineOverlay/>`
- [x] Custom cursor
- [x] Reduced-motion CSS rule
- [x] Motion + audio toggles in HUD

### Phase 2 — 3D Scene Skeleton ✅
- [x] R3F `<Stage/>` + EffectComposer + Bloom + ChromaticAberration + Vignette
- [x] Placeholder character (capsule + sphere, rotating, with Float)
- [x] Reflective floor (`MeshReflectorMaterial`)
- [x] Particle field (instanced mesh, 500 dots, drifting upward)
- [x] CameraRig with mouse parallax
- [x] Dynamic Stage import via StageLazy wrapper (`ssr: false`)
- [x] Suspense fallback
- [ ] GPU tier detection (deferred to Phase 10 polish)
- [x] Lights (ambient + hemisphere + 3 spots)
- [x] HologramRing under character

### Phase 4 — Desk + Monitors ✅
- [x] Desk + monitor meshes (low-poly, in-code)
- [x] Monitor L (CanvasTexture code-typer with syntax highlighting)
- [x] Monitor C (CanvasTexture terminal with typewriter + window chrome)
- [x] Monitor R (CanvasTexture attract-mode for VIBE STRIKER preview)
- [x] RGB ambient point lights behind monitors
- [ ] Click R monitor handler (deferred to Phase 6)

### Phase 3 — Character 🟡 Partial
- [ ] Source character GLB (commission or Mixamo + custom) ← still blocked
- [x] Hologram material shader (fresnel + scanline + flicker) — custom ShaderMaterial via traverse
- [ ] Mixamo animations (idle, walk, sit, play_guitar, stand, wave) ← needs GLB
- [ ] Animation manager (0.3s crossfade) ← needs GLB
- [x] FSM integration with `useSceneStore` — WAVING state added + wave() action
- [x] HologramText name plate via Drei `<Billboard/>` + Html
- [x] Click character → wave + speech bubble ("// hey! o/")

*(Other phases unchanged — see `08_ROADMAP.md`)*

---

## Open Decisions (Blocking Phase 3+)

| # | Decision | Owner | Status |
|---|---|---|---|
| 1 | Real project details (Chat System, Admin Dashboard, Frontend Projects) | Kyl | ⏳ |
| 2 | **Character: commission vs Mixamo + custom mesh** | Kyl | ⏳ Blocks Phase 3 |
| 3 | Domain choice (`kyl.dev` vs `kylponio.com`) | Kyl | ⏳ |
| 4 | Audio licensing (CC-BY vs commission) | Kyl | ⏳ |
| 5 | Mini-game name (final, not "VIBE STRIKER") | Kyl | ⏳ |
| 6 | Final hex palette (current values placeholder) | Kyl | ⏳ |
| 7 | Hosting (Vercel confirmed?) | Kyl | ⏳ |

---

## Decisions Made

| Date | Decision | Why | Reversible? |
|---|---|---|---|
| 2026-05-18 | Next.js 16 (latest) over 15 | Latest stable when scaffolding | Yes (low cost) |
| 2026-05-18 | Tailwind 4 over 3.4 | What `create-next-app` shipped; CSS-based config | Yes (medium cost) |
| 2026-05-18 | Zustand over Redux/XState | Tiny FSM, no ceremony | Yes (medium cost) |
| 2026-05-18 | GSAP ScrollTrigger over Framer scroll | Cinematic timelines, pinning | Yes (medium cost) |
| 2026-05-18 | Canvas2D mini-game (not WebGL/Pixi) | Lightweight, fewer deps | Yes (medium cost) |
| 2026-05-18 | Tone.js over raw Web Audio | Scheduling + analyzer convenience | Yes (low cost) |
| 2026-05-18 | Docs in `docs/`, app at root | Cleanest co-existence | Yes (low cost) |
| 2026-05-18 | Inline SVG icons (no lucide v1 import) | Avoid v1 API uncertainty for 2 icons | Yes (low cost) |
| 2026-05-18 | Placeholder character = capsule + sphere | Lets Phase 2 ship without real model | Yes — Phase 3 swaps it |

---

## Blockers
- **Phase 3 (Character)**: needs real chibi GLB or Mixamo workflow decision
- **Phase 4 (Desk + Monitors)**: low-poly meshes need sourcing
- **Phase 7 (Guitar)**: guitar mesh needs sourcing
- **Phase 8 (Projects section)**: real project details + screenshots needed

---

## Recent Activity Log

| Date | Change | By |
|---|---|---|
| 2026-05-18 | 14 planning .md files created in `docs/` | Claude |
| 2026-05-18 | Scaffolded Next.js 16 + Tailwind 4 project | Claude |
| 2026-05-18 | Installed 3D + animation deps (16 packages) | Claude |
| 2026-05-18 | Implemented Phase 0 (foundation + tokens + fonts + stores) | Claude |
| 2026-05-18 | Implemented Phase 1 (static hero + HUD + cursor + scanlines) | Claude |
| 2026-05-18 | Implemented Phase 2 (3D scene with placeholder character) | Claude |
| 2026-05-18 | Build verified clean — TS + bundle pass | Claude |
| 2026-05-18 | Implemented Phase 4 (Desk + 3 monitors with CanvasTexture screens) | Claude |
| 2026-05-18 | Build re-verified clean after Phase 4 | Claude |
| 2026-05-18 | Phase 3 partial: hologram ShaderMaterial, WAVING FSM state, wave() action, click→wave+bubble, name plate Billboard, fixed WALKING_TO_GUITAR transition | Claude |
| 2026-05-18 | Build re-verified clean after Phase 3 partial | Claude |

---

## How to Run

```bash
# install (if fresh clone)
pnpm install

# dev server
pnpm dev          # → http://localhost:3000

# production build
pnpm build
pnpm start

# lint
pnpm lint
```

---

## Velocity Tracker

| Phase | Started | Finished | Days | Notes |
|---|---|---|---|---|
| 0 — Foundation | 2026-05-18 | 2026-05-18 | < 1 | Scaffold + deps + tokens |
| 1 — Static Hero | 2026-05-18 | 2026-05-18 | < 1 | Components + wiring |
| 2 — 3D Skeleton | 2026-05-18 | 2026-05-18 | < 1 | Placeholder character |
| 3 — Character | — | — | — | Blocked on asset |
| 4 — Desk + Monitors | 2026-05-18 | 2026-05-18 | < 1 | All 3 monitors animated via CanvasTexture |
| 5 — Game Core | — | — | — | |
| 6 — Game Integration | — | — | — | |
| 7 — Guitar Mode | — | — | — | |
| 8 — Scroll Sections | — | — | — | |
| 9 — Game L2+3 | — | — | — | |
| 10 — Polish | — | — | — | |
| 11 — Launch | — | — | — | |

---

## Next Action
**To unblock further phases, decide on:**
1. **Character asset** — fastest path is Mixamo "Y Bot" + hologram material; quality path is custom chibi commission
2. **Project content** — what to put in the 3 project cards
3. **Domain** — buy whichever you want before Phase 11

**To keep building without those decisions** — possible next phases:
- **Phase 4 (Desk + Monitors)** — buildable with primitive meshes; can use procedural shaders for monitor content
- **Phase 5 (Mini-game core)** — fully buildable, only the name + theme are placeholder
- **Phase 8 (scroll sections shell)** — buildable with lorem-ipsum content

Recommend: **Phase 5 next** — it's a discrete, deeply satisfying chunk that doesn't depend on assets, and the docs already detail every system.
