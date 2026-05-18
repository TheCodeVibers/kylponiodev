import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AudioStore {
  enabled: boolean;
  masterGain: number;
  toggle: () => void;
  setGain: (v: number) => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set) => ({
      enabled: false,
      masterGain: 0.5,
      toggle: () => set((s) => ({ enabled: !s.enabled })),
      setGain: (v) => set({ masterGain: Math.max(0, Math.min(1, v)) }),
    }),
    { name: "kyl:audio" }
  )
);
