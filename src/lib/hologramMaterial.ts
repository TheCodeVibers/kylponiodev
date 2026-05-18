import * as THREE from "three";

const vertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float time;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float NdotV = clamp(dot(normalize(vNormal), viewDir), 0.0, 1.0);

  // Fresnel rim — bright edge glow
  float fresnel = pow(1.0 - NdotV, 2.5);

  // Scanlines drifting upward
  float scan = sin(vWorldPos.y * 18.0 - time * 2.0) * 0.5 + 0.5;

  // Subtle per-fragment flicker
  float flicker = 0.92 + 0.08 * sin(time * 11.3 + vWorldPos.x * 3.0);

  // Cyan base + bright fresnel rim
  vec3 col = vec3(0.0, 0.94, 0.87) * (0.4 + scan * 0.15);
  col += vec3(0.15, 0.95, 1.0) * fresnel * 2.5;

  float alpha = (0.3 + fresnel * 0.65 + scan * 0.05) * flicker;
  alpha = clamp(alpha, 0.15, 0.92);

  gl_FragColor = vec4(col, alpha);
}
`;

export function createHologramMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}
