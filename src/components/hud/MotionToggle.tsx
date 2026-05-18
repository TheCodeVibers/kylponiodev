"use client";
import { useMotionStore, type MotionLevel } from "@/state/useMotionStore";

const order: MotionLevel[] = ["LOW", "MEDIUM", "HIGH"];
const labels: Record<MotionLevel, string> = {
  LOW: "L",
  MEDIUM: "M",
  HIGH: "H",
};

export function MotionToggle() {
  const level = useMotionStore((s) => s.level);
  const setLevel = useMotionStore((s) => s.set);
  const cycle = () =>
    setLevel(order[(order.indexOf(level) + 1) % order.length]);

  return (
    <button
      onClick={cycle}
      aria-label={`Motion level: ${level}. Click to cycle.`}
      className="group h-10 min-w-[3.5rem] px-3 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-md flex items-center justify-center gap-2 transition-colors hover:border-neon-purple hover:text-neon-purple text-ink-200"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
      <span className="font-ui text-xs font-semibold tracking-widest">
        {labels[level]}
      </span>
    </button>
  );
}
