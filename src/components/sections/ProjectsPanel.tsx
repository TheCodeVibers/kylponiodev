"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useSceneStore } from "@/state/useSceneStore";

const projects = [
  {
    name: "KYL.DEV Portfolio",
    desc: "Interactive 3D portfolio with hologram character, retro mini-game, and guitar vibe mode.",
    tags: ["Next.js", "Three.js", "R3F", "TypeScript", "Tone.js"],
    href: "#",
    accent: "#00fff0",
  },
  {
    name: "Vibe Striker",
    desc: "Browser-native retro side-scroller — Canvas 2D, fixed-timestep ECS, 60 Hz game loop.",
    tags: ["TypeScript", "Canvas2D", "Zustand"],
    href: "#",
    accent: "#c0ff00",
  },
  {
    name: "NeonUI Kit",
    desc: "Cyberpunk glassmorphism component library with neon glow utilities and Tailwind 4 tokens.",
    tags: ["React", "Tailwind 4", "Framer Motion"],
    href: "#",
    accent: "#b266ff",
  },
];

export function ProjectsPanel() {
  const camera = useSceneStore((s) => s.camera);

  return (
    <AnimatePresence>
      {camera === "PROJECTS" && (
        <motion.div
          key="projects-panel"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.4 }}
          className="fixed top-1/2 -translate-y-1/2 right-2 sm:right-6 z-20 w-[calc(100vw-1rem)] max-w-xs sm:w-80 pointer-events-auto"
        >
          <div
            style={{
              background: "rgba(4,3,10,0.72)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(178,102,255,0.25)",
              borderRadius: "12px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <span style={{ color: "#b266ff", fontFamily: "Orbitron, sans-serif", fontSize: "10px", letterSpacing: "0.2em" }}>
              // PROJECTS.DIR
            </span>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {projects.map((p, i) => (
                <ProjectCard key={p.name} project={p} index={i} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  return (
    <motion.a
      href={project.href}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.1 }}
      whileHover={{ y: -3, scale: 1.01 }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "14px",
        borderRadius: "8px",
        textDecoration: "none",
        cursor: "pointer",
        position: "relative",
        background: "rgba(255,255,255,0.03)",
        // Conic-gradient border via outline trick
        outline: `1px solid ${project.accent}33`,
        boxShadow: `0 0 0 1px ${project.accent}22, inset 0 0 20px ${project.accent}06`,
        transition: "box-shadow 0.2s, outline-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 0 0 1px ${project.accent}66, inset 0 0 20px ${project.accent}12, 0 8px 24px ${project.accent}20`;
        (e.currentTarget as HTMLElement).style.outlineColor = `${project.accent}66`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 0 0 1px ${project.accent}22, inset 0 0 20px ${project.accent}06`;
        (e.currentTarget as HTMLElement).style.outlineColor = `${project.accent}33`;
      }}
    >
      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: "14px", right: "14px", height: "1px", background: `linear-gradient(90deg, transparent, ${project.accent}66, transparent)` }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "11px", fontWeight: 700, color: project.accent, textShadow: `0 0 8px ${project.accent}80`, letterSpacing: "0.05em" }}>
          {project.name}
        </h3>
        <span style={{ color: project.accent, fontSize: "10px", opacity: 0.6 }}>→</span>
      </div>

      <p style={{ fontSize: "10px", color: "#8888aa", lineHeight: 1.6, fontFamily: "Rajdhani, sans-serif" }}>
        {project.desc}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: "9px",
              fontFamily: "JetBrains Mono, monospace",
              padding: "2px 7px",
              borderRadius: "99px",
              border: `1px solid ${project.accent}30`,
              color: `${project.accent}99`,
              letterSpacing: "0.05em",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.a>
  );
}
