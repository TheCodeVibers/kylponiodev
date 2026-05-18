# 02 — Tech Stack

## Stack Table

| Layer | Tool | Version | Why |
|---|---|---|---|
| Framework | Next.js (App Router) | 15.x | RSC, edge runtime, MDX, image/font optimization |
| Runtime | React | 19.x | Concurrent rendering, transitions, `use()` |
| Language | TypeScript | 5.x | Type safety across 3D + UI |
| 3D engine | three.js | r170+ | WebGL standard |
| 3D React | @react-three/fiber | 9.x | Declarative R3F |
| 3D helpers | @react-three/drei | latest | Cameras, controls, loaders, helpers |
| Post FX | @react-three/postprocessing | latest | Bloom, scanlines, chromatic aberration |
| Styling | Tailwind CSS | 3.4.x | Utility-first, fast iteration |
| UI motion | framer-motion (`motion`) | 11.x | Component & page motion |
| Scroll motion | GSAP + ScrollTrigger | 3.12.x | Cinematic scroll choreography |
| State | Zustand | 4.x | Tiny global state machine |
| Audio | Tone.js + Web Audio API | latest | Guitar audio + analyzer |
| Game loop | Plain Canvas2D | — | Lightweight mini-game |
| Icons | lucide-react | latest | Crisp line icons |
| Fonts | `next/font` (Orbitron, Rajdhani, JetBrains Mono, Inter) | — | Futuristic display + mono |
| Hosting | Vercel | — | First-class Next.js |
| Analytics | Vercel Analytics + Plausible | — | Privacy-friendly |

---

## Dev Tooling
- ESLint + Prettier + `prettier-plugin-tailwindcss`
- `lint-staged` + Husky pre-commit
- TypeScript **strict** mode
- Vitest for unit tests (game logic only)
- Playwright for smoke e2e (loads, hero visible, mini-game launchable)

---

## Why This Stack

### Next.js 15 + R3F
SSR shell + hydrated 3D canvas gives fast first paint while loading the heavy WebGL work asynchronously. App Router gives us streaming and Suspense for free.

### Drei
We avoid reinventing camera rigs, loaders, helpers (`useGLTF`, `useAnimations`, `MeshReflectorMaterial`, `Environment`, `Html`, `Float`).

### Postprocessing
Bloom and scanlines are **core to the hologram vibe** — building these by hand is throwaway work.

### Zustand
The character/scene state machine has clear discrete states (idle / walking / sitting / playing). Zustand is ~1KB and avoids Redux ceremony.

### GSAP for Scroll
ScrollTrigger blows Framer's scroll out of the water for cinematic timelines (pinning, scrubbing, multi-step easing across long sections).

### Framer Motion for UI
Still preferred for component micro-interactions (panel slide-ins, hover, modals).

### Tone.js
Schedule the guitar loop deterministically + tap into Web Audio analyzer node for the visualizer.

---

## Install (one-liner)
```bash
pnpm create next-app@latest kyl-portfolio --typescript --tailwind --app --eslint --src-dir
cd kyl-portfolio

pnpm add three @react-three/fiber @react-three/drei @react-three/postprocessing \
  framer-motion gsap zustand tone howler lucide-react clsx tailwind-merge

pnpm add -D @types/three eslint-config-prettier prettier prettier-plugin-tailwindcss \
  vitest @playwright/test
```

---

## Browser Targets
- Chrome / Edge / Firefox — last 2 versions
- Safari 16+
- Mobile Safari 16+, Chrome Android — last 2
- **WebGL2 required**; static fallback for everything else

---

## Key Library Notes

### React 19 + R3F
R3F 9 supports React 19. Use `<Canvas>` with `dpr={[1, 1.75]}` to avoid retina cost on high-density displays.

### GSAP in React 19
Use the `useGSAP` hook from `@gsap/react` for safe context cleanup. Initialize ScrollTrigger inside `useGSAP`, not at module scope.

### Audio Autoplay
Browsers require a user gesture before audio. We initialize `Tone.start()` on the first **document click** anywhere, and expose a visible mute toggle in the HUD.

### Next/Dynamic for Canvas
```tsx
const Stage = dynamic(() => import('@/components/scene/Stage'), { ssr: false });
```
Critical for `window`-using libraries (three.js, GSAP scroll listeners).

---

## Dependency Hygiene
- Lock major versions in `package.json` (no `^` for three / r3f / drei — those move fast)
- Renovate or Dependabot weekly, batched into a single PR
- No CSS-in-JS runtime libs (Tailwind only) — keep bundle lean
