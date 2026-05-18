import { create } from "zustand";

export type CharacterState =
  | "IDLE_HOLOGRAM"
  | "WAVING"
  | "WALKING_TO_DESK"
  | "SITTING_AT_DESK"
  | "WALKING_TO_GUITAR"
  | "SITTING_GUITAR"
  | "PLAYING_GUITAR"
  | "RETURNING_TO_CENTER";

export type CameraMode =
  | "HERO"
  | "DESK_FOCUS"
  | "ABOUT"
  | "PROJECTS"
  | "CONTACT"
  | "GAME_FULLSCREEN"
  | "GUITAR_FOCUS";

interface SceneStore {
  character: CharacterState;
  camera: CameraMode;
  mouse: { x: number; y: number };

  setCharacter: (s: CharacterState) => void;
  setCamera: (m: CameraMode) => void;
  setMouse: (x: number, y: number) => void;

  // High-level interaction triggers
  sitAtDesk: () => void;
  leaveDesk: () => void;
  triggerGuitar: () => void;
  stopGuitar: () => void;
  expandGame: () => void;
  exitGame: () => void;
  wave: () => void;
}

export const useSceneStore = create<SceneStore>((set, get) => ({
  character: "IDLE_HOLOGRAM",
  camera: "HERO",
  mouse: { x: 0, y: 0 },

  setCharacter: (s) => {
    set({ character: s });
    if (s === "SITTING_GUITAR") {
      setTimeout(() => {
        if (get().character === "SITTING_GUITAR") set({ character: "PLAYING_GUITAR" });
      }, 800);
    }
  },
  setCamera: (m) => set({ camera: m }),
  setMouse: (x, y) => set({ mouse: { x, y } }),

  sitAtDesk: () => {
    const c = get().character;
    // Already at desk or returning? do nothing
    if (c === "SITTING_AT_DESK" || c === "WALKING_TO_DESK") return;
    set({ character: "WALKING_TO_DESK", camera: "DESK_FOCUS" });
  },
  leaveDesk: () => {
    set({ character: "RETURNING_TO_CENTER", camera: "HERO" });
  },

  triggerGuitar: () =>
    set({ camera: "GUITAR_FOCUS", character: "WALKING_TO_GUITAR" }),
  stopGuitar: () =>
    set({ character: "RETURNING_TO_CENTER", camera: "HERO" }),
  expandGame: () => set({ camera: "GAME_FULLSCREEN" }),
  exitGame: () => set({ camera: "HERO" }),
  wave: () => {
    if (get().character !== "IDLE_HOLOGRAM") return;
    set({ character: "WAVING" });
    setTimeout(() => {
      if (get().character === "WAVING") set({ character: "IDLE_HOLOGRAM" });
    }, 2200);
  },
}));
