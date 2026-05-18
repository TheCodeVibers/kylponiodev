"use client";

/**
 * Studio gaming room — back wall, side wall, ceiling LED strips, neon trims.
 * Designed to give a sense of enclosure without occluding the camera.
 */
export function RoomEnvironment() {
  return (
    <group>
      {/* Back wall (behind desk + character) */}
      <mesh position={[0, 2, -4]} receiveShadow>
        <planeGeometry args={[18, 5]} />
        <meshStandardMaterial
          color="#06050f"
          metalness={0.2}
          roughness={0.85}
        />
      </mesh>

      {/* Back-wall vertical neon strips */}
      {[-5, -3, 3, 5].map((x, i) => (
        <mesh key={`bv-${i}`} position={[x, 2.1, -3.99]}>
          <planeGeometry args={[0.04, 3.5]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#b266ff" : "#00fff0"}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Back-wall horizontal accent (mid) */}
      <mesh position={[0, 1.2, -3.985]}>
        <planeGeometry args={[12, 0.025]} />
        <meshBasicMaterial color="#00aaff" toneMapped={false} />
      </mesh>

      {/* Back-wall glowing sign panel */}
      <mesh position={[2.6, 2.4, -3.97]}>
        <planeGeometry args={[1.4, 0.55]} />
        <meshStandardMaterial
          color="#0a0820"
          emissive="#ff3df0"
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[2.6, 2.4, -3.965]}>
        <planeGeometry args={[1.3, 0.45]} />
        <meshBasicMaterial color="#ff3df0" toneMapped={false} transparent opacity={0.15} />
      </mesh>

      {/* Right-side wall (suggested, partial) */}
      <mesh
        position={[5.5, 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial
          color="#06050f"
          metalness={0.2}
          roughness={0.85}
        />
      </mesh>

      {/* Right-wall vertical neon trim */}
      <mesh
        position={[5.49, 2.1, -1.5]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[3.5, 0.03]} />
        <meshBasicMaterial color="#00fff0" toneMapped={false} />
      </mesh>

      {/* Ceiling indicator (long horizontal LED bar) */}
      <mesh position={[0, 4.2, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 0.12]} />
        <meshBasicMaterial color="#b266ff" toneMapped={false} />
      </mesh>
      {/* Second ceiling LED bar */}
      <mesh position={[0, 4.2, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 0.08]} />
        <meshBasicMaterial color="#00fff0" toneMapped={false} />
      </mesh>

      {/* Ceiling fill light (downward) */}
      <pointLight position={[0, 4, 0]} intensity={0.6} color="#b266ff" distance={8} decay={1.5} />
      <pointLight position={[-2, 4, -1]} intensity={0.4} color="#00fff0" distance={6} decay={1.5} />
      <pointLight position={[2, 4, -1]} intensity={0.4} color="#ff3df0" distance={6} decay={1.5} />

      {/* Floor base color tint (subtle) — purely a flat plane far below to enrich reflections */}
      <mesh position={[0, -0.01, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial
          color="#04030a"
          metalness={0.1}
          roughness={1}
        />
      </mesh>
    </group>
  );
}
