"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GW, GH, STEP } from "./engine/constants";
import { createState, update, render, advanceLevel } from "./engine/game";
import { initInput, readInput, setTouch } from "./engine/input";
import { useGameStore } from "@/state/useGameStore";
import { useSceneStore } from "@/state/useSceneStore";
import type { GameState } from "./engine/types";

type OverlayStatus = "playing" | "paused" | "gameover" | "levelclear";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const accRef = useRef<number>(0);
  const disposerRef = useRef<(() => void) | null>(null);

  const [overlayStatus, setOverlayStatus] = useState<OverlayStatus>("playing");
  const [finalScore, setFinalScore] = useState(0);
  const [displayHiScore, setDisplayHiScore] = useState(0);

  const exitGame = useSceneStore(s => s.exitGame);
  const endStore = useGameStore(s => s.end);
  const setScoreStore = useGameStore(s => s.start);

  // Initialize game
  const initGame = useCallback(() => {
    const hiScore = useGameStore.getState().hiScore;
    gsRef.current = createState(hiScore);
    useGameStore.getState().start();
    setOverlayStatus("playing");
  }, []);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ctx2d: CanvasRenderingContext2D = ctx;

    // Init input
    disposerRef.current = initInput();

    // Init state
    initGame();

    // Escape to exit
    const onEsc = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        useSceneStore.getState().exitGame();
      }
    };
    window.addEventListener("keydown", onEsc);

    let cancelled = false;

    function loop(now: number) {
      if (cancelled) return;

      const gs = gsRef.current;
      if (!gs) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Delta time, capped at 100ms
      const rawDt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      const dtMs = Math.min(rawDt, 100);

      // Fixed timestep accumulation
      accRef.current += dtMs;
      const input = readInput();

      while (accRef.current >= STEP) {
        update(gs, input, STEP);
        accRef.current -= STEP;
      }

      // Render
      render(ctx2d, gs);

      // Check status change
      const newStatus = gs.status as OverlayStatus;
      setOverlayStatus(prev => {
        if (prev !== newStatus) {
          if (newStatus === "gameover") {
            // Sync score to store
            const finalSc = gs.score;
            setFinalScore(finalSc);
            setDisplayHiScore(Math.max(gs.hiScore, finalSc));
            // Update game store
            const store = useGameStore.getState();
            // Update hiScore in store if needed
            if (finalSc > store.hiScore) {
              gs.hiScore = finalSc;
            }
            useGameStore.getState().end();
          } else if (newStatus === "levelclear") {
            setFinalScore(gs.score);
            const currentLevel = gsRef.current?.level ?? 1;
            if (currentLevel >= 3) {
              // Final win — show win screen, exit after 5s
              setTimeout(() => {
                useSceneStore.getState().exitGame();
              }, 5000);
            } else {
              // Advance to next level after 2s
              setTimeout(() => {
                if (gsRef.current) {
                  advanceLevel(gsRef.current);
                  setOverlayStatus("playing");
                }
              }, 2000);
            }
          }
          return newStatus;
        }
        return prev;
      });

      rafRef.current = requestAnimationFrame(loop);
    }

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      disposerRef.current?.();
      window.removeEventListener("keydown", onEsc);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = useCallback(() => {
    initGame();
  }, [initGame]);

  const handleExit = useCallback(() => {
    exitGame();
  }, [exitGame]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#02010a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Canvas wrapper maintaining 16:9 */}
      <div
        style={{
          position: "relative",
          width: "min(100vw, 177.78vh)", // 16:9
          height: "min(100vh, 56.25vw)",
        }}
      >
        <canvas
          ref={canvasRef}
          width={GW}
          height={GH}
          style={{
            width: "100%",
            height: "100%",
            imageRendering: "pixelated",
            objectFit: "contain",
            display: "block",
          }}
        />

        {/* Exit button (always visible) */}
        <button
          onClick={handleExit}
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            background: "rgba(4,3,10,0.7)",
            border: "1px solid #00fff0",
            color: "#00fff0",
            fontFamily: "'Courier New', monospace",
            fontSize: "10px",
            padding: "2px 6px",
            cursor: "pointer",
            zIndex: 10,
            lineHeight: 1.2,
          }}
          aria-label="Exit game"
        >
          ✕
        </button>

        {/* Paused overlay */}
        {overlayStatus === "paused" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(4,3,10,0.75)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                color: "#00fff0",
                fontFamily: "'Courier New', monospace",
                fontSize: "clamp(16px, 4vw, 36px)",
                fontWeight: "bold",
                letterSpacing: "0.3em",
                textShadow: "0 0 20px #00fff0",
              }}
            >
              PAUSED
            </div>
            <div
              style={{
                color: "#5555aa",
                fontFamily: "'Courier New', monospace",
                fontSize: "clamp(8px, 2vw, 14px)",
                letterSpacing: "0.2em",
              }}
            >
              P to resume
            </div>
          </div>
        )}

        {/* Game Over overlay */}
        {overlayStatus === "gameover" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(4,3,10,0.88)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                color: "#ff3df0",
                fontFamily: "'Courier New', monospace",
                fontSize: "clamp(18px, 5vw, 42px)",
                fontWeight: "bold",
                letterSpacing: "0.2em",
                textShadow: "0 0 20px #ff3df0",
              }}
            >
              GAME OVER
            </div>
            <div
              style={{
                color: "#00fff0",
                fontFamily: "'Courier New', monospace",
                fontSize: "clamp(9px, 2.2vw, 16px)",
                letterSpacing: "0.15em",
              }}
            >
              SCORE: {String(finalScore).padStart(6, "0")}
            </div>
            <div
              style={{
                color: "#5555aa",
                fontFamily: "'Courier New', monospace",
                fontSize: "clamp(8px, 1.8vw, 13px)",
                letterSpacing: "0.15em",
              }}
            >
              HI: {String(displayHiScore).padStart(6, "0")}
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                onClick={handleRetry}
                style={{
                  background: "transparent",
                  border: "1px solid #00fff0",
                  color: "#00fff0",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(8px, 2vw, 14px)",
                  padding: "4px 16px",
                  cursor: "pointer",
                  letterSpacing: "0.2em",
                  textShadow: "0 0 8px #00fff0",
                }}
              >
                RETRY
              </button>
              <button
                onClick={handleExit}
                style={{
                  background: "transparent",
                  border: "1px solid #ff3df0",
                  color: "#ff3df0",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(8px, 2vw, 14px)",
                  padding: "4px 16px",
                  cursor: "pointer",
                  letterSpacing: "0.2em",
                  textShadow: "0 0 8px #ff3df0",
                }}
              >
                EXIT
              </button>
            </div>
          </div>
        )}

        {/* Level Clear overlay */}
        {overlayStatus === "levelclear" && (() => {
          const clearedLevel = gsRef.current?.level ?? 1;
          const isFinalWin = clearedLevel >= 3;
          return (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(4,3,10,0.85)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  color: isFinalWin ? "#ffd700" : "#c0ff00",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(16px, 4.5vw, 40px)",
                  fontWeight: "bold",
                  letterSpacing: "0.2em",
                  textShadow: isFinalWin ? "0 0 20px #ffd700" : "0 0 20px #c0ff00",
                }}
              >
                {isFinalWin ? "YOU WIN!" : `LEVEL ${clearedLevel} CLEAR!`}
              </div>
              <div
                style={{
                  color: "#5555aa",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(8px, 2vw, 14px)",
                  letterSpacing: "0.15em",
                }}
              >
                SCORE: {String(finalScore).padStart(6, "0")}
              </div>
              <div
                style={{
                  color: isFinalWin ? "#ffd700" : "#8833ff",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(7px, 1.8vw, 13px)",
                  letterSpacing: "0.1em",
                  marginTop: "4px",
                }}
              >
                {isFinalWin ? "Returning to scene..." : "NEXT LEVEL IN 2s..."}
              </div>
            </div>
          );
        })()}

        {/* ── Touch controls (only on coarse-pointer / mobile) ── */}
        <style>{`
          @media (pointer: coarse) { .vibe-touch { display: flex !important; } }
        `}</style>

        {/* D-pad — bottom left */}
        <div className="vibe-touch" style={{
          display: "none", position: "absolute", bottom: "6%", left: "4%",
          flexDirection: "column", alignItems: "center", gap: "2px",
          userSelect: "none", touchAction: "none",
        }}>
          {/* Up */}
          <button
            onPointerDown={() => setTouch("up", true)}
            onPointerUp={() => setTouch("up", false)}
            onPointerLeave={() => setTouch("up", false)}
            style={dpadBtn}
            aria-label="Up"
          >▲</button>
          <div style={{ display: "flex", gap: "2px" }}>
            <button onPointerDown={() => setTouch("left", true)} onPointerUp={() => setTouch("left", false)} onPointerLeave={() => setTouch("left", false)} style={dpadBtn} aria-label="Left">◀</button>
            <div style={{ width: 40, height: 40 }} />
            <button onPointerDown={() => setTouch("right", true)} onPointerUp={() => setTouch("right", false)} onPointerLeave={() => setTouch("right", false)} style={dpadBtn} aria-label="Right">▶</button>
          </div>
          <button onPointerDown={() => setTouch("down", true)} onPointerUp={() => setTouch("down", false)} onPointerLeave={() => setTouch("down", false)} style={dpadBtn} aria-label="Down">▼</button>
        </div>

        {/* Action buttons — bottom right */}
        <div className="vibe-touch" style={{
          display: "none", position: "absolute", bottom: "6%", right: "4%",
          flexDirection: "column", alignItems: "center", gap: "6px",
          userSelect: "none", touchAction: "none",
        }}>
          <button
            onPointerDown={() => setTouch("bomb", true)}
            onPointerUp={() => setTouch("bomb", false)}
            onPointerLeave={() => setTouch("bomb", false)}
            style={{ ...actionBtn, width: 44, height: 44, fontSize: 12, borderColor: "#00fff0", color: "#00fff0" }}
            aria-label="Bomb"
          >B</button>
          <button
            onPointerDown={() => setTouch("fire", true)}
            onPointerUp={() => setTouch("fire", false)}
            onPointerLeave={() => setTouch("fire", false)}
            style={{ ...actionBtn, width: 60, height: 60, fontSize: 20, borderColor: "#c0ff00", color: "#c0ff00" }}
            aria-label="Fire"
          >●</button>
        </div>
      </div>
    </div>
  );
}

const dpadBtn: React.CSSProperties = {
  width: 40, height: 40,
  background: "rgba(0,255,240,0.08)",
  border: "1px solid rgba(0,255,240,0.4)",
  color: "#00fff0",
  fontSize: 14,
  borderRadius: 4,
  cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  touchAction: "none",
};

const actionBtn: React.CSSProperties = {
  background: "rgba(0,0,0,0.4)",
  border: "2px solid",
  borderRadius: "50%",
  cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  touchAction: "none",
  fontWeight: "bold",
};
