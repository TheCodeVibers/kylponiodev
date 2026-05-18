"use client";
import { useEffect, useRef, useState } from "react";

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<"default" | "link" | "object">("default");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia("(hover: none)").matches;
    if (isCoarse) {
      setEnabled(false);
      return;
    }

    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
      }
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('a, button, [role="button"], input, textarea')) {
        setVariant("link");
      } else if (target.closest('[data-cursor="object"]')) {
        setVariant("object");
      } else {
        setVariant("default");
      }
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  const ringColor =
    variant === "object" ? "#ff3df0" : variant === "link" ? "#b266ff" : "#00fff0";

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="fixed top-0 left-0 z-[9999] pointer-events-none size-8 rounded-full border transition-[border-color] duration-200 mix-blend-screen"
        style={{ borderColor: ringColor, boxShadow: `0 0 12px ${ringColor}` }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="fixed top-0 left-0 z-[9999] pointer-events-none size-1.5 rounded-full mix-blend-screen"
        style={{ background: ringColor, boxShadow: `0 0 6px ${ringColor}` }}
      />
    </>
  );
}
