import { create } from "zustand";

type Status = "IDLE" | "PLAYING" | "PAUSED" | "GAMEOVER";

interface GameStore {
  status: Status;
  score: number;
  hiScore: number;
  lives: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  end: () => void;
  reset: () => void;
}

const HISCORE_KEY = "kyl:vibe-striker:hiscore";

const loadHiScore = (): number => {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(HISCORE_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
};

export const useGameStore = create<GameStore>((set, get) => ({
  status: "IDLE",
  score: 0,
  hiScore: loadHiScore(),
  lives: 3,
  start: () => set({ status: "PLAYING", score: 0, lives: 3 }),
  pause: () => set({ status: "PAUSED" }),
  resume: () => set({ status: "PLAYING" }),
  end: () => {
    const { score, hiScore } = get();
    if (score > hiScore && typeof window !== "undefined") {
      localStorage.setItem(HISCORE_KEY, String(score));
      set({ hiScore: score, status: "GAMEOVER" });
    } else {
      set({ status: "GAMEOVER" });
    }
  },
  reset: () => set({ status: "IDLE", score: 0, lives: 3 }),
}));
