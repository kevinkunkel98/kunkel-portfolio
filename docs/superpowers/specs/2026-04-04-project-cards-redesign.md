# Project Cards Redesign

**Date:** 2026-04-04
**Status:** Approved

---

## Goal

Replace the existing generic project cards with a visually striking "hero image card + modal expand" pattern that fits the site's terminal/hacker aesthetic and excites every type of visitor.

---

## Approved Design

### Card (idle + hover)

- 2-column CSS grid, all 9 projects.
- Each card is a fixed-height tile (~160px image area + footer bar).
- **Image area:**
  - If `imageUrl` is set: render the screenshot at `object-fit: cover`, dimmed to ~70% opacity.
  - If no image (or as a fallback): render a dark CSS gradient (`linear-gradient(135deg, #1a0a2e, #0d0d1f, #1a0a15)`) with a faint `{ }` glyph centered.
  - A category badge (`ML` / `WebDev`) is pinned top-left in violet/magenta respectively.
- **Hover state** (CSS transition, no JS):
  - Image dims further + scales slightly (`transform: scale(1.04)`).
  - A dark overlay fades in showing: one-line description excerpt + "Expand ↗" button. A ghost "GitHub →" link is also shown only if `githubUrl` is set on the project; it is omitted otherwise.
  - Card border glows violet (`box-shadow: 0 8px 32px rgba(124,58,237,0.25)`), card lifts (`translateY(-3px)`).
  - A small "click to expand" hint appears bottom-right.
- **Footer bar** (always visible):
  - Project title (truncated with ellipsis if too long).
  - Up to 4 skillicons.dev icon images (16×16) right-aligned.
- Click anywhere on the card opens the modal.

### Modal

- Full-screen backdrop (`rgba(5,5,10,0.92)`) with a centered panel (max-width ~680px).
- **Hero strip** (200px tall): same image/gradient as card, title overlaid at bottom with a fade-up gradient. Category badge top-left. Close button (✕) top-right.
- **Body:**
  - `// about` label + full description text.
  - `// stack` label + plain-text monospace chips (no icons) — one chip per technology string from `projects.ts`.
  - Footer row with action buttons:
    - "GitHub →" (filled violet, primary) — only shown if `githubUrl` is set.
    - "Live Demo ↗" (ghost, violet border) — only shown if `liveUrl` is set.
    - If neither is set, the footer row is omitted.
- Close on: ✕ button click, backdrop click, or `Escape` key.

### Category filter

The existing ML / WebDev / All filter buttons above the grid are retained as-is (no redesign needed).

---

## Component Architecture

### `ProjectCard.tsx` (replace existing)

React component. Props:

```ts
interface Props {
  project: Project;
  onExpand: (project: Project) => void;
}
```

Renders the card tile. Calls `onExpand(project)` on click. All hover effects via CSS (no JS state needed for the card itself).

### `ProjectModal.tsx` (new)

React component. Props:

```ts
interface Props {
  project: Project | null;
  onClose: () => void;
}
```

Renders `null` when `project` is null. When project is set, renders the modal backdrop + panel. Handles `Escape` key via `useEffect`. Traps focus to the modal panel while open.

### `ProjectsSection.tsx` (new — replaces filter script + card grid)

A new React component that owns all interactivity for the projects section. This replaces the existing vanilla JS `<script>` block in `index.astro` that handles ML/WebDev/All filtering via `data-category` attribute toggling.

- Holds `selectedProject: Project | null` state and `activeFilter: 'All' | 'ML' | 'WebDev'` state.
- Renders the filter buttons, the card grid (passing `onExpand` to each `ProjectCard`), and `ProjectModal`.
- Mounted with `client:load` in `index.astro`, replacing the existing card grid markup and filter script.
- The existing vanilla JS filter `<script>` block in `index.astro` is removed.

---

## Styling

- Use CSS custom properties throughout: `--bg-surface`, `--bg-elevated`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent-violet`, `--accent-magenta`, `--border`.
- No Tailwind utility classes in the new components.
- Transitions: `0.2s ease` for hover lift/glow, `0.25s ease` for overlay fade-in, `0.2s ease` for modal backdrop fade.
- Modal uses `position: fixed` with `z-index: 50`.

---

## Tech Icon Rendering (card footer)

- Render up to 4 icons using `<img src="https://skillicons.dev/icons?i={slug}" width="16" height="16" />`.
- Technology strings in `projects.ts` that map directly to skillicons.dev slugs are used as-is.
- Strings that do NOT have a skillicons.dev equivalent (e.g. `spotify-api`, `sentence-transformers`, `random-forest`, `librechat`, `litellm`, `shadcn-ui`, `pgvector`, `socket-io`, `flowbite`, `kaggle`, `three.js`) are **skipped silently** — they do not render in the card footer. The 4-icon cap means only the most recognisable icons show anyway.
- In the modal stack chips: plain text only, no icons.

---

## Data Model Changes

The `imageUrl` field in the `Project` interface in `src/data/projects.ts` is currently typed as `string` (required). Change it to `string | undefined` (optional) so `ProjectCard` can treat a missing image as the gradient fallback case. All 9 existing projects already have an `imageUrl` set, so no data changes are needed — only the type definition.

---

## Accessibility

- Modal panel has `role="dialog"` and `aria-modal="true"`.
- Close button has `aria-label="Close"`.
- When modal opens, focus moves to the close button.
- When modal closes, focus returns to the card that opened it.
- Each card's root element has `aria-label="Expand {project.title}"` so screen readers announce its purpose.
- Cards have a visible `:focus-visible` ring (violet outline, matching the hover glow) for keyboard navigation.

---

## Responsive Layout

- 2-column grid at all widths ≥ 640px.
- Single-column below 640px.

---

## Out of Scope

- No individual project detail pages/routes.
- No animation library (Framer Motion etc.) — CSS transitions only.
- No image lazy-loading beyond what the browser provides natively.
- Placeholder image replacement (Moodsic, CA Analysis) is a separate task.
