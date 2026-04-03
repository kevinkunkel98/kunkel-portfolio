# Experience Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat experience list on the About page with a vertical alternating-card timeline component.

**Architecture:** Create `src/components/ExperienceTimeline.astro` containing inline experience data, timeline markup, and scoped CSS. Update `src/pages/about.astro` to remove the experience block from inside `TerminalCard filename="cv.md"` and render `<ExperienceTimeline />` in its place above the remaining Education + Skills card.

**Tech Stack:** Astro 5, CSS custom properties (design tokens), no new dependencies.

**Spec:** `docs/superpowers/specs/2026-04-03-experience-timeline-design.md`

---

### Task 1: Create `ExperienceTimeline.astro` with data and structure

**Files:**
- Create: `src/components/ExperienceTimeline.astro`

- [ ] **Step 1: Create the component file with typed data and static markup**

Create `src/components/ExperienceTimeline.astro` with the following complete content:

```astro
---
interface ExperienceEntry {
  role: string;
  company: string;
  initials: string;
  period: string;
  description: string;
  tags: string[];
}

const entries: ExperienceEntry[] = [
  {
    role: 'AI Engineer',
    company: 'Exxeta AG · Leipzig, DE',
    initials: 'EX',
    period: '2025 — present',
    description: 'Building and deploying internal AI tooling — LLM gateways, OpenWebUI integrations, and infrastructure for multi-model access across teams.',
    tags: ['FastAPI', 'OpenWebUI', 'LiteLLM', 'Keycloak', 'Kubernetes'],
  },
  {
    role: 'Fullstack Developer',
    company: 'Exxeta AG · Leipzig, DE',
    initials: 'EX',
    period: '2024 — 2025',
    description: 'Full-stack development on client-facing applications. Backend APIs in Spring Boot and FastAPI, React frontends, containerised deployments on AWS.',
    tags: ['Spring Boot', 'FastAPI', 'React', 'Docker', 'AWS'],
  },
  {
    role: 'Junior Consultant',
    company: 'M&L AG · Frankfurt, DE',
    initials: 'ML',
    period: '2020 — 2021',
    description: 'Geospatial data analysis and Python automation for logistics clients. Built tooling to process and visualise GIS datasets.',
    tags: ['Python', 'GIS'],
  },
  {
    role: 'Fullstack Developer',
    company: 'M&L AG · Frankfurt, DE',
    initials: 'ML',
    period: '2017 — 2019',
    description: 'Dual-study position alongside B.Sc. Built internal web tools with Spring Boot backends, Bootstrap frontends, and MySQL databases in Docker.',
    tags: ['Spring Boot', 'Bootstrap', 'Docker', 'MySQL'],
  },
];
---

<section class="experience-timeline">
  <div class="timeline-heading">// experience</div>

  <div class="timeline-list">
    {entries.map((entry, i) => {
      const isEven = i % 2 === 0;
      return (
        <div class={`timeline-row ${isEven ? 'row-left' : 'row-right'}`}>
          <!-- Left slot: card (even) or spacer (odd) -->
          <div class="slot slot-left">
            {isEven && (
              <div class="card card-left">
                <div class="card-role">{entry.role}</div>
                <div class="card-company">{entry.company}</div>
                <div class="card-desc">{entry.description}</div>
                <div class="card-tags">
                  {entry.tags.map(t => <span class="tag">{t}</span>)}
                </div>
              </div>
            )}
          </div>

          <!-- Center spine -->
          <div class="spine">
            <div class="spine-line spine-line-top" />
            <div class="spine-circle">{entry.initials}</div>
            <div class="spine-line spine-line-bottom" />
            {isEven
              ? <div class="spine-date spine-date-right">{entry.period}</div>
              : <div class="spine-date spine-date-left">{entry.period}</div>
            }
          </div>

          <!-- Right slot: spacer (even) or card (odd) -->
          <div class="slot slot-right">
            {!isEven && (
              <div class="card card-right">
                <div class="card-role">{entry.role}</div>
                <div class="card-company">{entry.company}</div>
                <div class="card-desc">{entry.description}</div>
                <div class="card-tags">
                  {entry.tags.map(t => <span class="tag">{t}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
</section>

<style>
  .experience-timeline {
    margin-bottom: 2rem;
  }

  .timeline-heading {
    font-size: clamp(1rem, 3vw, 1.5rem);
    color: var(--accent-magenta);
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;
    font-weight: 600;
    text-align: center;
    margin-bottom: 2rem;
  }

  .timeline-list {
    display: flex;
    flex-direction: column;
  }

  /* ─── Row ─── */
  .timeline-row {
    display: grid;
    grid-template-columns: 1fr 80px 1fr;
    align-items: stretch;
    min-height: 140px;
  }

  /* ─── Slots ─── */
  .slot {
    padding: 1rem 0;
    display: flex;
    align-items: center;
  }
  .slot-left { justify-content: flex-end; padding-right: 1.25rem; }
  .slot-right { justify-content: flex-start; padding-left: 1.25rem; }

  /* ─── Card ─── */
  .card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    max-width: 380px;
    position: relative;
  }

  /* Notch pointing right (toward spine from left card) */
  .card-left::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -7px;
    transform: translateY(-50%) rotate(45deg);
    width: 12px;
    height: 12px;
    background: var(--bg-surface);
    border-top: 1px solid var(--border);
    border-right: 1px solid var(--border);
  }

  /* Notch pointing left (toward spine from right card) */
  .card-right::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -7px;
    transform: translateY(-50%) rotate(45deg);
    width: 12px;
    height: 12px;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    border-left: 1px solid var(--border);
  }

  .card-role {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.2rem;
  }

  .card-company {
    font-size: 0.8125rem;
    color: var(--accent-violet);
    margin-bottom: 0.6rem;
  }

  .card-desc {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 0.6rem;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .tag {
    font-size: 0.7rem;
    color: var(--accent-magenta);
    background: color-mix(in srgb, var(--accent-magenta) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent-magenta) 25%, transparent);
    border-radius: 3px;
    padding: 0.1rem 0.45rem;
  }

  /* ─── Spine ─── */
  .spine {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .spine-line {
    width: 2px;
    background: var(--border);
    flex: 1;
  }

  .spine-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--bg-elevated);
    border: 2px solid var(--accent-violet);
    color: var(--accent-violet);
    font-size: 0.6875rem;
    font-weight: 700;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    z-index: 1;
  }

  .spine-date {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.75rem;
    color: var(--text-muted);
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;
    white-space: nowrap;
  }

  .spine-date-right {
    left: calc(100% + 0.5rem);
  }

  .spine-date-left {
    right: calc(100% + 0.5rem);
    text-align: right;
  }

  /* ─── Mobile ─── */
  @media (max-width: 639px) {
    .timeline-row {
      grid-template-columns: 48px 1fr;
      grid-template-rows: auto;
    }

    .slot-left {
      display: none;
    }

    .slot-right {
      grid-column: 2;
      grid-row: 1;
      padding-left: 1rem;
      padding-right: 0;
      justify-content: stretch;
    }

    /* Show left-slot cards in the right slot on mobile */
    .row-left .slot-left {
      display: none;
    }

    .row-left .slot-right {
      display: flex;
    }

    /* For even rows, we need to move the card from left slot to right slot visually */
    .row-left .card-left {
      display: block;
    }

    .spine {
      grid-column: 1;
      grid-row: 1;
    }

    .spine-date-right,
    .spine-date-left {
      display: none;
    }

    .card-left::after,
    .card-right::after {
      display: none;
    }

    .card {
      max-width: 100%;
      width: 100%;
    }
  }
</style>
```

- [ ] **Step 2: Verify type check passes**

Run: `npm run astro -- check`
Expected: No errors. If errors appear, fix them before proceeding.

- [ ] **Step 3: Commit the new component**

```bash
git add src/components/ExperienceTimeline.astro
git commit -m "feat: add ExperienceTimeline component with alternating card layout"
```

---

### Task 2: Wire `ExperienceTimeline` into `about.astro`

**Files:**
- Modify: `src/pages/about.astro`

The current structure of the CV section in `about.astro` (lines 43–177) is:

```astro
<!-- CV Section -->
<div style="margin-bottom: 2rem;">
  <TerminalCard filename="cv.md">
    <div style="padding: 1.5rem;">
      <!-- Experience -->  ← remove this entire block (lines 48–121)
      <!-- Education -->   ← keep
      <!-- Skills -->      ← keep
    </div>
  </TerminalCard>
</div>
```

- [ ] **Step 1: Add the import for `ExperienceTimeline`**

In `src/pages/about.astro`, add the import in the frontmatter fence (after existing imports):

Old:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TerminalCard from '../components/TerminalCard.astro';
import ChatWidget from '../components/ChatWidget';
---
```

New:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TerminalCard from '../components/TerminalCard.astro';
import ExperienceTimeline from '../components/ExperienceTimeline.astro';
import ChatWidget from '../components/ChatWidget';
---
```

- [ ] **Step 2: Replace the CV section block**

Replace the entire CV section (the `<!-- CV Section -->` div, lines 43–177) with `<ExperienceTimeline />` followed by the condensed `TerminalCard` that holds only Education and Skills:

Old (lines 43–177):
```astro
    <!-- CV Section -->
    <div style="margin-bottom: 2rem;">
      <TerminalCard filename="cv.md">
        <div style="padding: 1.5rem;">

          <!-- Experience -->
          <div style="margin-bottom: 1.75rem;">
            <div style="font-size: 0.75rem; color: var(--accent-violet); font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border);">
              Experience
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.25rem;">

              <div class="cv-entry">
                <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
                  <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">AI Engineer</div>
                  <div style="font-size: 0.75rem; color: var(--accent-magenta); flex-shrink: 0; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;">2025 — present</div>
                </div>
                <div style="font-size: 0.8125rem; color: var(--accent-violet); margin-bottom: 0.4rem;">Exxeta AG · Leipzig, DE</div>
                <div style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.6;">
                  Building and deploying internal AI tooling — LLM gateways, OpenWebUI integrations, and infrastructure for multi-model access across teams.
                </div>
                <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.3rem;">
                  {['FastAPI', 'OpenWebUI', 'LiteLLM', 'Keycloak', 'Kubernetes'].map(t => (
                    <span style="font-size: 0.7rem; color: var(--accent-magenta); background: color-mix(in srgb, var(--accent-magenta) 10%, transparent); border: 1px solid color-mix(in srgb, var(--accent-magenta) 25%, transparent); border-radius: 3px; padding: 0.1rem 0.45rem;">{t}</span>
                  ))}
                </div>
              </div>

              <div class="cv-entry" style="padding-top: 1.25rem; border-top: 1px solid var(--border);">
                <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
                  <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">Fullstack Developer</div>
                  <div style="font-size: 0.75rem; color: var(--accent-magenta); flex-shrink: 0; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;">2024 — 2025</div>
                </div>
                <div style="font-size: 0.8125rem; color: var(--accent-violet); margin-bottom: 0.4rem;">Exxeta AG · Leipzig, DE</div>
                <div style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.6;">
                  Full-stack development on client-facing applications. Backend APIs in Spring Boot and FastAPI, React frontends, containerised deployments on AWS.
                </div>
                <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.3rem;">
                  {['Spring Boot', 'FastAPI', 'React', 'Docker', 'AWS'].map(t => (
                    <span style="font-size: 0.7rem; color: var(--accent-magenta); background: color-mix(in srgb, var(--accent-magenta) 10%, transparent); border: 1px solid color-mix(in srgb, var(--accent-magenta) 25%, transparent); border-radius: 3px; padding: 0.1rem 0.45rem;">{t}</span>
                  ))}
                </div>
              </div>

              <div class="cv-entry" style="padding-top: 1.25rem; border-top: 1px solid var(--border);">
                <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
                  <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">Junior Consultant</div>
                  <div style="font-size: 0.75rem; color: var(--accent-magenta); flex-shrink: 0; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;">2020 — 2021</div>
                </div>
                <div style="font-size: 0.8125rem; color: var(--accent-violet); margin-bottom: 0.4rem;">M&amp;L AG · Frankfurt, DE</div>
                <div style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.6;">
                  Geospatial data analysis and Python automation for logistics clients. Built tooling to process and visualise GIS datasets.
                </div>
                <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.3rem;">
                  {['Python', 'GIS'].map(t => (
                    <span style="font-size: 0.7rem; color: var(--accent-magenta); background: color-mix(in srgb, var(--accent-magenta) 10%, transparent); border: 1px solid color-mix(in srgb, var(--accent-magenta) 25%, transparent); border-radius: 3px; padding: 0.1rem 0.45rem;">{t}</span>
                  ))}
                </div>
              </div>

              <div class="cv-entry" style="padding-top: 1.25rem; border-top: 1px solid var(--border);">
                <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
                  <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">Fullstack Developer</div>
                  <div style="font-size: 0.75rem; color: var(--accent-magenta); flex-shrink: 0; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;">2017 — 2019</div>
                </div>
                <div style="font-size: 0.8125rem; color: var(--accent-violet); margin-bottom: 0.4rem;">M&amp;L AG · Frankfurt, DE</div>
                <div style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.6;">
                  Dual-study position alongside B.Sc. Built internal web tools with Spring Boot backends, Bootstrap frontends, and MySQL databases in Docker.
                </div>
                <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.3rem;">
                  {['Spring Boot', 'Bootstrap', 'Docker', 'MySQL'].map(t => (
                    <span style="font-size: 0.7rem; color: var(--accent-magenta); background: color-mix(in srgb, var(--accent-magenta) 10%, transparent); border: 1px solid color-mix(in srgb, var(--accent-magenta) 25%, transparent); border-radius: 3px; padding: 0.1rem 0.45rem;">{t}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <!-- Education -->
          <div style="margin-bottom: 1.75rem;">
```

New (replace the entire CV Section div with):
```astro
    <!-- Experience Timeline -->
    <ExperienceTimeline />

    <!-- Education + Skills -->
    <div style="margin-bottom: 2rem;">
      <TerminalCard filename="cv.md">
        <div style="padding: 1.5rem;">

          <!-- Education -->
          <div style="margin-bottom: 1.75rem;">
```

And the closing of the TerminalCard at the end of the old CV Section (after Skills) stays as-is — just ensure the `</div></TerminalCard></div>` chain closes correctly after the Skills block.

- [ ] **Step 3: Verify the file renders correctly**

Run: `npm run astro -- check`
Expected: No errors.

Also run `npm run dev` and open `http://localhost:4321/about` in a browser to visually verify:
- Timeline renders with alternating left/right cards
- Spine line and initials circles visible
- Education and Skills sections still present below

- [ ] **Step 4: Commit the updated page**

```bash
git add src/pages/about.astro
git commit -m "feat: wire ExperienceTimeline into about page, remove flat experience list"
```

---

### Task 3: Fix mobile layout for even-indexed (left-side) entries

**Files:**
- Modify: `src/components/ExperienceTimeline.astro` (the `<style>` block)

The mobile layout collapses to single-column but even-indexed entries (1st, 3rd) have their card in `slot-left`, which is hidden on mobile. Those cards need to appear in the right-slot column on small screens.

- [ ] **Step 1: Replace the mobile CSS block in `ExperienceTimeline.astro`**

Find the `@media (max-width: 639px)` block and replace it entirely with:

```css
@media (max-width: 639px) {
  .timeline-row {
    grid-template-columns: 48px 1fr;
    position: relative;
    min-height: unset;
  }

  /* Spine takes column 1 on mobile */
  .spine {
    grid-column: 1;
    grid-row: 1;
  }

  /* Both slots go into column 2 */
  .slot-left,
  .slot-right {
    grid-column: 2;
    grid-row: 1;
    padding-left: 1rem;
    padding-right: 0;
    justify-content: stretch;
  }

  /* Left slot is visible on mobile (carries even-row cards) */
  .slot-left {
    display: flex;
  }

  .card {
    max-width: 100%;
    width: 100%;
  }

  /* Remove directional notches on mobile */
  .card-left::after,
  .card-right::after {
    display: none;
  }

  /* Hide date labels from spine on mobile (date is in the card context) */
  .spine-date {
    display: none;
  }
}
```

- [ ] **Step 2: Add mobile date display inside each card**

Since the spine date labels are hidden on mobile, add the period visually inside each card on mobile by appending a date line to the card markup. The cleanest approach: add `data-period={entry.period}` to each `.card` div, then show it via a CSS-only `::before` on mobile with `content: attr(data-period)`.

In the card markup for both left and right cards, add `data-period={entry.period}`:

Left card (`.card.card-left`):
```astro
<div class="card card-left" data-period={entry.period}>
```

Right card (`.card.card-right`):
```astro
<div class="card card-right" data-period={entry.period}>
```

Add this CSS inside the `@media (max-width: 639px)` block:

```css
  .card::before {
    content: attr(data-period);
    display: block;
    font-size: 0.7rem;
    color: var(--text-muted);
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;
    margin-bottom: 0.4rem;
  }
```

- [ ] **Step 3: Verify type check and visual check**

Run: `npm run astro -- check`
Expected: No errors.

Visually verify mobile layout at ≤639px viewport width:
- All 4 entries visible, stacked single-column
- Spine on the left with circles
- Date shown inside each card at the top
- No directional notches

- [ ] **Step 4: Commit**

```bash
git add src/components/ExperienceTimeline.astro
git commit -m "fix: correct mobile layout for timeline — single-column with inline dates"
```

---

### Task 4: Final type check and smoke test

**Files:** None modified — verification only.

- [ ] **Step 1: Run full type check**

```bash
npm run astro -- check
```

Expected: zero errors, zero warnings.

- [ ] **Step 2: Build the project**

```bash
npm run build
```

Expected: Build completes successfully, `dist/` produced with no errors.

- [ ] **Step 3: Preview and confirm**

```bash
npm run preview
```

Open `http://localhost:4321/about` and confirm:
- `// experience` heading present
- 4 timeline entries with alternating left/right cards on desktop
- Spine line connects all entries
- Initials circles (EX, EX, ML, ML) on the spine
- Date labels beside circles
- Cards have directional notches
- Education and Skills still visible below in the `TerminalCard`
- Hardware/Software/Stack grid still visible below that

- [ ] **Step 4: Final commit (if any last tweaks were made)**

```bash
git add -A
git commit -m "chore: final verification pass for experience timeline"
```
