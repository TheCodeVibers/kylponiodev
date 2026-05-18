import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MotionLevel = "LOW" | "MEDIUM" | "HIGH";

interface MotionStore {
  level: MotionLevel;
  set: (l: MotionLevel) => void;
}

export const useMotionStore = create<MotionStore>()(
  persist(
    (set) => ({
      level: "HIGH",
      set: (level) => set({ level }),
    }),
    { name: "kyl:motion" }
  )
);
