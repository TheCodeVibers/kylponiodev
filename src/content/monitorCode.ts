/**
 * Snippets cycled on the L monitor (CodeMonitor).
 * Each snippet is shown in full, scrolled vertically, then the next is loaded.
 */
export const codeSnippets: string[] = [
  `// Cinematic camera lerp
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function useCinematicLerp(
  target: THREE.Vector3,
  factor = 0.06,
) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.lerp(target, factor);
    camera.lookAt(target);
  });
}`,

  `// Audio analyzer -> bloom intensity
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 128;
const data = new Uint8Array(
  analyser.frequencyBinCount,
);

useFrame(() => {
  analyser.getByteFrequencyData(data);
  const lowBand = data.slice(0, 8)
    .reduce((a, b) => a + b, 0) / 8 / 255;
  bloomRef.current.intensity =
    0.9 + lowBand * 0.5;
});`,

  `// Hologram shader fragment
varying vec3 vNormal;
varying vec3 vViewPos;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uBase;
uniform vec3 uRim;

void main() {
  float fres = pow(
    1.0 - dot(vNormal, vViewPos), 2.5
  );
  float scan = sin(
    vUv.y * 80.0 + uTime * 2.0
  ) * 0.5 + 0.5;
  float flick = 0.9 +
    0.1 * sin(uTime * 8.0);
  vec3 col = mix(uBase, uRim, fres);
  gl_FragColor = vec4(
    col, (0.7 + scan * 0.3) * flick
  );
}`,

  `// Character finite state machine
type CharacterState =
  | 'IDLE_HOLOGRAM'
  | 'WALKING_TO_GUITAR'
  | 'SITTING_GUITAR'
  | 'PLAYING_GUITAR'
  | 'RETURNING_TO_CENTER';

export const useSceneStore =
  create<SceneStore>((set) => ({
    character: 'IDLE_HOLOGRAM',
    triggerGuitar: () => set({
      camera: 'GUITAR_FOCUS',
      character: 'WALKING_TO_GUITAR',
    }),
  }));`,

  `// Fixed timestep game loop
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
  render(acc / STEP);
  raf = requestAnimationFrame(frame);
}`,
];
