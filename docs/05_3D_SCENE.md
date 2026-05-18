# 05 — 3D Scene Specification

## Room Layout (top-down)
```
   ┌────────────────────────────────────────────┐
   │                                            │
   │   [Desk + 3 Monitors]                      │
   │   ╔═══╗╔═══╗╔═══╗                          │
   │   ║ L ║║ C ║║ R ║                          │
   │   ╚═══╝╚═══╝╚═══╝                          │
   │                                            │
   │                   ◉   ← Character          │
   │                   (rotating hologram)      │
   │                                            │
   │                              [Guitar] ♫    │
   │                                            │
   └────────────────────────────────────────────┘
                      ↑
                  Camera (front-center, hero)
```

- **Floor**: dark mirror-finish (`MeshReflectorMaterial` from Drei, blur [200, 100], resolution 1024, mixBlur 0.8)
- **Walls**: optional, low-poly, with emissive trim strips along edges; or omit and use deep void
- **"Sky" / void**: deep space gradient with subtle nebula color stops, behind everything

---

## Lighting

| Light | Color | Intensity | Position | Purpose |
|---|---|---|---|---|
| Ambient | `#1a1a2e` | 0.2 | — | Base fill so shadows aren't black |
| Hemisphere | sky `#0033aa` / ground `#110022` | 0.4 | — | Global vibe |
| Spot (key) | `#00fff0` (cyan) | 1.8 | `(0, 4, 2)` → character | Overhead hologram key |
| Spot (fill) | `#b266ff` (purple) | 0.6 | `(-3, 2.5, 2)` → character | Side rim |
| Point (desk) | `#ff3df0` (magenta) | 0.8 | behind monitors | RGB monitor glow |
| Point (guitar) | `#00aaff` (blue) | pulses 0.4 → 1.2 | at guitar | Breathing |
| Environment | "warehouse" HDRI preset | — | — | Metallic reflections (low intensity) |

All shadows: `PCFSoftShadowMap`, only key spot casts shadows. Shadow map size `1024×1024`.

---

## Camera Rig

### Base
- `PerspectiveCamera`, fov **38**, near **0.1**, far **100**
- Position (hero): `(0, 1.6, 6)` looking at `(0, 1, 0)`

### Mouse Parallax
```ts
useFrame(({ camera, mouse }) => {
  const targetX = mouse.x * 0.4;
  const targetY = 1.6 + mouse.y * 0.2;
  camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.08);
  camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.08);
  camera.lookAt(0, 1, 0);
});
```

### Scroll Choreography (GSAP ScrollTrigger)
| Scroll % | Mode | Camera target |
|---|---|---|
| 0–25 | HERO | `(0, 1.6, 6)` orbit-slow |
| 25–50 | ABOUT | dolly to `(2, 1.7, 4)`, look at desk |
| 50–75 | PROJECTS | pull back to `(0, 2.4, 8)`, slight top-down |
| 75–100 | CONTACT | tilt down to terminal HUD `(0, 1.2, 5)` |

### Cinematic Transitions
- Game expand: lerp camera to `(0, 1.5, 2.8)` over 1.0s easeOutQuint, then DOM canvas fades in
- Guitar focus: lerp to `(2.5, 1.5, 3)` + look-at guitar position, 1.2s

---

## Character ("Kyl Hologram")

### Model
- **Format**: GLB, Draco-compressed
- **Tris**: ~10k (chibi proportions allow low poly)
- **Style**: big head, simplified hands, suit with neon trim
- **Textures**: 1024² diffuse + emissive
- Emissive map drives the cyan hologram glow

### Materials
Custom hologram shader extending `MeshStandardMaterial` with a custom fragment chunk:
- **Fresnel rim** — `pow(1.0 - dot(normal, viewDir), 2.5)` boosts cyan at silhouette
- **Animated scanlines** — sample noise texture, shift UV by `time * 0.5`
- **Flicker** — multiply alpha by `0.9 + 0.1 * sin(time * 8.0)`
- **Slight transparency** — `opacity: 0.85`, `transparent: true`, `depthWrite: false` (sort carefully)

### Rig
Standard humanoid skeleton (Mixamo-compatible) so we can re-use Mixamo animation library.

### Animations
Separate GLB clips (smaller than embedding all in one model):
| Clip | Length | Loop | Description |
|---|---|---|---|
| `idle_hologram` | 4s | ✅ | Gentle breath + slow 360° body Y rotation |
| `walk` | 1.2s | ✅ | Walk cycle |
| `sit_down` | 0.8s | one-shot | Transition into seated |
| `stand_up` | 0.8s | one-shot | Reverse of sit_down |
| `play_guitar` | 8s | ✅ | Strumming idle |
| `wave` | 1.5s | one-shot | Easter-egg greeting on click |

Animation manager via `useAnimations` from Drei. Blend with **0.3s crossfade**.

```tsx
const { actions, mixer } = useAnimations(animations, group);

useEffect(() => {
  const action = actions[currentClip];
  action?.reset().fadeIn(0.3).play();
  return () => { action?.fadeOut(0.3); };
}, [currentClip]);
```

---

## Desk + Monitors

### Desk
- Low-poly cuboid (~500 tris)
- Material: dark chrome with emissive edges (cyan trim along front lip)

### Monitor Frames
- Thin bezels with chamfered corners
- 3 units in slight curve (toed-in toward center)

### Monitor Screens (3 strategies considered)
1. **`<Html transform/>`** — easy to author, accurate text — but expensive (DOM in 3D)
2. **`<CanvasTexture>` updated per frame** — best perf, more code
3. **Pre-rendered video texture** — cheapest, less dynamic

**Decision**: hybrid —
- **Monitor L (code)**: CanvasTexture, repaint at 10 FPS (cheap, looks great)
- **Monitor C (terminal)**: CanvasTexture, repaint on keystroke events from a fake stdin loop
- **Monitor R (game preview)**: pre-rendered loop video texture; swap to live game on click

### Content
- **Monitor L** — scrolling TS / TSX snippets from `content/monitorCode.ts`
- **Monitor C** — terminal:
  ```
  > pnpm dev
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  ✓ Ready in 1.2s
  ✓ Compiled / in 312ms
  ```
  Periodic fake errors → fixed in real time → green check
- **Monitor R** — attract-mode loop (player ship + scrolling background + flashing "PRESS START")

### Click
- Raycast onto monitor mesh
- Hover: monitor frame glow intensifies + "[ CLICK TO PLAY ]" text overlays
- Click R: `expandGame()` → camera dollies → DOM `<GameCanvas/>` fades in

---

## Guitar

### Model
- Floating on a stand (or floating freely with subtle Y bob)
- Material: dark chrome body with neon blue trim
- Strings: magenta emissive

### Lighting
- Pulsing point light at body
- Aura intensifies on hover

### Interaction
Click guitar →
1. Scene store: `triggerGuitar()` → camera switches to `GUITAR_FOCUS` (lerped over 1.2s)
2. Character: `WALKING_TO_GUITAR` — plays `walk` clip + position lerps along a 3-waypoint path
3. On arrival: plays `sit_down` (0.8s one-shot)
4. State → `PLAYING_GUITAR` → plays `play_guitar` loop
5. Tone.js triggers `guitar_loop.opus`
6. Audio analyzer drives:
   - Bloom intensity (0.9 → up to 1.4)
   - Particle emission rate (1× → 2×)
   - Ring pulse amplitude

Click elsewhere or "Stop" button →
1. Character `stand_up`
2. `RETURNING_TO_CENTER` → walks back, position lerps to center
3. `IDLE_HOLOGRAM` resumes
4. Camera lerps back to `HERO`

---

## Particles
- **Count**: 600 (desktop high), 300 (medium), 100 (mobile)
- Implementation: `InstancedMesh` of tiny spheres
- Random initial positions inside a cylinder around the character
- Drift slowly upward; respawn at floor level when reaching ceiling
- Color blends cyan ↔ magenta over time via vertex-color attribute updated in `useFrame`
- Soft additive blending

---

## Hologram Ring
- Animated ring **under** the character (Drei `<Ring/>` or a `<Circle/>` with custom shader)
- Custom shader: rotating dashed gradient + outer wave pulse
- Same color palette as character emissive

---

## Post-Processing
```tsx
<EffectComposer multisampling={0}>
  <Bloom intensity={0.9} luminanceThreshold={0.15} mipmapBlur />
  <ChromaticAberration offset={[0.0008, 0.0008]} />
  <Noise opacity={0.04} />
  <Vignette eskil={false} darkness={0.6} />
  <ScanlinePass density={1.2} />   {/* custom pass */}
</EffectComposer>
```

Disabled on motion=LOW. Bloom-only on motion=MEDIUM. Full stack on motion=HIGH.

---

## Custom Shaders (GLSL)
Stored in `src/lib/shaders/`:
- `hologramMaterial.glsl.ts` — vertex + fragment with scanlines + flicker + fresnel
- `scanlinePass.glsl.ts` — full-screen scanline + slight RGB split
- `ringPulse.glsl.ts` — animated ring under character
- `particle.glsl.ts` — vertex shader for instanced particle drift

Use `glsl` template literal helper (`three/examples` or simple string templating).

---

## Performance Tactics
- DPR clamp: `dpr={[1, 1.75]}`
- Frustum culling on instanced particles
- Disable post FX on mobile or low GPU tier (`useDetectGPU`)
- LOD on character (swap to ~3k-tri model when camera > 8 units away)
- Texture compression: KTX2 (BasisU)
- GLB compression: Draco
- Suspense-lazy load character + desk
- Pause `useFrame` callbacks when tab hidden (`document.hidden`)

---

## Scene File Skeleton
```tsx
// src/components/scene/Scene.tsx
'use client';
import { Suspense } from 'react';
import { Environment } from '@react-three/drei';
import { CameraRig, Lights, Particles, Room, HologramRing, PostProcessing } from '.';

export default function Scene() {
  return (
    <>
      <CameraRig />
      <Lights />
      <Environment preset="warehouse" intensity={0.3} />
      <Suspense fallback={null}>
        <Particles />
        <HologramRing />
        <Room />
      </Suspense>
      <PostProcessing />
    </>
  );
}
```
