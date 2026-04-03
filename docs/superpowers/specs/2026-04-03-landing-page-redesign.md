# Landing Page Redesign — Design Spec
**Date:** 2026-04-03

## Goal

Redesign the homepage (`src/pages/index.astro`) to be more visually impactful and professional. Replace the current static 2-column hero with a full-viewport Three.js loss landscape animation. Restructure the sections below the hero to better showcase projects and writing.

---

## 1. Hero Section

**Full-viewport centered layout.** The Three.js canvas fills 100vh behind the content. The existing terminal intro card and photo card are replaced with centered copy directly over the canvas.

### Three.js Canvas (`src/components/LossLandscape.tsx`)

React component, `client:load`. Canvas absolutely fills its container.

**Scene:**
- Non-convex loss surface rendered as isometric wireframe grid (24×24)
- Surface height function:
  ```
  z = 0.25(x²+y²) - 1.05·exp(-5.5((x-0.4)²+(y+0.35)²)) - 0.80·exp(-6.0((x+0.5)²+(y-0.3)²)) - 0.55·exp(-7.0((x+0.1)²+(y+0.65)²)) + 0.20·sin(5x)·cos(4y) + 0.40
  ```
- Wireframe colour: interpolates violet `rgb(70,25,195)` → magenta `rgb(232,121,249)` by normalised z height
- Subtle breathing: `±0.01` sinusoidal z perturbation per frame

**Gradient descent balls (5):**

| Ball | Start | Colour | Phase offset |
|------|-------|--------|-------------|
| 1 | (-0.82, -0.80) | Cyan `[0,212,255]` | 0.00 |
| 2 | (0.85, -0.75) | Amber `[245,158,11]` | 0.20 |
| 3 | (-0.78, 0.80) | Lime `[74,222,128]` | 0.40 |
| 4 | (0.78, 0.72) | Rose `[251,113,133]` | 0.60 |
| 5 | (-0.10, -0.90) | Yellow `[250,204,21]` | 0.80 |

- Each ball pre-computes a 500-step gradient descent path (momentum SGD, `lr=0.048–0.070`, `momentum=0.75–0.85`)
- Position interpolated smoothly between path points (no discrete stepping)
- Loop speed: `t += 0.0018` per frame, ball advance `0.042` of path per t-unit
- Trail: 120 interpolated samples behind ball head, fading from transparent (tail) to full colour (head), width 0.5px → 2.3px
- Ball head: white 2.5px core + radial glow halo (11px radius)
- All balls rendered above surface with `z + 0.055` offset

**Hero copy (centered, above canvas):**
- `var(--text-muted)` small caps label: `KEVIN KUNKEL`
- `var(--text-primary)` large heading: `ML Engineer &\nWeb Developer`
- `var(--text-secondary)` subtitle: `Leipzig, DE — building things that learn`
- Two CTA buttons: primary `$ view projects →` (accent-violet fill) + secondary `$ read blog` (outlined)

---

## 2. Stats Strip

Single terminal card spanning full width, one row of 4 stats:

| Stat | Value |
|------|-------|
| projects | 7 |
| blog posts | 6 |
| yrs ML | 3+ |
| curiosity | ∞ |

Value in `var(--accent-magenta)`, label in `var(--text-muted)`. Dividers between columns via border-right.

---

## 3. Featured Projects

Terminal card with filename `featured_projects.ts`. 3-column grid of project cards, each showing:
- Project title (`var(--text-primary)`)
- One-line description (`var(--text-secondary)`)
- Tech tag pills
- GitHub and/or live link icons

Pull the first 3 projects from `src/data/projects.ts`. "View all projects →" link below the grid.

---

## 4. Skills

Keep existing 2-column layout unchanged:
- `ml_stack.py` — ML/AI tools
- `web_stack.ts` (rename from `package.json`) — web technologies

No content changes required.

---

## 5. Blog Teaser

Terminal card with filename `latest_posts.md`. List the 3 most recent blog posts as rows:
- Post title (left, `var(--accent-violet)`)
- `→` link (right, `var(--text-muted)`)

Pull from `src/content/blog` collection sorted by date descending.

---

## 6. Removed Sections

- **FAQ section** — removed from landing page. Already exists on `/about`.
- **CV section** — removed from landing page. Already exists on `/about`.

---

## 7. Files to Create / Modify

| File | Action |
|------|--------|
| `src/components/LossLandscape.tsx` | Create — Three.js canvas component |
| `src/pages/index.astro` | Modify — new hero + section structure |

### Dependencies

- `three` npm package (Three.js) — install if not already present
- Alternatively, implement with Canvas 2D API (matches existing brainstorm prototype — avoids Three.js bundle size, same visual result)

**Recommendation: use Canvas 2D API.** The prototype was built with Canvas 2D and produces identical visuals. Three.js adds ~600KB to the bundle for no visual gain here. The component is still called `LossLandscape.tsx` but uses `<canvas>` with `requestAnimationFrame` directly.
