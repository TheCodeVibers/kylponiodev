"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSceneStore, type CameraMode } from "@/state/useSceneStore";

interface CamPreset {
  pos: THREE.Vector3;
  look: THREE.Vector3;
  mouseInfluence: number;
}

// Mobile gets a pulled-back, wider-angle hero view so desk + guitar are visible
const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

const PRESETS: Partial<Record<CameraMode, CamPreset>> = {
  HERO: {
    pos: IS_MOBILE ? new THREE.Vector3(0, 1.9, 9.5) : new THREE.Vector3(0, 1.6, 6),
    look: new THREE.Vector3(0, 1.0, 0),
    mouseInfluence: IS_MOBILE ? 0.3 : 1.0,
  },
  GAME_FULLSCREEN: {
    pos: new THREE.Vector3(-0.4, 1.3, 2.8),
    look: new THREE.Vector3(-1.2, 0.85, 0),
    mouseInfluence: 0,
  },
  DESK_FOCUS: {
    pos: new THREE.Vector3(-0.2, 1.8, 3.4),
    look: new THREE.Vector3(-1.7, 0.9, 0),
    mouseInfluence: 0.25,
  },
  GUITAR_FOCUS: {
    pos: new THREE.Vector3(2.6, 1.6, 3.0),
    look: new THREE.Vector3(2.0, 0.9, 0),
    mouseInfluence: 0.2,
  },
  ABOUT: {
    pos: new THREE.Vector3(2, 1.7, 4),
    look: new THREE.Vector3(0, 1.1, 0),
    mouseInfluence: 0.4,
  },
  PROJECTS: {
    pos: new THREE.Vector3(0, 2.4, 8),
    look: new THREE.Vector3(0, 0.5, 0),
    mouseInfluence: 0.3,
  },
  CONTACT: {
    pos: new THREE.Vector3(0, 1.2, 5),
    look: new THREE.Vector3(0, 0.6, 0),
    mouseInfluence: 0.3,
  },
};

const desiredPos = new THREE.Vector3();
const desiredLook = new THREE.Vector3();

export function CameraRig() {
  const { camera } = useThree();
  const setMouse = useSceneStore((s) => s.setMouse);
  const lookRef = useRef(new THREE.Vector3(0, 1.1, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      setMouse(x, y);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [setMouse]);

  useFrame(() => {
    const { mouse, camera: mode } = useSceneStore.getState();
    const preset = PRESETS[mode] ?? PRESETS.HERO!;

    desiredPos.copy(preset.pos);
    desiredPos.x += mouse.x * 0.6 * preset.mouseInfluence;
    desiredPos.y += mouse.y * 0.3 * preset.mouseInfluence;

    desiredLook.copy(preset.look);

    camera.position.lerp(desiredPos, 0.05);
    lookRef.current.lerp(desiredLook, 0.05);
    camera.lookAt(lookRef.current);
  });

  return null;
}
