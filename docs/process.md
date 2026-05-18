# Process & Workflow

> How work gets done on this project. Conventions, cadence, decision flow. Keep it lean — change as needed.

---

## Working Cadence
**Default**: focused build sessions of 60–120 minutes, then break.

Within a session:
1. Open `progress.md` — pick the top unfinished box in the current phase
2. Set a small goal (e.g., "get the spot light shadows right")
3. Build, test in browser
4. Commit when the box is done (or a meaningful sub-step is)
5. Tick the box; jot a note in `learning.md` if you learned something

**Avoid**: hopping between phases. Finish a phase before moving on, even if rough — polish in Phase 10.

---

## Git Workflow

### Branching
- `main` — always deployable; auto-deploys to production
- `dev` — integration branch; auto-deploys to a preview URL
- `feat/<short-name>` — feature branches off `dev`
- `fix/<short-name>` — bugfix branches
- `chore/<short-name>` — tooling / assets / non-functional

### Merging
- Solo dev: open a PR from `feat/*` → `dev` even when no one reviews — the PR is your second pair of eyes (Vercel preview + clean diff)
- Squash-merge to keep history flat
- After a phase ships, merge `dev` → `main`

### Commit Messages
Format: `<type>(<scope>): <subject>`

Examples:
- `feat(scene): add particle field`
- `fix(game): respawn position off by one`
- `chore(deps): bump three to r170`
- `docs(roadmap): update phase 5 checklist`

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`, `style`

Body (optional): the **why**, not the **what**. The diff shows what.

---

## Decision Log

When you make a judgment call that future-you might second-guess, append to the "Decisions Made" table in `progress.md`. If it's big (architecture-altering), drop a one-paragraph note in the relevant numbered planning doc too.

Format:
```
| Date | Decision | Why | Reversible? |
|---|---|---|---|
| 2026-05-18 | Chose X over Y | Reason | Yes/No |
```

---

## Definition of Done

### Per Phase
- [ ] All checklist items in `progress.md` ticked
- [ ] Feature works on desktop Chrome (primary target)
- [ ] Manually tested on mobile Safari (or iOS simulator)
- [ ] No console errors in production build (`pnpm build && pnpm start`)
- [ ] Lighthouse score didn't regress > 5 points
- [ ] Merged to `main`
- [ ] Preview URL shared (if soliciting feedback)

### Per Component / Feature
- [ ] Compiles with strict TS
- [ ] Lints clean (`pnpm lint`)
- [ ] Reduced-motion variant considered (works at motion=LOW)
- [ ] Keyboard accessible (where applicable)
- [ ] Mobile responsive (≥ 360px wide)
- [ ] No new console warnings
- [ ] Self-review checklist below run

---

## Asset Pipeline

### 3D Models
```
.blend / source → export GLB → gltf-pipeline -d → public/models/
```
- Validate with **gltf.report** before committing
- Keep source `.blend` files in `/assets-source/` (gitignored or LFS)
- Target: < 500KB per model after Draco

### Textures
```
.png / .jpg → toktx --bcmp --genmipmap → public/textures/
```
- 2K max for any single texture (1K preferred)
- Tileable textures get `wrap: RepeatWrapping`
- Normal maps: keep linear color space

### Audio
```
.wav (source) → opusenc / ffmpeg → .opus / .m4a → public/audio/
```
- Music loops: 90 kbps Opus
- SFX: 64 kbps Opus
- Test loops are seamless (no click at the boundary)
- Trim silence; normalize to -14 LUFS

### Images (2D)
- `next/image` autogenerates AVIF/WebP
- Source: WebP or PNG at 2× display size
- Project preview videos: H.264 MP4, 1080p, < 3 MB

---

## Self-Review Checklist (run before every PR)
- [ ] Did I delete dead code I introduced?
- [ ] Are there `console.log` calls I forgot?
- [ ] Did I introduce any `any` types I should have narrowed?
- [ ] Did I add new deps? If so, are they necessary and < 30 KB gzip?
- [ ] Did I update `progress.md`?
- [ ] Does the feature work with audio muted?
- [ ] Does the feature work with reduced motion (motion=LOW)?
- [ ] Does the feature work on a 360 px-wide viewport?
- [ ] Did I update the relevant numbered planning doc if I changed a spec?

---

## Handling Scope Creep

When a new idea pops up mid-build:
1. Write it in the **V2 Backlog** section of `08_ROADMAP.md`
2. Move on — do not implement
3. Re-evaluate after V1 ships

Allowed exceptions:
- Bugs uncovered while building (fix immediately)
- Tiny ergonomic wins (≤ 15 min)
- Anything that makes the current phase impossible to ship

---

## Daily Routine (Recommended)

1. **Start** — open `progress.md`, scan blockers + open decisions
2. **Pick** — top unchecked box in current phase
3. **Build** — focused 60–120 min
4. **Test** — desktop browser + mobile simulator
5. **Commit + tick** — close the loop
6. **End-of-day** — push branch, write a 1-line note in `learning.md` if something stuck

---

## Code Review (Solo Mode)
Even without a reviewer, force the rituals:
- Read your own PR diff line-by-line before merging
- Sleep on big decisions when possible
- Ask in a public Discord (R3F server, Three.js, Buildspace, Vercel) when stuck > 30 min

---

## When You're Stuck > 30 Minutes
1. Step away from the screen for 5 minutes
2. Re-read the relevant planning doc
3. Search the issue on the lib's GitHub Issues page (often a known gotcha)
4. Ask in R3F / Three.js Discord with a minimal repro
5. If still blocked: skip to a different checklist item, return later

Log the stuck → fix loop in `learning.md` "Stuck Log".

---

## Tooling

### Editor
- **VS Code** with extensions:
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - Error Lens
  - GitLens
  - GLSL Lint (for shader files)

### Browser
- **Chrome** primary (DevTools + React DevTools + R3F DevTools extension)
- **Safari** for parity checks (each phase)
- **Firefox** for parity checks (each phase)

### In-app Development Aids
- `<Stats/>` overlay (drei) in dev only
- `react-three/perf` in dev only
- React DevTools Profiler for re-render checks

### Testing
- **Playwright** for smoke e2e (loads, hero visible, game launchable)
- **Vitest** for game-engine unit tests

---

## Communication / Documentation Hierarchy
- **Live tracker** → `progress.md`
- **Knowledge log** → `learning.md`
- **Workflow conventions** (this file) → `process.md`
- **Specifications** → `01_*.md`–`10_*.md` (update with the implementation that changes them)
- **Code comments** → only when the *why* is non-obvious; never re-state what the code does

---

## Maintenance of These Living Docs
| File | Update Frequency |
|---|---|
| `progress.md` | Every session |
| `learning.md` | When you learn something non-obvious |
| `process.md` | When the workflow changes (rare) |
| `01_*.md`–`10_*.md` | When a spec changes (commit with the code change) |

---

## Release Process

### Pre-Launch (Phase 10 wrap-up)
- [ ] Lighthouse perf ≥ 70 mobile, ≥ 90 desktop
- [ ] axe a11y violations = 0
- [ ] Smoke tests passing
- [ ] No console errors / warnings in production build
- [ ] OG image + favicon set + meta tags
- [ ] 404 page themed
- [ ] Analytics + Plausible wired
- [ ] LICENSE chosen
- [ ] `LICENSES.md` (asset attribution) complete
- [ ] Tested on real iPhone + Android device

### Launch
- [ ] Tag a release `v1.0.0`
- [ ] Merge `dev` → `main`
- [ ] Verify production deploy
- [ ] Post on socials (X, LinkedIn, dev.to writeup)
- [ ] Submit to Awwwards / Codrops if confident
- [ ] Update GitHub profile pin

### Post-Launch
- [ ] Monitor analytics for 1 week
- [ ] Triage feedback into bug-fixes vs V2 backlog
- [ ] Hotfix critical bugs immediately
- [ ] Plan V2 sprint after feedback settles

---

## Working Style Reminders
- Ship rough, polish later — Phase 10 exists for a reason
- One feature at a time inside a phase
- Don't refactor mid-build; finish the slice, refactor as its own commit
- When in doubt, **add motion** — it's the vibe
- When in doubt about adding motion, **respect reduced-motion** — it's accessibility
