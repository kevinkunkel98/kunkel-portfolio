# Design Overhaul Spec
**Date:** 2026-04-01  
**Branch:** blog-content → new branch `design-overhaul`

## Goal

Redesign the portfolio with solid colors (no transparency/blur), a light/dark theme toggle, unified terminal-window component motif, and a more professional-but-eccentric personality. The terminal/hacker aesthetic is kept and strengthened — just cleaner and more intentional.

---

## Color System

### Dark Mode (default)

| Token | Value | Use |
|---|---|---|
| `bg-base` | `#0d0d1a` | Page background |
| `bg-surface` | `#110d26` | Cards, nav, raised surfaces |
| `bg-elevated` | `#1a1033` | Terminal window headers |
| `border` | `#2d1a5e` | Dividers, card outlines |
| `accent-violet` | `#7c3aed` | Primary accent, buttons, active states |
| `accent-magenta` | `#e879f9` | Secondary accent, highlights, hover |
| `text-primary` | `#f0abfc` | Headings |
| `text-secondary` | `#c4b5fd` | Body text |
| `text-muted` | `#a78bfa` | Labels, metadata |

### Light Mode (toggled)

| Token | Value | Use |
|---|---|---|
| `bg-base` | `#fdf4ff` | Page background (pink-purple tint) |
| `bg-surface` | `#fae8ff` | Cards, nav |
| `bg-elevated` | `#e9d5ff` | Terminal window headers |
| `border` | `#d8b4fe` | Dividers |
| `accent-violet` | `#7c3aed` | Same as dark — consistent |
| `accent-magenta` | `#a21caf` | Darker for contrast on light bg |
| `text-primary` | `#1e1b4b` | Deep indigo headings |
| `text-secondary` | `#3b0764` | Body text |
| `text-muted` | `#6b21a8` | Labels, metadata |

Colors defined as CSS custom properties in `global.css`, switched via the `.dark` class on `<html>`.

---

## Typography

- Single font: monospace (`font-mono`) everywhere — headings, body, labels, all of it.
- Headings: heavier weight + larger size only, same font family.
- Section eyebrow labels use `// comment` style (e.g. `// ml-projects`, `// about-me`).
- List bullets and hero decorations use terminal prompt characters (`❯`, `$`, `▶`).
- Blog prose: `@tailwindcss/typography` retained but colors overridden to match the purple palette.

---

## Background Treatment

- Base: solid `bg-base` color.
- Texture: very faint CRT scanline overlay using `repeating-linear-gradient` at ~4% opacity — no animation, no blur, no glow.
- **Remove entirely**: animated nebula, starfield, glassmorphism, all `backdrop-blur`, all semi-transparent overlays.
- Sections are separated by a 1px `border` line or a `// label` comment, not background color changes.

---

## Universal Component: Terminal Window Card

Applied to: project cards, blog post cards, contact form wrapper, content section boxes.

```
┌─ [●][●][●]  filename.ext  ──────────────────┐
│  card content                                │
└──────────────────────────────────────────────┘
```

- **Header strip**: solid `bg-elevated`, traffic-light dots (red/yellow/green), + filename relevant to content:
  - ML project → `model-name.py`
  - Web project → `project-name.tsx`
  - Blog post → `post-slug.md`
  - Contact page → `contact.sh`
- **Body**: solid `bg-surface`, no transparency.
- **Border**: 1px solid `border`, `border-radius: 6px`.
- **Hover state**: border shifts to `accent-violet`, no shadow.

---

## Navigation

Terminal prompt bar, sticky, full-width.

```
❯ kevin@portfolio:~$   /home  /projects  /blog  /contact   [☀/☾]
```

- Background: solid `bg-surface`, 1px bottom border (`border` color).
- Left: terminal prompt — `❯ kevin@portfolio:~$` in `accent-magenta` / `accent-violet`.
- Links: path-style (`/home`, `/projects`, etc.), active link in `accent-magenta`.
- Right: `ThemeToggle` — small bordered button `[☀/☾]`.
- Mobile: hamburger → full-width dropdown styled as a terminal menu.

---

## Theme Toggle

- **Storage**: `localStorage` key `theme`, defaults to `"dark"`.
- **Mechanism**: Tailwind `darkMode: 'class'` — toggle adds/removes `dark` on `<html>`.
- **Component**: `ThemeToggle.tsx` (React island, `client:load`) placed in `Navigation.astro`.
- **No flash**: inline `<script>` in `Layout.astro` `<head>` reads localStorage and sets `dark` class before first paint.

---

## Page Changes

### All Pages
- Remove: nebula animation, starfield, all `backdrop-blur`, gradient backgrounds.
- Add: CRT scanline texture on body.
- Nav replaced with terminal prompt style + ThemeToggle.
- Footer restyled as terminal status bar (same prompt aesthetic as nav).

### Home (`index.astro`)
- Hero: terminal window card with a typed/static intro text.
- Skills section cards: terminal window treatment.
- Remove: current floating gradient hero background.

### Projects (`projects.astro`)
- Each project card: terminal window with appropriate filename in header.
- Category labels: `// ml-projects` and `// web-projects` as section dividers.

### Blog Index (`blog/index.astro`)
- Post list cards: terminal window with `.md` filename.

### Blog Post (`blog/[slug].astro`)
- Entire article wrapped in a terminal window component.
- Prose content uses `@tailwindcss/typography` with purple palette overrides.

### Contact (`contact.astro`)
- Page content wrapped in a terminal window with `contact.sh` filename.

### Footer
- Restyled as a one-line terminal status bar mirroring the nav prompt style.

---

## Files to Create / Modify

| File | Action |
|---|---|
| `src/styles/global.css` | Define CSS custom properties for both color modes; add CRT scanline background; remove old gradient/animation rules |
| `src/layouts/Layout.astro` | Add no-flash theme script in `<head>` |
| `src/components/Navigation.astro` | Rewrite to terminal prompt style; import ThemeToggle |
| `src/components/ThemeToggle.tsx` | New React island — reads/writes localStorage, toggles `dark` on `<html>` |
| `src/components/TerminalCard.astro` | New reusable component — terminal window chrome (header with dots + filename slot, body slot) |
| `src/components/Footer.astro` | Rewrite as terminal status bar |
| `src/pages/index.astro` | Remove nebula/animations; wrap sections in TerminalCard |
| `src/pages/projects.astro` | Wrap project cards in TerminalCard with appropriate filenames |
| `src/pages/blog/index.astro` | Wrap post cards in TerminalCard |
| `src/pages/blog/[slug].astro` | Wrap article in TerminalCard; override typography colors |
| `src/pages/contact.astro` | Wrap in TerminalCard with `contact.sh` |
| `src/styles/global.css` (Tailwind v4) | Add `@variant dark (&:where(.dark, .dark *));` to enable class-based dark mode |
