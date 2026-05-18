"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  count?: number;
}

interface ParticleData {
  x: number;
  y: number;
  z: number;
  speed: number;
}

export function Particles({ count = 250 }: ParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions = useMemo<ParticleData[]>(() => {
    const arr: ParticleData[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 12,
        y: Math.random() * 6 - 0.5,
        z: (Math.random() - 0.5) * 8,
        speed: 0.08 + Math.random() * 0.18,
      });
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const p = positions[i];
      p.y += p.speed * delta;
      if (p.y > 5.5) p.y = -0.5;
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(0.022);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#00fff0" toneMapped={false} transparent opacity={0.8} />
    </instancedMesh>
  );
}
