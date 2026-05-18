"use client";
import { useEffect, useRef } from "react";
import { useSceneStore } from "@/state/useSceneStore";
import {
  startGuitarAudio,
  stopGuitarAudio,
  getGuitarAmplitude,
} from "@/lib/guitarAudio";

export function GuitarHUD() {
  const camera = useSceneStore((s) => s.camera);
  const charState = useSceneStore((s) => s.character);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  // Audio start/stop — always play when PLAYING_GUITAR (user explicitly clicked the guitar)
  useEffect(() => {
    if (charState === "PLAYING_GUITAR") {
      startGuitarAudio();
    } else {
      stopGuitarAudio();
    }
    return () => stopGuitarAudio();
  }, [charState]);

  // EQ bar animation
  useEffect(() => {
    if (camera !== "GUITAR_FOCUS") return;
    function animate() {
      const amp = getGuitarAmplitude();
      const t = Date.now() * 0.001;
      barRefs.current.forEach((bar, i) => {
        if (!bar) return;
        const factor = 0.4 + 0.6 * Math.abs(Math.sin(t * (1.5 + i * 0.4) + i));
        const h = Math.max(4, amp * factor * 55);
        bar.style.height = `${h}px`;
      });
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [camera]);

  if (camera !== "GUITAR_FOCUS") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "Orbitron, sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          color: "#b266ff",
          textShadow: "0 0 8px #b266ff, 0 0 20px #b266ff",
          letterSpacing: "0.18em",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        // GUITAR VIBE MODE
      </div>

      {/* Stop button */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "auto",
        }}
      >
        <button
          onClick={() => {
            stopGuitarAudio();
            useSceneStore.getState().stopGuitar();
          }}
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: "#ff3df0",
            background: "transparent",
            border: "1px solid #ff3df0",
            borderRadius: "4px",
            padding: "8px 20px",
            cursor: "pointer",
            letterSpacing: "0.12em",
            textShadow: "0 0 8px #ff3df0",
            boxShadow: "0 0 12px rgba(255,61,240,0.3)",
            transition: "box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 24px rgba(255,61,240,0.7)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 12px rgba(255,61,240,0.3)";
          }}
        >
          ■ STOP VIBE
        </button>
      </div>

      {/* EQ bars */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          height: "60px",
        }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              barRefs.current[i] = el;
            }}
            style={{
              width: "8px",
              height: "4px",
              background: i % 2 === 0 ? "#00fff0" : "#ff3df0",
              boxShadow:
                i % 2 === 0 ? "0 0 6px #00fff0" : "0 0 6px #ff3df0",
              transition: "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
