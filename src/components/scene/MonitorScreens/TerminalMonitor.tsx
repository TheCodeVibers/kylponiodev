"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  width?: number;
  height?: number;
}

const CANVAS_W = 512;
const CANVAS_H = 320;
const LINE_H = 18;
const CHAR_SPEED = 28; // chars per second

interface Line {
  start: number;
  text: string;
  color: string;
}

const SCRIPT: Line[] = [
  { start: 0.0, text: "> pnpm dev", color: "#00fff0" },
  { start: 0.8, text: "", color: "#b9c0e0" },
  { start: 1.2, text: "▲ Next.js 16.2.6 (Turbopack)", color: "#b9c0e0" },
  { start: 1.8, text: "- Local:    http://localhost:3000", color: "#7a83b3" },
  { start: 2.4, text: "- Network:  http://192.168.1.10:3000", color: "#7a83b3" },
  { start: 3.2, text: "✓ Ready in 712ms", color: "#c0ff00" },
  { start: 4.6, text: "", color: "#b9c0e0" },
  { start: 5.0, text: "○ Compiling /...", color: "#7a83b3" },
  { start: 6.0, text: "✓ Compiled / in 312ms", color: "#c0ff00" },
  { start: 6.6, text: "  GET / 200 in 45ms", color: "#7a83b3" },
  { start: 7.8, text: "✓ Compiled in 89ms", color: "#c0ff00" },
  { start: 8.4, text: "  GET / 200 in 12ms", color: "#7a83b3" },
  { start: 9.6, text: "  ⚡ HMR update applied", color: "#b266ff" },
  { start: 10.4, text: "  ⚡ HMR update applied", color: "#b266ff" },
  { start: 11.6, text: "  ⚡ HMR update applied", color: "#b266ff" },
];

const TOTAL_DURATION = 16; // seconds before loop restart

export function TerminalMonitor({ width = 0.66, height = 0.4 }: Props) {
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

  const startRef = useRef<number | null>(null);
  const lastRef = useRef(0);

  useFrame((threeState) => {
    if (!canvas || !texture) return;
    const now = threeState.clock.elapsedTime;
    if (startRef.current === null) startRef.current = now;
    if (now - lastRef.current < 0.14) return;
    lastRef.current = now;

    let elapsed = (now - startRef.current) % TOTAL_DURATION;
    if (elapsed < 0.1) startRef.current = now;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#04030a";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Title bar
    ctx.fillStyle = "#0a0820";
    ctx.fillRect(0, 0, CANVAS_W, 20);
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#7a83b3";
    ctx.fillText("kyl@vibe:~/portfolio", 10, 10);
    // window controls
    ["#ff3df0", "#c0ff00", "#00fff0"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(CANVAS_W - 16 - i * 14, 10, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textBaseline = "top";

    let y = 32;
    for (const line of SCRIPT) {
      if (elapsed < line.start) break;
      const sinceStart = elapsed - line.start;
      const visibleChars = Math.min(
        line.text.length,
        Math.floor(sinceStart * CHAR_SPEED)
      );
      ctx.fillStyle = line.color;
      ctx.fillText(line.text.slice(0, visibleChars), 10, y);
      y += LINE_H;
      if (y > CANVAS_H - 24) break;
    }

    // Blinking cursor on last visible position
    if (Math.floor(elapsed * 2) % 2 === 0) {
      ctx.fillStyle = "#00fff0";
      ctx.fillRect(10, y, 7, 12);
    }

    texture.needsUpdate = true;
  });

  if (!texture) return null;

  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
