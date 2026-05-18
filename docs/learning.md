# Learning Log

> Skills required for this project, curated resources, and personal notes/insights as you build.

---

## Skill Map (What This Project Demands)

| Skill | Why it matters here | Level needed |
|---|---|---|
| React (hooks, suspense) | Entire UI layer | ⭐⭐⭐⭐⭐ |
| Next.js 15 (App Router) | Framework, routing, SSR shell | ⭐⭐⭐⭐ |
| TypeScript | Type safety across 3D + UI | ⭐⭐⭐⭐ |
| Three.js fundamentals | The 3D scene | ⭐⭐⭐⭐ |
| React Three Fiber + Drei | Declarative 3D in React | ⭐⭐⭐⭐ |
| GLSL shaders (basic) | Hologram material, scanline pass | ⭐⭐⭐ |
| Postprocessing (Bloom, scanlines) | The hologram vibe | ⭐⭐⭐ |
| GSAP + ScrollTrigger | Cinematic scroll choreography | ⭐⭐⭐ |
| Framer Motion | UI micro-interactions | ⭐⭐⭐ |
| Zustand | State machine for character + scene | ⭐⭐ |
| Tone.js / Web Audio API | Guitar audio + analyzer | ⭐⭐⭐ |
| Canvas2D game loop | Mini-game | ⭐⭐⭐ |
| ECS-lite | Game architecture | ⭐⭐ |
| Tailwind CSS | Styling | ⭐⭐⭐ |
| Accessibility (WCAG AA, ARIA) | Inclusive UX | ⭐⭐⭐ |
| Performance profiling | Lighthouse + R3F perf | ⭐⭐⭐ |
| Blender (basic low-poly) | Desk / monitor / guitar custom meshes | ⭐⭐ |
| Mixamo | Character animations | ⭐ |
| Draco / KTX2 compression | Asset pipeline | ⭐⭐ |

---

## Curated Resources

### React Three Fiber + Three.js
- **Three.js Journey** (Bruno Simon) — https://threejs-journey.com (paid, gold standard)
- **R3F docs** — https://docs.pmnd.rs/react-three-fiber
- **Drei docs** — https://github.com/pmndrs/drei
- **Maxime Heckel's blog** — https://blog.maximeheckel.com (shader articles are gold)
- **Andrew Woan** (YouTube) — practical R3F tutorials
- **Wawa Sensei** (YouTube) — R3F project walkthroughs

### GLSL Shaders
- **The Book of Shaders** — https://thebookofshaders.com (free, foundational)
- **Inigo Quilez** — https://iquilezles.org/articles (guru-level)
- **Shadertoy** — https://shadertoy.com (browse + remix)
- **Patricio Gonzalez Vivo** — author of Book of Shaders, deep wisdom

### GSAP ScrollTrigger
- **Official docs + demos** — https://gsap.com/docs/v3/Plugins/ScrollTrigger
- **CodeGrid** (YouTube) — cinematic scroll tutorials
- **@gsap/react** package — use `useGSAP` for safe React integration

### Web Audio + Tone.js
- **Tone.js docs** — https://tonejs.github.io
- **MDN Web Audio API** — https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **Smashing Magazine: Audio Visualizer** articles

### Game Dev (Canvas2D)
- **MDN Games** — https://developer.mozilla.org/en-US/docs/Games
- **Coding Math** (YouTube) — game loops, vectors, collision
- **"Fix your timestep!"** (Glenn Fiedler) — canonical fixed-timestep article
- **Frank Force** — minimalist game engine inspiration

### Accessibility
- **WebAIM** — https://webaim.org
- **A11y Project** — https://www.a11yproject.com
- **Sara Soueidan** — articles on accessible motion + ARIA
- **Inclusive Components** (Heydon Pickering) — book

### Performance
- **web.dev/learn/performance** — Google's curriculum
- **Chrome DevTools docs** — Performance tab deep dive
- **R3F perf docs** — https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance
- **WebPageTest** — real-world LCP

### Asset Pipeline
- **gltf.report** — inspect/validate GLBs
- **Khronos glTF docs** — https://www.khronos.org/gltf
- **Draco** — https://github.com/google/draco
- **toktx** for KTX2 — https://github.com/KhronosGroup/KTX-Software

### Design Inspiration (steal like an artist)
- **Awwwards** filter "WebGL" — https://www.awwwards.com
- **Codrops** — https://tympanus.net/codrops
- **Bruno Simon's portfolio** — https://bruno-simon.com (the gold standard)
- **Lusion** — https://lusion.co
- **Active Theory** — https://activetheory.net

---

## Concepts to Internalize

### State Machine for Character
- Read about FSMs (finite state machines) before writing the Zustand store
- XState is overkill here; plain Zustand transitions are enough
- **Key insight**: every interaction is a state *transition*, not a flag toggle. Treat invalid transitions as bugs.

### Fixed Timestep Game Loop
- Variable timestep = physics bugs and frame-rate-dependent behavior
- Pattern: accumulator + interpolation alpha for rendering
- Glenn Fiedler's article is the canonical reference

### Audio Analyzer → Visual
- Web Audio `AnalyserNode` exposes frequency + time-domain data
- `getByteFrequencyData(Uint8Array)` each frame
- Map low-band average → bloom intensity; mid → particle rate; high → ring pulse

### Hologram Shader Recipe
1. Fresnel (rim) — `pow(1.0 - dot(normal, viewDir), n)`
2. Scanline UV scroll — sample noise, shift Y over time
3. Flicker — small alpha modulation with `sin(time)`
4. Slight transparency + `depthWrite: false` (watch sort order)
5. Emissive color contributes to bloom

### Cinematic Camera Lerping
- Don't snap; always lerp with a smoothing factor (0.05–0.1)
- For scripted moves: use GSAP `gsap.to(camera.position, {...})`
- For input-driven: lerp in `useFrame`

### Suspense + Lazy 3D
- Wrap heavy GLBs in `<Suspense fallback={<Placeholder/>}>` so the user sees something while assets stream
- Use `useGLTF.preload()` for assets you know you'll need

### `useFrame` Discipline
- Avoid React state updates inside `useFrame` (re-renders 60×/s)
- Mutate `ref.current` directly for animation values
- Use Zustand subscriptions (not React state) for cross-component scene communication

---

## Personal Notes (fill in as you build)

### 2026-05-18 — Planning Day
- The Zustand FSM is the keystone — every interaction lives there. Avoid the temptation to put state in individual components.
- Hologram + bloom is mostly about disciplined emissive maps, not heavy shader work.
- ___

### ___
- ___

---

## Self-Assessment

### Skills I Already Have
> Check honestly — drives what to study first
- [ ] React hooks (useState/useEffect/useRef/useCallback)
- [ ] Next.js App Router
- [ ] TypeScript generics
- [ ] Tailwind CSS
- [ ] Basic three.js (scene, camera, mesh, light)
- [ ] R3F basics
- [ ] GLSL fragment shader
- [ ] GLSL vertex shader
- [ ] GSAP timeline
- [ ] GSAP ScrollTrigger
- [ ] Tone.js
- [ ] Web Audio analyzer node
- [ ] Canvas2D game loop
- [ ] Blender low-poly modeling
- [ ] Mixamo rigging/retargeting

### Skills I'm Learning On This Project
> Add as gaps surface
- [ ] ...
- [ ] ...

---

## "Aha!" Moments Log
Capture insights worth remembering. Even one-liners help.

| Date | Insight |
|---|---|
| 2026-05-18 | Holographic look ≈ emissive + bloom + scanline overlay, not a complex shader |
| | |
| | |

---

## Stuck Log
When you bang your head > 30 min on something, jot the issue + the eventual fix. Future-you will thank you.

| Date | Stuck on | Fix / Reference |
|---|---|---|
| | | |
| | | |

---

## Recommended Order to Study (if learning from scratch)
1. Solid React + hooks
2. Tailwind CSS
3. Next.js App Router basics
4. Three.js basics (4 hours minimum, ideally Three.js Journey first chapters)
5. R3F + Drei
6. GSAP + ScrollTrigger
7. GLSL crash course (Book of Shaders ch. 1–5)
8. Postprocessing in R3F
9. Web Audio API basics
10. Canvas2D game loop pattern
11. Performance profiling
12. Accessibility patterns

Don't try to learn everything before building — learn the **next 2 phases ahead** of where you currently are.
