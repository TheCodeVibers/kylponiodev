"use client";
import { useRef, useEffect } from "react";
import { Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMotionStore } from "@/state/useMotionStore";
import { Lights } from "./Lights";
import { CameraRig } from "./CameraRig";
import { Particles } from "./Particles";
import { Character } from "./Character";
import { Floor } from "./Floor";
import { HologramRing } from "./HologramRing";
import { Desk } from "./Desk";
import { Chair } from "./Chair";
import { RoomEnvironment } from "./RoomEnvironment";
import { PostProcessing } from "./PostProcessing";
import { Guitar, GuitarStand, GuitarStool, GuitarAmp } from "./Guitar";
import * as THREE from "three";

// Canvas texture sign — renders as a real 3D mesh so the character occludes it naturally
function BackWallSign() {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    let tex: THREE.CanvasTexture;

    document.fonts.ready.then(() => {
      const W = 2048, H = 560;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, W, H);

      // Main name
      ctx.save();
      ctx.font = "900 110px Orbitron, sans-serif";
      ctx.fillStyle = "#00fff0";
      ctx.textAlign = "center";
      ctx.shadowColor = "#00fff0";
      ctx.shadowBlur = 36;
      ctx.fillText("JAYSON PONIO MALLARI", W / 2, 155);
      ctx.restore();

      // AKA subtitle
      ctx.save();
      ctx.font = "600 48px Rajdhani, sans-serif";
      ctx.fillStyle = "#c084fc";
      ctx.textAlign = "center";
      ctx.shadowColor = "#b266ff";
      ctx.shadowBlur = 22;
      ctx.fillText("A.K.A  KYL PONIO", W / 2, 255);
      ctx.restore();

      // Vibe Coder — gradient
      ctx.save();
      const grad = ctx.createLinearGradient(W * 0.25, 0, W * 0.75, 0);
      grad.addColorStop(0, "#00fff0");
      grad.addColorStop(0.5, "#b266ff");
      grad.addColorStop(1, "#ff36e8");
      ctx.font = "700 80px Orbitron, sans-serif";
      ctx.fillStyle = grad;
      ctx.textAlign = "center";
      ctx.shadowColor = "#b266ff";
      ctx.shadowBlur = 28;
      ctx.fillText("VIBE CODER", W / 2, 410);
      ctx.restore();

      tex = new THREE.CanvasTexture(canvas);
      const mat = meshRef.current?.material as THREE.MeshBasicMaterial | undefined;
      if (mat) { mat.map = tex; mat.needsUpdate = true; }
    });

    return () => tex?.dispose();
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 2.0, -5]}>
      <planeGeometry args={[7.2, 2.0]} />
      {/* alphaTest (not transparent) → opaque pass → writes depth → character occludes it */}
      <meshBasicMaterial alphaTest={0.04} />
    </mesh>
  );
}

// Pauses R3F render loop when the browser tab is hidden
function TabPause() {
  const { gl } = useThree();
  useEffect(() => {
    const handle = () => {
      // Throttle rendering when hidden; browser already slows rAF but this stops it fully
      if (document.hidden) gl.setAnimationLoop(null);
    };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, [gl]);
  return null;
}

export function Scene() {
  const motion = useMotionStore((s) => s.level);
  const particleCount = motion === "LOW" ? 0 : motion === "MEDIUM" ? 150 : 500;

  return (
    <>
      <TabPause />
      <CameraRig />
      <Lights />
      <Environment preset="warehouse" environmentIntensity={0.3} />
      <RoomEnvironment />
      <Floor />
      <HologramRing />
      <Character />
      <Desk />
      <Chair />
      {particleCount > 0 && <Particles count={particleCount} />}
      <BackWallSign />
      <Guitar />
      <GuitarStand />
      <GuitarStool />
      <GuitarAmp />
      <PostProcessing />
    </>
  );
}
