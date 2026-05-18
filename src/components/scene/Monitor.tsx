"use client";
import type { ReactNode } from "react";

interface MonitorProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  accent?: string;
  children: ReactNode;
}

/**
 * Monitor frame + stand. Local Y=0 is at the BOTTOM of the stand base —
 * so positioning at desk-top Y places the stand on the desk surface cleanly.
 *
 * Layout (monitor local):
 *  - Stand base:    Y 0.000 → 0.012
 *  - Stand neck:    Y 0.012 → 0.155
 *  - Screen frame:  Y 0.155 → 0.605  (height 0.45)
 *  - Screen plane:  Y center 0.38
 */
export function Monitor({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  accent = "#00fff0",
  children,
}: MonitorProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Stand base */}
      <mesh position={[0, 0.006, 0]} castShadow>
        <boxGeometry args={[0.26, 0.012, 0.16]} />
        <meshStandardMaterial color="#0a0814" metalness={0.65} roughness={0.3} />
      </mesh>
      {/* Stand neck */}
      <mesh position={[0, 0.084, 0]}>
        <boxGeometry args={[0.05, 0.144, 0.05]} />
        <meshStandardMaterial color="#0a0814" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Frame back */}
      <mesh position={[0, 0.38, -0.025]} castShadow>
        <boxGeometry args={[0.72, 0.45, 0.05]} />
        <meshStandardMaterial color="#0a0814" metalness={0.55} roughness={0.4} />
      </mesh>
      {/* Top bezel emissive */}
      <mesh position={[0, 0.6, 0.001]}>
        <boxGeometry args={[0.66, 0.006, 0.003]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      {/* Bottom bezel emissive */}
      <mesh position={[0, 0.16, 0.001]}>
        <boxGeometry args={[0.66, 0.006, 0.003]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      {/* Small brand logo on bottom bezel */}
      <mesh position={[0, 0.158, 0.003]}>
        <cylinderGeometry args={[0.014, 0.014, 0.003, 6]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      {/* Screen content (the children render a plane here) */}
      <group position={[0, 0.38, 0.002]}>{children}</group>
    </group>
  );
}
