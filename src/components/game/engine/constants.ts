export const GW = 320;   // logical canvas width
export const GH = 180;   // logical canvas height
export const STEP = 1000 / 60; // fixed timestep ms

export const PAL = {
  bg:       "#04030a",
  bgMid:    "#0d0720",
  player:   "#00fff0",
  thruster: "#ff8c00",
  bullet:   "#c0ff00",
  eBullet:  "#ff4444",
  enemy:    "#ff3df0",
  enemyB:   "#b266ff",
  loader:   "#8833ff",
  phisher:  "#ff6633",
  hit:      "#ffffff",
  hud:      "#00fff0",
  life:     "#ff3df0",
  powerup:  "#c0ff00",
  particle1:"#ff3df0",
  particle2:"#00fff0",
  particle3:"#c0ff00",
  worm:     "#00ff66",
  compiler: "#8800ff",
  beam:     "#ff6600",
  bossHp:   "#ff3333",
} as const;
