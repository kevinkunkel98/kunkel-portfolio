# Project Cards Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing `ProjectCard.tsx` and vanilla-JS filter with a new `ProjectsSection.tsx` React component that renders hero-image cards with hover overlays, a click-to-expand modal, and React-managed ML/WebDev/All filtering.

**Architecture:** A new `ProjectsSection.tsx` component owns all state (`selectedProject`, `activeFilter`) and renders the filter buttons, card grid, and modal. `ProjectCard.tsx` is replaced with a stateless card that calls `onExpand` on click. `ProjectModal.tsx` is a new component that renders null when closed, handles Escape key and focus management. The existing vanilla-JS filter script and per-card `client:load` pattern in `index.astro` are replaced by a single `<ProjectsSection client:load />`.

**Tech Stack:** React 19, TypeScript strict, CSS custom properties (`var(--accent-violet)` etc.), skillicons.dev for tech icons, Astro 5

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/data/projects.ts` | Change `imageUrl: string` → `imageUrl?: string` |
| Replace | `src/components/ProjectCard.tsx` | Stateless hero card: image/gradient + hover overlay + footer icons |
| Create | `src/components/ProjectModal.tsx` | Full-detail modal: hero strip, about, stack chips, links, Escape/focus |
| Create | `src/components/ProjectsSection.tsx` | Owns filter + selectedProject state; renders grid + modal |
| Modify | `src/pages/index.astro` | Remove old grid + filter markup + JS script; add `<ProjectsSection client:load />` |

---

## Task 1: Make `imageUrl` optional in the data model

**Files:**
- Modify: `src/data/projects.ts`

- [ ] **Step 1: Edit the `Project` interface**

In `src/data/projects.ts`, change line 8:
```ts
// Before
imageUrl: string;

// After
imageUrl?: string;
```

- [ ] **Step 2: Type-check**

```bash
npm run astro -- check
```

Expected: 0 errors, 0 warnings. (All 9 projects still have `imageUrl` set so no data changes needed.)

- [ ] **Step 3: Commit**

```bash
git add src/data/projects.ts
git commit -m "feat: make Project.imageUrl optional for gradient fallback"
```

---

## Task 2: Build `ProjectCard.tsx` (replace existing)

**Files:**
- Replace: `src/components/ProjectCard.tsx`

The known skillicons.dev slugs for this project's tech strings are:
`python`, `pytorch`, `fastapi`, `react`, `docker`, `nodejs`, `express`, `mongodb`, `flask`, `astro`, `tailwind`, `opencv`, `sklearn` (maps to `scikitlearn`).

Everything else (`spotify-api`, `sentence-transformers`, `litellm`, `librechat`, `shadcn-ui`, `pgvector`, `socket-io`, `flowbite`, `kaggle`, `three.js`, `random-forest`, `spring-ai`, `yolov8`, `ollama`, `langchain`, `chromadb`, `bootstrap`) is silently skipped.

- [ ] **Step 1: Write the new `ProjectCard.tsx`**

Replace the entire file with:

```tsx
import { useRef } from 'react';
import type { Project } from '../data/projects';

// Slugs that exist on skillicons.dev — everything else is skipped silently
const SKILL_ICON_SLUGS = new Set([
  'python', 'pytorch', 'fastapi', 'react', 'docker',
  'nodejs', 'express', 'mongodb', 'flask', 'astro',
  'tailwind', 'opencv', 'sklearn',
]);

// Normalize project tech strings to skillicons slugs
function toSkillSlug(tech: string): string | null {
  const normalized = tech.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (normalized === 'scikitlearn' || normalized === 'sklearn') return 'sklearn';
  if (normalized === 'nodejs' || normalized === 'node') return 'nodejs';
  if (SKILL_ICON_SLUGS.has(normalized)) return normalized;
  return null;
}

interface Props {
  project: Project;
  onExpand: (project: Project, el: HTMLElement) => void;
}

export default function ProjectCard({ project, onExpand }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const icons = project.technologies
    .map(toSkillSlug)
    .filter((s): s is string => s !== null)
    .slice(0, 4);

  const isML = project.category === 'ML';
  const badgeColor = isML ? 'var(--accent-violet)' : 'var(--accent-magenta)';
  const badgeBg = isML ? 'rgba(124,58,237,0.15)' : 'rgba(192,38,211,0.15)';
  const badgeBorder = isML ? 'rgba(124,58,237,0.4)' : 'rgba(192,38,211,0.4)';

  // First sentence of description for the hover excerpt
  const excerpt = project.description.split(/[.!?]/)[0] + '.';

  return (
    <div
      ref={cardRef}
      className="proj-card"
      role="button"
      aria-label={`Expand ${project.title}`}
      tabIndex={0}
      onClick={() => onExpand(project, cardRef.current!)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onExpand(project, cardRef.current!); } }}
    >
      {/* Image / gradient area */}
      <div className="proj-card-image">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt="" className="proj-card-img" />
        ) : (
          <div className="proj-card-gradient">
            <span className="proj-card-glyph">{'{ }'}</span>
          </div>
        )}

        {/* Category badge */}
        <span
          className="proj-card-badge"
          style={{ color: badgeColor, background: badgeBg, border: `1px solid ${badgeBorder}` }}
        >
          {project.category}
        </span>

        {/* Hover overlay */}
        <div className="proj-card-overlay">
          <p className="proj-card-excerpt">{excerpt}</p>
          <div className="proj-card-overlay-links">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="proj-card-link"
              >
                GitHub
              </a>
            )}
            <button className="proj-card-link" onClick={(e) => { e.stopPropagation(); onExpand(project, cardRef.current!); }}>
              Expand ↗
            </button>
          </div>
        </div>

        <span className="proj-card-expand-hint">click to expand</span>
      </div>

      {/* Footer */}
      <div className="proj-card-footer">
        <span className="proj-card-title">{project.title}</span>
        <div className="proj-card-icons">
          {icons.map((slug) => (
            <img
              key={slug}
              src={`https://skillicons.dev/icons?i=${slug}`}
              alt={slug}
              width={16}
              height={16}
              className="proj-card-icon"
            />
          ))}
        </div>
      </div>

      <style>{`
        .proj-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace;
          display: flex;
          flex-direction: column;
        }
        .proj-card:hover,
        .proj-card:focus-visible {
          border-color: var(--accent-violet);
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(124,58,237,0.25);
          outline: none;
        }
        .proj-card:focus-visible {
          outline: 2px solid var(--accent-violet);
          outline-offset: 2px;
        }

        /* Image area */
        .proj-card-image {
          position: relative;
          height: 160px;
          overflow: hidden;
          background: #0a0a12;
          flex-shrink: 0;
        }
        .proj-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.7;
          transition: opacity 0.3s ease, transform 0.3s ease;
          display: block;
        }
        .proj-card:hover .proj-card-img {
          opacity: 0.3;
          transform: scale(1.04);
        }
        .proj-card-gradient {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a0a2e 0%, #0d0d1f 60%, #1a0a15 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .proj-card-glyph {
          font-size: 2rem;
          color: var(--text-primary);
          opacity: 0.12;
        }

        /* Badge */
        .proj-card-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          border-radius: 3px;
          padding: 2px 7px;
          font-family: inherit;
        }

        /* Hover overlay */
        .proj-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10,10,18,0.92);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 16px;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .proj-card:hover .proj-card-overlay {
          opacity: 1;
        }
        .proj-card-excerpt {
          font-size: 11px;
          color: #ccc;
          line-height: 1.6;
          margin: 0 0 12px 0;
        }
        .proj-card-overlay-links {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .proj-card-link {
          font-size: 10px;
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid var(--accent-violet);
          color: var(--accent-violet);
          text-decoration: none;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
        }
        .proj-card-link:hover {
          background: rgba(124,58,237,0.2);
        }

        /* Expand hint */
        .proj-card-expand-hint {
          position: absolute;
          bottom: 8px;
          right: 10px;
          font-size: 9px;
          color: var(--accent-violet);
          opacity: 0;
          transition: opacity 0.25s ease;
          letter-spacing: 1px;
          text-transform: uppercase;
          pointer-events: none;
        }
        .proj-card:hover .proj-card-expand-hint {
          opacity: 1;
        }

        /* Footer */
        .proj-card-footer {
          padding: 10px 14px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-shrink: 0;
        }
        .proj-card-title {
          font-size: 12px;
          color: var(--text-primary);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }
        .proj-card-icons {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }
        .proj-card-icon {
          border-radius: 2px;
          display: block;
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npm run astro -- check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectCard.tsx
git commit -m "feat: replace ProjectCard with hero-image card + hover overlay"
```

---

## Task 3: Build `ProjectModal.tsx` (new)

**Files:**
- Create: `src/components/ProjectModal.tsx`

- [ ] **Step 1: Create `ProjectModal.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import type { Project } from '../data/projects';

interface Props {
  project: Project | null;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export default function ProjectModal({ project, onClose, triggerRef }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus management: move focus in on open, return it on close
  useEffect(() => {
    if (project) {
      closeButtonRef.current?.focus();
    } else {
      (triggerRef?.current as HTMLElement | null)?.focus();
    }
  }, [project]);

  // Escape key + body scroll lock + focus trap
  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      // Focus trap: keep Tab/Shift+Tab inside the modal panel
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('disabled'));
        if (focusable.length === 0) { e.preventDefault(); return; }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  const isML = project.category === 'ML';
  const badgeColor = isML ? 'var(--accent-violet)' : 'var(--accent-magenta)';
  const badgeBg = isML ? 'rgba(124,58,237,0.15)' : 'rgba(192,38,211,0.15)';
  const badgeBorder = isML ? 'rgba(124,58,237,0.4)' : 'rgba(192,38,211,0.4)';
  const hasLinks = project.githubUrl || project.liveUrl;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-modal="true"
      role="dialog"
      aria-label={project.title}
    >
      <div className="modal-panel" ref={panelRef}>
        {/* Hero strip */}
        <div className="modal-hero">
          {project.imageUrl ? (
            <img src={project.imageUrl} alt="" className="modal-hero-img" />
          ) : (
            <div className="modal-hero-gradient" />
          )}
          <div className="modal-hero-fade" />

          <span
            className="modal-badge"
            style={{ color: badgeColor, background: badgeBg, border: `1px solid ${badgeBorder}` }}
          >
            {project.category}
          </span>

          <button
            ref={closeButtonRef}
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>

          <div className="modal-hero-title">
            <h2 className="modal-title">{project.title}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="modal-label">// about</div>
          <p className="modal-description">{project.description}</p>

          <div className="modal-label">// stack</div>
          <div className="modal-chips">
            {project.technologies.map((tech) => (
              <span key={tech} className="modal-chip">{tech}</span>
            ))}
          </div>

          {hasLinks && (
            <div className="modal-footer">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-btn modal-btn-primary"
                >
                  GitHub →
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-btn"
                >
                  Live Demo ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(5,5,10,0.92);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: modal-fade-in 0.2s ease;
        }
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .modal-panel {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace;
          animation: modal-slide-up 0.2s ease;
        }
        @keyframes modal-slide-up {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        /* Hero */
        .modal-hero {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #0a0a12;
          flex-shrink: 0;
        }
        .modal-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.55;
          display: block;
        }
        .modal-hero-gradient {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a0a2e 0%, #0d0d1f 60%, #1a0a15 100%);
        }
        .modal-hero-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--bg-surface) 0%, transparent 60%);
        }
        .modal-badge {
          position: absolute;
          top: 12px;
          left: 14px;
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          border-radius: 3px;
          padding: 2px 7px;
        }
        .modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(0,0,0,0.6);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
          font-family: inherit;
        }
        .modal-close:hover {
          color: var(--text-primary);
          border-color: var(--accent-violet);
        }
        .modal-close:focus-visible {
          outline: 2px solid var(--accent-violet);
          outline-offset: 2px;
        }
        .modal-hero-title {
          position: absolute;
          bottom: 14px;
          left: 16px;
          right: 16px;
        }
        .modal-title {
          font-size: 1.2rem;
          color: var(--text-primary);
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.5px;
          line-height: 1.3;
        }

        /* Body */
        .modal-body {
          padding: 18px 20px 20px;
        }
        .modal-label {
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .modal-description {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0 0 18px 0;
        }
        .modal-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 20px;
        }
        .modal-chip {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 3px 9px;
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.3px;
        }
        .modal-footer {
          display: flex;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .modal-btn {
          display: inline-flex;
          align-items: center;
          padding: 7px 16px;
          border-radius: 5px;
          font-size: 11px;
          font-family: inherit;
          cursor: pointer;
          text-decoration: none;
          border: 1px solid var(--accent-violet);
          color: var(--accent-violet);
          background: transparent;
          transition: background 0.15s;
        }
        .modal-btn:hover {
          background: rgba(124,58,237,0.15);
        }
        .modal-btn-primary {
          background: var(--accent-violet);
          color: #fff;
        }
        .modal-btn-primary:hover {
          background: #6d28d9;
        }
        .modal-btn:focus-visible {
          outline: 2px solid var(--accent-violet);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npm run astro -- check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectModal.tsx
git commit -m "feat: add ProjectModal component with focus management and Escape handling"
```

---

## Task 4: Build `ProjectsSection.tsx` (new)

**Files:**
- Create: `src/components/ProjectsSection.tsx`

This component owns `selectedProject` and `activeFilter` state, renders the filter buttons, card grid, and modal. It replaces the existing per-card `ProjectCard client:load` pattern and the vanilla-JS filter script.

- [ ] **Step 1: Create `ProjectsSection.tsx`**

```tsx
import { useState, useRef } from 'react';
import { allProjects } from '../data/projects';
import type { Project } from '../data/projects';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

type Filter = 'All' | 'ML' | 'WebDev';

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const filtered = activeFilter === 'All'
    ? allProjects
    : allProjects.filter((p) => p.category === activeFilter);

  const filters: Filter[] = ['All', 'ML', 'WebDev'];
  const filterLabels: Record<Filter, string> = {
    All: './all',
    ML: './machine_learning',
    WebDev: './web_development',
  };

  function handleExpand(project: Project, el: HTMLElement) {
    triggerRef.current = el;
    setSelectedProject(project);
  }

  return (
    <>
      {/* Filter buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.75rem',
        marginBottom: '2.5rem',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
      }}>
        {filters.map((f) => {
          const active = f === activeFilter;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                border: `1px solid ${active ? 'var(--accent-violet)' : 'var(--border)'}`,
                color: active ? 'var(--accent-violet)' : 'var(--text-muted)',
                background: 'transparent',
                fontFamily: 'inherit',
                fontSize: '0.8125rem',
                padding: '0.4rem 1rem',
                borderRadius: '3px',
                cursor: 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>{filterLabels[f].split('/')[0] + '/'}</span>
              {filterLabels[f].split('/')[1]}
            </button>
          );
        })}
      </div>

      {/* Card grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
        gap: '1.5rem',
      }}>
        {filtered.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
            onExpand={(p, el) => handleExpand(p, el)}
          />
        ))}
      </div>

      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        triggerRef={triggerRef}
      />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npm run astro -- check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectsSection.tsx
git commit -m "feat: add ProjectsSection with React-managed filter and modal state"
```

---

## Task 5: Wire `ProjectsSection` into `index.astro`

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Update imports in `index.astro`**

In the frontmatter (`---` block) of `src/pages/index.astro`, make these two changes:

Add this line (after the existing imports):
```ts
import ProjectsSection from '../components/ProjectsSection';
```

Remove these two lines (they are currently on lines 7 and 10):
```ts
import ProjectCard from '../components/ProjectCard';
import { allProjects } from '../data/projects';
```

After this step `index.astro` will reference `ProjectCard` and `allProjects` in the markup below — that's fine, Step 2 immediately removes that markup. Do not run the type-check between Step 1 and Step 2.

- [ ] **Step 2: Replace the projects section markup**

Find the `<!-- ═══ PROJECTS ═══ -->` section (lines ~228–257). Replace the entire inner content of `<div style="max-width: 80rem; ...">` with:

```astro
<div style="max-width: 80rem; margin: 0 auto;">
  <div class="section-heading">// projects</div>
  <ProjectsSection client:load />
</div>
```

This removes:
- The `<div id="project-filters">` block with three `<button>` elements
- The `<div class="projects-grid" id="projects-grid">` block with the `allProjects.map(...)` loop

- [ ] **Step 3: Remove the vanilla-JS filter `<script>` block**

Delete the entire `<script>` block at the bottom of `index.astro` (lines ~322–349):
```js
// Remove this entire block:
<script>
  document.addEventListener('DOMContentLoaded', () => {
    ...
  });
</script>
```

Also remove the `.projects-grid` CSS rules from the `<style>` block (the grid is now managed by `ProjectsSection`):
```css
/* Remove these: */
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
```

- [ ] **Step 4: Type-check**

```bash
npm run astro -- check
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 5: Smoke test in dev server**

```bash
npm run dev
```

Open `http://localhost:4321`. Verify:
- Projects section renders all 9 cards in a grid
- Filter buttons change displayed cards
- Hovering a card shows the overlay + links
- Clicking a card opens the modal with correct title, description, stack chips
- GitHub / Live Demo buttons are correct (absent when not set)
- Pressing Escape closes the modal
- Clicking the backdrop closes the modal
- Focus returns to the card after closing

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: wire ProjectsSection into index.astro, remove vanilla-JS filter"
```

---

## Task 6: Final type-check and build verification

- [ ] **Step 1: Full type-check**

```bash
npm run astro -- check
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 3: Commit (if any build-triggered fixes needed)**

```bash
git add -A
git commit -m "fix: resolve any build-time issues"
```

Only create this commit if fixes were needed. Skip if build was clean.
