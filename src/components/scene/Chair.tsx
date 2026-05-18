"use client";
import { useState } from "react";
import { useSceneStore } from "@/state/useSceneStore";

const ACCENT_CYAN = "#00fff0";
const ACCENT_PURPLE = "#b266ff";
const ACCENT_MAGENTA = "#ff3df0";
const BODY_DARK = "#0a0814";
const CUSHION_DARK = "#15102a";

/**
 * Racing-style gaming chair with LOW backrest so the seated character's
 * torso + head are clearly visible above it. Wings extend up to give
 * the bucket-seat gaming vibe without occluding the chibi.
 */
export function Chair() {
  const [hovered, setHovered] = useState(false);
  const character = useSceneStore((s) => s.character);
  const sitAtDesk = useSceneStore((s) => s.sitAtDesk);
  const leaveDesk = useSceneStore((s) => s.leaveDesk);

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (character === "SITTING_AT_DESK") leaveDesk();
    else sitAtDesk();
  };

  const handleOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const handleOut = () => {
    setHovered(false);
    document.body.style.cursor = "";
  };

  const accentEmissive = hovered ? 0.7 : 0.18;

  return (
    <group
      position={[-1.7, 0, 0.3]}
      rotation={[0, -Math.PI * 0.83, 0]}
      onClick={handleClick}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      data-cursor="object"
    >
      {/* ═══════ SEAT ═══════ */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <boxGeometry args={[0.55, 0.08, 0.55]} />
        <meshStandardMaterial
          color={CUSHION_DARK}
          metalness={0.35}
          roughness={0.6}
          emissive={ACCENT_CYAN}
          emissiveIntensity={accentEmissive * 0.25}
        />
      </mesh>
      {/* Seat bolsters (left + right) */}
      {[-0.24, 0.24].map((x, i) => (
        <mesh key={`bolster-${i}`} position={[x, 0.52, 0]} castShadow>
          <boxGeometry args={[0.09, 0.1, 0.5]} />
          <meshStandardMaterial color={CUSHION_DARK} metalness={0.35} roughness={0.6} />
        </mesh>
      ))}
      {/* Front seat neon piping */}
      <mesh position={[0, 0.5, 0.275]}>
        <boxGeometry args={[0.55, 0.005, 0.005]} />
        <meshBasicMaterial color={ACCENT_CYAN} toneMapped={false} />
      </mesh>
      {/* Bolster top piping */}
      {[-0.24, 0.24].map((x, i) => (
        <mesh key={`bolster-piping-${i}`} position={[x, 0.57, 0]}>
          <boxGeometry args={[0.092, 0.004, 0.5]} />
          <meshBasicMaterial color={ACCENT_CYAN} toneMapped={false} />
        </mesh>
      ))}

      {/* ═══════ BACKREST (low, leans further back) ═══════ */}
      <group position={[0, 0, -0.22]} rotation={[-0.15, 0, 0]}>
        {/* Short main backrest panel (lumbar zone only) */}
        <mesh position={[0, 0.62, 0]} castShadow>
          <boxGeometry args={[0.55, 0.4, 0.06]} />
          <meshStandardMaterial color={CUSHION_DARK} metalness={0.35} roughness={0.6} />
        </mesh>
        {/* Center vertical purple stripe */}
        <mesh position={[0, 0.62, 0.031]}>
          <boxGeometry args={[0.07, 0.36, 0.003]} />
          <meshBasicMaterial color={ACCENT_PURPLE} toneMapped={false} />
        </mesh>

        {/* Racing wings (extend up beyond main panel, frame the upper body) */}
        {[-0.24, 0.24].map((x, i) => (
          <mesh
            key={`wing-${i}`}
            position={[x, 0.95, 0.01]}
            rotation={[0, 0, i === 0 ? 0.08 : -0.08]}
            castShadow
          >
            <boxGeometry args={[0.08, 0.55, 0.045]} />
            <meshStandardMaterial color={CUSHION_DARK} metalness={0.35} roughness={0.6} />
          </mesh>
        ))}
        {/* Wing neon piping */}
        {[-0.24, 0.24].map((x, i) => (
          <mesh
            key={`wing-pipe-${i}`}
            position={[x, 0.95, 0.034]}
            rotation={[0, 0, i === 0 ? 0.08 : -0.08]}
          >
            <boxGeometry args={[0.075, 0.5, 0.003]} />
            <meshBasicMaterial color={ACCENT_CYAN} toneMapped={false} />
          </mesh>
        ))}

        {/* Lumbar pillow (low back support) */}
        <mesh position={[0, 0.55, 0.045]} castShadow>
          <boxGeometry args={[0.32, 0.14, 0.05]} />
          <meshStandardMaterial
            color={ACCENT_PURPLE}
            emissive={ACCENT_PURPLE}
            emissiveIntensity={0.4}
            metalness={0.2}
            roughness={0.65}
          />
        </mesh>
        {/* Lumbar stitch */}
        <mesh position={[0, 0.55, 0.071]}>
          <boxGeometry args={[0.28, 0.004, 0.005]} />
          <meshBasicMaterial color={BODY_DARK} />
        </mesh>

        {/* Brand badge (hexagon) at backrest top center */}
        <mesh position={[0, 0.77, 0.038]}>
          <cylinderGeometry args={[0.038, 0.038, 0.005, 6]} />
          <meshStandardMaterial
            color="#1a1530"
            emissive={ACCENT_MAGENTA}
            emissiveIntensity={0.7}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* ═══════ ARMRESTS ═══════ */}
      {[-0.3, 0.3].map((x, i) => (
        <group key={`arm-${i}`} position={[x, 0.55, -0.05]}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.04, 0.1, 0.05]} />
            <meshStandardMaterial color={BODY_DARK} metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.12, 0.02]} castShadow>
            <boxGeometry args={[0.06, 0.03, 0.34]} />
            <meshStandardMaterial color={CUSHION_DARK} metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.136, 0.02]}>
            <boxGeometry args={[0.055, 0.003, 0.32]} />
            <meshBasicMaterial color={ACCENT_CYAN} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* ═══════ STEM (hydraulic post) ═══════ */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.45, 12]} />
        <meshStandardMaterial color={BODY_DARK} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.055, 0.008, 6, 16]} />
        <meshBasicMaterial color={ACCENT_PURPLE} toneMapped={false} />
      </mesh>

      {/* ═══════ WHEEL BASE (5 prongs with caster wheels) ═══════ */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <group key={`prong-${i}`} rotation={[0, angle, 0]}>
            <mesh position={[0.17, 0.04, 0]} castShadow>
              <boxGeometry args={[0.32, 0.03, 0.05]} />
              <meshStandardMaterial color={BODY_DARK} metalness={0.65} roughness={0.3} />
            </mesh>
            <mesh position={[0.17, 0.022, 0]}>
              <boxGeometry args={[0.3, 0.003, 0.04]} />
              <meshBasicMaterial color={ACCENT_CYAN} toneMapped={false} />
            </mesh>
            <mesh position={[0.33, 0.035, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.03, 12]} />
              <meshStandardMaterial color={CUSHION_DARK} metalness={0.4} roughness={0.55} />
            </mesh>
            <mesh position={[0.33, 0.035, 0]}>
              <sphereGeometry args={[0.013, 8, 8]} />
              <meshStandardMaterial color="#1a1530" emissive={ACCENT_CYAN} emissiveIntensity={0.4} />
            </mesh>
          </group>
        );
      })}

      {/* Hover glow ring under chair */}
      {hovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <ringGeometry args={[0.48, 0.62, 48]} />
          <meshBasicMaterial color={ACCENT_CYAN} transparent opacity={0.45} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
