"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Keyboard + mouse on the desk surface.
 * Placed in DESK-LOCAL coordinates (sits within the rotated Desk group).
 */
export function Peripherals() {
  const keyboardLightRef = useRef<THREE.MeshBasicMaterial>(null);

  // Pulse the underglow slightly
  useFrame((state) => {
    if (!keyboardLightRef.current) return;
    const t = state.clock.elapsedTime;
    const pulse = 0.55 + Math.sin(t * 1.4) * 0.15;
    keyboardLightRef.current.color.setRGB(
      0.7 * pulse,
      0.4 * pulse,
      1.0 * pulse
    );
  });

  // Mini key grid (decorative, not full keys)
  const keys = useMemo(() => {
    const cells: [number, number][] = [];
    const cols = 14;
    const rows = 4;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push([
          (c - (cols - 1) / 2) * 0.027,
          (r - (rows - 1) / 2) * 0.027,
        ]);
      }
    }
    return cells;
  }, []);

  return (
    <group>
      {/* Keyboard base */}
      <mesh position={[0, 0.745, 0.2]} castShadow>
        <boxGeometry args={[0.42, 0.015, 0.13]} />
        <meshStandardMaterial
          color="#0a0814"
          metalness={0.5}
          roughness={0.45}
        />
      </mesh>

      {/* Keyboard underglow (RGB plane underneath) */}
      <mesh position={[0, 0.738, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.44, 0.15]} />
        <meshBasicMaterial
          ref={keyboardLightRef}
          color="#b266ff"
          toneMapped={false}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Mini key grid (small emissive squares) */}
      <group position={[0, 0.755, 0.2]}>
        {keys.map(([x, z], i) => (
          <mesh key={i} position={[x, 0, z]}>
            <boxGeometry args={[0.022, 0.005, 0.022]} />
            <meshStandardMaterial
              color="#15102a"
              emissive="#00fff0"
              emissiveIntensity={0.25}
              metalness={0.6}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Mouse */}
      <mesh position={[0.27, 0.747, 0.22]} castShadow>
        <boxGeometry args={[0.05, 0.022, 0.075]} />
        <meshStandardMaterial
          color="#0a0814"
          metalness={0.55}
          roughness={0.4}
        />
      </mesh>
      {/* Mouse scroll wheel cyan accent */}
      <mesh position={[0.27, 0.76, 0.205]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.012, 12]} />
        <meshBasicMaterial color="#00fff0" toneMapped={false} />
      </mesh>
      {/* Mouse pad */}
      <mesh position={[0.27, 0.736, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.16, 0.13]} />
        <meshStandardMaterial
          color="#04030a"
          metalness={0.2}
          roughness={0.85}
          emissive="#ff3df0"
          emissiveIntensity={0.04}
        />
      </mesh>
    </group>
  );
}
