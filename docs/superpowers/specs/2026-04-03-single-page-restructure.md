# Design Spec: Single-Page Portfolio Restructure

**Date:** 2026-04-03  
**Status:** Draft

---

## Overview

Collapse the current multi-page portfolio (4 separate routes) into a single scrollable page. All content sections—Hero, About, Skills, Projects, Contact—live on `index.astro`. Separate pages are deleted. The floating AI chat widget moves to the landing page. A new `SkillsCloud.astro` component replaces the current text-based skills cards with an organic, CSS-animated floating icon cloud. A second accent color (emerald `#10b981`) is added to the design token system alongside the existing violet.

---

## Goals

- All portfolio content discoverable from a single URL (`/`)
- Navigation links become smooth-scroll anchor links
- Skills section becomes visually engaging: floating icon cloud with real tech logos
- Color palette gains a second accent (violet + emerald) to reduce the "unicolor" feel
- ChatWidget available everywhere (it was only on `/about`)
- No new runtime JS beyond what already exists (skills cloud is CSS-only)

---

## Section Order

```
/ (index.astro)
├── #hero       Hero with LossLandscape background, CTA scrolls to #projects
├── #about      Bio card + ExperienceTimeline + Education card + Hardware/Software/Tech-stack cards
├── #skills     Skills cloud (SkillsCloud.astro)
├── #projects   Full project grid with All / ML / WebDev filter buttons
└── #contact    ContactForm inside TerminalCard
```

The Stats Strip (currently between Hero and Featured Projects) is removed — the stats already appear in the Projects section footer.

---

## Navigation Changes (`Navigation.astro`)

Replace page links with anchor scroll links. The `isActive` function is replaced with a scroll-spy mechanism (vanilla JS, `IntersectionObserver`) that highlights the nav link for the currently visible section.

| Old | New |
|-----|-----|
| `/home` → `/` | `/home` → `/#hero` |
| `/about` → `/about` | `/about` → `/#about` |
| `/projects` → `/projects` | `/projects` → `/#projects` |
| `/contact` → `/contact` | `/contact` → `/#contact` |

Terminal-style labels are kept. Mobile hamburger menu works the same way but closes the menu on anchor link click.

Active state is driven by an `IntersectionObserver` watching each `section[id]`. The nav link whose section occupies the majority of the viewport gets the active accent color. On initial load with no scroll, `#hero` is active.

---

## Color Token Changes (`src/styles/global.css`)

Add `--accent-emerald` to both `:root` and `.dark`:

```css
:root {
  /* existing tokens unchanged */
  --accent-emerald: #059669;   /* emerald-600, readable on light backgrounds */
}

.dark {
  /* existing tokens unchanged */
  --accent-emerald: #10b981;   /* emerald-500, readable on dark backgrounds */
}
```

Usage guidance:
- `--accent-violet` (#7c3aed): primary actions, links, borders, spine circles
- `--accent-magenta` (#a21caf / #e879f9): section headers, counts, hover states, tags
- `--accent-emerald`: skills cloud icon borders/fills, filter button active state in Projects section, "success" visual affordances

Existing components are not touched — emerald only appears in new/modified elements.

---

## New Component: `SkillsCloud.astro`

### Purpose

Replace the two `TerminalCard`-based skills cards (ml_stack.py + package.json) with a floating cloud of circular tech-logo badges that animate organically using CSS `@keyframes`. No JavaScript required. No React island.

### Layout

A fixed-height container (`min-height: 420px`) with `position: relative`. Each badge is `position: absolute`, sized `56px × 56px` (desktop) / `44px × 44px` (mobile). Badges contain an inline SVG logo (white icon on colored background in dark mode; icon-colored on light background in light mode).

### Icon List (28 technologies)

Sourced from the `simple-icons` npm package (to be installed as a regular dependency). The icon slugs and display names:

| Slug | Name |
|------|------|
| `python` | Python |
| `typescript` | TypeScript |
| `javascript` | JavaScript |
| `react` | React |
| `nextdotjs` | Next.js |
| `astro` | Astro |
| `nodedotjs` | Node.js |
| `fastapi` | FastAPI |
| `spring` | Spring |
| `docker` | Docker |
| `kubernetes` | Kubernetes |
| `postgresql` | PostgreSQL |
| `mongodb` | MongoDB |
| `pytorch` | PyTorch |
| `tensorflow` | TensorFlow |
| `scikitlearn` | scikit-learn |
| `langchain` | LangChain |
| `huggingface` | Hugging Face |
| `amazonaws` | AWS |
| `github` | GitHub |
| `githubactions` | GitHub Actions |
| `mlflow` | MLflow |
| `linux` | Linux |
| `neovim` | Neovim |
| `tailwindcss` | Tailwind CSS |
| `vite` | Vite |
| `ollama` | Ollama |
| `netlify` | Netlify |

### Animation Strategy

Each badge gets a unique CSS animation using `@keyframes float-N` (one per badge, N = 0–27). Each keyframe defines a slow, drifting path via `transform: translate(x, y)` waypoints — 4 waypoints, looping. Duration: 12–22s per badge (staggered via `animation-delay: -Ns`). `animation-timing-function: ease-in-out`. `animation-iteration-count: infinite`. `animation-direction: alternate`.

Badge positions are pre-computed as percentage-based `left`/`top` values, spread to fill the container without obvious grid lines. The initial positions are arranged in a rough ellipse with randomized offsets so the cloud reads as organic without requiring JS.

The section heading `// skills` appears above the cloud container, styled consistently with other section headings.

### Section wrapper

```astro
<section id="skills" style="padding: 4rem 1rem;">
  <div style="max-width: 80rem; margin: 0 auto;">
    <div class="section-heading">// skills</div>
    <SkillsCloud />
  </div>
</section>
```

### Implementation Note

`simple-icons` exports icon objects as `{ title, slug, svg, hex }`. The `svg` field is the raw SVG string (no wrapper element). Each badge renders:

```html
<div class="skill-badge" style="background: #HEX; left: X%; top: Y%; animation: float-N Xs ease-in-out -Ds infinite alternate;">
  <!-- raw SVG injected, white fill override in dark, native hex in light -->
</div>
```

Since `SkillsCloud.astro` is an Astro component (not React), SVG injection uses Astro's `set:html` directive on a span inside the badge.

---

## About Section (`#about`)

Pulls all content from current `about.astro`. No content changes, just location:

1. Bio card (`kevin.md` TerminalCard)  
2. `<ExperienceTimeline />` component  
3. Education + Skills card (`cv.md` TerminalCard)  
4. Hardware / Software / Tech-stack grid (3 TerminalCards)

Internal links that previously pointed to `/projects` and `/contact` are updated to `#projects` and `#contact`.

---

## Projects Section (`#projects`)

Pulls all content from current `projects.astro`. The filter JS block (`DOMContentLoaded` listener) moves into `index.astro`'s `<script>` block. The Stats sub-section and the CTA sub-section at the bottom of the old page are **omitted** — the contact section immediately follows.

The active filter button color uses `--accent-emerald` instead of `--accent-magenta` to differentiate it visually.

---

## Contact Section (`#contact`)

Pulls content from current `contact.astro`. No structural changes.

---

## ChatWidget

Moves from `about.astro` to `index.astro`. One `<ChatWidget client:load />` at the bottom of the page, floats fixed.

---

## Files to Delete

After `index.astro` is complete:
- `src/pages/about.astro`
- `src/pages/projects.astro`
- `src/pages/contact.astro`

**Not deleted:** `src/pages/blog/` (if it exists), `src/pages/404.astro` (if it exists).

---

## Files to Create

- `src/components/SkillsCloud.astro` — new component

---

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/index.astro` | Full rewrite — all sections consolidated |
| `src/components/Navigation.astro` | Anchor links + IntersectionObserver scroll-spy |
| `src/styles/global.css` | Add `--accent-emerald` to `:root` and `.dark` |
| `package.json` | Add `simple-icons` as dependency |

---

## Constraints

- No TypeScript `any`; strict mode throughout
- No path aliases — relative imports only
- No Tailwind utility classes in new components — use CSS custom properties
- No new React islands — `SkillsCloud` is a pure `.astro` component
- `simple-icons` SVGs are injected via Astro's `set:html` directive
- `ProjectCard` and `ContactForm` remain as existing React islands (`client:load`)
- The `LossLandscape` React island remains on the Hero section

---

## Out of Scope

- Blog feature (no blog posts exist; `/blog` link in Footer is left as-is)
- Any changes to `ProjectCard.tsx`, `ContactForm.tsx`, `ChatWidget.tsx`, `LossLandscape.tsx`
- SEO redirects from old page URLs (not needed — personal portfolio)
- Animations beyond the skills cloud float
