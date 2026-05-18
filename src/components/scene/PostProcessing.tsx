"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useSceneStore } from "@/state/useSceneStore";
import { useAudioStore } from "@/state/useAudioStore";
import { useMotionStore } from "@/state/useMotionStore";
import { getGuitarAmplitude } from "@/lib/guitarAudio";

function DynamicBloom({ reduced }: { reduced: boolean }) {
  const bloomRef = useRef<{ intensity: number } | null>(null);

  useFrame(() => {
    if (!bloomRef.current) return;
    const mode = useSceneStore.getState().camera;
    const audioOn = useAudioStore.getState().enabled;
    let target = reduced ? 0.5 : 0.85;
    if (mode === "GUITAR_FOCUS" && audioOn && !reduced) {
      target = 0.85 + getGuitarAmplitude() * 0.55;
    }
    bloomRef.current.intensity = THREE.MathUtils.lerp(
      bloomRef.current.intensity ?? target,
      target,
      0.08
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Bloom ref={bloomRef as any} intensity={reduced ? 0.5 : 0.85} luminanceThreshold={0.25} levels={4} />;
}

export function PostProcessing() {
  const motion = useMotionStore((s) => s.level);

  // LOW — skip all post-processing for best performance
  if (motion === "LOW") return null;

  // MEDIUM — bloom only, no vignette
  if (motion === "MEDIUM") {
    return (
      <EffectComposer multisampling={0}>
        <DynamicBloom reduced />
      </EffectComposer>
    );
  }

  // HIGH — full stack
  return (
    <EffectComposer multisampling={0}>
      <DynamicBloom reduced={false} />
      <Vignette eskil={false} darkness={0.6} offset={0.25} />
    </EffectComposer>
  );
}
