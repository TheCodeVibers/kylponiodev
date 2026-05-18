"use client";
import { motion } from "framer-motion";
import { HologramText } from "@/components/hud/HologramText";
import { useSceneStore } from "@/state/useSceneStore";

export function Hero() {
  const sitAtDesk = useSceneStore((s) => s.sitAtDesk);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative min-h-screen w-full flex items-start justify-center pt-[14vh] sm:pt-[18vh]"
    >
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* name moved to 3D back wall */}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6 }}
        onClick={sitAtDesk}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer font-ui tracking-[0.4em] uppercase text-[10px] sm:text-xs text-ink-300 hover:text-neon-cyan transition-colors"
      >
        ↓ Enter Workspace
      </motion.button>
    </section>
  );
}
