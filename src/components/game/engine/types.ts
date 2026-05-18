export interface AABB { x: number; y: number; w: number; h: number }
export type EnemyType = "bit" | "glitch" | "loader" | "phisher";
export type PowerupType = "R" | "T" | "S" | "B" | "LIFE";
export type WavePattern = "spread" | "line" | "v" | "solo";
export type BossType = "worm" | "compiler";

export interface Boss {
  type: BossType;
  x: number; y: number; w: number; h: number;
  hp: number; maxHp: number;
  phase: number;        // 1, 2, 3
  score: number;
  vy: number;           // vertical movement speed
  fireTimer: number;
  phaseTimer: number;   // counts frames for special attacks
  spawnTimer: number;   // for compiler phase 2 bit spawning
  beamActive: boolean;  // compiler phase 3 beam
  beamY: number;        // beam y position
  beamTimer: number;
  entryDone: boolean;   // boss has finished sliding in from right
}

export interface Player extends AABB {
  vx: number; vy: number;
  hp: number;           // lives remaining
  invTimer: number;     // invincibility frames
  fireTimer: number;    // frames until can fire again
  fireCooldown: number;
  bombs: number;
  bombTimer: number;    // cooldown frames after using bomb
  speed: number;
  rapidFrames: number;  // rapid-fire powerup frames remaining
  tripleFrames: number; // triple-shot powerup frames remaining
  shieldHp: number;     // shield powerup
}

export interface Enemy extends AABB {
  id: number;
  type: EnemyType;
  vx: number; vy: number;
  hp: number; maxHp: number;
  score: number;
  fireTimer: number;
  seed: number;         // for deterministic behavior
}

export interface Bullet extends AABB {
  vx: number; vy: number;
  fromPlayer: boolean;
  damage: number;
}

export interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
}

export interface Star {
  x: number; y: number;
  speed: number; size: number; alpha: number;
}

export interface Powerup extends AABB {
  type: PowerupType;
  vy: number; bobPhase: number;
}

export interface WaveEvent {
  t: number;        // ms from level start when to spawn
  type: EnemyType;
  count: number;
  pattern: WavePattern;
}

export interface GameState {
  player: Player;
  enemies: Enemy[];
  playerBullets: Bullet[];
  enemyBullets: Bullet[];
  particles: Particle[];
  powerups: Powerup[];
  stars: [Star[], Star[], Star[]];
  score: number;
  hiScore: number;
  combo: number;
  multiplier: number;
  level: number;
  levelTime: number;
  frame: number;
  waveQueue: WaveEvent[];
  status: "playing" | "paused" | "gameover" | "levelclear";
  shakeFrames: number;
  flashFrames: number;
  nextId: number;
  lastPauseHeld: boolean; // for rising-edge pause detection
  boss: Boss | null;
  bossDefeated: boolean;
}

export interface InputState {
  up: boolean; down: boolean; left: boolean; right: boolean;
  fire: boolean; bomb: boolean; pause: boolean;
}
