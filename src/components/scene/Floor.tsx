"use client";
import { MeshReflectorMaterial } from "@react-three/drei";

export function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <MeshReflectorMaterial
        mirror={0.4}
        blur={[60, 30]}
        resolution={256}
        mixBlur={1.4}
        mixStrength={0.9}
        roughness={0.7}
        depthScale={0.6}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0a0814"
        metalness={0.45}
      />
    </mesh>
  );
}
