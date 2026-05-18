"use client";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSceneStore } from "@/state/useSceneStore";
import { GlassPanel } from "@/components/hud/GlassPanel";

const skills = [
  "React", "Next.js", "TypeScript", "Three.js",
  "Tailwind", "Node.js", "GSAP", "Zustand",
];

const stats = [
  { label: "Years Coding",   end: 5,   suffix: "+" },
  { label: "Projects Built", end: 30,  suffix: "+" },
  { label: "Cups of Coffee", end: 999, suffix: "+" },
];

function Counter({ end, suffix, active }: { end: number; suffix: string; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active || !ref.current) return;
    const duration = 1400;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      if (ref.current) ref.current.textContent = Math.floor(ease * end) + suffix;
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, end, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function AboutPanel() {
  const camera = useSceneStore((s) => s.camera);
  const active = camera === "ABOUT";

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="about-panel"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.4 }}
          className="fixed top-1/2 -translate-y-1/2 right-2 sm:right-6 z-20 w-[calc(100vw-1rem)] max-w-xs sm:w-80 pointer-events-auto"
        >
          <GlassPanel glow="cyan" className="p-6 flex flex-col gap-4">
            <span className="neon-cyan font-ui text-xs tracking-widest">// ABOUT.EXE</span>

            <div className="flex flex-col gap-0.5">
              <h2 className="font-display font-black text-xl neon-cyan">Jayson Ponio Mallari</h2>
              <p className="text-xs text-ink-300 font-ui tracking-widest">A.K.A Kyl Ponio · Philippines 🇵🇭</p>
            </div>

            <hr className="border-white/10" />

            <p className="text-xs text-ink-200 leading-relaxed">
              Full-stack developer passionate about interactive 3D experiences,
              creative coding, and building products that feel alive. Vibe coder by night.
            </p>

            {/* Stat counters */}
            <div className="grid grid-cols-3 gap-2">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-0.5 p-2 rounded border border-neon-cyan/15 bg-neon-cyan/5">
                  <span className="font-display font-black text-lg neon-cyan">
                    <Counter end={s.end} suffix={s.suffix} active={active} />
                  </span>
                  <span className="font-ui text-[9px] text-ink-300 text-center tracking-wide uppercase leading-tight">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <span className="neon-cyan font-ui text-xs tracking-widest">// TECH STACK</span>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-ui tracking-wider px-2 py-0.5 rounded-full border border-neon-cyan/30 text-neon-cyan/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
