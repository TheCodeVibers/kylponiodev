import type { InputState } from "./types";

const held = new Set<string>();

// Virtual touch buttons — set by GameCanvas touch controls
const touch = { up: false, down: false, left: false, right: false, fire: false, bomb: false };

export function setTouch(key: keyof typeof touch, val: boolean) {
  touch[key] = val;
}

export function clearTouch() {
  (Object.keys(touch) as (keyof typeof touch)[]).forEach(k => { touch[k] = false; });
}

export function initInput(): () => void {
  const onDown = (e: KeyboardEvent) => {
    held.add(e.code);
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
      e.preventDefault();
    }
  };
  const onUp = (e: KeyboardEvent) => held.delete(e.code);
  window.addEventListener("keydown", onDown);
  window.addEventListener("keyup", onUp);
  return () => {
    window.removeEventListener("keydown", onDown);
    window.removeEventListener("keyup", onUp);
    held.clear();
    clearTouch();
  };
}

export function readInput(): InputState {
  return {
    up:    held.has("ArrowUp")    || held.has("KeyW") || touch.up,
    down:  held.has("ArrowDown")  || held.has("KeyS") || touch.down,
    left:  held.has("ArrowLeft")  || held.has("KeyA") || touch.left,
    right: held.has("ArrowRight") || held.has("KeyD") || touch.right,
    fire:  held.has("Space")      || held.has("KeyZ")  || touch.fire,
    bomb:  held.has("KeyX") || touch.bomb,
    pause: held.has("KeyP"),
  };
}
