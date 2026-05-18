"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useSceneStore } from "@/state/useSceneStore";
import { NeonButton } from "@/components/hud/NeonButton";

export function NavDock() {
  const camera = useSceneStore((s) => s.camera);
  const setCamera = useSceneStore((s) => s.setCamera);
  const leaveDesk = useSceneStore((s) => s.leaveDesk);
  const stopGuitar = useSceneStore((s) => s.stopGuitar);
  const triggerGuitar = useSceneStore((s) => s.triggerGuitar);
  const sitAtDesk = useSceneStore((s) => s.sitAtDesk);

  const isHero = camera === "HERO";

  function handleBack() {
    if (camera === "DESK_FOCUS") leaveDesk();
    else if (camera === "GUITAR_FOCUS") stopGuitar();
    else setCamera("HERO");
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto w-full max-w-sm px-4 sm:px-0 sm:w-auto">
      <AnimatePresence mode="wait">
        {isHero ? (
          <motion.div
            key="nav-main"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 1.8 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <NeonButton variant="cyan" onClick={() => setCamera("ABOUT")}>
              About
            </NeonButton>
            <NeonButton variant="purple" onClick={() => setCamera("PROJECTS")}>
              Projects
            </NeonButton>
            <NeonButton variant="magenta" onClick={() => setCamera("CONTACT")}>
              Contact
            </NeonButton>
            <NeonButton variant="cyan" onClick={() => sitAtDesk()}>
              Desk
            </NeonButton>
            <NeonButton variant="purple" onClick={() => triggerGuitar()}>
              Guitar
            </NeonButton>
          </motion.div>
        ) : (
          <motion.div
            key="nav-back"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <NeonButton variant="purple" onClick={handleBack}>
              ← Back
            </NeonButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
