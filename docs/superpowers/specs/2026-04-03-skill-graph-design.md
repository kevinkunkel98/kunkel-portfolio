# Spec: Obsidian Graph Skills View

**Date:** 2026-04-03  
**Status:** Approved

---

## Overview

Replace the current CSS-animated floating `SkillsCloud.astro` component with a force-directed graph React component (`SkillGraph.tsx`) that behaves like the Obsidian graph view — icons as nodes, thin lines as edges, physics-driven motion that never fully settles.

---

## Architecture

**Component:** `src/components/SkillGraph.tsx` (React, `client:load`)

**Structure:**
- A single `<div>` container with `position: relative` and a fixed height
- A `<canvas>` element covering the full container — draws the edge lines each frame
- One `<img>` (or `<span>` for simple-icons fallbacks) per node, absolutely positioned on top of the canvas, translated via inline `style` updated each rAF frame

**Replaces:** `src/components/SkillsCloud.astro`  
**Referenced in:** `src/pages/index.astro` (skills section)

The canvas handles all physics simulation and line rendering. Icon elements sit on top and get their positions synced from the simulation state each frame.

---

## Skill Data

Same 21 icons as the current SkillsCloud (py, ts, js, react, astro, obsidian, arch, fastapi, spring, docker, kubernetes, postgres, mongodb, pytorch, sklearn, git, mlflow, linux, vim, tailwind, java).

- Icons available on skillicons.dev: rendered as `<img src="https://skillicons.dev/icons?i=<slug>">`
- Icons not on skillicons.dev (mlflow): rendered as `<span>` with inline SVG from `simple-icons`, brand background, luminance-based fill — same logic as current SkillsCloud

Data structure per node:
```ts
interface SkillNode {
  slug?: string;           // skillicons.dev slug
  siIcon?: { svg: string; hex: string; title: string }; // simple-icons fallback
  label: string;
}
```

Runtime simulation state (not part of the static data):
```ts
interface SimNode extends SkillNode {
  x: number; y: number;   // current position (px, relative to container)
  vx: number; vy: number; // current velocity
}
```

---

## Physics Simulation

Runs in a `requestAnimationFrame` loop. Each frame:

1. **Repulsion** — every pair of nodes pushes apart. Force = `k_repel / d²`, capped at `maxRepelDist = 200px`. Applied symmetrically.
2. **Attraction (spring)** — each node is attracted to its 4–5 nearest neighbours. Force = `k_spring * (d - restLength)` along the connecting vector. `restLength ≈ 120px`.
3. **Center gravity** — each node pulled toward canvas center with `k_gravity * dist_from_center`. Keeps nodes from drifting off-screen without hard walls.
4. **Velocity damping** — `vx *= 0.88`, `vy *= 0.88` each frame. Graph never fully stops; settles into slow organic drift.
5. **Boundary soft walls** — within 40px of any edge, an inward force is applied proportional to how close the node is to the wall. Prevents icons clipping out of view.

**Constants (tunable):**
```
k_repel    = 4000
k_spring   = 0.012
k_gravity  = 0.008
damping    = 0.88
restLength = 120
neighbours = 5
```

**Initial positions:** randomly scattered within the inner 80% of the canvas bounds at mount time.

---

## Rendering

### Lines (canvas)
- Each frame: clear canvas, draw edges
- For each node, find its 5 nearest neighbours and draw a line to each (deduplication: only draw each pair once)
- Default line style: `rgba(124, 58, 237, 0.15)` (accent-violet at 15% opacity), `lineWidth = 0.8`
- Hovered node: its edges drawn at `rgba(124, 58, 237, 0.45)`, `lineWidth = 1.2`

### Icons (DOM)
- Each icon element: `position: absolute`, `width: 64px`, `height: 64px` on desktop, `48px` on mobile
- Position updated each frame: `element.style.left = (node.x - halfSize) + 'px'`, same for top
- Use `transform: translate` instead of left/top for performance — `element.style.transform = \`translate(${node.x - half}px, ${node.y - half}px)\``
- skillicons.dev icons: `<img>` with `border-radius: 22%`, `loading="lazy"`
- simple-icons fallback: `<span>` with brand background, centered SVG, same border-radius

### Hover interaction
- `mousemove` on container: find nearest node within 40px of cursor, mark as hovered
- Hovered node: icon scales to 1.1 via `transform`, edges brighter (see above)
- `mouseleave`: clear hover state

---

## Container

```
desktop: width 100%, height 420px
mobile (≤639px): height 560px
```

Canvas sized to match container via `ResizeObserver`. On resize: update canvas dimensions, re-scatter node positions into new bounds.

---

## Error Handling / Edge Cases

- `simple-icons` import: non-null assertion `siMlflow!` is safe — these are static imports verified at build time
- Canvas 2D context: guard with `if (!ctx) return` before drawing
- Cleanup: `cancelAnimationFrame` and `ResizeObserver.disconnect` in `useEffect` cleanup

---

## TypeScript

- Strict mode throughout — no `any`
- `SimNode` interface owns the mutable simulation state
- Canvas ref: `useRef<HTMLCanvasElement>(null)`
- Icon element refs: `useRef<(HTMLElement | null)[]>([])`
- All physics constants typed as `const` numbers

---

## What Does NOT Change

- The `// skills` section heading in `index.astro`
- The skillicons.dev URLs and simple-icons fallback logic
- The icon set (same 21 icons)
- Site styling, design tokens, dark mode
