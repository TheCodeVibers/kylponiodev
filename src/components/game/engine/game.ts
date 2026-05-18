import { GW, GH, PAL } from "./constants";
import { LEVEL_1, LEVELS, LEVEL_BOSS_SPAWN } from "./levels";
import type {
  GameState,
  InputState,
  Player,
  Enemy,
  Bullet,
  Particle,
  Star,
  Powerup,
  PowerupType,
  EnemyType,
  WaveEvent,
  Boss,
} from "./types";

// ─── helpers ─────────────────────────────────────────────────────────────────

function rnd(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function overlaps(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function spawnParticles(
  particles: Particle[],
  cx: number,
  cy: number,
  count: number,
  colors: string[]
): void {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = rnd(20, 80);
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1, maxLife: 1,
      color: colors[Math.floor(Math.random() * colors.length)] ?? PAL.particle1,
      size: rnd(1, 3),
    });
  }
}

function makeStarLayer(count: number, speed: number, size: number, alpha: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * GW,
    y: Math.random() * GH,
    speed,
    size,
    alpha,
  }));
}

function makePlayer(): Player {
  return {
    x: 20, y: GH / 2 - 4,
    w: 12, h: 8,
    vx: 0, vy: 0,
    hp: 3,
    invTimer: 0,
    fireTimer: 0,
    fireCooldown: 12,
    bombs: 2,
    bombTimer: 0,
    speed: 140,
    rapidFrames: 0,
    tripleFrames: 0,
    shieldHp: 0,
  };
}

function enemyStats(type: EnemyType, seed: number): Omit<Enemy, "id" | "x" | "y" | "seed"> {
  switch (type) {
    case "bit":
      return { type, w: 8, h: 6, hp: 1, maxHp: 1, score: 10, vx: -80, vy: 0, fireTimer: 60 + Math.random() * 60 };
    case "glitch":
      return { type, w: 7, h: 7, hp: 1, maxHp: 1, score: 20, vx: -110, vy: 0, fireTimer: 90 + Math.random() * 60 };
    case "loader":
      return { type, w: 12, h: 10, hp: 5, maxHp: 5, score: 100, vx: -50, vy: 0, fireTimer: 120 + Math.random() * 60 };
    case "phisher":
      return { type, w: 8, h: 8, hp: 2, maxHp: 2, score: 50, vx: -60, vy: 0, fireTimer: 80 + Math.random() * 60 };
  }
}

let _nextId = 1;

function spawnEnemy(
  enemies: Enemy[],
  type: EnemyType,
  x: number,
  y: number,
  nextId: number
): number {
  const seed = Math.random() * 1000;
  const stats = enemyStats(type, seed);
  enemies.push({
    id: nextId,
    x, y,
    seed,
    ...stats,
  });
  return nextId + 1;
}

function spawnWave(gs: GameState, event: WaveEvent): void {
  const { type, count, pattern } = event;
  let nextId = gs.nextId;

  const baseX = GW + 10;
  const spacing = 18;

  for (let i = 0; i < count; i++) {
    let ex = baseX;
    let ey = GH / 2;

    switch (pattern) {
      case "spread":
        ex = baseX + i * spacing;
        ey = rnd(10, GH - 10);
        break;
      case "line":
        ex = baseX + i * spacing;
        ey = GH / 2;
        break;
      case "v":
        ex = baseX + Math.floor(i / 2) * spacing;
        ey = i % 2 === 0
          ? GH / 4 + (Math.floor(i / 2) * 6)
          : GH * 3 / 4 - (Math.floor(i / 2) * 6);
        break;
      case "solo":
        ex = baseX;
        ey = GH / 2;
        break;
    }

    nextId = spawnEnemy(gs.enemies, type, ex, ey, nextId);
  }

  gs.nextId = nextId;
}

// ─── createState ─────────────────────────────────────────────────────────────

export function createState(hiScore: number, startLevel = 1): GameState {
  _nextId = 1;
  const level = Math.max(1, Math.min(startLevel, LEVELS.length));
  const waveData = LEVELS[level - 1] ?? LEVEL_1;
  return {
    player: makePlayer(),
    enemies: [],
    playerBullets: [],
    enemyBullets: [],
    particles: [],
    powerups: [],
    stars: [
      makeStarLayer(50, 0.4, 1, 0.4),
      makeStarLayer(25, 1.1, 1, 0.7),
      makeStarLayer(10, 2.5, 2, 1.0),
    ],
    score: 0,
    hiScore,
    combo: 0,
    multiplier: 1,
    level,
    levelTime: 0,
    frame: 0,
    waveQueue: [...waveData].sort((a, b) => a.t - b.t),
    status: "playing",
    shakeFrames: 0,
    flashFrames: 0,
    nextId: 1,
    lastPauseHeld: false,
    boss: null,
    bossDefeated: false,
  };
}

// ─── advanceLevel ─────────────────────────────────────────────────────────────

export function advanceLevel(gs: GameState): void {
  gs.level++;
  if (gs.level > LEVELS.length) {
    // All levels complete — keep final levelclear status
    gs.status = "levelclear";
    return;
  }
  const waveData = LEVELS[gs.level - 1] ?? LEVEL_1;
  gs.levelTime = 0;
  gs.waveQueue = [...waveData].sort((a, b) => a.t - b.t);
  gs.enemies = [];
  gs.playerBullets = [];
  gs.enemyBullets = [];
  gs.powerups = [];
  gs.boss = null;
  gs.bossDefeated = false;
  gs.status = "playing";
  gs.shakeFrames = 0;
  gs.flashFrames = 0;
  gs.frame = 0;
}

// ─── boss spawn ───────────────────────────────────────────────────────────────

function spawnBoss(gs: GameState): void {
  if (gs.level === 2) {
    gs.boss = {
      type: "worm",
      x: GW + 5, y: GH / 2 - 15,
      w: 40, h: 30,
      hp: 60, maxHp: 60,
      phase: 1,
      score: 800,
      vy: 40,
      fireTimer: 60,
      phaseTimer: 0,
      spawnTimer: 0,
      beamActive: false,
      beamY: 0,
      beamTimer: 0,
      entryDone: false,
    };
  } else if (gs.level === 3) {
    gs.boss = {
      type: "compiler",
      x: GW + 5, y: GH / 2 - 20,
      w: 48, h: 40,
      hp: 150, maxHp: 150,
      phase: 1,
      score: 2500,
      vy: 25,
      fireTimer: 80,
      phaseTimer: 0,
      spawnTimer: 0,
      beamActive: false,
      beamY: GH / 2,
      beamTimer: 0,
      entryDone: false,
    };
  }
}

// ─── updateBoss ──────────────────────────────────────────────────────────────

function updateBoss(gs: GameState, dt: number): void {
  const boss = gs.boss;
  if (!boss) return;
  const p = gs.player;

  if (boss.type === "worm") {
    // Entry slide
    const entryTargetX = GW * 0.75;
    if (!boss.entryDone) {
      boss.x -= 60 * dt;
      if (boss.x <= entryTargetX) {
        boss.x = entryTargetX;
        boss.entryDone = true;
      }
    } else {
      // Bounce vertically
      boss.y += boss.vy * dt;
      if (boss.y <= 5) {
        boss.y = 5;
        boss.vy = Math.abs(boss.vy);
      } else if (boss.y >= GH - 35) {
        boss.y = GH - 35;
        boss.vy = -Math.abs(boss.vy);
      }

      // Phase transition: phase 1 → 2 when hp drops to 30
      if (boss.phase === 1 && boss.hp <= 30) {
        boss.phase = 2;
        // Speed up by 1.5x (one-shot)
        boss.vy *= 1.5;
      }

      // Fire
      boss.fireTimer--;
      const fireCooldown = boss.phase === 2 ? 40 : 60;
      if (boss.fireTimer <= 0) {
        boss.fireTimer = fireCooldown;
        const bx = boss.x;
        const by = boss.y + boss.h / 2 - 1;

        // Spread: forward + diagonal
        const speeds: [number, number][] = [[-120, 0], [-90, -50], [-90, 50]];
        for (const [vx, vy] of speeds) {
          gs.enemyBullets.push({ x: bx, y: by, w: 5, h: 2, vx, vy, fromPlayer: false, damage: 1 });
        }

        // Phase 2: also fire aimed at player
        if (boss.phase === 2) {
          const dx = p.x - bx;
          const dy = (p.y + p.h / 2) - by;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          gs.enemyBullets.push({
            x: bx, y: by, w: 5, h: 2,
            vx: (dx / len) * 130,
            vy: (dy / len) * 130,
            fromPlayer: false,
            damage: 1,
          });
        }
      }
    }

  } else if (boss.type === "compiler") {
    // Entry slide
    const entryTargetX = GW * 0.72;
    if (!boss.entryDone) {
      boss.x -= 50 * dt;
      if (boss.x <= entryTargetX) {
        boss.x = entryTargetX;
        boss.entryDone = true;
      }
    } else {
      // Phase transitions (one-shot guard via phase field)
      if (boss.phase === 1 && boss.hp <= 100) {
        boss.phase = 2;
        boss.vy = 20;
        boss.spawnTimer = 0;
      }
      if (boss.phase === 2 && boss.hp <= 50) {
        boss.phase = 3;
        boss.vy = 0;
        boss.beamTimer = 200;
      }

      // Movement
      if (boss.phase === 2) {
        boss.y += boss.vy * dt;
        if (boss.y <= 5) { boss.y = 5; boss.vy = Math.abs(boss.vy); }
        if (boss.y >= GH - boss.h - 5) { boss.y = GH - boss.h - 5; boss.vy = -Math.abs(boss.vy); }
      }

      // Phase 1 fire: 4-way spread every 80 frames
      if (boss.phase === 1) {
        boss.fireTimer--;
        if (boss.fireTimer <= 0) {
          boss.fireTimer = 80;
          const bx = boss.x;
          const by = boss.y + boss.h / 2 - 1;
          const dirs: [number, number][] = [[-110, 0], [-78, -78], [-78, 78], [0, -110]];
          for (const [vx, vy] of dirs) {
            gs.enemyBullets.push({ x: bx, y: by, w: 5, h: 2, vx, vy, fromPlayer: false, damage: 1 });
          }
        }
      }

      // Phase 2: spawn 3 bits every 120 frames
      if (boss.phase === 2) {
        boss.spawnTimer++;
        if (boss.spawnTimer >= 120) {
          boss.spawnTimer = 0;
          for (let i = 0; i < 3; i++) {
            gs.nextId = spawnEnemy(
              gs.enemies,
              "bit",
              boss.x - 5,
              boss.y + boss.h / 2 - 10 + i * 10,
              gs.nextId
            );
          }
        }
        // Also fire aimed shots every 80 frames
        boss.fireTimer--;
        if (boss.fireTimer <= 0) {
          boss.fireTimer = 80;
          const bx = boss.x;
          const by = boss.y + boss.h / 2 - 1;
          const dx = p.x - bx;
          const dy = (p.y + p.h / 2) - by;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          gs.enemyBullets.push({
            x: bx, y: by, w: 5, h: 2,
            vx: (dx / len) * 120,
            vy: (dy / len) * 120,
            fromPlayer: false,
            damage: 1,
          });
        }
      }

      // Phase 3: beam attack every 200 frames + 8-way fire when not beaming
      if (boss.phase === 3) {
        if (!boss.beamActive) {
          // Counting down to next beam
          boss.beamTimer--;
          if (boss.beamTimer <= 0) {
            boss.beamActive = true;
            boss.beamY = boss.y + boss.h / 2;
            boss.beamTimer = 60; // beam lasts 60 frames
          }
          // 8-way spread fire every 90 frames when not beaming
          boss.fireTimer--;
          if (boss.fireTimer <= 0) {
            boss.fireTimer = 90;
            const bx = boss.x;
            const by = boss.y + boss.h / 2 - 1;
            const spd = 110;
            const dirs8: [number, number][] = [
              [-spd, 0], [spd, 0], [0, -spd], [0, spd],
              [-spd * 0.707, -spd * 0.707], [-spd * 0.707, spd * 0.707],
              [spd * 0.707, -spd * 0.707], [spd * 0.707, spd * 0.707],
            ];
            for (const [vx, vy] of dirs8) {
              gs.enemyBullets.push({ x: bx, y: by, w: 5, h: 2, vx, vy, fromPlayer: false, damage: 1 });
            }
          }
        } else {
          // Beam is active — count down its duration
          boss.beamTimer--;
          if (boss.beamTimer <= 0) {
            boss.beamActive = false;
            boss.beamTimer = 200; // wait 200 frames before next beam
          }
          // Beam damage to player
          if (p.invTimer <= 0) {
            if (Math.abs((p.y + p.h / 2) - boss.beamY) <= 6) {
              if (p.shieldHp > 0) {
                p.shieldHp--;
              } else {
                p.hp--;
                gs.combo = 0;
                gs.multiplier = 1;
              }
              p.invTimer = 90;
              gs.flashFrames = 8;
              gs.shakeFrames = 6;
              if (p.hp <= 0) {
                gs.status = "gameover";
              }
            }
          }
        }
      }
    }
  }
}

// ─── update ───────────────────────────────────────────────────────────────────

export function update(gs: GameState, input: InputState, dtMs: number): void {
  if (gs.status === "gameover" || gs.status === "levelclear") return;

  // ── Pause (rising edge) ─────────────────────────────────────────────────
  if (input.pause && !gs.lastPauseHeld) {
    gs.status = gs.status === "paused" ? "playing" : "paused";
  }
  gs.lastPauseHeld = input.pause;

  if (gs.status === "paused") return;

  const dt = dtMs / 1000; // seconds
  const p = gs.player;

  // ── Stars ────────────────────────────────────────────────────────────────
  for (const layer of gs.stars) {
    for (const star of layer) {
      star.x -= star.speed;
      if (star.x < 0) {
        star.x = GW + 1;
        star.y = Math.random() * GH;
      }
    }
  }

  // ── Player movement ──────────────────────────────────────────────────────
  if (input.up)    p.vy -= p.speed * dt;
  if (input.down)  p.vy += p.speed * dt;
  if (input.left)  p.vx -= p.speed * dt;
  if (input.right) p.vx += p.speed * dt;

  p.vx *= 0.82;
  p.vy *= 0.82;

  p.x += p.vx * dt;
  p.y += p.vy * dt;

  // Clamp to bounds
  p.x = Math.max(0, Math.min(GW * 0.55 - p.w, p.x));
  p.y = Math.max(0, Math.min(GH - p.h, p.y));

  // ── Fire timer ──────────────────────────────────────────────────────────
  p.fireCooldown = p.rapidFrames > 0 ? 6 : 12;
  if (p.fireTimer > 0) p.fireTimer--;

  // ── Player fire ─────────────────────────────────────────────────────────
  if (input.fire && p.fireTimer <= 0) {
    const bx = p.x + p.w;
    const by = p.y + p.h / 2 - 1;
    const bspeed = 260;

    if (p.tripleFrames > 0) {
      const angles = [-0.2, 0, 0.2];
      for (const angle of angles) {
        gs.playerBullets.push({
          x: bx, y: by, w: 7, h: 2,
          vx: Math.cos(angle) * bspeed,
          vy: Math.sin(angle) * bspeed,
          fromPlayer: true,
          damage: 1,
        });
      }
    } else {
      gs.playerBullets.push({
        x: bx, y: by, w: 7, h: 2,
        vx: bspeed, vy: 0,
        fromPlayer: true,
        damage: 1,
      });
    }
    p.fireTimer = p.fireCooldown;
  }

  // ── Bomb ────────────────────────────────────────────────────────────────
  if (input.bomb && p.bombs > 0 && p.bombTimer <= 0) {
    p.bombs--;
    p.bombTimer = 90;
    gs.enemyBullets.length = 0;
    for (const e of gs.enemies) {
      e.hp -= 1;
      spawnParticles(gs.particles, e.x + e.w / 2, e.y + e.h / 2, 4, [PAL.particle1, PAL.particle2, PAL.particle3]);
    }
    // Bomb also damages boss
    if (gs.boss) {
      gs.boss.hp -= 3;
      spawnParticles(gs.particles, gs.boss.x + gs.boss.w / 2, gs.boss.y + gs.boss.h / 2, 8, [PAL.particle1, PAL.particle2, PAL.particle3]);
      if (gs.boss.hp <= 0) {
        defeatBoss(gs);
      }
    }
    gs.shakeFrames = 8;
    gs.flashFrames = 6;
  }
  if (p.bombTimer > 0) p.bombTimer--;

  // ── Powerup timers ──────────────────────────────────────────────────────
  if (p.rapidFrames > 0)  p.rapidFrames--;
  if (p.tripleFrames > 0) p.tripleFrames--;

  // ── Invincibility ───────────────────────────────────────────────────────
  if (p.invTimer > 0) p.invTimer--;

  // ── Wave spawner ────────────────────────────────────────────────────────
  gs.levelTime += dtMs;
  while (gs.waveQueue.length > 0 && gs.waveQueue[0]!.t <= gs.levelTime) {
    const event = gs.waveQueue.shift() as WaveEvent;
    spawnWave(gs, event);
  }

  // ── Boss spawning ────────────────────────────────────────────────────────
  const bossSpawnTime = LEVEL_BOSS_SPAWN[gs.level];
  if (bossSpawnTime !== undefined && gs.levelTime >= bossSpawnTime && gs.boss === null && !gs.bossDefeated) {
    spawnBoss(gs);
  }

  // ── Enemy movement + AI ─────────────────────────────────────────────────
  const deadEnemyIds = new Set<number>();

  for (const e of gs.enemies) {
    // Movement
    e.x += e.vx * dt;

    switch (e.type) {
      case "glitch": {
        // Sine y movement
        const freq = 2 + (e.seed % 3);
        e.y += Math.sin(gs.levelTime * 0.001 * freq + e.seed) * 25 * dt;
        break;
      }
      case "phisher": {
        // Track player y
        const targetVy = (p.y + p.h / 2 - (e.y + e.h / 2)) * 3;
        e.vy += (targetVy - e.vy) * 0.08;
        e.y += e.vy * dt;
        break;
      }
    }

    // Clamp enemies vertically
    e.y = Math.max(0, Math.min(GH - e.h, e.y));

    // Remove if off left edge
    if (e.x + e.w < -10) {
      deadEnemyIds.add(e.id);
      continue;
    }

    // Enemy fire
    e.fireTimer--;
    if (e.fireTimer <= 0) {
      // fire bullet toward player
      const ex = e.x;
      const ey = e.y + e.h / 2 - 1;

      if (e.type === "bit") {
        gs.enemyBullets.push({
          x: ex, y: ey, w: 5, h: 2,
          vx: -120, vy: 0,
          fromPlayer: false,
          damage: 1,
        });
      } else if (e.type === "glitch") {
        // fires toward player
        const dx = p.x - ex;
        const dy = (p.y + p.h / 2) - ey;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        gs.enemyBullets.push({
          x: ex, y: ey, w: 5, h: 2,
          vx: (dx / len) * 110,
          vy: (dy / len) * 110,
          fromPlayer: false,
          damage: 1,
        });
      } else if (e.type === "loader") {
        gs.enemyBullets.push({
          x: ex, y: ey, w: 5, h: 2,
          vx: -90, vy: 0,
          fromPlayer: false,
          damage: 1,
        });
        // also fire diagonal
        gs.enemyBullets.push({
          x: ex, y: ey, w: 5, h: 2,
          vx: -70, vy: -40,
          fromPlayer: false,
          damage: 1,
        });
        gs.enemyBullets.push({
          x: ex, y: ey, w: 5, h: 2,
          vx: -70, vy: 40,
          fromPlayer: false,
          damage: 1,
        });
      } else if (e.type === "phisher") {
        const dx = p.x - ex;
        const dy = (p.y + p.h / 2) - ey;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        gs.enemyBullets.push({
          x: ex, y: ey, w: 5, h: 2,
          vx: (dx / len) * 130,
          vy: (dy / len) * 130,
          fromPlayer: false,
          damage: 1,
        });
      }

      // Reset fire timer
      e.fireTimer = Math.floor(90 + Math.random() * 90);
    }
  }

  // Remove dead/off-screen enemies
  gs.enemies = gs.enemies.filter(e => !deadEnemyIds.has(e.id));

  // ── Move bullets ────────────────────────────────────────────────────────
  for (const b of gs.playerBullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  }
  for (const b of gs.enemyBullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  }

  // Remove off-screen bullets
  gs.playerBullets = gs.playerBullets.filter(
    b => b.x < GW + 10 && b.x > -10 && b.y > -10 && b.y < GH + 10
  );
  gs.enemyBullets = gs.enemyBullets.filter(
    b => b.x < GW + 10 && b.x > -20 && b.y > -10 && b.y < GH + 10
  );

  // ── Collision: player bullets vs enemies ─────────────────────────────────
  const hitBullets = new Set<Bullet>();
  const killedEnemies = new Set<number>();

  for (const b of gs.playerBullets) {
    for (const e of gs.enemies) {
      if (killedEnemies.has(e.id)) continue;
      if (overlaps(b.x, b.y, b.w, b.h, e.x, e.y, e.w, e.h)) {
        hitBullets.add(b);
        e.hp -= b.damage;
        if (e.hp <= 0) {
          killedEnemies.add(e.id);
          gs.score += e.score * gs.multiplier;
          gs.combo++;
          // Multiplier thresholds
          if (gs.combo >= 25) gs.multiplier = 3;
          else if (gs.combo >= 10) gs.multiplier = 2;
          // Particle explosion
          spawnParticles(
            gs.particles,
            e.x + e.w / 2,
            e.y + e.h / 2,
            8,
            [PAL.particle1, PAL.particle2, PAL.particle3]
          );
          gs.shakeFrames = Math.max(gs.shakeFrames, 3);
          // Loader drops powerup
          if (e.type === "loader") {
            const types: PowerupType[] = ["R", "T", "S", "B", "LIFE"];
            const pt = types[Math.floor(Math.random() * types.length)] as PowerupType;
            gs.powerups.push({
              x: e.x, y: e.y,
              w: 10, h: 10,
              type: pt,
              vy: 0,
              bobPhase: Math.random() * Math.PI * 2,
            });
          }
        }
        break; // bullet hits one enemy
      }
    }
  }

  gs.playerBullets = gs.playerBullets.filter(b => !hitBullets.has(b));
  gs.enemies = gs.enemies.filter(e => !killedEnemies.has(e.id));

  // ── Collision: player bullets vs boss ────────────────────────────────────
  if (gs.boss) {
    const boss = gs.boss;
    const bossBulletHits = new Set<Bullet>();
    for (const b of gs.playerBullets) {
      if (overlaps(b.x, b.y, b.w, b.h, boss.x, boss.y, boss.w, boss.h)) {
        bossBulletHits.add(b);
        boss.hp -= b.damage;
        spawnParticles(gs.particles, b.x, b.y, 3, [PAL.hit, boss.type === "worm" ? PAL.worm : PAL.compiler]);
        if (boss.hp <= 0) {
          defeatBoss(gs);
          break;
        }
      }
    }
    gs.playerBullets = gs.playerBullets.filter(b => !bossBulletHits.has(b));
  }

  // ── Collision: enemy bullets vs player ──────────────────────────────────
  if (p.invTimer <= 0) {
    const hitEB = new Set<Bullet>();
    for (const b of gs.enemyBullets) {
      if (overlaps(b.x, b.y, b.w, b.h, p.x, p.y, p.w, p.h)) {
        hitEB.add(b);
        if (p.shieldHp > 0) {
          p.shieldHp--;
        } else {
          p.hp--;
          gs.combo = 0;
          gs.multiplier = 1;
        }
        p.invTimer = 90;
        gs.flashFrames = 8;
        gs.shakeFrames = 6;
        if (p.hp <= 0) {
          gs.status = "gameover";
        }
        break;
      }
    }
    gs.enemyBullets = gs.enemyBullets.filter(b => !hitEB.has(b));
  }

  // ── Collision: enemies ramming player ───────────────────────────────────
  if (p.invTimer <= 0) {
    const rammedEnemies = new Set<number>();
    for (const e of gs.enemies) {
      if (overlaps(e.x, e.y, e.w, e.h, p.x, p.y, p.w, p.h)) {
        rammedEnemies.add(e.id);
        if (p.shieldHp > 0) {
          p.shieldHp--;
        } else {
          p.hp--;
          gs.combo = 0;
          gs.multiplier = 1;
        }
        p.invTimer = 90;
        gs.flashFrames = 8;
        gs.shakeFrames = 6;
        spawnParticles(gs.particles, e.x + e.w / 2, e.y + e.h / 2, 6, [PAL.particle1, PAL.hit]);
        if (p.hp <= 0) {
          gs.status = "gameover";
        }
        break;
      }
    }
    gs.enemies = gs.enemies.filter(e => !rammedEnemies.has(e.id));
  }

  // ── Update boss AI ───────────────────────────────────────────────────────
  if (gs.boss && gs.status === "playing") {
    updateBoss(gs, dt);
  }

  // ── Powerups ─────────────────────────────────────────────────────────────
  const collectedPUs = new Set<Powerup>();
  for (const pu of gs.powerups) {
    pu.x -= 40 * dt;
    pu.bobPhase += 0.08;
    pu.y += Math.sin(pu.bobPhase) * 0.5;

    if (overlaps(pu.x, pu.y, pu.w, pu.h, p.x, p.y, p.w, p.h)) {
      collectedPUs.add(pu);
      switch (pu.type) {
        case "R": p.rapidFrames = 360; break;
        case "T": p.tripleFrames = 360; break;
        case "S": p.shieldHp = 1; break;
        case "B": p.bombs++; break;
        case "LIFE": p.hp = Math.min(p.hp + 1, 5); break;
      }
      spawnParticles(gs.particles, pu.x + pu.w / 2, pu.y + pu.h / 2, 6, [PAL.powerup, PAL.particle2]);
    }
  }
  gs.powerups = gs.powerups.filter(pu => !collectedPUs.has(pu) && pu.x + pu.w > -10);

  // ── Particles ────────────────────────────────────────────────────────────
  for (const pt of gs.particles) {
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.vx *= 0.92;
    pt.vy *= 0.92;
    pt.life -= dt * 1.5; // lifetime ~0.67s
  }
  gs.particles = gs.particles.filter(pt => pt.life > 0);

  // ── Shake/flash timers ───────────────────────────────────────────────────
  if (gs.shakeFrames > 0) gs.shakeFrames--;
  if (gs.flashFrames > 0) gs.flashFrames--;

  // ── Frame counter ────────────────────────────────────────────────────────
  gs.frame++;

  // ── Level clear ──────────────────────────────────────────────────────────
  const hasBoss = gs.level >= 2;
  const bossDone = !hasBoss || gs.bossDefeated;
  if (
    gs.levelTime >= 60000 &&
    gs.waveQueue.length === 0 &&
    gs.enemies.length === 0 &&
    bossDone &&
    gs.boss === null &&
    gs.status === "playing"
  ) {
    gs.status = "levelclear";
  }
}

// ─── defeatBoss ──────────────────────────────────────────────────────────────

function defeatBoss(gs: GameState): void {
  if (!gs.boss) return;
  const boss = gs.boss;
  const cx = boss.x + boss.w / 2;
  const cy = boss.y + boss.h / 2;
  const particleCount = boss.type === "worm" ? 40 : 60;
  gs.score += boss.score * gs.multiplier;
  gs.combo++;
  if (gs.combo >= 25) gs.multiplier = 3;
  else if (gs.combo >= 10) gs.multiplier = 2;
  spawnParticles(gs.particles, cx, cy, particleCount, [PAL.particle1, PAL.particle2, PAL.particle3, PAL.hit]);
  gs.shakeFrames = 20;
  gs.flashFrames = 15;
  gs.bossDefeated = true;
  gs.boss = null;
}

// ─── renderBoss ──────────────────────────────────────────────────────────────

function renderBoss(ctx: CanvasRenderingContext2D, boss: Boss, frame: number): void {
  const bx = Math.round(boss.x);
  const by = Math.round(boss.y);

  if (boss.type === "worm") {
    // Main body glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00ff66";
    ctx.fillStyle = "#00dd44";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(bx, by, boss.w, boss.h, 8);
    } else {
      ctx.rect(bx, by, boss.w, boss.h);
    }
    ctx.fill();
    ctx.shadowBlur = 0;

    // Phase 2 red tint
    if (boss.phase >= 2) {
      ctx.fillStyle = "rgba(255,0,0,0.15)";
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(bx, by, boss.w, boss.h, 8);
      } else {
        ctx.rect(bx, by, boss.w, boss.h);
      }
      ctx.fill();
    }

    // Segmented look: 3 circles along body
    ctx.fillStyle = "#008833";
    for (let i = 0; i < 3; i++) {
      const cx = bx + 8 + i * 11;
      const cy = by + boss.h / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eyes (front = left since boss moves left)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(bx + 2, by + 4, 4, 4);
    ctx.fillRect(bx + 2, by + boss.h - 8, 4, 4);

    // HP bar above boss
    const barW = boss.w;
    const hpFrac = boss.hp / boss.maxHp;
    ctx.fillStyle = "#333";
    ctx.fillRect(bx, by - 5, barW, 3);
    ctx.fillStyle = hpFrac > 0.5 ? "#00ff44" : "#ff4400";
    ctx.fillRect(bx, by - 5, Math.round(barW * hpFrac), 3);

  } else if (boss.type === "compiler") {
    // Main body
    ctx.fillStyle = "#1a0033";
    ctx.shadowBlur = boss.beamActive ? 0 : 12;
    ctx.shadowColor = "#8800ff";
    ctx.fillRect(bx, by, boss.w, boss.h);
    ctx.shadowBlur = 0;

    // Circuit lines detail
    ctx.strokeStyle = "#4400aa";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx + 6, by + 8);
    ctx.lineTo(bx + 20, by + 8);
    ctx.lineTo(bx + 20, by + 16);
    ctx.lineTo(bx + 36, by + 16);
    ctx.moveTo(bx + 10, by + 28);
    ctx.lineTo(bx + 28, by + 28);
    ctx.lineTo(bx + 28, by + 20);
    ctx.stroke();

    // Phase 1 stroke
    ctx.strokeStyle = "#8800ff";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx, by, boss.w, boss.h);

    // Phase 2: orange pulsing outline
    if (boss.phase >= 2) {
      const pulse = (Math.sin(frame * 0.15) + 1) * 0.5;
      ctx.strokeStyle = `rgba(255,140,0,${pulse * 0.8})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx - 1, by - 1, boss.w + 2, boss.h + 2);
    }

    // Phase 3 beam
    if (boss.phase >= 3 && boss.beamActive) {
      ctx.shadowBlur = 16;
      ctx.shadowColor = "rgba(255,100,0,1)";
      ctx.fillStyle = "rgba(255,100,0,0.7)";
      ctx.fillRect(0, Math.round(boss.beamY) - 6, GW, 12);
      ctx.shadowBlur = 0;
    }

    // Eyes: 2 red glowing squares
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#ff0000";
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(bx + 6, by + 10, 6, 6);
    ctx.fillRect(bx + 6, by + boss.h - 16, 6, 6);
    ctx.shadowBlur = 0;

    // 3 phase indicators (diamonds) below boss
    const phases = [boss.hp > 100, boss.hp > 50, boss.hp > 0];
    for (let i = 0; i < 3; i++) {
      const dx = bx + 10 + i * 14;
      const dy = by + boss.h + 6;
      ctx.fillStyle = phases[i] ? "#8800ff" : "#220033";
      ctx.shadowBlur = phases[i] ? 6 : 0;
      ctx.shadowColor = "#8800ff";
      ctx.beginPath();
      ctx.moveTo(dx + 4, dy);
      ctx.lineTo(dx + 8, dy + 4);
      ctx.lineTo(dx + 4, dy + 8);
      ctx.lineTo(dx, dy + 4);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // HP bar above boss
    const barW = boss.w;
    const hpFrac = boss.hp / boss.maxHp;
    ctx.fillStyle = "#330022";
    ctx.fillRect(bx, by - 5, barW, 3);
    ctx.fillStyle = hpFrac > 0.5 ? "#8800ff" : (hpFrac > 0.25 ? "#ff8800" : "#ff2200");
    ctx.fillRect(bx, by - 5, Math.round(barW * hpFrac), 3);
  }
}

// ─── render ──────────────────────────────────────────────────────────────────

export function render(ctx: CanvasRenderingContext2D, gs: GameState): void {
  const p = gs.player;

  // ── Screen shake offset ─────────────────────────────────────────────────
  let sx = 0, sy = 0;
  if (gs.shakeFrames > 0) {
    sx = (Math.random() - 0.5) * 4;
    sy = (Math.random() - 0.5) * 4;
  }

  ctx.save();
  ctx.translate(sx, sy);

  // ── Background gradient ─────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, GH);
  bg.addColorStop(0, "#08051a");
  bg.addColorStop(1, PAL.bg);
  ctx.fillStyle = bg;
  ctx.fillRect(-2, -2, GW + 4, GH + 4);

  // ── Stars ────────────────────────────────────────────────────────────────
  for (let layerIdx = 0; layerIdx < 3; layerIdx++) {
    const layer = gs.stars[layerIdx as 0 | 1 | 2];
    for (const star of layer) {
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = layerIdx === 2 ? "#d0c0ff" : "#6655aa";
      ctx.fillRect(Math.round(star.x), Math.round(star.y), star.size, star.size);
    }
  }
  ctx.globalAlpha = 1;

  // ── Powerups ─────────────────────────────────────────────────────────────
  for (const pu of gs.powerups) {
    const cx = Math.round(pu.x);
    const cy = Math.round(pu.y);
    // Glow box
    ctx.shadowColor = PAL.powerup;
    ctx.shadowBlur = 6;
    ctx.strokeStyle = PAL.powerup;
    ctx.lineWidth = 1;
    ctx.strokeRect(cx, cy, pu.w, pu.h);
    ctx.shadowBlur = 0;
    // Letter
    ctx.fillStyle = PAL.powerup;
    ctx.font = "bold 7px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(pu.type === "LIFE" ? "♥" : pu.type, cx + pu.w / 2, cy + pu.h / 2);
  }

  // ── Enemy bullets ────────────────────────────────────────────────────────
  ctx.fillStyle = PAL.eBullet;
  for (const b of gs.enemyBullets) {
    ctx.fillRect(Math.round(b.x), Math.round(b.y), b.w, b.h);
  }

  // ── Player bullets ───────────────────────────────────────────────────────
  ctx.shadowColor = PAL.bullet;
  ctx.shadowBlur = 4;
  ctx.fillStyle = PAL.bullet;
  for (const b of gs.playerBullets) {
    ctx.fillRect(Math.round(b.x), Math.round(b.y), b.w, b.h);
  }
  ctx.shadowBlur = 0;

  // ── Enemies ──────────────────────────────────────────────────────────────
  for (const e of gs.enemies) {
    const ex = Math.round(e.x);
    const ey = Math.round(e.y);

    switch (e.type) {
      case "bit": {
        // Magenta diamond
        const cx = ex + e.w / 2;
        const cy = ey + e.h / 2;
        ctx.fillStyle = PAL.enemy;
        ctx.shadowColor = PAL.enemy;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(cx, ey);
        ctx.lineTo(ex + e.w, cy);
        ctx.lineTo(cx, ey + e.h);
        ctx.lineTo(ex, cy);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }
      case "glitch": {
        // Purple jagged rect with artifact
        ctx.fillStyle = PAL.enemyB;
        ctx.fillRect(ex, ey, e.w, e.h);
        // glitch artifact
        ctx.fillStyle = PAL.enemy;
        const off = gs.frame % 4 < 2 ? 2 : -2;
        ctx.fillRect(ex + off, ey + 1, e.w - 2, 2);
        ctx.fillRect(ex, ey + 4, e.w, 2);
        break;
      }
      case "loader": {
        // Heavy purple rect
        ctx.fillStyle = PAL.loader;
        ctx.shadowColor = PAL.loader;
        ctx.shadowBlur = 6;
        ctx.fillRect(ex, ey, e.w, e.h);
        ctx.shadowBlur = 0;
        // Inner detail
        ctx.fillStyle = PAL.enemyB;
        ctx.fillRect(ex + 2, ey + 2, e.w - 4, e.h - 4);
        // HP bar above
        const barW = e.w;
        const hpFrac = e.hp / e.maxHp;
        ctx.fillStyle = "#333";
        ctx.fillRect(ex, ey - 4, barW, 2);
        ctx.fillStyle = hpFrac > 0.5 ? "#00ff44" : "#ff4400";
        ctx.fillRect(ex, ey - 4, Math.round(barW * hpFrac), 2);
        break;
      }
      case "phisher": {
        // Orange triangle pointing left (homing missile shape)
        ctx.fillStyle = PAL.phisher;
        ctx.shadowColor = PAL.phisher;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(ex, ey + e.h / 2);
        ctx.lineTo(ex + e.w, ey);
        ctx.lineTo(ex + e.w, ey + e.h);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }
    }
  }

  // ── Boss ─────────────────────────────────────────────────────────────────
  if (gs.boss) {
    renderBoss(ctx, gs.boss, gs.frame);
  }

  // ── Player ───────────────────────────────────────────────────────────────
  const showPlayer = p.invTimer <= 0 || gs.frame % 6 < 3;
  if (showPlayer) {
    const px = Math.round(p.x);
    const py = Math.round(p.y);
    const isHit = p.invTimer > 0;

    // Thruster flame
    ctx.fillStyle = PAL.thruster;
    ctx.shadowColor = PAL.thruster;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(px, py + p.h / 2);
    ctx.lineTo(px - 5 - Math.random() * 4, py + p.h / 2 - 2);
    ctx.lineTo(px - 5 - Math.random() * 4, py + p.h / 2 + 2);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ship body (triangle pointing right)
    ctx.fillStyle = isHit ? PAL.hit : PAL.player;
    ctx.shadowColor = isHit ? PAL.hit : PAL.player;
    ctx.shadowBlur = isHit ? 10 : 4;
    ctx.beginPath();
    ctx.moveTo(px + p.w, py + p.h / 2);
    ctx.lineTo(px, py);
    ctx.lineTo(px, py + p.h);
    ctx.closePath();
    ctx.fill();

    // Wing detail
    ctx.fillStyle = "#007788";
    ctx.fillRect(px + 2, py + 2, 6, 4);
    ctx.shadowBlur = 0;

    // Shield ring
    if (p.shieldHp > 0) {
      ctx.strokeStyle = "#44aaff";
      ctx.shadowColor = "#44aaff";
      ctx.shadowBlur = 8;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px + p.w / 2, py + p.h / 2, p.w, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  // ── Particles ─────────────────────────────────────────────────────────────
  for (const pt of gs.particles) {
    ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(Math.round(pt.x), Math.round(pt.y), pt.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.restore(); // end shake transform

  // ── Hit flash overlay ────────────────────────────────────────────────────
  if (gs.flashFrames > 0) {
    ctx.fillStyle = `rgba(255,255,255,${(gs.flashFrames / 8) * 0.35})`;
    ctx.fillRect(0, 0, GW, GH);
  }

  // ── CRT scanlines ────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  for (let y = 0; y < GH; y += 2) {
    ctx.fillRect(0, y, GW, 1);
  }

  // ── HUD ──────────────────────────────────────────────────────────────────
  ctx.font = "7px 'Courier New', monospace";
  ctx.textBaseline = "top";

  // Lives (top-left)
  ctx.fillStyle = PAL.life;
  let livesStr = "";
  for (let i = 0; i < p.hp; i++) livesStr += "♥";
  ctx.textAlign = "left";
  ctx.fillText(livesStr, 3, 3);

  // Bombs (bottom-left)
  ctx.fillStyle = PAL.hud;
  let bombStr = "";
  for (let i = 0; i < p.bombs; i++) bombStr += "◆";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(bombStr, 3, GH - 3);

  // HI score (top-center)
  ctx.fillStyle = "#5555aa";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(`HI ${String(gs.hiScore).padStart(6, "0")}`, GW / 2, 3);

  // Score (top-right)
  ctx.fillStyle = PAL.hud;
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(`SCORE ${String(gs.score).padStart(6, "0")}`, GW - 3, 3);

  // Level (top-right below score — hide when boss HP bar is showing)
  if (!gs.boss) {
    ctx.fillStyle = PAL.enemyB;
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(`LVL ${gs.level}`, GW - 3, 12);
  }

  // Multiplier (bottom-center)
  if (gs.multiplier > 1) {
    ctx.fillStyle = "#ffff00";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(`×${gs.multiplier}`, GW / 2, GH - 3);
  }

  // Powerup timers (bottom-right)
  ctx.textBaseline = "bottom";
  ctx.textAlign = "right";
  let activeStr = "";
  if (p.rapidFrames > 0) activeStr += "R ";
  if (p.tripleFrames > 0) activeStr += "T ";
  if (p.shieldHp > 0) activeStr += "S";
  if (activeStr) {
    ctx.fillStyle = PAL.powerup;
    ctx.fillText(activeStr.trim(), GW - 3, GH - 3);
  }

  // ── Boss HP bar (top center, prominent) ──────────────────────────────────
  if (gs.boss) {
    const bw = GW * 0.6;
    const bx = GW * 0.2;
    const bby = 14;
    // background
    ctx.fillStyle = "#110022";
    ctx.fillRect(bx, bby, bw, 5);
    // fill
    const pct = gs.boss.hp / gs.boss.maxHp;
    ctx.fillStyle = gs.boss.type === "worm" ? "#00ff66" : "#8800ff";
    ctx.fillRect(bx, bby, bw * pct, 5);
    // label (rendered below the bar to avoid overlapping HI score)
    ctx.font = '6px "Courier New", monospace';
    ctx.fillStyle = "#aaaacc";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(gs.boss.type === "worm" ? "// WORM" : "// THE COMPILER", GW / 2, bby + 7);
  }

  // Reset text settings
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // ── Paused indicator (minimal — overlay done in React) ───────────────────
  if (gs.status === "paused") {
    ctx.fillStyle = "rgba(4,3,10,0.6)";
    ctx.fillRect(0, 0, GW, GH);
  }
}
