# Design Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the glassmorphism/nebula aesthetic with a solid-color deep space purple dark mode + rose/fuchsia light mode, unified terminal-window card motif, terminal prompt nav, and a flash-free theme toggle.

**Architecture:** CSS custom properties drive both color modes on `:root` (light) and `.dark` (dark). Tailwind's class-based dark mode is activated via `@variant dark`. A `TerminalCard.astro` component provides the reusable terminal window chrome. A `ThemeToggle.tsx` React island manages localStorage and toggles the `.dark` class on `<html>`.

**Tech Stack:** Astro 5, React 19, Tailwind CSS 4 (CSS-first, `@variant dark`), TypeScript

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/styles/global.css` | Modify | CSS custom properties for both themes; CRT scanline; dark mode variant; remove old animations |
| `src/layouts/Layout.astro` | Modify | Add no-flash theme script in `<head>`; update body classes |
| `src/components/ThemeToggle.tsx` | Create | React island — reads/writes localStorage, toggles `.dark` on `<html>` |
| `src/components/TerminalCard.astro` | Create | Terminal window chrome: header strip (dots + filename slot), body slot |
| `src/components/Navigation.astro` | Modify | Terminal prompt style nav with ThemeToggle |
| `src/components/Footer.astro` | Modify | Terminal status bar style |
| `src/components/ProjectCard.tsx` | Modify | Remove glassmorphism; use CSS vars; integrate terminal window chrome |
| `src/pages/index.astro` | Modify | Remove space background; apply CSS vars; wrap sections in TerminalCard |
| `src/pages/projects.astro` | Modify | Remove space background; update filter buttons and stat/CTA sections |
| `src/pages/blog/index.astro` | Modify | Remove space background; convert blog cards to TerminalCard |
| `src/pages/blog/[slug].astro` | Modify | Remove space background; wrap article in TerminalCard |
| `src/pages/contact.astro` | Modify | Remove space background; wrap in TerminalCard |

---

## Task 1: CSS Foundation — Color Tokens, Dark Mode Variant, CRT Scanlines

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace global.css with the new foundation**

Replace the entire file content with:

```css
@import "tailwindcss";

/* ─── Dark mode: activate when .dark class is on any ancestor ─── */
@variant dark (&:where(.dark, .dark *));

/* ─── Color tokens ─── */
/* Light mode (rose/fuchsia) */
:root {
  --bg-base:       #fdf4ff;
  --bg-surface:    #fae8ff;
  --bg-elevated:   #e9d5ff;
  --border:        #d8b4fe;
  --accent-violet: #7c3aed;
  --accent-magenta:#a21caf;
  --text-primary:  #1e1b4b;
  --text-secondary:#3b0764;
  --text-muted:    #6b21a8;
}

/* Dark mode (deep space purple) */
.dark {
  --bg-base:       #0d0d1a;
  --bg-surface:    #110d26;
  --bg-elevated:   #1a1033;
  --border:        #2d1a5e;
  --accent-violet: #7c3aed;
  --accent-magenta:#e879f9;
  --text-primary:  #f0abfc;
  --text-secondary:#c4b5fd;
  --text-muted:    #a78bfa;
}

/* ─── Base styles ─── */
html {
  scroll-behavior: smooth;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

body {
  background-color: var(--bg-base);
  color: var(--text-secondary);
  /* CRT scanline texture */
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(124, 58, 237, 0.04) 2px,
      rgba(124, 58, 237, 0.04) 4px
    );
  min-height: 100vh;
}

/* ─── Scrollbar ─── */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-surface); }
::-webkit-scrollbar-thumb { background: var(--accent-violet); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent-magenta); }

/* ─── Prose (blog posts) ─── */
.prose {
  overflow-wrap: break-word;
  word-break: break-word;
  color: var(--text-secondary);
}

.prose h1, .prose h2, .prose h3,
.prose h4, .prose h5, .prose h6 {
  color: var(--text-primary);
  overflow-wrap: break-word;
}

.prose a { color: var(--accent-magenta); }
.prose strong { color: var(--text-primary); }
.prose code {
  font-size: 0.875em;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  background-color: var(--bg-elevated);
  color: var(--accent-magenta);
  word-break: break-all;
}

.prose pre {
  overflow-x: auto;
  max-width: 100%;
  margin: 1rem 0;
  background-color: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.prose pre code {
  padding: 0;
  background-color: transparent;
  word-break: normal;
  overflow-wrap: normal;
  color: var(--text-secondary);
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}

.prose table {
  display: block;
  overflow-x: auto;
  max-width: 100%;
  color: var(--text-secondary);
}

.prose blockquote {
  border-left-color: var(--accent-violet);
  color: var(--text-muted);
}

.prose hr { border-color: var(--border); }

/* ─── Mobile touch targets ─── */
@media (max-width: 640px) {
  button, a { min-height: 44px; min-width: 44px; }
}

/* ─── Fade in animation (kept for hero) ─── */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd /Users/macbook/Documents/Dev/kunkel-portfolio && npm run build
```

Expected: build completes without errors (CSS warnings about unused vars are fine).

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: replace glassmorphism with solid CSS token system + CRT scanlines"
```

---

## Task 2: No-Flash Theme Script in Layout.astro

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Add the no-flash script and update body classes**

Replace the entire `src/layouts/Layout.astro` with:

```astro
---
import '../styles/global.css';

export interface Props {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

const {
  title,
  description = "Kevin Kunkel - ML Engineer & Full-Stack Developer. Specializing in machine learning, LLM integration, and modern web development.",
  image = "/optimized-og.png",
  url = Astro.url.pathname
} = Astro.props;

const canonicalURL = new URL(url, Astro.site || "https://kevinkunkel.dev");
const socialImage = new URL(image, Astro.site || "https://kevinkunkel.dev");
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- No-flash theme script: runs before paint -->
    <script is:inline>
      (function() {
        var stored = localStorage.getItem('theme');
        // Default to dark if nothing stored
        if (stored === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>

    <!-- Primary Meta Tags -->
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="author" content="Kevin Kunkel" />
    <meta name="keywords" content="Kevin Kunkel, ML Engineer, Machine Learning, Full-Stack Developer, Web Development, Python, React, TypeScript, AI, LLM, Portfolio" />
    <link rel="canonical" href={canonicalURL} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={socialImage} />
    <meta property="og:site_name" content="Kevin Kunkel Portfolio" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={canonicalURL} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={socialImage} />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Generator -->
    <meta name="generator" content={Astro.generator} />

    <!-- Robots -->
    <meta name="robots" content="index, follow" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add no-flash theme script to Layout"
```

---

## Task 3: ThemeToggle React Island

**Files:**
- Create: `src/components/ThemeToggle.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Sync state with current class on mount
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        fontFamily: 'inherit',
        fontSize: '0.75rem',
        padding: '2px 10px',
        border: '1px solid var(--border)',
        borderRadius: '3px',
        background: 'transparent',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        minHeight: '28px',
        minWidth: 'unset',
        lineHeight: 1,
      }}
    >
      {isDark ? '☀' : '☾'}
    </button>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/ThemeToggle.tsx
git commit -m "feat: add ThemeToggle React island"
```

---

## Task 4: TerminalCard Astro Component

**Files:**
- Create: `src/components/TerminalCard.astro`

- [ ] **Step 1: Create the component**

```astro
---
export interface Props {
  filename: string;
  class?: string;
}

const { filename, class: className = '' } = Astro.props;
---

<div
  class={`terminal-card ${className}`}
  style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden; background: var(--bg-surface);"
>
  <!-- Terminal header strip -->
  <div
    style="background: var(--bg-elevated); padding: 6px 12px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--border);"
  >
    <!-- Traffic lights -->
    <div style="display: flex; gap: 5px; flex-shrink: 0;">
      <span style="width: 10px; height: 10px; border-radius: 50%; background: #ff5f57; display: inline-block;"></span>
      <span style="width: 10px; height: 10px; border-radius: 50%; background: #ffbd2e; display: inline-block;"></span>
      <span style="width: 10px; height: 10px; border-radius: 50%; background: #28ca41; display: inline-block;"></span>
    </div>
    <!-- Filename -->
    <span style="font-family: inherit; font-size: 0.75rem; color: var(--text-muted);">{filename}</span>
  </div>

  <!-- Card body -->
  <div style="background: var(--bg-surface);">
    <slot />
  </div>
</div>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/TerminalCard.astro
git commit -m "feat: add TerminalCard reusable component"
```

---

## Task 5: Navigation Rewrite

**Files:**
- Modify: `src/components/Navigation.astro`

- [ ] **Step 1: Rewrite Navigation.astro**

Replace the entire file with:

```astro
---
import ThemeToggle from './ThemeToggle';

const navItems = [
  { path: '/home',     href: '/' },
  { path: '/projects', href: '/projects' },
  { path: '/blog',     href: '/blog' },
  { path: '/contact',  href: '/contact' },
];

const currentPath = Astro.url.pathname;

function isActive(href: string) {
  if (href === '/') return currentPath === '/';
  return currentPath.startsWith(href);
}
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
          style={`font-size: 0.8125rem; text-decoration: none; color: ${isActive(item.href) ? 'var(--accent-magenta)' : 'var(--text-muted)'}; transition: color 0.2s;`}
          onmouseover="this.style.color='var(--accent-magenta)'"
          onmouseout={`this.style.color='${isActive(item.href) ? 'var(--accent-magenta)' : 'var(--text-muted)'}'`}
        >
          {item.path}
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
        style={`display: block; padding: 8px 0; font-size: 0.875rem; text-decoration: none; color: ${isActive(item.href) ? 'var(--accent-magenta)' : 'var(--text-muted)'}; border-bottom: 1px solid var(--border);`}
      >
        <span style="color: var(--accent-violet);">$</span> cd {item.path}
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
  const button = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  if (button && menu) {
    button.addEventListener('click', () => {
      const isOpen = menu.style.display === 'block';
      menu.style.display = isOpen ? 'none' : 'block';
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  }
</script>
```

- [ ] **Step 2: Verify build and visually check nav**

```bash
npm run dev
```

Open http://localhost:4321 — nav should show terminal prompt on left, path links on right, theme toggle button.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navigation.astro
git commit -m "feat: rewrite Navigation as terminal prompt style with theme toggle"
```

---

## Task 6: Footer Rewrite

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Rewrite Footer.astro as terminal status bar**

Replace the entire file with:

```astro
---
const currentYear = new Date().getFullYear();
---

<footer style="background: var(--bg-surface); border-top: 1px solid var(--border); font-family: inherit;">
  <div style="max-width: 80rem; margin: 0 auto; padding: 0 1.5rem;">

    <!-- Main footer content -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; padding: 2.5rem 0; border-bottom: 1px solid var(--border);">

      <!-- System info -->
      <div style="font-size: 0.8125rem; display: flex; flex-direction: column; gap: 6px;">
        <div style="color: var(--accent-magenta); margin-bottom: 4px;">// system-info</div>
        <div><span style="color: var(--accent-violet);">❯</span> <span style="color: var(--text-muted);">whoami:</span> <span style="color: var(--text-secondary);">Kevin Kunkel</span></div>
        <div><span style="color: var(--accent-violet);">❯</span> <span style="color: var(--text-muted);">status:</span> <span style="color: #28ca41;">alive ●</span></div>
        <div><span style="color: var(--accent-violet);">❯</span> <span style="color: var(--text-muted);">location:</span> <span style="color: var(--text-secondary);">Leipzig</span></div>
      </div>

      <!-- Quick access -->
      <div style="font-size: 0.8125rem; display: flex; flex-direction: column; gap: 6px;">
        <div style="color: var(--accent-magenta); margin-bottom: 4px;">// quick-access</div>
        <div><span style="color: var(--accent-violet);">$</span> <a href="/projects" style="color: var(--text-secondary); text-decoration: none;">ls ./projects</a></div>
        <div><span style="color: var(--accent-violet);">$</span> <a href="/blog" style="color: var(--text-secondary); text-decoration: none;">python3 ml_models.py</a></div>
        <div><span style="color: var(--accent-violet);">$</span> <a href="/contact" style="color: var(--text-secondary); text-decoration: none;">ping kevin</a></div>
      </div>

      <!-- External links -->
      <div style="font-size: 0.8125rem; display: flex; flex-direction: column; gap: 6px;">
        <div style="color: var(--accent-magenta); margin-bottom: 4px;">// external-links</div>
        <div><span style="color: var(--accent-violet);">$</span> <a href="https://github.com/kevinkunkel98" target="_blank" rel="noopener" style="color: var(--text-secondary); text-decoration: none;">git remote -v</a></div>
        <div><span style="color: var(--accent-violet);">$</span> <a href="https://linkedin.com/in/kevinkunkel" target="_blank" rel="noopener" style="color: var(--text-secondary); text-decoration: none;">curl linkedin.com/in/kevin</a></div>
        <div><span style="color: var(--accent-violet);">$</span> <a href="mailto:kevinkunkeldev@gmail.com" style="color: var(--text-secondary); text-decoration: none;">mail kevinkunkeldev@gmail.com</a></div>
      </div>
    </div>

    <!-- Status bar -->
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; font-size: 0.75rem; color: var(--text-muted); flex-wrap: wrap; gap: 8px;">
      <div>
        <span style="color: var(--accent-violet);">❯</span>
        <span style="color: var(--accent-magenta);">kevin@portfolio</span><span>:~$</span>
        <span style="margin-left: 8px;">Built with Astro.js, React & excessive neurodivergence</span>
      </div>
      <div>© {currentYear} Kevin Kunkel <span style="color: var(--accent-magenta);">●</span> MIT License</div>
    </div>
  </div>
</footer>

<style>
  @media (max-width: 640px) {
    footer > div > div:first-of-type {
      grid-template-columns: 1fr !important;
    }
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: rewrite Footer as terminal status bar"
```

---

## Task 7: ProjectCard Rewrite

**Files:**
- Modify: `src/components/ProjectCard.tsx`

- [ ] **Step 1: Rewrite ProjectCard.tsx**

Replace the entire file with:

```tsx
import React from 'react';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  category: 'ML' | 'WebDev';
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const filename = project.category === 'ML'
    ? project.title.toLowerCase().replace(/\s+/g, '-') + '.py'
    : project.title.toLowerCase().replace(/\s+/g, '-') + '.tsx';

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: '6px',
        overflow: 'hidden',
        background: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'border-color 0.2s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-violet)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Terminal header */}
      <div style={{
        background: 'var(--bg-elevated)',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28ca41', display: 'inline-block' }} />
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{filename}</span>
      </div>

      {/* Project image */}
      {project.imageUrl && (
        <div style={{ position: 'relative', height: '160px', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={project.imageUrl}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'var(--accent-violet)',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            padding: '2px 8px',
            borderRadius: '3px',
          }}>
            {project.category}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
          {project.title}
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px', flexGrow: 1 }}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {project.technologies.map((tech, i) => (
            <span key={i} style={{
              fontSize: '0.7rem',
              padding: '2px 8px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--accent-magenta)',
              borderRadius: '3px',
            }}>
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-magenta)')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)')}
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-magenta)')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)')}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectCard.tsx
git commit -m "feat: rewrite ProjectCard with terminal window chrome and CSS vars"
```

---

## Task 8: Home Page Overhaul

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace index.astro**

Replace the entire file with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TerminalCard from '../components/TerminalCard.astro';
---

<BaseLayout
  title="Kevin Kunkel - dev && ml_engineer"
  description="Kevin Kunkel - ML Engineer & AI-focused Full-Stack Developer. Building ML, LLM, and scalable web systems."
  image="/optimized-og.png"
  url="/"
>

  <!-- Hero Section -->
  <section style="min-height: calc(100vh - 48px); display: flex; align-items: center; justify-content: center; padding: 3rem 1.5rem;">
    <div style="max-width: 80rem; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">

      <!-- Left: Terminal intro -->
      <div class="animate-fade-in-up" style="opacity: 0;">
        <TerminalCard filename="kevin@portfolio:~$">
          <div style="padding: 1.5rem; font-size: 0.875rem;">
            <div style="color: var(--text-muted); margin-bottom: 1rem;">
              <span style="color: var(--accent-violet);">$</span> whoami
            </div>

            <h1 style="font-size: 2.5rem; font-weight: bold; color: var(--text-primary); margin-bottom: 0.5rem; line-height: 1.1;">
              Kevin Kunkel
            </h1>

            <div style="color: var(--text-muted); margin-top: 1rem; margin-bottom: 0.5rem;">
              <span style="color: var(--accent-violet);">$</span> cat ./roles.txt
            </div>

            <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 1.5rem;">
              <div style="color: var(--text-secondary);">
                <span style="color: var(--accent-violet);">❯</span> ML Mozart
              </div>
              <div style="color: var(--text-secondary);">
                <span style="color: var(--accent-violet);">❯</span> LLM Whisperer
              </div>
              <div style="color: var(--text-secondary);">
                <span style="color: var(--accent-violet);">❯</span> Fullstack Dev
              </div>
              <div style="color: var(--text-secondary);">
                <span style="color: var(--accent-violet);">❯</span> Elected Student Council
              </div>
            </div>

            <div style="border-top: 1px solid var(--border); padding-top: 1rem; margin-bottom: 1rem;">
              <div style="border-left: 2px solid var(--accent-violet); padding-left: 1rem;">
                <div style="color: var(--text-secondary); font-style: italic; line-height: 1.6;">
                  Wer Zukunftsmusik hören will muss zur Gitarre greifen
                </div>
                <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 4px;">— Personal motto</div>
              </div>
            </div>

            <div style="border-top: 1px solid var(--border); padding-top: 0.75rem; display: flex; align-items: center; gap: 8px; font-size: 0.75rem;">
              <span style="color: #28ca41;">●</span>
              <span style="color: var(--text-muted);">status:</span>
              <span style="color: #28ca41;">alive</span>
            </div>
          </div>
        </TerminalCard>
      </div>

      <!-- Right: Photo -->
      <div class="animate-fade-in-up" style="opacity: 0; animation-delay: 0.3s; display: flex; justify-content: center;">
        <TerminalCard filename="~/kevin.jpg" class="photo-card">
          <div style="position: relative; overflow: hidden;">
            <img
              src="/kevin-hero.jpg"
              alt="Kevin Kunkel with electric guitar and aviator sunglasses"
              style="width: 100%; max-width: 420px; display: block; object-fit: cover;"
              onerror="this.style.display='none'; document.getElementById('photo-fallback').style.display='flex';"
            />
            <div id="photo-fallback" style="display: none; height: 300px; align-items: center; justify-content: center; flex-direction: column; gap: 8px; color: var(--text-muted);">
              <div style="font-size: 2rem;">🎸</div>
              <div style="font-size: 0.75rem;">Kevin Kunkel</div>
            </div>
            <!-- Hover overlay -->
            <div class="photo-overlay" style="position: absolute; inset: 0; background: rgba(13,13,26,0.7); opacity: 0; transition: opacity 0.3s; display: flex; align-items: flex-end; padding: 1rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted);">There is no place like 127.0.0.1</div>
            </div>
          </div>
        </TerminalCard>
      </div>

    </div>
  </section>

  <!-- CV Section -->
  <section style="padding: 3rem 1.5rem;">
    <div style="max-width: 80rem; margin: 0 auto;">
      <TerminalCard filename="resume.json">
        <div style="padding: 1.5rem; font-size: 0.875rem;">

          <!-- Toggle command -->
          <div
            id="cv-toggle-command"
            style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: var(--bg-elevated); border-radius: 4px; cursor: pointer; margin-bottom: 1rem; border: 1px solid var(--border);"
          >
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: var(--accent-violet);">$</span>
              <span style="color: var(--accent-magenta);">cat ./resume.json | jq '.'</span>
              <span style="color: var(--text-muted); font-size: 0.75rem;"># Toggle CV</span>
            </div>
            <span style="width: 8px; height: 16px; background: var(--accent-magenta); display: inline-block; animation: blink 1s step-end infinite;"></span>
          </div>

          <!-- CV Content (hidden by default) -->
          <div id="cv-content" style="display: none; color: var(--text-secondary); font-size: 0.8125rem; line-height: 1.8;">
            <div><span style="color: var(--accent-violet);">"name":</span> <span style="color: var(--accent-magenta);">"Kevin Kunkel"</span>,</div>
            <div><span style="color: var(--accent-violet);">"role":</span> <span style="color: var(--accent-magenta);">"AI Engineer & Full-Stack Developer"</span>,</div>

            <div style="margin-top: 12px;"><span style="color: var(--accent-violet);">"experience":</span> [</div>
            <div style="margin-left: 1.5rem;">
              <div>{"{"}</div>
              <div style="margin-left: 1.5rem;">
                <span style="color: var(--accent-violet);">"position":</span> <span style="color: var(--accent-magenta);">"AI Engineer"</span>, <span style="color: var(--accent-violet);">"company":</span> <span style="color: var(--accent-magenta);">"Exxeta AG"</span>,<br />
                <span style="color: var(--accent-violet);">"period":</span> <span style="color: var(--accent-magenta);">"2025-present"</span>,<br />
                <span style="color: var(--accent-violet);">"stack":</span> [<span style="color: var(--text-muted);">"FastAPI", "Openwebui", "LiteLLM", "Keycloak", "Kubernetes"</span>]
              </div>
              <div>},</div>
              <div>{"{"}</div>
              <div style="margin-left: 1.5rem;">
                <span style="color: var(--accent-violet);">"position":</span> <span style="color: var(--accent-magenta);">"Fullstack Developer"</span>, <span style="color: var(--accent-violet);">"company":</span> <span style="color: var(--accent-magenta);">"Exxeta AG"</span>,<br />
                <span style="color: var(--accent-violet);">"period":</span> <span style="color: var(--accent-magenta);">"2024-2025"</span>,<br />
                <span style="color: var(--accent-violet);">"stack":</span> [<span style="color: var(--text-muted);">"Spring Boot", "FastAPI", "React", "Docker", "AWS"</span>]
              </div>
              <div>},</div>
              <div>{"{"}</div>
              <div style="margin-left: 1.5rem;">
                <span style="color: var(--accent-violet);">"position":</span> <span style="color: var(--accent-magenta);">"Junior Consultant"</span>, <span style="color: var(--accent-violet);">"company":</span> <span style="color: var(--accent-magenta);">"M&L AG"</span>,<br />
                <span style="color: var(--accent-violet);">"period":</span> <span style="color: var(--accent-magenta);">"2020-2021"</span>,<br />
                <span style="color: var(--accent-violet);">"stack":</span> [<span style="color: var(--text-muted);">"Python", "GIS"</span>]
              </div>
              <div>},</div>
              <div>{"{"}</div>
              <div style="margin-left: 1.5rem;">
                <span style="color: var(--accent-violet);">"position":</span> <span style="color: var(--accent-magenta);">"Fullstack Developer"</span>, <span style="color: var(--accent-violet);">"company":</span> <span style="color: var(--accent-magenta);">"M&L AG"</span>,<br />
                <span style="color: var(--accent-violet);">"period":</span> <span style="color: var(--accent-magenta);">"2017-2019"</span>,<br />
                <span style="color: var(--accent-violet);">"stack":</span> [<span style="color: var(--text-muted);">"Spring Boot", "Bootstrap", "Docker", "MySQL"</span>]
              </div>
              <div>}</div>
            </div>
            <div>],</div>

            <div style="margin-top: 12px;"><span style="color: var(--accent-violet);">"skills":</span> {"{"}</div>
            <div style="margin-left: 1.5rem;">
              <div><span style="color: var(--accent-violet);">"languages":</span> [<span style="color: var(--text-muted);">"Python", "JavaScript", "TypeScript", "Java"</span>],</div>
              <div><span style="color: var(--accent-violet);">"ml_frameworks":</span> [<span style="color: var(--text-muted);">"PyTorch", "TensorFlow", "Scikit-learn", "Transformers"</span>],</div>
              <div><span style="color: var(--accent-violet);">"web_tech":</span> [<span style="color: var(--text-muted);">"React", "Next.js", "Node.js", "Express"</span>],</div>
              <div><span style="color: var(--accent-violet);">"databases":</span> [<span style="color: var(--text-muted);">"PostgreSQL", "MongoDB", "PGVector", "InfluxDB"</span>],</div>
              <div><span style="color: var(--accent-violet);">"devops":</span> [<span style="color: var(--text-muted);">"Docker", "Kubernetes", "AWS", "GitHub Actions"</span>]</div>
            </div>
            <div>},</div>

            <div style="margin-top: 12px;"><span style="color: var(--accent-violet);">"education":</span> [</div>
            <div style="margin-left: 1.5rem;">
              <div>{"{"}</div>
              <div style="margin-left: 1.5rem;">
                <span style="color: var(--accent-violet);">"degree":</span> <span style="color: var(--accent-magenta);">"M.Sc. Computer Science"</span>,<br />
                <span style="color: var(--accent-violet);">"university":</span> <span style="color: var(--accent-magenta);">"University of Leipzig"</span>,<br />
                <span style="color: var(--accent-violet);">"years":</span> <span style="color: var(--accent-magenta);">"2021 - today"</span>
              </div>
              <div>},</div>
              <div>{"{"}</div>
              <div style="margin-left: 1.5rem;">
                <span style="color: var(--accent-violet);">"degree":</span> <span style="color: var(--accent-magenta);">"B.Sc. Business Informatics"</span>,<br />
                <span style="color: var(--accent-violet);">"university":</span> <span style="color: var(--accent-magenta);">"Berufsakademie Rhein-Main"</span>,<br />
                <span style="color: var(--accent-violet);">"years":</span> <span style="color: var(--accent-magenta);">"2017-2020"</span>
              </div>
              <div>}</div>
            </div>
            <div>]</div>

            <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 1.5rem; font-size: 0.8125rem;">
              <a href="/projects" style="color: var(--accent-magenta); text-decoration: none;"><span style="color: var(--accent-violet);">$</span> ./view-projects</a>
              <a href="/contact" style="color: var(--accent-magenta); text-decoration: none;"><span style="color: var(--accent-violet);">$</span> ./contact-kevin</a>
              <a href="/blog" style="color: var(--accent-magenta); text-decoration: none;"><span style="color: var(--accent-violet);">$</span> ./read-thoughts</a>
            </div>
          </div>

        </div>
      </TerminalCard>
    </div>
  </section>

  <!-- Skills Section -->
  <section style="padding: 3rem 1.5rem;">
    <div style="max-width: 80rem; margin: 0 auto;">
      <div style="font-size: 0.75rem; color: var(--accent-magenta); margin-bottom: 1.5rem;">// cat /dev/skills</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">

        <!-- ML Stack -->
        <TerminalCard filename="ml_stack.py">
          <div style="padding: 1.25rem; font-size: 0.8125rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
            <div style="color: var(--text-muted);"># Daily drivers</div>
            <div><span style="color: var(--accent-violet);">import</span> torch, tensorflow <span style="color: var(--text-muted);"># The usual suspects</span></div>
            <div><span style="color: var(--accent-violet);">from</span> transformers <span style="color: var(--accent-violet);">import</span> * <span style="color: var(--text-muted);"># HuggingFace magic</span></div>
            <div><span style="color: var(--accent-violet);">import</span> numpy, pandas <span style="color: var(--text-muted);"># Data wrangling</span></div>
            <div style="color: var(--text-muted); margin-top: 6px;"># When things get visual</div>
            <div><span style="color: var(--accent-violet);">import</span> cv2, matplotlib</div>
            <div style="color: var(--text-muted); margin-top: 6px;"># Deployment & MLOps</div>
            <div><span style="color: var(--accent-violet);">import</span> mlflow, docker</div>
            <div style="color: var(--text-muted); margin-top: 6px;"># Classical NLP & Linear models</div>
            <div><span style="color: var(--accent-violet);">from</span> sklearn.svm <span style="color: var(--accent-violet);">import</span> LinearSVC</div>
            <div><span style="color: var(--accent-violet);">from</span> sklearn.pipeline <span style="color: var(--accent-violet);">import</span> make_pipeline</div>
          </div>
        </TerminalCard>

        <!-- Web Stack -->
        <TerminalCard filename="package.json">
          <div style="padding: 1.25rem; font-size: 0.8125rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
            <div style="color: var(--accent-magenta);">{"{"}</div>
            <div style="margin-left: 1rem;"><span style="color: var(--accent-violet);">"react"</span>: <span style="color: var(--text-primary);">"^18.x"</span>, <span style="color: var(--text-muted);">// Still the GOAT</span></div>
            <div style="margin-left: 1rem;"><span style="color: var(--accent-violet);">"typescript"</span>: <span style="color: var(--text-primary);">"latest"</span>, <span style="color: var(--text-muted);">// Life saver</span></div>
            <div style="margin-left: 1rem;"><span style="color: var(--accent-violet);">"next.js"</span>: <span style="color: var(--text-primary);">"^14.x"</span>, <span style="color: var(--text-muted);">// Full-stack magic</span></div>
            <div style="margin-left: 1rem;"><span style="color: var(--accent-violet);">"node.js"</span>: <span style="color: var(--text-primary);">"LTS"</span>, <span style="color: var(--text-muted);">// Backend buddy</span></div>
            <div style="margin-left: 1rem;"><span style="color: var(--accent-violet);">"postgresql"</span>: <span style="color: var(--text-primary);">"^15"</span>, <span style="color: var(--text-muted);">// Reliable data</span></div>
            <div style="margin-left: 1rem;"><span style="color: var(--accent-violet);">"tailwindcss"</span>: <span style="color: var(--text-primary);">"latest"</span>, <span style="color: var(--text-muted);">// Utility-first</span></div>
            <div style="margin-left: 1rem;"><span style="color: var(--accent-violet);">"docker"</span>: <span style="color: var(--text-primary);">"latest"</span> <span style="color: var(--text-muted);">// It works on my machine™</span></div>
            <div style="color: var(--accent-magenta);">{"}"}</div>
          </div>
        </TerminalCard>

      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section style="padding: 3rem 1.5rem;">
    <div style="max-width: 56rem; margin: 0 auto;">
      <div style="font-size: 0.75rem; color: var(--accent-magenta); margin-bottom: 1.5rem;">// cat ./faq.md</div>
      <TerminalCard filename="faq.md">
        <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 2rem;">

          <div style="border-left: 2px solid var(--accent-violet); padding-left: 1rem;">
            <div style="color: var(--accent-violet); font-size: 0.9375rem; font-weight: bold; margin-bottom: 6px;">
              ## What got you into Computer Science?
            </div>
            <p style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.7;">
              Most of my closest friends went into media and art. They wondered why someone with creative cravings like me went into tech. But honestly? I feel like CS gives you the ultimate ability to express yourself philosophically and artistically while also solving a multitude of interesting problems!
            </p>
          </div>

          <div style="border-left: 2px solid var(--accent-violet); padding-left: 1rem;">
            <div style="color: var(--accent-violet); font-size: 0.9375rem; font-weight: bold; margin-bottom: 6px;">
              ## What kind of projects do you work on?
            </div>
            <p style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.7;">
              Both ML projects (computer vision, NLP, data analysis) and web development (fullstack applications, APIs, frontend interfaces). Particularly interested in projects that combine both domains. I also try to use ML wherever possible to lift the heavy weight from LLMs.
            </p>
          </div>

          <div style="border-left: 2px solid var(--accent-violet); padding-left: 1rem;">
            <div style="color: var(--accent-violet); font-size: 0.9375rem; font-weight: bold; margin-bottom: 6px;">
              ## Do we even need traditional ML in 2025?
            </div>
            <p style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.7;">
              Absolutely! While AI, especially LLMs, have taken the spotlight, classical ML techniques remain invaluable for structured data, time-series analysis, and scenarios where interpretability is crucial. A balanced approach often yields the best results. For a lot of tasks it's a matter of "sledgehammer vs scalpel".
            </p>
          </div>

        </div>
      </TerminalCard>
    </div>
  </section>

</BaseLayout>

<style>
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  .photo-card:hover .photo-overlay { opacity: 1 !important; }

  @media (max-width: 768px) {
    section > div[style*="grid-template-columns: 1fr 1fr"] {
      grid-template-columns: 1fr !important;
    }
  }
</style>

<script>
  const toggleBtn = document.getElementById('cv-toggle-command');
  const cvContent = document.getElementById('cv-content');
  if (toggleBtn && cvContent) {
    toggleBtn.addEventListener('click', () => {
      cvContent.style.display = cvContent.style.display === 'none' ? 'block' : 'none';
    });
  }
</script>
```

- [ ] **Step 2: Verify build and visual check**

```bash
npm run build && npm run dev
```

Open http://localhost:4321 — should see dark purple background, CRT lines, terminal window cards, terminal prompt nav, theme toggle.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: overhaul home page with terminal cards and new design system"
```

---

## Task 9: Projects Page Overhaul

**Files:**
- Modify: `src/pages/projects.astro`

- [ ] **Step 1: Replace projects.astro**

Replace the entire file with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard';
import TerminalCard from '../components/TerminalCard.astro';

const allProjects = [
  {
    title: "LibreChat LiteLLM Proxy",
    description: "A lightweight proxy implementation that bridges LibreChat with LiteLLM, enabling unified access to multiple LLMs. Experimental setup trying to replace Openwebui and being the real open-source Cuba Libre.",
    technologies: ["litellm", "librechat", "docker", "fastapi"],
    category: "ML" as const,
    githubUrl: "https://github.com/kevinkunkel98/LibreChat-LiteLLM-Proxy",
    imageUrl: "/assets/libre.jpeg"
  },
  {
    title: "FSR RAG Chat Assistant",
    description: "The FSR RAG Chat Assistant is a Retrieval-Augmented Generation (RAG) chatbot designed to support the student council of the computer science faculty at the University of Leipzig.",
    technologies: ["ollama", "spring-ai", "react", "shadcn-ui", "pgvector"],
    category: "ML" as const,
    githubUrl: "https://github.com/kevinkunkel98/fsr-rag-assistant.git",
    imageUrl: "/assets/fsrchat.png"
  },
  {
    title: "Computer Science Faculty Website",
    description: "Web presence static page that displays all relevant information, news, and events related to the elected council members of the computer science faculty at the University of Leipzig.",
    technologies: ["astro", "node", "flowbite", "netlify"],
    category: "WebDev" as const,
    liveUrl: "https://fsinf.informatik.uni-leipzig.de/",
    imageUrl: "/assets/fsinf.png"
  },
  {
    title: "90s Forum Post SVM Classifier",
    description: "Support Vector Machine that classifies forum posts from the 90s into different topics based on their content using TF-IDF vectorization and gives insights into early internet shitposting.",
    technologies: ["scikit-learn", "kaggle", "fastapi", "react"],
    category: "ML" as const,
    githubUrl: "https://github.com/kevinkunkel98/90sInternetSVM.git",
    imageUrl: "/assets/netscape.jpg"
  },
  {
    title: "Vilkulakis - The Online Game",
    description: "Online real-time multiplayer version of the card game Werewolves that has one lobby and supports 20 active players with a chat GUI.",
    technologies: ["node", "socket-io", "express", "mongodb"],
    category: "WebDev" as const,
    githubUrl: "https://github.com/kevinkunkel98/VilkulakisGame.git",
    imageUrl: "/assets/vilkulakis.png"
  },
  {
    title: "Study BrAIn - Study Smarter Chat",
    description: "RAG Chat that helps you study and chat with your lecture slides and embed notes using GPT 3.5 and ChromaDB.",
    technologies: ["flask", "bootstrap", "langchain", "chromadb"],
    category: "ML" as const,
    githubUrl: "https://github.com/kevinkunkel98/Study-Brain-Chatbot",
    imageUrl: "/assets/studybrain.png"
  },
  {
    title: "Linux Dev Blog and Portfolio Website",
    description: "My first real portfolio website that I used to document my journey into web development and Arch Linux customizations.",
    technologies: ["astro", "react", "express", "tailwind"],
    category: "WebDev" as const,
    liveUrl: "https://kevin-kunkel.netlify.app/",
    imageUrl: "/assets/devblog.png"
  }
];

const mlProjects = allProjects.filter(p => p.category === 'ML');
const webDevProjects = allProjects.filter(p => p.category === 'WebDev');
---

<BaseLayout title="Projects - My Work Portfolio" description="Explore my machine learning and web development projects">
  <div style="min-height: 100vh; padding: 3rem 1.5rem;">
    <div style="max-width: 80rem; margin: 0 auto;">

      <!-- Page header -->
      <div style="margin-bottom: 2.5rem;">
        <div style="font-size: 0.75rem; color: var(--accent-magenta); margin-bottom: 4px;">// ls -la ./projects/</div>
        <div style="font-size: 0.8125rem; color: var(--text-muted);"># Listing repository contents: ML models, web applications, and experimental solutions</div>
      </div>

      <!-- Filter tabs -->
      <div style="display: flex; gap: 8px; margin-bottom: 2rem; flex-wrap: wrap;" id="project-filters">
        <button class="filter-btn active" data-filter="all"
          style="font-family: inherit; font-size: 0.8125rem; padding: 6px 16px; border-radius: 3px; cursor: pointer; border: 1px solid var(--accent-magenta); background: transparent; color: var(--accent-magenta);">
          <span style="color: var(--accent-violet);">./</span>all
        </button>
        <button class="filter-btn" data-filter="ML"
          style="font-family: inherit; font-size: 0.8125rem; padding: 6px 16px; border-radius: 3px; cursor: pointer; border: 1px solid var(--border); background: transparent; color: var(--text-muted);">
          <span style="color: var(--accent-violet);">./</span>machine_learning
        </button>
        <button class="filter-btn" data-filter="WebDev"
          style="font-family: inherit; font-size: 0.8125rem; padding: 6px 16px; border-radius: 3px; cursor: pointer; border: 1px solid var(--border); background: transparent; color: var(--text-muted);">
          <span style="color: var(--accent-violet);">./</span>web_development
        </button>
      </div>

      <!-- Projects grid -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 3rem;" id="projects-grid">
        {allProjects.map((project) => (
          <div class="project-item" data-category={project.category} style="display: flex; flex-direction: column;">
            <ProjectCard project={project} client:load />
          </div>
        ))}
      </div>

      <!-- Stats -->
      <TerminalCard filename="wc-projects.sh">
        <div style="padding: 1.25rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
          <div>
            <div style="font-size: 2rem; font-weight: bold; color: var(--accent-magenta);">{allProjects.length}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">total_projects</div>
          </div>
          <div>
            <div style="font-size: 2rem; font-weight: bold; color: var(--accent-violet);">{mlProjects.length}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">ml_models</div>
          </div>
          <div>
            <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">{webDevProjects.length}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">web_apps</div>
          </div>
        </div>
      </TerminalCard>

      <!-- CTA -->
      <div style="margin-top: 1.5rem; text-align: center; padding: 2rem; border: 1px solid var(--border); border-radius: 6px; background: var(--bg-surface);">
        <div style="font-size: 0.875rem; color: var(--accent-magenta); margin-bottom: 0.5rem;">
          <span style="color: var(--accent-violet);">$</span> ./collaborate --with=kevin
        </div>
        <div style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 1.5rem;"># Ready to build something awesome together?</div>
        <a href="/contact"
          style="display: inline-block; font-family: inherit; font-size: 0.875rem; padding: 10px 24px; background: var(--accent-violet); color: #fff; border-radius: 3px; text-decoration: none; border: 1px solid var(--accent-violet);"
          onmouseover="this.style.background='var(--accent-magenta)'; this.style.borderColor='var(--accent-magenta)'"
          onmouseout="this.style.background='var(--accent-violet)'; this.style.borderColor='var(--accent-violet)'">
          ./contact --kevin
        </a>
      </div>

    </div>
  </div>
</BaseLayout>

<style>
  @media (max-width: 1024px) {
    #projects-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 640px) {
    #projects-grid { grid-template-columns: 1fr !important; }
  }
</style>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
    const projectItems = document.querySelectorAll<HTMLElement>('.project-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach(b => {
          b.style.borderColor = 'var(--border)';
          b.style.color = 'var(--text-muted)';
        });
        btn.style.borderColor = 'var(--accent-magenta)';
        btn.style.color = 'var(--accent-magenta)';

        projectItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
</script>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects.astro
git commit -m "feat: overhaul projects page with new design system"
```

---

## Task 10: Blog Index Overhaul

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Read the full current blog index to extract all 6 model cards**

```bash
cat src/pages/blog/index.astro
```

Read the file fully to copy all 6 model entries (Linear Regression, Logistic Regression, Decision Trees, Random Forest, SVM, K-Nearest Neighbors) including their hrefs, descriptions, and emoji icons.

- [ ] **Step 2: Replace blog/index.astro**

Replace the entire file. Use the 6 model entries you copied from Step 1, preserving all href, description and emoji content. Wrap each in a `TerminalCard`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import TerminalCard from '../../components/TerminalCard.astro';
---

<BaseLayout title="ML Models Playground - Kevin Kunkel" description="Interactive overview of machine learning models and algorithms">
  <div style="min-height: 100vh; padding: 3rem 1.5rem;">
    <div style="max-width: 80rem; margin: 0 auto;">

      <!-- Page header -->
      <div style="margin-bottom: 2.5rem;">
        <div style="font-size: 0.75rem; color: var(--accent-magenta); margin-bottom: 4px;">// python3 ml_models.py --explore</div>
        <div style="font-size: 0.8125rem; color: var(--text-muted);"># Interactive ML Models Playground</div>
      </div>

      <!-- Models grid -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">

        <!-- Paste all 6 model cards here as TerminalCard components.
             Example format for each card: -->

        <a href="/blog/linear-regression" style="text-decoration: none; display: block;">
          <TerminalCard filename="linear-regression.py">
            <div style="padding: 1.25rem;">
              <div style="font-size: 1.5rem; margin-bottom: 8px;">📈</div>
              <h3 style="font-size: 1rem; font-weight: bold; color: var(--text-primary); margin-bottom: 6px;">Linear Regression</h3>
              <p style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.6;">
                <!-- copy description from original file -->
              </p>
              <div style="margin-top: 12px; font-size: 0.75rem; color: var(--accent-magenta);">
                <span style="color: var(--accent-violet);">$</span> cat ./linear-regression.md →
              </div>
            </div>
          </TerminalCard>
        </a>

        <!-- Repeat for the other 5 models with their filenames:
             logistic-regression.py, decision-trees.py, random-forest.py,
             support-vector-machines.py, k-nearest-neighbors.py -->

      </div>
    </div>
  </div>
</BaseLayout>

<style>
  @media (max-width: 1024px) {
    div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 640px) {
    div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
  }
  a:hover .terminal-card { border-color: var(--accent-violet) !important; }
</style>
```

**Important:** In Step 1, read the full file and fill in all 6 model card descriptions from the original. Do not leave placeholder comments in the final file.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: overhaul blog index with terminal card design"
```

---

## Task 11: Blog Post Page Overhaul

**Files:**
- Modify: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Read the full current [slug].astro to see all metadata/sharing UI**

```bash
cat src/pages/blog/\[slug\].astro
```

- [ ] **Step 2: Replace [slug].astro**

Replace the entire file with (preserve all frontmatter logic, reading time, and sharing UI from Step 1):

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import TerminalCard from '../../components/TerminalCard.astro';
import type { CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const blogEntries = await getCollection('blog');
  return blogEntries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry }
  }));
}

const { entry } = Astro.props as { entry: CollectionEntry<'blog'> };
const { Content } = await entry.render();

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}
---

<BaseLayout
  title={entry.data.title}
  description={entry.data.description}
  image={entry.data.heroImage || '/kevin-hero.jpg'}
  url={`/blog/${entry.slug}/`}
>
  <div style="min-height: 100vh; padding: 3rem 1.5rem;">
    <div style="max-width: 56rem; margin: 0 auto;">

      <!-- Back link -->
      <div style="margin-bottom: 1.5rem; font-size: 0.8125rem;">
        <a href="/blog" style="color: var(--text-muted); text-decoration: none;">
          <span style="color: var(--accent-violet);">$</span> cd ../
        </a>
      </div>

      <!-- Article wrapped in TerminalCard -->
      <TerminalCard filename={`${entry.slug}.md`}>
        <div style="padding: 2rem;">

          <!-- Post meta header -->
          <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); font-size: 0.75rem; color: var(--text-muted); display: flex; flex-wrap: wrap; gap: 16px;">
            <span>
              <span style="color: var(--accent-violet);">date:</span> {formatDate(entry.data.pubDate)}
            </span>
            <span>
              <span style="color: var(--accent-violet);">category:</span> {entry.data.category}
            </span>
            {entry.data.tags && (
              <span>
                <span style="color: var(--accent-violet);">tags:</span> [{entry.data.tags.join(', ')}]
              </span>
            )}
          </div>

          <!-- Post title -->
          <h1 style="font-size: 1.75rem; font-weight: bold; color: var(--text-primary); margin-bottom: 2rem; line-height: 1.2;">
            {entry.data.title}
          </h1>

          <!-- Post content -->
          <div class="prose">
            <Content />
          </div>

        </div>
      </TerminalCard>

      <!-- Bottom nav -->
      <div style="margin-top: 2rem; display: flex; justify-content: space-between; font-size: 0.8125rem; color: var(--text-muted);">
        <a href="/blog" style="color: var(--text-muted); text-decoration: none;">
          <span style="color: var(--accent-violet);">$</span> ls ../
        </a>
        <a href="/" style="color: var(--text-muted); text-decoration: none;">
          <span style="color: var(--accent-violet);">$</span> cd ~
        </a>
      </div>

    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add "src/pages/blog/[slug].astro"
git commit -m "feat: overhaul blog post page with terminal card wrapper"
```

---

## Task 12: Contact Page Overhaul

**Files:**
- Modify: `src/pages/contact.astro`

- [ ] **Step 1: Read the full current contact.astro to see the form section content**

```bash
cat src/pages/contact.astro
```

- [ ] **Step 2: Replace contact.astro**

Replace the file (preserve the `<ContactForm />` component — it handles Netlify Forms and must not be changed):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ContactForm from '../components/ContactForm';
import TerminalCard from '../components/TerminalCard.astro';
---

<BaseLayout title="Contact - Get In Touch" description="Get in touch for opportunities, collaborations, or just to say hello">
  <div style="min-height: 100vh; padding: 3rem 1.5rem; display: flex; align-items: flex-start; justify-content: center;">
    <div style="max-width: 40rem; width: 100%;">

      <!-- Page header -->
      <div style="margin-bottom: 2rem;">
        <div style="font-size: 0.75rem; color: var(--accent-magenta); margin-bottom: 4px;">// ping kevin</div>
        <div style="font-size: 0.8125rem; color: var(--text-muted);"># Get in touch for opportunities, collaborations, or just to say hello</div>
      </div>

      <TerminalCard filename="contact.sh">
        <div style="padding: 1.5rem;">
          <ContactForm client:load />
        </div>
      </TerminalCard>

    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: overhaul contact page with terminal card wrapper"
```

---

## Task 13: ContactForm Styles Update

The `ContactForm.tsx` React component renders its own inputs and labels. Those inputs likely have hardcoded dark gray Tailwind classes. Update them to use CSS vars so they work in both themes.

**Files:**
- Modify: `src/components/ContactForm.tsx`

- [ ] **Step 1: Read ContactForm.tsx**

```bash
cat src/components/ContactForm.tsx
```

- [ ] **Step 2: Replace all hardcoded color classes with inline CSS var styles**

For each `<input>`, `<textarea>`, `<label>`, and `<button>` in the form, replace Tailwind color utilities with inline `style` props using CSS vars. Example pattern:

```tsx
// Before (typical)
<input className="bg-gray-800 border border-gray-600 text-white rounded-lg p-3 w-full" ... />

// After
<input
  style={{
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    borderRadius: '4px',
    padding: '10px 12px',
    width: '100%',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    outline: 'none',
  }}
  ...
/>
```

Apply this pattern to labels, inputs, textarea, and submit button. Submit button uses `var(--accent-violet)` background and `#fff` text.

- [ ] **Step 3: Verify build and test form appearance**

```bash
npm run build && npm run dev
```

Navigate to http://localhost:4321/contact and verify form inputs are visible in both dark and light modes.

- [ ] **Step 4: Commit**

```bash
git add src/components/ContactForm.tsx
git commit -m "feat: update ContactForm to use CSS var color tokens"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Color system (dark + light CSS vars): Task 1
- ✅ No-flash theme default dark: Task 2
- ✅ ThemeToggle (localStorage, class toggle): Task 3
- ✅ TerminalCard component (dots + filename + body): Task 4
- ✅ Navigation terminal prompt style: Task 5
- ✅ Footer terminal status bar: Task 6
- ✅ ProjectCard with terminal chrome: Task 7
- ✅ Home page: Task 8
- ✅ Projects page: Task 9
- ✅ Blog index: Task 10
- ✅ Blog post: Task 11
- ✅ Contact page: Task 12
- ✅ ContactForm color adaptation: Task 13
- ✅ Remove all nebula/starfield/backdrop-blur: covered in Tasks 8–12
- ✅ CRT scanline texture on body: Task 1
- ✅ Section dividers via `// label` comments: Tasks 8–12

**Type consistency:** `TerminalCard` prop is `filename: string` — used consistently as a string in all tasks. `ThemeToggle` has no props. `ProjectCard` `Project` interface unchanged — same shape used in Task 9.

**No placeholders:** Task 10 Step 1 instructs reading the full file before writing, to avoid leaving placeholder comments. Task 13 Step 1 same. No TBDs remain.
