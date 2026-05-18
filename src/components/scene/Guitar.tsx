"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "@/state/useSceneStore";
import { getGuitarAmplitude, startGuitarAudio } from "@/lib/guitarAudio";

// ── Shared helper ──────────────────────────────────────────────────────────────
function Box({
  pos,
  size,
  color,
  emissive = "#000000",
  emissiveIntensity = 0,
  metalness = 0.1,
  roughness = 0.8,
  transparent = false,
  opacity = 1,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  transparent?: boolean;
  opacity?: number;
}) {
  return (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        metalness={metalness}
        roughness={roughness}
        transparent={transparent}
        opacity={opacity}
      />
    </mesh>
  );
}

// ── Guitar Stool (at character's sitting position) ─────────────────────────────
export function GuitarStool() {
  return (
    <group position={[2.0, 0, 0.3]}>
      {/* Seat */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <cylinderGeometry args={[0.21, 0.19, 0.04, 20]} />
        <meshStandardMaterial color="#0a0814" metalness={0.45} roughness={0.5}
          emissive="#0033cc" emissiveIntensity={0.15} />
      </mesh>
      {/* Seat top neon ring */}
      <mesh position={[0, 0.482, 0]}>
        <torusGeometry args={[0.19, 0.006, 8, 32]} />
        <meshBasicMaterial color="#0088ff" toneMapped={false} />
      </mesh>
      {/* Center post */}
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.04, 0.44, 10]} />
        <meshStandardMaterial color="#151020" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Footrest ring */}
      <mesh position={[0, 0.26, 0]}>
        <torusGeometry args={[0.13, 0.012, 8, 24]} />
        <meshStandardMaterial color="#111" metalness={0.65} roughness={0.35}
          emissive="#0055ff" emissiveIntensity={0.2} />
      </mesh>
      {/* 3 legs */}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * 0.13, 0.1, Math.cos(angle) * 0.13]}
            rotation={[0, 0, Math.sin(angle) * 0.28]}
            castShadow
          >
            <boxGeometry args={[0.02, 0.22, 0.02]} />
            <meshStandardMaterial color="#111" metalness={0.65} roughness={0.35} />
          </mesh>
        );
      })}
      {/* Base plate */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.018, 20]} />
        <meshStandardMaterial color="#0a0814" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[0.2, 0.004, 6, 28]} />
        <meshBasicMaterial color="#0033cc" toneMapped={false} />
      </mesh>
    </group>
  );
}

// ── Guitar Amp ──────────────────────────────────────────────────────────────────
export function GuitarAmp() {
  return (
    <group position={[3.1, 0, 0.0]} rotation={[0, -0.4, 0]}>
      {/* Main cabinet */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.36, 0.44, 0.26]} />
        <meshStandardMaterial color="#080612" metalness={0.3} roughness={0.75} />
      </mesh>
      {/* Speaker grille (front face) */}
      <mesh position={[0, 0.22, 0.132]}>
        <boxGeometry args={[0.30, 0.30, 0.008]} />
        <meshStandardMaterial color="#111122" metalness={0.2} roughness={0.9}
          emissive="#0011aa" emissiveIntensity={0.08} />
      </mesh>
      {/* Speaker cone */}
      <mesh position={[0, 0.22, 0.137]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.01, 24]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.2} roughness={0.9} />
      </mesh>
      {/* Neon brand strip at top */}
      <mesh position={[0, 0.433, 0.133]}>
        <boxGeometry args={[0.3, 0.016, 0.005]} />
        <meshBasicMaterial color="#0088ff" toneMapped={false} />
      </mesh>
      {/* 3 knobs */}
      {[-0.08, 0, 0.08].map((x, i) => (
        <mesh key={i} position={[x, 0.395, 0.134]}>
          <cylinderGeometry args={[0.018, 0.018, 0.016, 12]} />
          <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3}
            emissive="#0044ff" emissiveIntensity={0.2} />
        </mesh>
      ))}
      {/* Corner edge strips */}
      {[[-0.178, 0], [0.178, 0]].map(([x], i) => (
        <mesh key={i} position={[x, 0.22, 0]}>
          <boxGeometry args={[0.008, 0.44, 0.27]} />
          <meshStandardMaterial color="#0033aa" metalness={0.5} roughness={0.4}
            emissive="#0033cc" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* Base */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[0.38, 0.02, 0.28]} />
        <meshStandardMaterial color="#050410" metalness={0.55} roughness={0.4} />
      </mesh>
    </group>
  );
}

// ── Guitar Stand ───────────────────────────────────────────────────────────────
export function GuitarStand() {
  return (
    <group position={[2.5, 0, 0.2]}>
      {/* Left leg — tilted outward */}
      <mesh position={[-0.12, 0.35, 0]} rotation={[0, 0, 0.25]}>
        <boxGeometry args={[0.012, 0.7, 0.012]} />
        <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Right leg — tilted outward */}
      <mesh position={[0.12, 0.35, 0]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.012, 0.7, 0.012]} />
        <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Crossbar */}
      <Box pos={[0, 0.12, 0]} size={[0.28, 0.012, 0.012]} color="#222222" metalness={0.6} roughness={0.4} />
      {/* Top yoke left */}
      <mesh position={[-0.1, 0.72, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.012, 0.16, 0.012]} />
        <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Top yoke right */}
      <mesh position={[0.1, 0.72, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.012, 0.16, 0.012]} />
        <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

// ── Guitar ─────────────────────────────────────────────────────────────────────
export function Guitar() {
  const guitarGroupRef = useRef<THREE.Group>(null);
  const auraLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const charState = useSceneStore.getState().character;

    // Y bob animation
    if (guitarGroupRef.current) {
      guitarGroupRef.current.position.y = 0.85 + Math.sin(t * 0.9) * 0.025;
    }

    // Aura light intensity animation
    if (auraLightRef.current) {
      let intensity = 0.35 + Math.sin(t * 1.6) * 0.2;
      if (charState === "PLAYING_GUITAR") {
        intensity += getGuitarAmplitude() * 0.6;
      }
      auraLightRef.current.intensity = intensity;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const store = useSceneStore.getState();
    if (store.character === "IDLE_HOLOGRAM" || store.character === "WAVING") {
      // Prime AudioContext during user gesture so it's ready when character arrives
      startGuitarAudio();
      store.triggerGuitar();
    }
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const charState = useSceneStore.getState().character;
    if (charState === "IDLE_HOLOGRAM" || charState === "WAVING") {
      document.body.style.cursor = "pointer";
    }
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "none";
  };

  return (
    <>
      {/* Aura point light — outside the bobbing group so position is stable */}
      <pointLight
        ref={auraLightRef}
        position={[2.5, 1.5, 0.8]}
        color="#0055ff"
        intensity={0.35}
        distance={3.5}
      />

      {/* Bobbing guitar group */}
      <group
        ref={guitarGroupRef}
        position={[2.5, 0.85, 0.2]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* ── BODY ──────────────────────────────────────────── */}
        {/* Main body */}
        <Box
          pos={[0, 0, 0]}
          size={[0.28, 0.40, 0.07]}
          color="#0a0820"
          emissive="#0033cc"
          emissiveIntensity={0.6}
        />
        {/* Upper cutaway horn */}
        <Box
          pos={[-0.14, 0.22, 0]}
          size={[0.07, 0.13, 0.07]}
          color="#0a0820"
          emissive="#0033cc"
          emissiveIntensity={0.6}
        />
        {/* Body edge trim strip (front face) */}
        <Box
          pos={[0, 0, 0.038]}
          size={[0.30, 0.42, 0.005]}
          color="#0033cc"
          emissive="#0088ff"
          emissiveIntensity={1.2}
        />

        {/* ── NECK ──────────────────────────────────────────── */}
        <Box
          pos={[0, 0.48, 0]}
          size={[0.055, 0.56, 0.038]}
          color="#1a0e05"
          metalness={0.2}
          roughness={0.85}
        />
        {/* Headstock */}
        <Box
          pos={[0, 0.795, 0]}
          size={[0.11, 0.11, 0.038]}
          color="#1a0e05"
          metalness={0.2}
          roughness={0.85}
        />
        {/* Nut */}
        <Box pos={[0, 0.505, 0.02]} size={[0.06, 0.008, 0.012]} color="#888888" />

        {/* ── FRETS ─────────────────────────────────────────── */}
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={`fret-${i}`}
            pos={[0, 0.22 + i * 0.1, 0.02]}
            size={[0.057, 0.003, 0.006]}
            color="#aaaaaa"
            emissive="#aaaaaa"
            emissiveIntensity={0.3}
          />
        ))}

        {/* ── STRINGS ───────────────────────────────────────── */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Box
            key={`string-${i}`}
            pos={[-0.018 + i * 0.007, 0.48, 0.022]}
            size={[0.0025, 0.56, 0.001]}
            color="#ff3df0"
            emissive="#ff3df0"
            emissiveIntensity={1.5}
            transparent
            opacity={0.9}
          />
        ))}

        {/* ── PICKUPS ───────────────────────────────────────── */}
        <Box
          pos={[0, 0.08, 0.042]}
          size={[0.11, 0.038, 0.014]}
          color="#1a1a1a"
          emissive="#0033ff"
          emissiveIntensity={0.3}
        />
        <Box
          pos={[0, -0.08, 0.042]}
          size={[0.11, 0.038, 0.014]}
          color="#1a1a1a"
          emissive="#0033ff"
          emissiveIntensity={0.3}
        />

        {/* ── BRIDGE ────────────────────────────────────────── */}
        <Box
          pos={[0, -0.17, 0.038]}
          size={[0.1, 0.018, 0.018]}
          color="#333333"
          metalness={0.8}
          roughness={0.2}
        />

        {/* ── TUNING PEGS ───────────────────────────────────── */}
        {/* Left side */}
        {[0, 1, 2].map((i) => (
          <mesh key={`peg-l-${i}`} position={[-0.065, 0.755 + i * 0.035, 0]}>
            <cylinderGeometry args={[0.007, 0.007, 0.025, 8]} />
            <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        {/* Right side */}
        {[0, 1, 2].map((i) => (
          <mesh key={`peg-r-${i}`} position={[0.065, 0.755 + i * 0.035, 0]}>
            <cylinderGeometry args={[0.007, 0.007, 0.025, 8]} />
            <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </>
  );
}
