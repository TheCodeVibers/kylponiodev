"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { codeSnippets } from "@/content/monitorCode";

interface Props {
  width?: number;
  height?: number;
}

const CANVAS_W = 512;
const CANVAS_H = 320;
const LINE_H = 16;

const COLOR_KEYWORD = "#b266ff";
const COLOR_COMMENT = "#424a73";
const COLOR_STRING = "#c0ff00";
const COLOR_TYPE = "#00fff0";
const COLOR_DEFAULT = "#b9c0e0";

const keywordRe =
  /\b(import|export|const|let|var|function|return|if|else|type|interface|class|extends|new|from|async|await|while|for|of|in)\b/g;
const typeRe = /\b(string|number|boolean|void|any|never|unknown|THREE|Vector3|Vector2)\b/g;

function colorize(line: string, ctx: CanvasRenderingContext2D, x: number, y: number) {
  if (/^\s*\/\//.test(line)) {
    ctx.fillStyle = COLOR_COMMENT;
    ctx.fillText(line, x, y);
    return;
  }
  // Simple tokenization — split by spaces and chunks, color tokens
  let cursor = 0;
  const tokens: { text: string; color: string }[] = [];
  const re = /(\b\w+\b|[^\w\s]+|\s+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    const t = m[0];
    let color = COLOR_DEFAULT;
    if (/^["'`].*?["'`]$/.test(t)) color = COLOR_STRING;
    else if (keywordRe.test(t)) color = COLOR_KEYWORD;
    else if (typeRe.test(t)) color = COLOR_TYPE;
    keywordRe.lastIndex = 0;
    typeRe.lastIndex = 0;
    tokens.push({ text: t, color });
  }
  let cx = x;
  for (const tok of tokens) {
    ctx.fillStyle = tok.color;
    ctx.fillText(tok.text, cx, y);
    cx += ctx.measureText(tok.text).width;
  }
  cursor = 0;
}

export function CodeMonitor({ width = 0.66, height = 0.4 }: Props) {
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

  const stateRef = useRef({ scroll: -CANVAS_H * 0.3, snippetIdx: 0, last: 0 });

  useFrame((threeState, delta) => {
    if (!canvas || !texture) return;
    const s = stateRef.current;
    const now = threeState.clock.elapsedTime;
    if (now - s.last < 0.12) return;
    s.last = now;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#050410";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Side gutter (line numbers)
    ctx.fillStyle = "#0a0820";
    ctx.fillRect(0, 0, 28, CANVAS_H);

    const snippet = codeSnippets[s.snippetIdx];
    const lines = snippet.split("\n");
    const totalH = lines.length * LINE_H;

    ctx.font = '12px "JetBrains Mono", ui-monospace, monospace';
    ctx.textBaseline = "top";

    s.scroll += delta * 14;
    if (s.scroll > totalH + 30) {
      s.scroll = -CANVAS_H * 0.5;
      s.snippetIdx = (s.snippetIdx + 1) % codeSnippets.length;
    }

    lines.forEach((line, i) => {
      const y = i * LINE_H - s.scroll;
      if (y < -LINE_H || y > CANVAS_H) return;
      // line number
      ctx.fillStyle = "#2a2d4a";
      ctx.fillText(String(i + 1).padStart(2, " "), 6, y);
      // code
      colorize(line, ctx, 34, y);
    });

    // Top scanline highlight (cursor line)
    ctx.fillStyle = "rgba(0, 255, 240, 0.04)";
    ctx.fillRect(0, CANVAS_H / 2 - 8, CANVAS_W, LINE_H);

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
