import type { WaveEvent } from "./types";

export const LEVEL_1: WaveEvent[] = [
  { t: 1000,  type: "bit",     count: 3, pattern: "spread" },
  { t: 4000,  type: "bit",     count: 4, pattern: "line"   },
  { t: 7500,  type: "glitch",  count: 2, pattern: "spread" },
  { t: 11000, type: "bit",     count: 5, pattern: "v"      },
  { t: 14000, type: "glitch",  count: 3, pattern: "line"   },
  { t: 17000, type: "loader",  count: 1, pattern: "solo"   },
  { t: 21000, type: "bit",     count: 6, pattern: "spread" },
  { t: 25000, type: "glitch",  count: 4, pattern: "v"      },
  { t: 29000, type: "loader",  count: 2, pattern: "spread" },
  { t: 33000, type: "phisher", count: 2, pattern: "spread" },
  { t: 37000, type: "bit",     count: 8, pattern: "v"      },
  { t: 41000, type: "phisher", count: 3, pattern: "spread" },
  { t: 45000, type: "loader",  count: 1, pattern: "solo"   },
  { t: 49000, type: "glitch",  count: 5, pattern: "v"      },
  { t: 53000, type: "phisher", count: 3, pattern: "line"   },
  // level ends at 60s — if no enemies left after 60s → levelclear
];

export const LEVEL_2: WaveEvent[] = [
  { t: 1000,  type: "bit",     count: 4,  pattern: "spread" },
  { t: 4000,  type: "glitch",  count: 3,  pattern: "v"      },
  { t: 8000,  type: "bit",     count: 6,  pattern: "v"      },
  { t: 12000, type: "loader",  count: 2,  pattern: "spread" },
  { t: 16000, type: "phisher", count: 3,  pattern: "spread" },
  { t: 20000, type: "glitch",  count: 5,  pattern: "line"   },
  { t: 24000, type: "bit",     count: 8,  pattern: "v"      },
  { t: 28000, type: "phisher", count: 4,  pattern: "v"      },
  { t: 32000, type: "loader",  count: 3,  pattern: "spread" },
  { t: 36000, type: "glitch",  count: 6,  pattern: "v"      },
  // WORM boss spawns at 42000ms via bossSpawnTime, no wave event needed
];

export const LEVEL_3: WaveEvent[] = [
  { t: 1000,  type: "glitch",  count: 5,  pattern: "v"      },
  { t: 5000,  type: "phisher", count: 4,  pattern: "spread" },
  { t: 9000,  type: "bit",     count: 10, pattern: "v"      },
  { t: 13000, type: "loader",  count: 3,  pattern: "spread" },
  { t: 17000, type: "phisher", count: 5,  pattern: "v"      },
  { t: 21000, type: "glitch",  count: 7,  pattern: "v"      },
  { t: 25000, type: "loader",  count: 4,  pattern: "spread" },
  { t: 29000, type: "phisher", count: 6,  pattern: "v"      },
  { t: 33000, type: "bit",     count: 12, pattern: "v"      },
  { t: 37000, type: "glitch",  count: 8,  pattern: "v"      },
  // THE COMPILER boss spawns at 44000ms
];

export const LEVEL_BOSS_SPAWN: Record<number, number> = {
  2: 42000,  // ms into level when WORM appears
  3: 44000,  // ms into level when COMPILER appears
};

export const LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3];
