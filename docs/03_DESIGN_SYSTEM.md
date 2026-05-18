# 03 — Design System

## Brand Voice
**Futuristic. Confident. Playful. Slightly mysterious** — like a character bio in a sci-fi RPG.

---

## Color Palette

### Tokens
```css
/* Backgrounds */
--bg-void:        #04030a;   /* near-black hero void */
--bg-deep:        #0a0814;   /* surfaces */
--bg-panel:       rgba(12, 10, 26, 0.55); /* glass */

/* Neon accents */
--neon-cyan:      #00fff0;
--neon-blue:      #00aaff;
--neon-purple:    #b266ff;
--neon-magenta:   #ff3df0;
--neon-acid:      #c0ff00;   /* sparingly, for game HUD only */

/* Ink (text) */
--ink-100:        #f6f8ff;   /* highest contrast */
--ink-200:        #b9c0e0;
--ink-300:        #7a83b3;
--ink-400:        #424a73;   /* placeholders */

/* Glow strings */
--glow-cyan:      0 0 20px #00fff0aa, 0 0 40px #00fff033;
--glow-purple:    0 0 20px #b266ffaa, 0 0 40px #b266ff33;
--glow-magenta:   0 0 20px #ff3df0aa, 0 0 40px #ff3df033;
```

### Tailwind Theme Extension
```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      void: '#04030a',
      deep: '#0a0814',
      neon: {
        cyan: '#00fff0',
        blue: '#00aaff',
        purple: '#b266ff',
        magenta: '#ff3df0',
        acid: '#c0ff00',
      },
      ink: { 100: '#f6f8ff', 200: '#b9c0e0', 300: '#7a83b3', 400: '#424a73' },
    },
    fontFamily: {
      display: ['var(--font-orbitron)', 'sans-serif'],
      ui: ['var(--font-rajdhani)', 'sans-serif'],
      mono: ['var(--font-jetbrains)', 'monospace'],
      body: ['var(--font-inter)', 'sans-serif'],
    },
    boxShadow: {
      'neon-cyan': '0 0 20px #00fff0aa, 0 0 40px #00fff033',
      'neon-purple': '0 0 20px #b266ffaa, 0 0 40px #b266ff33',
    },
    animation: {
      'scan-shift': 'scanShift 8s linear infinite',
      'pulse-slow': 'pulse 3s ease-in-out infinite',
      'float-bob': 'floatBob 6s ease-in-out infinite',
    },
  },
},
```

---

## Typography

### Font Stack
- **Display** — `Orbitron` (700 / 900) — Hero name, project titles, big numbers
- **UI** — `Rajdhani` (500 / 600) — buttons, labels, nav
- **Mono** — `JetBrains Mono` — terminal, code monitors, form values
- **Body** — `Inter` (400 / 500) — long-form copy

### Hierarchy
| Level | Size | Font | Weight | Tracking |
|---|---|---|---|---|
| H1 | clamp(2.5rem, 6vw, 5rem) | Orbitron | 900 | wide |
| H2 | clamp(2rem, 4vw, 3.5rem) | Orbitron | 700 | normal |
| H3 | 1.5rem | Rajdhani | 600 | wider |
| Body | 1rem (16px) | Inter | 400 | normal |
| Caption | 0.75rem | Rajdhani | 500 | widest, uppercase |

---

## Components

### Glassmorphism Panel
```tsx
className="
  rounded-2xl border border-white/10 bg-white/[0.04]
  backdrop-blur-xl backdrop-saturate-150
  shadow-[0_0_60px_rgba(0,255,240,0.08)]
"
```

### Neon Button
```tsx
className="
  group relative px-6 py-3 rounded-xl
  border border-neon-cyan/40 bg-neon-cyan/5
  text-neon-cyan font-ui font-semibold tracking-wide uppercase
  transition-all duration-300
  hover:bg-neon-cyan/10 hover:border-neon-cyan
  hover:shadow-neon-cyan
  active:scale-[0.98]
"
```

### Neon Text Utility
```css
.neon-cyan {
  color: #c8fffb;
  text-shadow:
    0 0 6px #00fff0,
    0 0 16px #00fff0aa,
    0 0 32px #00aaff66;
}
.neon-magenta {
  color: #ffd5fb;
  text-shadow:
    0 0 6px #ff3df0,
    0 0 16px #ff3df0aa,
    0 0 32px #b266ff66;
}
```

### Scanline Overlay
```css
.scanlines::after {
  content: "";
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255,255,255,0.04) 0 1px,
    transparent 1px 3px
  );
  mix-blend-mode: overlay;
  pointer-events: none;
  animation: scanShift 8s linear infinite;
}

@keyframes scanShift {
  from { background-position: 0 0; }
  to   { background-position: 0 200px; }
}
```

### Animated Conic-Gradient Border (Project Cards)
```css
.glow-border {
  position: relative;
  background: var(--bg-deep);
  border-radius: 1rem;
}
.glow-border::before {
  content: "";
  position: absolute; inset: -2px;
  border-radius: inherit; z-index: -1;
  background: conic-gradient(
    from var(--angle, 0deg),
    transparent 0deg,
    #00fff0 60deg,
    #b266ff 120deg,
    transparent 180deg
  );
  animation: spin 6s linear infinite;
}
@property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
@keyframes spin { to { --angle: 360deg; } }
```

---

## Motion Tokens

### Easings
- `--ease-cinematic: cubic-bezier(0.16, 1, 0.3, 1)` — entrances, big reveals
- `--ease-snap: cubic-bezier(0.7, 0, 0.3, 1)` — UI taps
- `--ease-glide: cubic-bezier(0.4, 0, 0.2, 1)` — generic UI

### Durations
| Token | ms | Usage |
|---|---|---|
| `--dur-micro` | 150 | hover, focus |
| `--dur-ui` | 400 | panels, modal |
| `--dur-scene` | 800 | camera shifts |
| `--dur-cinematic` | 1600 | section transitions |

### Motion Levels (User Toggle)
- **High** — default; all effects on
- **Medium** — particles halved, bloom intensity 50%, no chromatic aberration
- **Low** — `prefers-reduced-motion`; static character, no particles, no scroll cam, fade-only transitions

---

## Sound Design Tokens

| Sound | When | File | Volume |
|---|---|---|---|
| Ambient drone | Hero loaded | `ambient_drone.opus` | 0.35 |
| UI hover tick | Hover button | `ui_hover.opus` | 0.4 |
| UI click | Click button | `ui_click.opus` | 0.5 |
| Whoosh | Section reveal | `whoosh.opus` | 0.5 |
| Transmit success | Form submit | `transmit_success.opus` | 0.6 |
| Guitar loop | Guitar interaction | `guitar_loop.opus` | 0.7 |

---

## Iconography
Use `lucide-react` with `stroke-width: 1.5` wrapped in a subtle glow filter for accent icons. Mono color, never multi-color.

---

## Cursor
Custom cursor: thin ring + crosshair, color-shifts by focused element type:
- **Default** — cyan ring
- **Link/button** — purple ring with crosshair pulse
- **Character / 3D object** — magenta ring + larger
- **Game zone** — acid green crosshair

Hide on touch devices via `@media (hover: none)` → fall back to native cursor.

---

## Layout Grid
- Max content width: `1280px`
- Side padding: `clamp(1rem, 5vw, 4rem)`
- Section min-height: `100vh` (hero), `auto` (others, with `min-h-screen` on desktop)
- Vertical rhythm: `clamp(4rem, 10vh, 8rem)` between sections
