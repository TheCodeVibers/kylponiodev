"use client";
import { useSceneStore } from "@/state/useSceneStore";
import { GameCanvas } from "./GameCanvas";

export function GameCanvasWrapper() {
  const camera = useSceneStore(s => s.camera);
  if (camera !== "GAME_FULLSCREEN") return null;
  return <GameCanvas />;
}
