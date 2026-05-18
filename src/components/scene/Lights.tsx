"use client";

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} color="#1a1a2e" />
      <hemisphereLight args={["#0033aa", "#110022", 0.45]} />
      {/* Key — only this light casts shadows */}
      <spotLight
        position={[0, 4.5, 2]}
        angle={0.55}
        penumbra={0.6}
        intensity={2.2}
        color="#00fff0"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0005}
      />
      <spotLight
        position={[-3.5, 2.5, 2]}
        angle={0.5}
        penumbra={0.5}
        intensity={0.7}
        color="#b266ff"
      />
      <spotLight
        position={[3.5, 2.5, 1.5]}
        angle={0.5}
        penumbra={0.5}
        intensity={0.5}
        color="#ff3df0"
      />
    </>
  );
}
