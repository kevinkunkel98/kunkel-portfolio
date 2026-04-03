# Single-Page Portfolio Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse the 4-page portfolio into a single scrollable `index.astro`, add a CSS-animated floating skills icon cloud, and add an emerald accent color to the design token system.

**Architecture:** All section content migrates into `index.astro` as `<section id="...">` blocks. Navigation switches to anchor scroll links with IntersectionObserver scroll-spy. A new `SkillsCloud.astro` component renders 27 tech logo badges from `simple-icons` with CSS float animations.

**Tech Stack:** Astro 5, React 19 (islands only), Tailwind CSS v4, CSS custom properties, simple-icons v16

**Spec:** `docs/superpowers/specs/2026-04-03-single-page-restructure.md`

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `src/styles/global.css` | Add `--accent-emerald` token |
| Create | `src/components/SkillsCloud.astro` | Floating icon cloud component |
| Modify | `src/components/Navigation.astro` | Anchor links + scroll-spy |
| Modify | `src/pages/index.astro` | Full rewrite — all sections |
| Delete | `src/pages/about.astro` | Migrated into index |
| Delete | `src/pages/projects.astro` | Migrated into index |
| Delete | `src/pages/contact.astro` | Migrated into index |

---

## Task 0: Install simple-icons dependency

**Files:**
- Modify: `package.json` (via npm)

- [ ] Install `simple-icons` as a production dependency:
  ```bash
  npm install simple-icons
  ```
  Expected: package added to `dependencies` in `package.json`.

- [ ] Commit:
  ```bash
  git add package.json package-lock.json
  git commit -m "chore: add simple-icons dependency"
  ```

> **Note:** AWS (`amazonaws`) does not exist in simple-icons v16. The icon list uses 27 icons — AWS is intentionally omitted. The spec listed 28 but was written before slug verification; this is the correct list.

> **Note:** The animation implementation uses a single shared `@keyframes float-drift` with per-badge CSS custom properties (`--tx1/ty1/tx2/ty2/tx3/ty3`) rather than 27 individual `@keyframes float-N` blocks. This is functionally equivalent and avoids ~500 lines of repetitive CSS. The spec described the intent (unique per-badge paths), which this approach achieves more efficiently.

---

## Task 1: Add emerald accent color token

**Files:**
- Modify: `src/styles/global.css`

- [ ] Open `src/styles/global.css`. In the `:root` block, add after `--accent-magenta`:
  ```css
  --accent-emerald: #059669;
  ```
  In the `.dark` block, add after `--accent-magenta`:
  ```css
  --accent-emerald: #10b981;
  ```

- [ ] Run type check to confirm no breakage:
  ```bash
  npm run astro -- check
  ```
  Expected: 0 errors.

- [ ] Commit:
  ```bash
  git add src/styles/global.css
  git commit -m "feat: add --accent-emerald design token to light and dark themes"
  ```

---

## Task 2: Create SkillsCloud.astro

**Files:**
- Create: `src/components/SkillsCloud.astro`

The component renders 27 circular tech-logo badges. Each badge is `position: absolute` inside a `position: relative` container. SVGs come from `simple-icons` — imported in the frontmatter and injected via `set:html`.

Each badge has:
- A background color derived from the icon's brand hex
- A CSS animation (`float-N`) unique per badge — slow drift via `transform: translate`
- `position: absolute` with `left`/`top` set as percentages

- [ ] Create `src/components/SkillsCloud.astro` with the following content:

```astro
---
import { siPython, siTypescript, siJavascript, siReact, siNextdotjs, siAstro, siNodedotjs, siFastapi, siSpring, siDocker, siKubernetes, siPostgresql, siMongodb, siPytorch, siTensorflow, siScikitlearn, siLangchain, siHuggingface, siGithub, siGithubactions, siMlflow, siLinux, siNeovim, siTailwindcss, siVite, siOllama, siNetlify } from 'simple-icons';

interface IconEntry {
  icon: { svg: string; hex: string; title: string };
  left: number;
  top: number;
  dur: number;
  delay: number;
  tx1: number; ty1: number;
  tx2: number; ty2: number;
  tx3: number; ty3: number;
}

const icons: IconEntry[] = [
  { icon: siPython,        left:  8, top: 12, dur: 18, delay:  0, tx1: 12, ty1:  8, tx2: -8, ty2: 14, tx3:  6, ty3: -10 },
  { icon: siTypescript,    left: 22, top:  5, dur: 15, delay: -3, tx1: -6, ty1: 10, tx2: 10, ty2: -8, tx3: -4, ty3:  12 },
  { icon: siJavascript,    left: 38, top: 10, dur: 20, delay: -7, tx1:  8, ty1: -6, tx2: -10,ty2: 10, tx3:  4, ty3: -14 },
  { icon: siReact,         left: 55, top:  6, dur: 16, delay: -2, tx1: -8, ty1: 12, tx2:  6, ty2: -10,tx3: 10, ty3:   8 },
  { icon: siNextdotjs,     left: 70, top: 14, dur: 22, delay: -9, tx1: 10, ty1:  6, tx2: -6, ty2: -12,tx3:  8, ty3:  10 },
  { icon: siAstro,         left: 84, top:  8, dur: 17, delay: -5, tx1: -4, ty1: -8, tx2:  8, ty2: 10, tx3: -10,ty3:  6 },
  { icon: siNodedotjs,     left:  5, top: 35, dur: 19, delay: -1, tx1:  6, ty1: 10, tx2: -8, ty2: -6, tx3: 12, ty3:  4 },
  { icon: siFastapi,       left: 18, top: 48, dur: 14, delay: -6, tx1: -10,ty1:  8, tx2:  4, ty2: -12,tx3:  8, ty3:  6 },
  { icon: siSpring,        left: 32, top: 38, dur: 21, delay: -4, tx1:  8, ty1: -4, tx2: -6, ty2:  8, tx3: -12,ty3: -6 },
  { icon: siDocker,        left: 46, top: 42, dur: 16, delay: -8, tx1: -6, ty1: -10,tx2: 10, ty2:  6, tx3: -8, ty3: 12 },
  { icon: siKubernetes,    left: 62, top: 35, dur: 18, delay: -3, tx1:  4, ty1: 12, tx2: -8, ty2: -8, tx3: 10, ty3:  4 },
  { icon: siPostgresql,    left: 76, top: 44, dur: 23, delay: -7, tx1: -8, ty1:  6, tx2:  6, ty2: -10,tx3: -4, ty3:  8 },
  { icon: siMongodb,       left: 90, top: 38, dur: 15, delay: -2, tx1: 10, ty1: -8, tx2: -4, ty2: 10, tx3:  6, ty3: -6 },
  { icon: siPytorch,       left:  3, top: 62, dur: 20, delay: -5, tx1: -6, ty1:  8, tx2: 10, ty2: -6, tx3: -8, ty3: 10 },
  { icon: siTensorflow,    left: 16, top: 72, dur: 17, delay: -9, tx1:  8, ty1: -10,tx2: -6, ty2:  6, tx3: 10, ty3: -8 },
  { icon: siScikitlearn,   left: 30, top: 65, dur: 22, delay: -1, tx1: -4, ty1: -6, tx2:  8, ty2: 10, tx3: -6, ty3: -4 },
  { icon: siLangchain,     left: 45, top: 70, dur: 14, delay: -6, tx1:  6, ty1:  8, tx2: -10,ty2: -4, tx3:  8, ty3:  6 },
  { icon: siHuggingface,   left: 60, top: 62, dur: 19, delay: -3, tx1: -8, ty1:  6, tx2:  4, ty2: -10,tx3: -6, ty3:  8 },
  { icon: siGithub,        left: 74, top: 72, dur: 16, delay: -8, tx1: 10, ty1: -6, tx2: -6, ty2:  8, tx3:  4, ty3: -10 },
  { icon: siGithubactions, left: 88, top: 65, dur: 21, delay: -4, tx1: -6, ty1: 10, tx2:  8, ty2: -6, tx3: -10,ty3:  4 },
  { icon: siMlflow,        left: 10, top: 85, dur: 18, delay: -7, tx1:  6, ty1: -8, tx2: -8, ty2:  6, tx3: 10, ty3: -4 },
  { icon: siLinux,         left: 25, top: 88, dur: 15, delay: -2, tx1: -4, ty1: 10, tx2:  8, ty2: -8, tx3: -6, ty3:  6 },
  { icon: siNeovim,        left: 42, top: 84, dur: 20, delay: -5, tx1:  8, ty1:  6, tx2: -6, ty2: -10,tx3:  4, ty3:  8 },
  { icon: siTailwindcss,   left: 57, top: 88, dur: 23, delay: -9, tx1: -8, ty1: -6, tx2:  6, ty2:  8, tx3: -4, ty3: -8 },
  { icon: siVite,          left: 71, top: 82, dur: 17, delay: -1, tx1:  4, ty1:  8, tx2: -8, ty2: -4, tx3:  8, ty3:  6 },
  { icon: siOllama,        left: 83, top: 87, dur: 14, delay: -6, tx1: -6, ty1:  6, tx2: 10, ty2: -8, tx3: -8, ty3:  4 },
  { icon: siNetlify,       left: 94, top: 80, dur: 19, delay: -3, tx1:  8, ty1: -4, tx2: -4, ty2:  8, tx3:  6, ty3: -10 },
];
---

<div class="skills-cloud-wrap">
  <div class="skills-cloud">
    {icons.map((entry, i) => (
      <div
        class={`skill-badge badge-${i}`}
        title={entry.icon.title}
        style={`left:${entry.left}%;top:${entry.top}%;background:#${entry.icon.hex};animation-duration:${entry.dur}s;animation-delay:${entry.delay}s;--tx1:${entry.tx1}px;--ty1:${entry.ty1}px;--tx2:${entry.tx2}px;--ty2:${entry.ty2}px;--tx3:${entry.tx3}px;--ty3:${entry.ty3}px;`}
      >
        <span class="badge-icon" set:html={entry.icon.svg} />
      </div>
    ))}
  </div>
</div>

<style>
  .skills-cloud-wrap {
    padding: 1rem 0 2rem;
  }

  .skills-cloud {
    position: relative;
    width: 100%;
    min-height: 420px;
  }

  .skill-badge {
    position: absolute;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation-name: float-drift;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    opacity: 0.85;
    transition: opacity 0.2s, transform 0.2s;
    cursor: default;
  }

  .skill-badge:hover {
    opacity: 1;
    z-index: 10;
  }

  .badge-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
  }

  /* Force white SVG fill in dark mode, dark fill in light mode */
  :global(.dark) .badge-icon :global(svg) {
    fill: #ffffff !important;
    width: 26px;
    height: 26px;
  }

  :global(:not(.dark)) .badge-icon :global(svg) {
    fill: #000000 !important;
    width: 26px;
    height: 26px;
    opacity: 0.75;
  }

  /* Light mode: soften backgrounds */
  :global(:not(.dark)) .skill-badge {
    background: var(--bg-elevated) !important;
    border: 1px solid var(--border);
  }

  @keyframes float-drift {
    0%   { transform: translate(0, 0); }
    33%  { transform: translate(var(--tx1), var(--ty1)); }
    66%  { transform: translate(var(--tx2), var(--ty2)); }
    100% { transform: translate(var(--tx3), var(--ty3)); }
  }

  @media (max-width: 639px) {
    .skills-cloud {
      min-height: 520px;
    }

    .skill-badge {
      width: 42px;
      height: 42px;
    }

    .badge-icon,
    :global(.dark) .badge-icon :global(svg),
    :global(:not(.dark)) .badge-icon :global(svg) {
      width: 20px;
      height: 20px;
    }
  }
</style>
```

- [ ] Run type check:
  ```bash
  npm run astro -- check
  ```
  Expected: 0 errors.

- [ ] Start dev server and visually confirm the cloud renders at `http://localhost:4321` (import it temporarily in `index.astro` to preview):
  ```bash
  npm run dev
  ```

- [ ] Commit:
  ```bash
  git add src/components/SkillsCloud.astro
  git commit -m "feat: add SkillsCloud component with CSS float animation"
  ```

---

## Task 3: Rewrite index.astro with all sections

**Files:**
- Modify: `src/pages/index.astro`

This is the largest task. Replace the entire file with the consolidated single-page layout. Section order: `#hero` → `#about` → `#skills` → `#projects` → `#contact`.

- [ ] Replace `src/pages/index.astro` with the following:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TerminalCard from '../components/TerminalCard.astro';
import LossLandscape from '../components/LossLandscape';
import ExperienceTimeline from '../components/ExperienceTimeline.astro';
import SkillsCloud from '../components/SkillsCloud.astro';
import ProjectCard from '../components/ProjectCard';
import ContactForm from '../components/ContactForm';
import ChatWidget from '../components/ChatWidget';
import { allProjects } from '../data/projects';
---

<BaseLayout
  title="Kevin Kunkel - dev && ml_engineer"
  description="Kevin Kunkel - ML Engineer & AI-focused Full-Stack Developer. Building ML, LLM, and scalable web systems."
  image="/optimized-og.png"
  url="/"
>

  <!-- ═══════════════════════════════════════ HERO ═══════════════════════════════════════ -->
  <section id="hero" style="position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden;">
    <LossLandscape client:load />
    <div style="position: relative; z-index: 1; text-align: center; padding: 2rem 1rem; max-width: 56rem; width: 100%;">
      <div style="font-size: 0.75rem; letter-spacing: 0.2em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 1rem;">
        Kevin Kunkel
      </div>
      <h1 style="font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; color: var(--text-primary); line-height: 1.1; margin: 0 0 1rem 0;">
        ML Engineer &amp;<br/>Web Developer
      </h1>
      <p style="color: var(--text-secondary); font-size: 1.1rem; margin: 0 0 2.5rem 0;">
        Leipzig, DE — building things that learn
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <a href="#projects" style="background: var(--accent-violet); color: #fff; font-family: inherit; font-size: 0.9rem; padding: 0.75rem 1.5rem; border-radius: 4px; text-decoration: none; transition: opacity 0.2s;">
          $ view projects →
        </a>
        <a href="#about" style="border: 1px solid var(--border); color: var(--text-secondary); font-family: inherit; font-size: 0.9rem; padding: 0.75rem 1.5rem; border-radius: 4px; text-decoration: none; transition: opacity 0.2s;">
          $ about me →
        </a>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════ ABOUT ══════════════════════════════════════ -->
  <section id="about" style="padding: 5rem 1rem;">
    <div style="max-width: 56rem; margin: 0 auto;">

      <div class="section-heading">// about</div>

      <!-- Bio card -->
      <div style="margin-bottom: 1.5rem;">
        <TerminalCard filename="kevin.md">
          <div style="padding: 1.5rem;">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin: 0 0 1rem;">
              Kevin Kunkel
            </h2>
            <p style="font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.7; margin: 0 0 0.75rem;">
              ML engineer and web developer based in Leipzig, Germany.
              I build things that actually work — RAG chatbots, classifiers, web apps — and document the journey along the way.
            </p>
            <p style="font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.7; margin: 0;">
              Currently studying computer science and spending too much time on my Neovim config.
            </p>
            <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="#projects" style="font-size: 0.8125rem; color: var(--accent-magenta); text-decoration: none;">$ ls ./projects →</a>
              <a href="#contact" style="font-size: 0.8125rem; color: var(--accent-magenta); text-decoration: none;">$ ./contact.sh →</a>
            </div>
          </div>
        </TerminalCard>
      </div>

      <!-- Experience Timeline -->
      <ExperienceTimeline />

      <!-- Education + Skills -->
      <div style="margin-bottom: 2rem;">
        <TerminalCard filename="cv.md">
          <div style="padding: 1.5rem;">

            <div style="margin-bottom: 1.75rem;">
              <div style="font-size: 0.75rem; color: var(--accent-violet); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border);">
                Education
              </div>
              <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div>
                  <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
                    <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">M.Sc. Computer Science</div>
                    <div style="font-size: 0.75rem; color: var(--accent-magenta); flex-shrink: 0;">2021 — present</div>
                  </div>
                  <div style="font-size: 0.8125rem; color: var(--accent-violet);">University of Leipzig · Leipzig, DE</div>
                </div>
                <div style="padding-top: 1.25rem; border-top: 1px solid var(--border);">
                  <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
                    <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">B.Sc. Business Informatics</div>
                    <div style="font-size: 0.75rem; color: var(--accent-magenta); flex-shrink: 0;">2017 — 2020</div>
                  </div>
                  <div style="font-size: 0.8125rem; color: var(--accent-violet);">Berufsakademie Rhein-Main · Frankfurt, DE</div>
                </div>
              </div>
            </div>

            <div>
              <div style="font-size: 0.75rem; color: var(--accent-violet); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border);">
                Skills
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                {[
                  { label: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'Java'] },
                  { label: 'ML / AI',   items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'Transformers', 'LangChain', 'Ollama'] },
                  { label: 'Web',       items: ['React', 'Next.js', 'Astro', 'FastAPI', 'Spring Boot', 'Node.js', 'Express'] },
                  { label: 'Data',      items: ['PostgreSQL', 'MongoDB', 'pgvector', 'InfluxDB'] },
                  { label: 'DevOps',    items: ['Docker', 'Kubernetes', 'AWS', 'GitHub Actions', 'MLflow'] },
                ].map(({ label, items }) => (
                  <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                    <span style="font-size: 0.75rem; color: var(--text-muted); min-width: 5.5rem; padding-top: 0.15rem;">{label}</span>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
                      {items.map(t => (
                        <span style="font-size: 0.7rem; color: var(--text-secondary); background: var(--bg-surface); border: 1px solid var(--border); border-radius: 3px; padding: 0.1rem 0.45rem;">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </TerminalCard>
      </div>

      <!-- Hardware / Software / Tech-stack -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 2rem;" class="stack-grid">
        <TerminalCard filename="hardware.py">
          <div style="padding: 1.25rem;">
            <div style="font-size: 0.75rem; color: var(--accent-violet); margin-bottom: 0.875rem; letter-spacing: 0.05em;"># HARDWARE</div>
            <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
              {[
                'Machine: MacBook Pro M3 14-inch',
                'Monitor: LG 27UK850 4K',
                'Keyboard: Keychron Q1',
                'Mouse: Logitech MX Master 3',
              ].map(item => (
                <li style="font-size: 0.8125rem; color: var(--text-secondary); display: flex; gap: 0.5rem;">
                  <span style="color: var(--accent-magenta);">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </TerminalCard>

        <TerminalCard filename="software.sh">
          <div style="padding: 1.25rem;">
            <div style="font-size: 0.75rem; color: var(--accent-violet); margin-bottom: 0.875rem; letter-spacing: 0.05em;"># SOFTWARE</div>
            <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
              {[
                'OS: Arch Linux / macOS',
                'Editor: Neovim + lazy.nvim',
                'Terminal: Alacritty + tmux',
                'Shell: zsh + starship',
              ].map(item => (
                <li style="font-size: 0.8125rem; color: var(--text-secondary); display: flex; gap: 0.5rem;">
                  <span style="color: var(--accent-magenta);">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </TerminalCard>

        <TerminalCard filename="tech-stack.ts">
          <div style="padding: 1.25rem;">
            <div style="font-size: 0.75rem; color: var(--accent-violet); margin-bottom: 0.875rem; letter-spacing: 0.05em;"># TECH STACK</div>
            <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
              {[
                'Languages: Python, TypeScript, Java',
                'ML: scikit-learn, PyTorch, LangChain',
                'Web: Astro, React, FastAPI',
                'Infra: Docker, Netlify, PostgreSQL',
              ].map(item => (
                <li style="font-size: 0.8125rem; color: var(--text-secondary); display: flex; gap: 0.5rem;">
                  <span style="color: var(--accent-magenta);">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </TerminalCard>
      </div>

    </div>
  </section>

  <!-- ═══════════════════════════════════════ SKILLS ═════════════════════════════════════ -->
  <section id="skills" style="padding: 5rem 1rem;">
    <div style="max-width: 80rem; margin: 0 auto;">
      <div class="section-heading">// skills</div>
      <SkillsCloud />
    </div>
  </section>

  <!-- ═══════════════════════════════════════ PROJECTS ══════════════════════════════════ -->
  <section id="projects" style="padding: 5rem 1rem;">
    <div style="max-width: 80rem; margin: 0 auto;">
      <div class="section-heading">// projects</div>

      <!-- Filter buttons -->
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; margin-bottom: 2.5rem; font-family: inherit;" id="project-filters">
        <button class="filter-btn" data-filter="all"
          style="border: 1px solid var(--accent-emerald); color: var(--accent-emerald); background: transparent; font-family: inherit; font-size: 0.8125rem; padding: 0.4rem 1rem; border-radius: 3px; cursor: pointer;">
          <span style="color: var(--text-muted);">./</span>all
        </button>
        <button class="filter-btn" data-filter="ML"
          style="border: 1px solid var(--border); color: var(--text-muted); background: transparent; font-family: inherit; font-size: 0.8125rem; padding: 0.4rem 1rem; border-radius: 3px; cursor: pointer;">
          <span style="color: var(--text-muted);">./</span>machine_learning
        </button>
        <button class="filter-btn" data-filter="WebDev"
          style="border: 1px solid var(--border); color: var(--text-muted); background: transparent; font-family: inherit; font-size: 0.8125rem; padding: 0.4rem 1rem; border-radius: 3px; cursor: pointer;">
          <span style="color: var(--text-muted);">./</span>web_development
        </button>
      </div>

      <!-- Projects grid -->
      <div class="projects-grid" id="projects-grid">
        {allProjects.map((project) => (
          <div class="project-item" data-category={project.category}>
            <ProjectCard project={project} client:load />
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════ CONTACT ═══════════════════════════════════ -->
  <section id="contact" style="padding: 5rem 1rem;">
    <div style="max-width: 40rem; margin: 0 auto;">
      <div class="section-heading">// contact</div>
      <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">
        # Get in touch for opportunities, collaborations, or just to say hello
      </p>
      <TerminalCard filename="contact.sh">
        <div style="padding: 1.5rem;">
          <ContactForm client:load />
        </div>
      </TerminalCard>
    </div>
  </section>

  <!-- Floating AI chat widget -->
  <ChatWidget client:load />

</BaseLayout>

<style>
  .section-heading {
    font-size: clamp(1rem, 3vw, 1.5rem);
    color: var(--accent-magenta);
    font-weight: 600;
    text-align: center;
    margin-bottom: 2rem;
  }

  .stack-grid {
    grid-template-columns: 1fr;
  }
  @media (min-width: 640px) {
    .stack-grid {
      grid-template-columns: repeat(3, 1fr) !important;
    }
  }

  .projects-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  @media (min-width: 768px) {
    .projects-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .projects-grid { grid-template-columns: repeat(3, 1fr); }
  }
</style>

<script>
  // ── Project filter ──────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll<HTMLElement>('.filter-btn');
    const projectItems = document.querySelectorAll<HTMLElement>('.project-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach(b => {
          b.style.borderColor = 'var(--border)';
          b.style.color = 'var(--text-muted)';
        });
        btn.style.borderColor = 'var(--accent-emerald)';
        btn.style.color = 'var(--accent-emerald)';

        projectItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
</script>
```

- [ ] Run type check:
  ```bash
  npm run astro -- check
  ```
  Expected: 0 errors.

- [ ] Open `http://localhost:4321` in browser, scroll through all sections and confirm:
  - Hero renders with LossLandscape background
  - About section shows bio, timeline, education, hardware/software/tech cards
  - Skills section shows floating icon cloud
  - Projects section shows all 7 projects with working filter buttons
  - Contact section shows the form

- [ ] Commit:
  ```bash
  git add src/pages/index.astro
  git commit -m "feat: consolidate all sections into single-page index.astro"
  ```

---

## Task 4: Update Navigation to anchor scroll links + scroll-spy

**Files:**
- Modify: `src/components/Navigation.astro`

Replace the page-link nav with anchor links. Add an `IntersectionObserver` scroll-spy that highlights the active nav item. Mobile menu closes on anchor link click.

- [ ] Replace `src/components/Navigation.astro` with:

```astro
---
import ThemeToggle from './ThemeToggle';

const navItems = [
  { label: '/home',     href: '/#hero' },
  { label: '/about',    href: '/#about' },
  { label: '/skills',   href: '/#skills' },
  { label: '/projects', href: '/#projects' },
  { label: '/contact',  href: '/#contact' },
];
---

<nav style="position: sticky; top: 0; z-index: 50; background: var(--bg-surface); border-bottom: 1px solid var(--border);">
  <div style="max-width: 80rem; margin: 0 auto; padding: 0 1.5rem; display: flex; align-items: center; justify-content: space-between; height: 48px;">

    <!-- Terminal prompt (left) -->
    <a href="/" style="font-size: 0.875rem; text-decoration: none; display: flex; align-items: center; gap: 4px; color: var(--accent-magenta);">
      <span style="color: var(--accent-violet);">❯</span>
      <span> kevin</span><span style="color: var(--accent-magenta);">@</span><span>portfolio</span><span style="color: var(--text-muted);">:~$</span>
    </a>

    <!-- Desktop links (right) -->
    <div class="nav-desktop" style="display: flex; align-items: center; gap: 24px;">
      {navItems.map((item) => (
        <a
          href={item.href}
          data-nav-href={item.href}
          class="nav-link"
          style="font-size: 0.8125rem; text-decoration: none; color: var(--text-muted); transition: color 0.2s;"
        >
          {item.label}
        </a>
      ))}
      <ThemeToggle client:load />
    </div>

    <!-- Mobile hamburger -->
    <button
      id="mobile-menu-button"
      type="button"
      aria-controls="mobile-menu"
      aria-expanded="false"
      style="display: none; background: transparent; border: 1px solid var(--border); border-radius: 4px; padding: 6px; cursor: pointer; color: var(--text-muted);"
      class="nav-mobile-btn"
    >
      <span class="sr-only">Open main menu</span>
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  <!-- Mobile menu -->
  <div
    id="mobile-menu"
    style="display: none; background: var(--bg-surface); border-top: 1px solid var(--border); padding: 12px 24px 16px;"
  >
    {navItems.map((item) => (
      <a
        href={item.href}
        data-nav-href={item.href}
        class="nav-link mobile-nav-link"
        style="display: block; padding: 8px 0; font-size: 0.875rem; text-decoration: none; color: var(--text-muted); border-bottom: 1px solid var(--border);"
      >
        <span style="color: var(--accent-violet);">$</span> cd {item.label}
      </a>
    ))}
    <div style="margin-top: 12px;">
      <ThemeToggle client:load />
    </div>
  </div>
</nav>

<style>
  @media (max-width: 768px) {
    .nav-desktop { display: none !important; }
    .nav-mobile-btn { display: flex !important; }
  }
</style>

<script>
  // ── Mobile menu toggle ──────────────────────────────────────────────────────
  const button = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');

  if (button && menu) {
    button.addEventListener('click', () => {
      const isOpen = menu.style.display === 'block';
      menu.style.display = isOpen ? 'none' : 'block';
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  // Close mobile menu when an anchor link is clicked
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (menu) menu.style.display = 'none';
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Scroll-spy via IntersectionObserver ────────────────────────────────────
  const sectionIds = ['hero', 'about', 'skills', 'projects', 'contact'];

  function setActive(sectionId: string) {
    const href = `/#${sectionId}`;
    document.querySelectorAll<HTMLElement>('.nav-link').forEach(link => {
      const isActive = link.getAttribute('data-nav-href') === href;
      link.style.color = isActive ? 'var(--accent-magenta)' : 'var(--text-muted)';
    });
  }

  // Set hero active on load
  setActive('hero');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
</script>
```

- [ ] Run type check:
  ```bash
  npm run astro -- check
  ```
  Expected: 0 errors.

- [ ] Verify in browser:
  - All nav links scroll to correct sections
  - Active nav item changes as you scroll
  - Mobile menu closes when a link is tapped

- [ ] Commit:
  ```bash
  git add src/components/Navigation.astro
  git commit -m "feat: replace page nav with anchor scroll links and IntersectionObserver scroll-spy"
  ```

---

## Task 5: Delete old pages

**Files:**
- Delete: `src/pages/about.astro`
- Delete: `src/pages/projects.astro`
- Delete: `src/pages/contact.astro`

- [ ] Delete the three files:
  ```bash
  rm src/pages/about.astro src/pages/projects.astro src/pages/contact.astro
  ```

- [ ] Run type check and build to confirm nothing references the deleted pages:
  ```bash
  npm run astro -- check && npm run build
  ```
  Expected: 0 errors, build succeeds.

- [ ] Commit:
  ```bash
  git add -A
  git commit -m "chore: delete migrated pages (about, projects, contact)"
  ```

---

## Task 6: Final verification

- [ ] Run full type check:
  ```bash
  npm run astro -- check
  ```
  Expected: 0 errors.

- [ ] Run production build:
  ```bash
  npm run build
  ```
  Expected: build completes without errors.

- [ ] Preview production build:
  ```bash
  npm run preview
  ```
  Manually verify:
  - All 5 sections present and scrollable
  - Floating icon cloud animates
  - Filter buttons work (emerald active state)
  - Dark/light mode toggle works, cloud adapts
  - Navigation scroll-spy highlights correct section
  - Contact form visible and interactive
  - AI chat widget floats in bottom-right corner
  - No broken links to deleted pages

- [ ] Commit (if any final tweaks were made):
  ```bash
  git add -A
  git commit -m "chore: final cleanup after single-page restructure"
  ```
