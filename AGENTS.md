# AGENTS.md — Agent Instructions for kunkel-portfolio

This file provides guidance for agentic coding assistants working in this repository.

---

## Project Overview

Personal portfolio site for Kevin Kunkel, deployed to Netlify.

- **Framework:** Astro 5 (static output)
- **UI:** React 19 (islands only — interactive components)
- **Styling:** Tailwind CSS v4 + CSS custom property design tokens
- **Language:** TypeScript (strict mode)
- **Deployment:** Netlify (static site + serverless functions)
- **AI chat:** Groq SDK / Llama 3.3 70B via `netlify/functions/chat.ts`

---

## Commands

```bash
# Start dev server (localhost:4321)
npm run dev

# Production build → dist/
npm run build

# Preview production build locally
npm run preview

# Type-check all Astro, TS, and TSX files
npm run astro -- check

# Run OG image optimization script (devDependency: sharp)
node scripts/optimize-og.mjs
```

There are **no tests**, no lint scripts, and no formatter scripts configured. There is no test runner (Jest, Vitest, Playwright) in this project.

If you add tests in the future, prefer **Vitest** (compatible with Vite/Astro).

### Type Checking

Always run `npm run astro -- check` before considering a change complete. This validates `.astro`, `.ts`, and `.tsx` files using the Astro language server and `tsc`.

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEY` | Yes (for chat) | Groq LLM API key for the AI chat feature |

Copy `.env.example` to `.env` for local development. The chat feature (`/api/chat`) will fail without this key.

---

## Project Structure

```
src/
  components/     # Astro (.astro) and React (.tsx) components
  content/        # Astro content collections (blog posts in Markdown)
  data/           # Typed data files (projects, AI context, config)
  layouts/        # Page layout components
  pages/          # File-based routing — one file per route
  styles/         # global.css (design tokens), shiki-theme.json
netlify/
  functions/
    chat.ts       # Serverless function → /api/chat
public/           # Static assets (images, favicon, OG images)
scripts/          # Build-time utility scripts
```

---

## TypeScript Conventions

- **Strict mode** is enforced via `astro/tsconfigs/strict` — no `any`, no implicit `any`.
- Use `interface` (not `type`) for object shapes and component props.
- Mark optional props with `?`.
- Use union types for constrained string values: `'ML' | 'WebDev'`, `'idle' | 'success' | 'error'`.
- Use `import type` when importing types only (e.g., in Astro frontmatter).
- Astro component props: define as `export interface Props` inside the `---` fence, then destructure with `const { ... } = Astro.props`.
- React component props: define as a local `interface Props`, passed as the generic to `React.FC<Props>` or as the parameter type to a plain function.

```ts
// Astro component
export interface Props {
  title: string;
  subtitle?: string;
}
const { title, subtitle } = Astro.props;

// React component — either style is acceptable
interface Props { label: string }
const MyComponent: React.FC<Props> = ({ label }) => { ... }
// or
export default function MyComponent({ label }: Props) { ... }
```

---

## Import Style

- No path aliases (`@/`) — use **relative imports** only.
- Destructure named imports: `import { useState, useEffect } from 'react'`
- Import types separately with `import type`.
- Group imports: external packages first, then internal relative imports.

```ts
import { useState } from 'react'
import type { Project } from '../data/projects'
import ProjectCard from '../components/ProjectCard'
```

---

## File & Component Naming

| File type | Convention | Example |
|---|---|---|
| Astro components | `PascalCase.astro` | `TerminalCard.astro` |
| React components | `PascalCase.tsx` | `ChatWidget.tsx` |
| Pages (routes) | `lowercase.astro` | `about.astro` |
| Data / config | `kebab-case.ts` | `kevin-context.ts` |

---

## Styling Conventions

The project uses **two coexisting patterns**. New work should follow the newer CSS custom property pattern:

### Preferred (new): CSS custom properties

Use inline `style` attributes or `<style>` blocks with the design token variables defined in `src/styles/global.css`.

```astro
<div style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border);">
```

**Available tokens:**
- Backgrounds: `--bg-base`, `--bg-surface`, `--bg-elevated`
- Text: `--text-primary`, `--text-secondary`, `--text-muted`
- Accent: `--accent-violet` (`#7c3aed`), `--accent-magenta`
- Border: `--border`

Dark mode is toggled via `.dark` class on `<html>`, stored in `localStorage`.

### Legacy: Tailwind utility classes

Older components (e.g., `ContactForm.tsx`, `ProjectCard.tsx`) use Tailwind utility classes. Do not mix both patterns in the same component. When editing an existing component, match its existing style.

### Typography

Base font is monospace: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace`.
The site has a terminal/hacker aesthetic — lean into it when adding visual elements.

---

## Astro-Specific Patterns

- Use `<slot />` in layout components for content injection.
- Use `<script>` blocks in `.astro` files for vanilla JS DOM manipulation (e.g., filtering, mobile menu).
- Use `<style>` blocks for scoped component styles and media queries.
- Add `client:load` or `client:visible` directives only on React components that require interactivity.
- Content collections (blog) are defined in `src/content/config.ts` using Zod schemas.

---

## Serverless Functions

Netlify functions live in `netlify/functions/`. They use the **Netlify v2 function format**:

```ts
export default async (req: Request): Promise<Response> => { ... }
export const config = { path: '/api/route' }
```

The chat function (`chat.ts`) uses the Groq SDK with `llama-3.3-70b-versatile` (max 512 tokens, temp 0.8) and maintains a 10-message sliding context window.

---

## Data Files

- `src/data/projects.ts` — `Project` interface + `allProjects` array. Add new projects here.
- `src/data/kevin-context.ts` — AI system prompt context. Contains `[FILL IN]` placeholders that should be completed with real information.
- `src/content/config.ts` — Astro content collection schema (blog).

---

## Key Constraints

- **No tests exist.** Do not write code that assumes a test suite is present.
- **No ESLint or Prettier.** Follow the conventions in this document manually.
- **No path aliases.** Always use relative imports.
- **ES modules only** (`"type": "module"` in package.json) — no `require()`.
- Never use `any` in TypeScript — the project is in strict mode.
- `sharp` is a devDependency used only in `scripts/optimize-og.mjs` — do not import it in src/.
