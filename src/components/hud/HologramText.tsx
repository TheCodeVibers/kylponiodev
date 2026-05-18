"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HologramTextProps {
  className?: string;
}

const easeCinematic = [0.16, 1, 0.3, 1] as const;

export function HologramText({ className }: HologramTextProps) {
  return (
    <div
      className={cn("flex flex-col items-center text-center select-none", className)}
    >
      <motion.h1
        id="hero-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: easeCinematic, delay: 0.2 }}
        className="font-display font-black tracking-[0.18em] neon-cyan text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
      >
        JAYSON PONIO MALLARI
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: easeCinematic, delay: 0.55 }}
        className="font-ui font-semibold tracking-[0.4em] text-ink-200 text-xs sm:text-sm uppercase mt-4"
      >
        A.K.A&nbsp;&nbsp;Kyl Ponio
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: easeCinematic, delay: 0.85 }}
        className="font-display font-bold tracking-[0.3em] uppercase neon-text-gradient text-xl sm:text-2xl md:text-3xl mt-6"
      >
        Vibe Coder
      </motion.h2>
    </div>
  );
}
