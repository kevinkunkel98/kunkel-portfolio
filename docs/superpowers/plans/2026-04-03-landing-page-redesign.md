# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static 2-column homepage with a full-viewport Three.js-style animated loss landscape hero, a stats strip, featured projects, and a blog teaser — removing the FAQ and CV sections.

**Architecture:** A new `LossLandscape.tsx` React island handles the Canvas 2D animation (no Three.js dependency needed — pure Canvas API produces identical visuals). `index.astro` is rewritten to use the new hero layout and four new sections. All gradient descent paths are pre-computed at module load time so the animation loop is cheap.

**Tech Stack:** Astro 5, React 19 (`client:load`), Canvas 2D API, `astro:content` collection API, existing `src/data/projects.ts`.

---

## File Map

| File | Action |
|------|--------|
| `src/components/LossLandscape.tsx` | Create — animated Canvas 2D component |
| `src/pages/index.astro` | Modify — full rewrite of page content |

---

## Task 1: Create `LossLandscape.tsx`

**Files:**
- Create: `src/components/LossLandscape.tsx`

- [ ] **Step 1: Create the file with the full component**

```tsx
// src/components/LossLandscape.tsx
import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;

function lossNonConvex(nx: number, ny: number): number {
  return (
    0.25 * (nx * nx + ny * ny)
    - 1.05 * Math.exp(-((nx - 0.40) ** 2 + (ny + 0.35) ** 2) * 5.5)
    - 0.80 * Math.exp(-((nx + 0.50) ** 2 + (ny - 0.30) ** 2) * 6.0)
    - 0.55 * Math.exp(-((nx + 0.10) ** 2 + (ny + 0.65) ** 2) * 7.0)
    + 0.20 * Math.sin(nx * 5.0) * Math.cos(ny * 4.0)
    + 0.40
  );
}

function buildPath(
  startX: number, startY: number,
  steps: number, lr0: number, mom: number
): [number, number][] {
  const path: [number, number][] = [];
  let x = startX, y = startY, vx = 0, vy = 0;
  const eps = 0.007;
  for (let s = 0; s < steps; s++) {
    path.push([x, y]);
    const gx = (lossNonConvex(x + eps, y) - lossNonConvex(x - eps, y)) / (2 * eps);
    const gy = (lossNonConvex(x, y + eps) - lossNonConvex(x, y - eps)) / (2 * eps);
    const lr = lr0 / (1 + s * 0.012);
    vx = mom * vx - lr * gx;
    vy = mom * vy - lr * gy;
    x = Math.max(-0.98, Math.min(0.98, x + vx));
    y = Math.max(-0.98, Math.min(0.98, y + vy));
  }
  return path;
}

function samplePath(path: [number, number][], t01: number): [number, number, number] {
  const last = path.length - 1;
  const ft = t01 * last;
  const i = Math.min(Math.floor(ft), last - 1);
  const f = ft - i;
  const [ax, ay] = path[i];
  const [bx, by] = path[i + 1];
  const x = ax + (bx - ax) * f;
  const y = ay + (by - ay) * f;
  return [x, y, lossNonConvex(x, y)];
}

function isoProject(
  v: [number, number, number],
  cx: number, cy: number, sx: number, sy: number
) {
  return {
    x: cx + (v[0] - v[1]) * sx,
    y: cy + (v[0] + v[1]) * sy - v[2] * sy * 2.4,
  };
}

// Pre-computed at module load — not re-run per frame
const BALLS: { path: [number, number][]; color: [number, number, number]; offset: number }[] = [
  { path: buildPath(-0.82, -0.80, 500, 0.062, 0.78), color: [0,   212, 255], offset: 0.00 },
  { path: buildPath( 0.85, -0.75, 500, 0.055, 0.82), color: [245, 158,  11], offset: 0.20 },
  { path: buildPath(-0.78,  0.80, 500, 0.070, 0.75), color: [74,  222, 128], offset: 0.40 },
  { path: buildPath( 0.78,  0.72, 500, 0.048, 0.85), color: [251, 113, 133], offset: 0.60 },
  { path: buildPath(-0.10, -0.90, 500, 0.065, 0.80), color: [250, 204,  21], offset: 0.80 },
];

const TRAIL = 120;

export default function LossLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx!.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!canvas || !ctx) return;
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);
      t += 0.0018;

      const N = 24;
      const cx = cw * 0.5;
      const cy = ch * 0.76;
      const sx = cw * 0.23;
      const sy = ch * 0.10;

      // Build grid with subtle breathing
      const grid: [number, number, number][][] = [];
      for (let i = 0; i <= N; i++) {
        const row: [number, number, number][] = [];
        for (let j = 0; j <= N; j++) {
          const nx = (i / N) * 2 - 1;
          const ny = (j / N) * 2 - 1;
          let z = lossNonConvex(nx, ny);
          z += Math.sin(nx * 3 - t * 0.5) * 0.010 + Math.sin(ny * 3 - t * 0.4) * 0.010;
          row.push([nx, ny, z]);
        }
        grid.push(row);
      }

      let zMin = Infinity, zMax = -Infinity;
      grid.forEach(row => row.forEach(([,, z]) => {
        zMin = Math.min(zMin, z);
        zMax = Math.max(zMax, z);
      }));

      // Draw surface wireframe — colour interpolates violet→magenta by height
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const p0 = isoProject(grid[i][j],     cx, cy, sx, sy);
          const p1 = isoProject(grid[i + 1][j], cx, cy, sx, sy);
          const p2 = isoProject(grid[i][j + 1], cx, cy, sx, sy);
          const z = grid[i][j][2];
          const zt = Math.max(0, Math.min(1, (z - zMin) / (zMax - zMin)));
          const r = Math.round(70  + (232 - 70)  * zt);
          const g = Math.round(25  + (121 - 25)  * zt);
          const b = Math.round(195 + (249 - 195) * zt);
          const alpha = (0.12 + zt * 0.45).toFixed(2);
          const col = `rgba(${r},${g},${b},${alpha})`;
          ctx.strokeStyle = col;
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        }
      }

      // Draw balls + trails
      BALLS.forEach(({ path, color: [cr, cg, cb], offset }) => {
        const headT = ((t * 0.042 + offset) % 1);
        const tailT = Math.max(0, headT - 0.18);

        // Trail — interpolated samples from tail to head
        for (let s = 0; s <= TRAIL; s++) {
          const t0 = tailT + (headT - tailT) * (s / TRAIL);
          const t1 = tailT + (headT - tailT) * (Math.min(s + 1, TRAIL) / TRAIL);
          const pa = isoProject(samplePath(path, t0), cx, cy, sx, sy);
          const pb = isoProject(samplePath(path, t1), cx, cy, sx, sy);
          const age = s / TRAIL;
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(age * 0.88).toFixed(2)})`;
          ctx.lineWidth = 0.5 + age * 1.8;
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
        }

        // Glow halo + white core
        const head = samplePath(path, headT);
        const pt = isoProject([head[0], head[1], head[2] + 0.055], cx, cy, sx, sy);
        const halo = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 11);
        halo.addColorStop(0,   `rgba(${cr},${cg},${cb},1)`);
        halo.addColorStop(0.4, `rgba(${cr},${cg},${cb},0.3)`);
        halo.addColorStop(1,   `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 11, 0, TAU);
        ctx.fillStyle = halo; ctx.fill();

        ctx.beginPath(); ctx.arc(pt.x, pt.y, 2.5, 0, TAU);
        ctx.fillStyle = '#ffffff'; ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /path/to/.worktrees/ai-chat
npx astro check
```

Expected: no errors in `LossLandscape.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/LossLandscape.tsx
git commit -m "feat: add LossLandscape canvas component"
```

---

## Task 2: Rewrite the Hero Section in `index.astro`

**Files:**
- Modify: `src/pages/index.astro`

Replace the existing hero section (lines 13–100 in the current file — the `<section>` containing `hero-grid`) with the new full-viewport hero. Also add the `LossLandscape` import.

- [ ] **Step 1: Add imports to the frontmatter**

Replace the existing frontmatter block:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TerminalCard from '../components/TerminalCard.astro';
import LossLandscape from '../components/LossLandscape';
import { getCollection } from 'astro:content';
import { allProjects } from '../data/projects';

const posts = (await getCollection('blog'))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 3);

const featuredProjects = allProjects.slice(0, 3);
---
```

- [ ] **Step 2: Replace the hero section**

Replace the existing hero `<section>` (the one with `min-height: 100vh` containing `hero-grid`) with:

```astro
<!-- Hero Section -->
<section style="position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden;">

  <!-- Animated loss landscape background -->
  <LossLandscape client:load />

  <!-- Hero copy — centered over canvas -->
  <div style="position: relative; z-index: 1; text-align: center; padding: 2rem 1rem; max-width: 56rem; width: 100%;">
    <div style="font-family: inherit; font-size: 0.75rem; letter-spacing: 0.2em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 1rem;">
      Kevin Kunkel
    </div>
    <h1 style="font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; color: var(--text-primary); line-height: 1.1; margin: 0 0 1rem 0;">
      ML Engineer &amp;<br/>Web Developer
    </h1>
    <p style="color: var(--text-secondary); font-size: 1.1rem; margin: 0 0 2.5rem 0;">
      Leipzig, DE — building things that learn
    </p>
    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <a href="/projects" style="background: var(--accent-violet); color: #fff; font-family: inherit; font-size: 0.9rem; padding: 0.75rem 1.5rem; border-radius: 4px; text-decoration: none; transition: opacity 0.2s;">
        $ view projects →
      </a>
      <a href="/blog" style="border: 1px solid var(--accent-violet); color: var(--accent-violet); font-family: inherit; font-size: 0.9rem; padding: 0.75rem 1.5rem; border-radius: 4px; text-decoration: none; transition: opacity 0.2s;">
        $ read blog
      </a>
    </div>
  </div>

</section>
```

- [ ] **Step 3: Build to check for errors**

```bash
npm run build
```

Expected: build succeeds. If `LossLandscape` import fails, verify the file exists at `src/components/LossLandscape.tsx`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: full-viewport loss landscape hero"
```

---

## Task 3: Add Stats Strip + Featured Projects Section

**Files:**
- Modify: `src/pages/index.astro`

Add two new sections immediately after the hero section (before the existing CV section).

- [ ] **Step 1: Add the stats strip section**

Insert after the hero `</section>` closing tag:

```astro
<!-- Stats Strip -->
<section style="padding: 1.5rem 1rem;">
  <div style="max-width: 80rem; margin: 0 auto;">
    <TerminalCard filename="stats.ts">
      <div style="padding: 1rem 1.5rem; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;">
        <div style="text-align: center; padding: 0.5rem 1rem; border-right: 1px solid var(--border);">
          <div style="font-size: 2rem; font-weight: 700; color: var(--accent-magenta); line-height: 1;">7</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">projects</div>
        </div>
        <div style="text-align: center; padding: 0.5rem 1rem; border-right: 1px solid var(--border);">
          <div style="font-size: 2rem; font-weight: 700; color: var(--accent-magenta); line-height: 1;">6</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">blog posts</div>
        </div>
        <div style="text-align: center; padding: 0.5rem 1rem; border-right: 1px solid var(--border);">
          <div style="font-size: 2rem; font-weight: 700; color: var(--accent-magenta); line-height: 1;">3+</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">yrs ML</div>
        </div>
        <div style="text-align: center; padding: 0.5rem 1rem;">
          <div style="font-size: 2rem; font-weight: 700; color: var(--accent-magenta); line-height: 1;">∞</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">curiosity</div>
        </div>
      </div>
    </TerminalCard>
  </div>
</section>
```

- [ ] **Step 2: Add the featured projects section**

Insert immediately after the stats strip `</section>`:

```astro
<!-- Featured Projects -->
<section style="padding: 3rem 1rem;">
  <div style="max-width: 80rem; margin: 0 auto;">
    <TerminalCard filename="featured_projects.ts">
      <div style="padding: 1.5rem;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;" class="projects-grid">
          {featuredProjects.map((project) => (
            <div style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 4px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">{project.title}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; flex: 1;">{project.description}</div>
              <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
                {project.technologies.map((tech) => (
                  <span style="font-size: 0.7rem; color: var(--accent-magenta); background: color-mix(in srgb, var(--accent-magenta) 10%, transparent); border: 1px solid color-mix(in srgb, var(--accent-magenta) 25%, transparent); border-radius: 3px; padding: 0.15rem 0.5rem;">{tech}</span>
                ))}
              </div>
              <div style="display: flex; gap: 1rem; font-size: 0.8rem;">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener" style="color: var(--accent-violet); text-decoration: none;">
                    GitHub →
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener" style="color: var(--accent-violet); text-decoration: none;">
                    Live →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style="margin-top: 1.25rem; text-align: right;">
          <a href="/projects" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;">
            <span style="color: var(--accent-violet);">$</span> view all projects →
          </a>
        </div>
      </div>
    </TerminalCard>
  </div>
</section>
```

- [ ] **Step 3: Add responsive CSS for projects grid**

Inside the existing `<style>` block at the bottom of index.astro, add:

```css
.projects-grid {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- [ ] **Step 4: Build to check for errors**

```bash
npm run build
```

Expected: build succeeds with no TypeScript or Astro errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add stats strip and featured projects section"
```

---

## Task 4: Add Blog Teaser and Remove FAQ + CV Sections

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add blog teaser section**

The Skills section currently exists — add the blog teaser immediately **after** the closing `</section>` of the Skills section (before the FAQ section):

```astro
<!-- Blog Teaser -->
<section style="padding: 3rem 1rem;">
  <div style="max-width: 80rem; margin: 0 auto;">
    <TerminalCard filename="latest_posts.md">
      <div style="padding: 1.5rem;">
        <div style="display: flex; flex-direction: column;">
          {posts.map((post, i) => (
            <a
              href={`/blog/${post.slug}`}
              style={`display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 0; text-decoration: none; ${i < posts.length - 1 ? 'border-bottom: 1px solid var(--border);' : ''}`}
            >
              <div>
                <div style="font-size: 0.9rem; color: var(--accent-violet); margin-bottom: 0.2rem;">{post.data.title}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">{post.data.description}</div>
              </div>
              <span style="color: var(--text-muted); font-size: 0.85rem; flex-shrink: 0; margin-left: 1rem;">→</span>
            </a>
          ))}
        </div>
        <div style="margin-top: 1.25rem; text-align: right;">
          <a href="/blog" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;">
            <span style="color: var(--accent-violet);">$</span> view all posts →
          </a>
        </div>
      </div>
    </TerminalCard>
  </div>
</section>
```

- [ ] **Step 2: Remove the CV section**

Delete the entire CV `<section>` block — from:
```html
<!-- CV Section -->
<section style="padding: 3rem 1rem;">
```
to its closing `</section>` (includes the toggle command bar, cv-content div, and all CV JSON content).

Also delete the CV toggle `<script>` block at the bottom of the file (the one containing `cv-toggle-command` and `cv-content` logic).

- [ ] **Step 3: Remove the FAQ section**

Delete the entire FAQ `<section>` block — from:
```html
<!-- FAQ Section -->
<section style="padding: 3rem 1rem;">
```
to its closing `</section>`.

Also remove the Skills section heading div (the `// cat /dev/skills` comment block above the skills grid) — it's a leftover from the old layout. The TerminalCard filename already provides the context.

- [ ] **Step 4: Remove now-unused CSS from the `<style>` block**

In the `<style>` block, delete:

```css
.photo-hover:hover {
  transform: scale(1.03);
}

.photo-hover:hover + div + .photo-overlay,
.photo-hover:hover ~ .photo-overlay {
  opacity: 1 !important;
}

/* Wrap photo container to enable hover on overlay */
.photo-container:hover .photo-overlay {
  opacity: 1 !important;
}
```

Also delete the `.hero-grid` rule and its media query (no longer used).

- [ ] **Step 5: Build and verify**

```bash
npm run build
```

Expected: clean build, no errors.

Open `http://localhost:4321` (run `npm run dev`) and verify:
- Hero: full-viewport with animated loss landscape, 5 coloured balls with trails, centered text + 2 CTAs
- Stats strip: 4 stats in a row
- Featured projects: 3 project cards in a grid
- Skills: 2-col `ml_stack.py` + `package.json` cards
- Blog teaser: 3 posts (k-nearest-neighbors, random-forest, decision-trees) with titles + arrows
- No CV section
- No FAQ section

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add blog teaser, remove CV and FAQ from landing page"
```
