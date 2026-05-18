"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Scene } from "./Scene";

function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

export default function Stage() {
  const mobile = isMobileViewport();

  return (
    <Canvas
      shadows
      dpr={[1, mobile ? 1.0 : 1.25]}
      camera={{
        position: [0, 1.8, mobile ? 9.5 : 6],
        fov: mobile ? 65 : 38,
        near: 0.1,
        far: 100,
      }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
