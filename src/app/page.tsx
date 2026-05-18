import { Hero } from "@/components/sections/Hero";
import { ScanlineOverlay } from "@/components/shared/ScanlineOverlay";
import { Cursor } from "@/components/hud/Cursor";
import { AudioToggle } from "@/components/hud/AudioToggle";
import { MotionToggle } from "@/components/hud/MotionToggle";
import StageLazy from "@/components/scene/StageLazy";
import { NavDock } from "@/components/hud/NavDock";
import { AboutPanel } from "@/components/sections/AboutPanel";
import { ProjectsPanel } from "@/components/sections/ProjectsPanel";
import { ContactPanel } from "@/components/sections/ContactPanel";
import { GameCanvasWrapper } from "@/components/game/GameCanvasWrapper";
import { GuitarHUD } from "@/components/hud/GuitarHUD";

export default function Home() {
  return (
    <>
      <Cursor />
      <ScanlineOverlay />

      {/* 3D scene — fixed full-viewport, the visual backdrop */}
      <div className="fixed inset-0 z-0">
        <StageLazy />
      </div>

      {/* HUD top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4">
        <div className="font-display font-black tracking-[0.4em] text-sm neon-cyan">
          KYL.DEV
        </div>
        <div className="flex items-center gap-2">
          <MotionToggle />
          <AudioToggle />
        </div>
      </header>

      <main className="relative z-10 pointer-events-none">
        <Hero />
      </main>

      <NavDock />
      <AboutPanel />
      <ProjectsPanel />
      <ContactPanel />
      <GameCanvasWrapper />
      <GuitarHUD />
    </>
  );
}
