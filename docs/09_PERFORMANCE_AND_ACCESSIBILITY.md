# 09 — Performance & Accessibility

## Performance Budget

| Metric | Target |
|---|---|
| TTFB | < 200ms (Vercel edge) |
| FCP | < 1.5s on 4G |
| LCP | < 2.5s on 4G |
| TBT | < 200ms |
| CLS | < 0.05 |
| **JS bundle (initial)** | < 180KB gzip |
| Scene bundle (lazy) | < 800KB gzip |
| Game bundle (lazy) | < 150KB gzip |
| 3D models total | < 2MB (Draco compressed) |
| Textures total | < 1MB (KTX2/WebP) |
| Audio total | < 800KB (Opus/M4A) |
| FPS desktop | 60 (locked, drop frames acceptable during cinematic transitions) |
| FPS mobile | ≥ 30 |

---

## Strategies

### Code Splitting
- `<Stage/>` and `<GameCanvas/>` via `next/dynamic({ ssr: false })`
- Project modal lazy-loaded only on click
- Mini-game engine in its own chunk

### Asset Optimization
- **GLB** → Draco compression
  ```bash
  gltf-pipeline -i in.glb -o out.glb -d
  ```
- **Textures** → KTX2 (BasisU) via `toktx`
  ```bash
  toktx --bcmp --genmipmap out.ktx2 in.png
  ```
- **Audio** → Opus 64–96kbps for music, 48–64kbps for SFX
- **Sprite atlas** for game (one PNG, single GPU upload)
- `next/image` for all 2D imagery; AVIF + WebP autogen

### Runtime
- `dpr={[1, 1.75]}` on Canvas (caps retina cost)
- Disable post FX below GPU tier 2 (`useDetectGPU` from `@react-three/drei`)
- Particle count tier-based: 600 (tier3), 300 (tier2), 100 (tier1)
- Pause `useFrame` and game RAF when tab hidden (`document.visibilityState === 'hidden'`)
- Throttle mouse parallax to ~30Hz via rAF gate

### Caching
- Vercel CDN with long `max-age` on `_next/static`
- Service worker (optional, V2) for offline asset cache
- `Cache-Control: public, max-age=31536000, immutable` for hashed asset URLs

### Lazy Loading Strategy
1. **Immediate** — fonts, critical CSS, HeroShell
2. **First paint** — Stage chunk + minimal scene (lights, particles, placeholder character)
3. **Idle** — character GLB, animations, environment HDRI (`requestIdleCallback`)
4. **On-demand** — desk + monitors
5. **Lazy on interaction** — GameCanvas chunk + game audio (first expand)
6. **Lazy on interaction** — guitar loop audio (first guitar click)

---

## Accessibility

### Motion
- Respect `prefers-reduced-motion`:
  - Disable character idle rotation
  - Stop particle drift (snap to static positions)
  - No scroll-driven camera; sections become standard vertical scroll
  - All cinematic transitions become simple fades (200ms)
- User-facing **Motion Level toggle** (Low / Medium / High) in HUD, persisted to localStorage

### Color & Contrast
- All text passes WCAG **AA** on its background (4.5:1 normal, 3:1 large)
- High-contrast mode toggle (drops bloom, raises text alpha, swaps glass for solid panels)
- **Never communicate state by color alone** — always pair with icon or label
- Test palette with Stark / Polypane

### Keyboard
- Tab order through all interactive elements
- **Invisible focusable buttons mapped to 3D interactive objects** (character, monitor, guitar) — each emits the same store action as the 3D click
- Visible focus ring: neon outline, 2px, contrasting color
- `Esc` closes modals / exits game
- `?` opens a shortcuts cheatsheet overlay
- `/` focuses contact form (Vim-style)

### Screen Readers
- Each section is a `<section aria-labelledby="...">`
- 3D canvas: `role="img"` + `aria-label="Animated 3D workspace featuring a hologram of Kyl Ponio standing in a cyberpunk room with a developer desk and guitar"`
- **Skip 3D scene** link visible on focus (jumps to About)
- `aria-live="polite"` region for game events (score milestones, game over)
- `aria-live="assertive"` for errors only

### Audio
- Off by default; toggle persisted in localStorage
- Captions for any voice-line text bubbles
- **No audio is required to use any feature**

### Forms
- Labels for every input
- Errors via `aria-describedby` + visible red text (and icon)
- Submit button announces success via live region

### Touch / Mobile
- Tap targets ≥ 44×44 px
- No hover-only interactions on touch (every hover effect also has a tap state)
- Pinch-zoom not disabled

---

## Browser Support

### Targets
- Chrome / Edge / Firefox — last 2 versions
- Safari 16+
- Mobile Safari 16+, Chrome Android — last 2
- **WebGL2 required**; static fallback for everything else

### Feature Detection
```ts
function supports3D(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2'));
  } catch { return false; }
}
```
Fallback: serve the static HeroShell + sections-as-plain-cards layout.

---

## Testing

### Automated
- **Lighthouse CI** on every PR (perf, a11y, best-practices, SEO)
- **axe-core** automated a11y in Playwright smoke
- **Vitest** for game engine unit tests (collision, scoring, spawn)
- **Playwright** smoke: page loads, hero visible, mini-game launchable

### Manual
- Manual keyboard pass per release
- Manual screen reader pass (VoiceOver on macOS + NVDA on Windows) per release
- Test on real devices: iPhone (mid-tier), Pixel (mid-tier), low-end Android (e.g. Nokia G-series)
- Test on slow 3G profile in DevTools

### Performance Profiling
- Chrome DevTools Performance tab
- `Stats.js` overlay in development
- `react-three/perf` for R3F profiling
- WebPageTest.org for real-world LCP

---

## SEO (Lightweight)
This is a portfolio, not a content site — SEO is **not** the priority. But we do:
- Meaningful `<title>` and `<meta description>`
- OG / Twitter card with rendered hero shot
- Structured data (`schema.org/Person`) for Kyl
- Sitemap + robots.txt
- Clean URLs (no query string state)

---

## Monitoring (Post-Launch)
- **Vercel Analytics** — Real User Monitoring for Web Vitals
- **Plausible** — privacy-friendly page views + event tracking
- Custom events: `game_launched`, `game_completed`, `guitar_triggered`, `project_opened`, `contact_submitted`
- Sentry (optional) for runtime errors in the scene/game
