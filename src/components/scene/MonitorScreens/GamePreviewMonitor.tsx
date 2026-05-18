"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "@/state/useSceneStore";

interface Props {
  width?: number;
  height?: number;
}

const CANVAS_W = 480;
const CANVAS_H = 280;

interface Star { x: number; y: number; s: number }
interface Enemy { x: number; y: number; type: "bit" | "glitch" }

/**
 * Attract-mode preview of the mini-game (Phase 5/6 will replace with real game).
 * Pure Canvas2D animation looped as a CanvasTexture.
 */
export function GamePreviewMonitor({ width = 0.66, height = 0.4 }: Props) {
  const canvas = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = CANVAS_W;
    c.height = CANVAS_H;
    return c;
  }, []);

  const texture = useMemo(() => {
    if (!canvas) return null;
    const t = new THREE.CanvasTexture(canvas);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [canvas]);

  const stateRef = useRef({
    stars: Array.from({ length: 60 }, () => ({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      s: 0.3 + Math.random() * 1.2,
    })) as Star[],
    enemies: [] as Enemy[],
    spawnTimer: 0,
    lastFrame: 0,
    playerY: CANVAS_H / 2,
    playerDir: 1,
  });

  useFrame((threeState, delta) => {
    if (!canvas || !texture) return;
    const s = stateRef.current;
    const now = threeState.clock.elapsedTime;
    if (now - s.lastFrame < 0.08) return;
    const dt = now - s.lastFrame;
    s.lastFrame = now;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Nebula background
    const grad = ctx.createRadialGradient(
      CANVAS_W / 2,
      CANVAS_H / 2,
      20,
      CANVAS_W / 2,
      CANVAS_H / 2,
      CANVAS_W / 1.4
    );
    grad.addColorStop(0, "#150a25");
    grad.addColorStop(1, "#04030a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Stars (parallax)
    for (const star of s.stars) {
      star.x -= star.s * 60 * dt;
      if (star.x < 0) {
        star.x = CANVAS_W;
        star.y = Math.random() * CANVAS_H;
      }
      ctx.fillStyle = star.s > 0.9 ? "#b9c0e0" : "#424a73";
      ctx.fillRect(star.x, star.y, star.s, star.s);
    }

    // Spawn enemies
    s.spawnTimer += dt;
    if (s.spawnTimer > 0.8) {
      s.spawnTimer = 0;
      s.enemies.push({
        x: CANVAS_W + 10,
        y: 20 + Math.random() * (CANVAS_H - 40),
        type: Math.random() > 0.6 ? "glitch" : "bit",
      });
    }

    // Update + draw enemies
    s.enemies = s.enemies.filter((e) => e.x > -20);
    for (const e of s.enemies) {
      e.x -= (e.type === "glitch" ? 130 : 90) * dt;
      if (e.type === "glitch") e.y += Math.sin(now * 4 + e.x * 0.05) * 1.5;
      ctx.fillStyle = e.type === "glitch" ? "#ff3df0" : "#b266ff";
      ctx.fillRect(e.x - 4, e.y - 3, 8, 6);
      ctx.fillStyle = e.type === "glitch" ? "#ffa8f5" : "#d6b3ff";
      ctx.fillRect(e.x - 2, e.y - 1, 4, 2);
    }

    // Player (auto-bob)
    s.playerY += s.playerDir * 40 * dt;
    if (s.playerY < 30 || s.playerY > CANVAS_H - 30) s.playerDir *= -1;
    const px = 40;
    const py = s.playerY;
    // ship body
    ctx.fillStyle = "#00fff0";
    ctx.beginPath();
    ctx.moveTo(px + 10, py);
    ctx.lineTo(px - 6, py - 5);
    ctx.lineTo(px - 6, py + 5);
    ctx.closePath();
    ctx.fill();
    // thruster
    ctx.fillStyle = "#c0ff00";
    ctx.fillRect(px - 9, py - 2, 3, 4);

    // Title bar (top)
    ctx.fillStyle = "rgba(4,3,10,0.7)";
    ctx.fillRect(0, 0, CANVAS_W, 22);
    ctx.font = 'bold 12px "Orbitron", monospace';
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#00fff0";
    ctx.fillText("VIBE STRIKER", 10, 11);
    ctx.fillStyle = "#7a83b3";
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = "right";
    ctx.fillText("HI 1230", CANVAS_W - 10, 11);
    ctx.textAlign = "left";

    // "PRESS PLAY" blink
    if (Math.floor(now * 1.4) % 2 === 0) {
      ctx.font = 'bold 14px "Orbitron", monospace';
      ctx.fillStyle = "#c0ff00";
      ctx.textAlign = "center";
      ctx.fillText("► CLICK TO PLAY", CANVAS_W / 2, CANVAS_H - 24);
      ctx.textAlign = "left";
    }

    texture.needsUpdate = true;
  });

  if (!texture) return null;

  return (
    <mesh
      onClick={(e) => {
        e.stopPropagation();
        useSceneStore.getState().expandGame();
      }}
      onPointerOver={() => { document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "none"; }}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
