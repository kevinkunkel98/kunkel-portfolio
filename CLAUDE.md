# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (localhost:4321)
npm run build     # Production build
npm run preview   # Preview production build locally
```

## Architecture

**Framework:** Astro 5 (static output) + React 19 (interactive islands) + Tailwind CSS 4 + TypeScript. Deployed to Netlify via `@astrojs/netlify`.

### Routing & Pages

File-based routing under `src/pages/`:
- `index.astro` — Hero, skills showcase
- `projects.astro` — Project data is hardcoded directly in this file (no CMS/collection); 7 projects split into ML and WebDev categories
- `blog/index.astro` — Lists all blog posts from the content collection
- `blog/[slug].astro` — Dynamic post renderer; reads frontmatter for metadata
- `contact.astro` — Uses Netlify Forms; the actual form logic lives in `ContactForm.tsx`

### Layouts

Two-layer layout system:
- `Layout.astro` — Base HTML shell: `<head>` with SEO, OpenGraph, favicon
- `BaseLayout.astro` — Wraps `Layout.astro` and adds `Navigation.astro` + `Footer.astro`

Most pages use `BaseLayout`. Use `Layout` directly only when you need full control of the page chrome.

### Components

- `.astro` components for static UI (Navigation, Footer, etc.)
- `.tsx` React components only where client-side interactivity is needed (`ProjectCard.tsx`, `ContactForm.tsx`). These use `client:load` or `client:visible` directives in the pages that import them.

### Content Collections

Blog posts live in `src/content/blog/` as Markdown files with frontmatter. The schema is defined in `src/content/config.ts`. Valid categories: `Machine Learning`, `Web Development`, `Tutorial`, `Linux`, `Theming`, `Terminal`, `Opinion`, `Development Tools`.

Frontmatter shape:
```markdown
---
title: ""
description: ""
pubDate: YYYY-MM-DD
category: "Machine Learning"
tags: ["tag1", "tag2"]
---
```

### Styling

- Tailwind CSS 4 via Vite plugin (no `tailwind.config.js` class scanning needed — uses CSS-first config)
- Global styles in `src/styles/global.css`
- Terminal/hacker aesthetic: green/blue palette, monospace font, dark-by-default
- Dark mode is class-based (`darkMode: 'class'`); the site is always dark
- `@tailwindcss/typography` is used for blog post prose styling via the `prose` class

### Static Assets

Images and other static files live in `/public`. Project images referenced in `projects.astro` are served from `/public/`.
