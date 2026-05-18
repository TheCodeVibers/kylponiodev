# 08 — Implementation Roadmap

Phased plan. Each phase ends in a **shippable milestone** so the work is always demoable.

> Estimates assume one focused developer working full-time. Halve them if pair-programming, double them if part-time.

---

## Phase 0 — Foundation (Day 0–1)
**Goal**: project scaffolded with brand tokens.

- [ ] `pnpm create next-app` with TS + Tailwind + ESLint + App Router + src dir
- [ ] Install dependencies (see [02_TECH_STACK.md](./02_TECH_STACK.md))
- [ ] Tailwind theme tokens from [03_DESIGN_SYSTEM.md](./03_DESIGN_SYSTEM.md)
- [ ] Font setup via `next/font` (Orbitron, Rajdhani, JetBrains Mono, Inter)
- [ ] `globals.css` — scanlines, neon utilities, custom cursor
- [ ] Zustand stores skeleton (`useSceneStore`, `useAudioStore`, `useGameStore`, `useMotionStore`)
- [ ] Layout shell with dummy hero text
- [ ] Vercel preview deploy wired up

---

## Phase 1 — Static Hero (Day 1–2)
**Goal**: a beautiful static landing that already feels on-brand.

- [ ] SSR hero with wordmark + tagline + tag-lines
- [ ] `<GlassPanel/>`, `<NeonButton/>`, `<HologramText/>` components
- [ ] `<ScanlineOverlay/>` global component
- [ ] Custom cursor
- [ ] Reduced-motion media query plumbed into MotionStore
- [ ] Motion-level toggle in top-right HUD
- [ ] Audio mute toggle in top-right HUD

**🚢 Ship checkpoint**: pretty static landing.

---

## Phase 2 — 3D Scene Skeleton (Day 2–4)
**Goal**: a moody 3D void with placeholder geometry & particles.

- [ ] R3F `<Stage/>` canvas with `EffectComposer` + `Bloom`
- [ ] Placeholder character (Drei `<Box/>` for now)
- [ ] Reflective floor (`MeshReflectorMaterial`) + ambient lighting
- [ ] Particle field (instanced mesh, ~600 dots)
- [ ] `<CameraRig/>` with mouse parallax
- [ ] Dynamic import of Stage with `ssr: false`
- [ ] Loader / skeleton during GLB fetch
- [ ] GPU tier detection → motion-level auto-set

**🚢 Ship checkpoint**: 3D void with placeholders renders cleanly.

---

## Phase 3 — Character (Day 4–6)
**Goal**: holographic Kyl idles in the scene.

- [ ] Source/commission chibi GLB (or Mixamo body + custom hat as MVP)
- [ ] Hologram material shader (fresnel + scanline + flicker)
- [ ] Mixamo animations downloaded: idle, walk, sit, play_guitar, stand, wave
- [ ] Animation manager via `useAnimations`, 0.3s crossfade
- [ ] State machine integration with `useSceneStore`
- [ ] `<HologramText/>` name plate (Drei `<Billboard/>` + Text)
- [ ] Click character → wave + voice-line bubble

**🚢 Ship checkpoint**: holographic Kyl idles + can wave.

---

## Phase 4 — Desk + Monitors (Day 6–8)
**Goal**: animated desk with code, terminal, game-preview screens.

- [ ] Desk + monitor meshes (low-poly, Blender or asset library)
- [ ] Monitor screen as `CanvasTexture` (L: code, C: terminal)
- [ ] L: code-typer (cycle snippets from `content/monitorCode.ts`)
- [ ] C: terminal animation with fake errors → fixed in real time
- [ ] R: attract-mode loop video texture
- [ ] RGB ambient point light behind desk

---

## Phase 5 — Mini-Game Core (Day 8–11)
**Goal**: playable Level 1.

- [ ] Game loop + input system
- [ ] Player + bullets + Bit enemies
- [ ] Level 1 spawner
- [ ] Score + lives HUD
- [ ] LocalStorage hi-score
- [ ] Game over + restart
- [ ] Audio: laser, hit, explosion SFX + level 1 music
- [ ] CRT shader overlay (CSS for MVP, WebGL pass later)

---

## Phase 6 — Game Integration + Camera Cinematic (Day 11–12)
**Goal**: click R monitor → cinematic dolly → play.

- [ ] Raycast click on R monitor
- [ ] Camera dolly into screen (1.0s easeOutQuint)
- [ ] Mount `<GameCanvas/>` fullscreen
- [ ] Exit transition (Esc + X button)
- [ ] Touch controls (joystick + fire button overlay)

**🚢 Ship checkpoint**: playable in-page retro game with cinematic entry.

---

## Phase 7 — Guitar Vibe Mode (Day 12–14)
**Goal**: click guitar → character walks, sits, plays.

- [ ] Guitar mesh + stand + neon trim
- [ ] Click handler → camera transition + character walk path
- [ ] Tone.js loop trigger
- [ ] Audio analyzer node → bloom + particles binding
- [ ] Floating EQ bars HUD
- [ ] Reverse / stop button

---

## Phase 8 — Scroll Sections (Day 14–16)
**Goal**: cinematic scroll through About + Projects + Contact.

- [ ] GSAP ScrollTrigger setup with canvas pinning
- [ ] About section panel with bio + stats counters
- [ ] Projects: 3 cards with conic-gradient borders + hover lift
- [ ] Project modal with image/video carousel + tech chips
- [ ] Contact section: terminal-style form + social dock
- [ ] Whoosh SFX on section reveals

---

## Phase 9 — Game Levels 2+3 + Boss (Day 16–18)
**Goal**: full mini-game.

- [ ] More enemy types: Glitch, Loader, Phisher
- [ ] Powerups system (R, T, S, ❤, B)
- [ ] Level 2 + WORM mid-boss
- [ ] Level 3 + THE COMPILER 3-phase boss
- [ ] Level 2/3 music + boss music

---

## Phase 10 — Polish + Performance (Day 18–20)
**Goal**: production-quality on all targets.

- [ ] LOD on character (3k tris when camera far)
- [ ] Mobile fallback experience (simplified scene, swipe projects)
- [ ] A11y audit (axe, manual keyboard pass, VoiceOver / NVDA)
- [ ] Lighthouse pass on desktop + mobile (target perf ≥ 70 mobile, ≥ 90 desktop)
- [ ] OG image rendered, meta tags, favicon set
- [ ] Vercel Analytics + Plausible
- [ ] 404 page themed ("Signal lost in the void…")

---

## Phase 11 — Launch (Day 20+)
- [ ] Domain (e.g. `kyl.dev`, `kylponio.com`) + SSL
- [ ] PWA manifest (optional)
- [ ] Social share assets (Twitter/X, LinkedIn, Facebook previews)
- [ ] Soft launch → gather feedback → iterate
- [ ] Open-source select pieces if desired

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Character GLB sourcing slips | Med | High | Start with Mixamo body + simple chibi proxy; swap later |
| Mobile WebGL perf below target | High | Med | Hard fallback to 2D animated hero on mobile if FPS < 30 |
| Audio autoplay blocked | High | Low | First-gesture audio init pattern + visible mute toggle |
| Bundle size > 200KB initial | Med | Med | Aggressive code-split scene + game; dynamic imports |
| Browser support gaps (Safari shaders) | Med | Med | Feature-detect WebGL2; static fallback; test Safari early |
| Scope creep (more sections, more games) | High | High | Strict V1 scope; new ideas → V2 backlog |
| 3D asset cost (commissioned model) | Med | Med | Budget early; have Mixamo backup |

---

## V2 Backlog (Post-Launch)
- Multiplayer "vibe room" via WebSockets — others see your cursor as a particle
- WebXR / VR mode
- Voice synthesis for character voice lines (ElevenLabs)
- Procedural music generator that reacts to the user's scroll velocity
- A second mini-game (rhythm-based, tied to the guitar)
- Blog with MDX + 3D inline embeds
- Spotify Now Playing → drives bloom hue
- Twitch Live indicator → adds a "LIVE" banner to the room
