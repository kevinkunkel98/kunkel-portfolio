# Blog Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the blog — add matplotlib-style SVG plot images to cards, remove emojis, make code blocks look like the homepage terminal windows, and add copy-to-clipboard buttons.

**Architecture:** Custom Shiki theme JSON gives syntax colors matching the design system. A client-side script in `[slug].astro` wraps every `<pre>` in terminal chrome (dots + language label + copy button) at runtime. Six SVG files in `/public/assets/blog/` serve as plot thumbnails on the blog index.

**Tech Stack:** Astro 5, Shiki v1 (bundled with Astro), SVG, vanilla JS

---

## File Map

| File | Action |
|---|---|
| `src/styles/shiki-theme.json` | Create — custom dark theme matching design system palette |
| `astro.config.mjs` | Modify — add `markdown.shikiConfig` |
| `src/styles/global.css` | Modify — add `.prose pre` / `.astro-code` overrides |
| `public/assets/blog/linear-regression.svg` | Create |
| `public/assets/blog/logistic-regression.svg` | Create |
| `public/assets/blog/decision-trees.svg` | Create |
| `public/assets/blog/random-forest.svg` | Create |
| `public/assets/blog/support-vector-machines.svg` | Create |
| `public/assets/blog/k-nearest-neighbors.svg` | Create |
| `src/pages/blog/index.astro` | Modify — add SVG images, remove emojis |
| `src/pages/blog/[slug].astro` | Modify — add terminal chrome + copy button script + styles |

---

## Task 1: Custom Shiki Theme + Astro Config

**Files:**
- Create: `src/styles/shiki-theme.json`
- Modify: `astro.config.mjs`

- [ ] **Step 1: Create the Shiki theme file**

Create `src/styles/shiki-theme.json`:

```json
{
  "name": "kunkel-dark",
  "type": "dark",
  "colors": {
    "editor.background": "#1a1033",
    "editor.foreground": "#c4b5fd",
    "editor.lineHighlightBackground": "#2d1a5e30",
    "editorLineNumber.foreground": "#2d1a5e",
    "editorCursor.foreground": "#e879f9"
  },
  "tokenColors": [
    {
      "name": "Comment",
      "scope": ["comment", "punctuation.definition.comment"],
      "settings": { "foreground": "#a78bfa", "fontStyle": "italic" }
    },
    {
      "name": "String",
      "scope": ["string", "string.quoted", "string.template"],
      "settings": { "foreground": "#e879f9" }
    },
    {
      "name": "Keyword",
      "scope": [
        "keyword",
        "keyword.control",
        "keyword.operator",
        "storage",
        "storage.type",
        "storage.modifier"
      ],
      "settings": { "foreground": "#7c3aed" }
    },
    {
      "name": "Function",
      "scope": [
        "entity.name.function",
        "support.function",
        "meta.function-call"
      ],
      "settings": { "foreground": "#f0abfc" }
    },
    {
      "name": "Class / Type",
      "scope": [
        "entity.name.type",
        "entity.name.class",
        "support.class",
        "entity.other.inherited-class"
      ],
      "settings": { "foreground": "#c4b5fd" }
    },
    {
      "name": "Number / Constant",
      "scope": [
        "constant.numeric",
        "constant.language",
        "constant.other"
      ],
      "settings": { "foreground": "#e879f9" }
    },
    {
      "name": "Variable",
      "scope": ["variable", "variable.other"],
      "settings": { "foreground": "#c4b5fd" }
    },
    {
      "name": "Parameter",
      "scope": ["variable.parameter"],
      "settings": { "foreground": "#f0abfc" }
    },
    {
      "name": "Punctuation",
      "scope": ["punctuation", "meta.brace"],
      "settings": { "foreground": "#a78bfa" }
    },
    {
      "name": "Tag",
      "scope": ["entity.name.tag", "meta.tag"],
      "settings": { "foreground": "#7c3aed" }
    },
    {
      "name": "Attribute",
      "scope": ["entity.other.attribute-name"],
      "settings": { "foreground": "#e879f9" }
    },
    {
      "name": "Import / Module",
      "scope": ["keyword.control.import", "keyword.control.from"],
      "settings": { "foreground": "#7c3aed" }
    },
    {
      "name": "Operator",
      "scope": ["keyword.operator", "punctuation.separator"],
      "settings": { "foreground": "#7c3aed" }
    },
    {
      "name": "Boolean / Null",
      "scope": ["constant.language.boolean", "constant.language.null"],
      "settings": { "foreground": "#e879f9" }
    },
    {
      "name": "Shell builtin",
      "scope": ["support.function.builtin.shell"],
      "settings": { "foreground": "#7c3aed" }
    }
  ]
}
```

- [ ] **Step 2: Update astro.config.mjs to use the theme**

Replace the entire file:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

const __dirname = dirname(fileURLToPath(import.meta.url));
const shikiTheme = JSON.parse(
  readFileSync(resolve(__dirname, 'src/styles/shiki-theme.json'), 'utf-8')
);

export default defineConfig({
  site: 'https://kevinkunkel.dev',
  output: 'static',
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    shikiConfig: {
      theme: shikiTheme,
    },
  },
  integrations: [react(), sitemap()]
});
```

- [ ] **Step 3: Verify build passes**

```bash
cd /Users/macbook/Documents/Dev/kunkel-portfolio/.worktrees/design-overhaul && npm run build 2>&1 | tail -5
```

Expected: `[build] Complete!`

- [ ] **Step 4: Commit**

```bash
git add src/styles/shiki-theme.json astro.config.mjs
git commit -m "feat: add custom Shiki theme matching design system palette"
```

---

## Task 2: Global CSS Code Block Overrides

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Append code block overrides to global.css**

Add the following at the end of `src/styles/global.css`:

```css
/* ─── Code block terminal chrome overrides ─── */

/* Strip Typography's default pre styling — our JS wrapper handles chrome */
.prose pre {
  background-color: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  margin: 1.25rem 0 !important;
}

/* Shiki-generated code block */
.astro-code {
  background-color: var(--bg-elevated) !important;
  padding: 1rem 1.25rem !important;
  overflow-x: auto;
  margin: 0 !important;
  border-radius: 0 !important;
  font-size: 0.875rem;
  line-height: 1.6;
}

/* Terminal card wrapper injected by script */
.code-terminal-card {
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  margin: 1.25rem 0;
}

.code-terminal-header {
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.code-dot-red    { background: #ff5f57; }
.code-dot-yellow { background: #ffbd2e; }
.code-dot-green  { background: #28ca41; }

.code-filename {
  font-family: inherit;
  font-size: 0.75rem;
  color: var(--text-muted);
  flex: 1;
}

.copy-btn {
  font-family: inherit;
  font-size: 0.7rem;
  padding: 2px 8px;
  border: 1px solid var(--border);
  border-radius: 3px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  line-height: 1.4;
  transition: color 0.15s, border-color 0.15s;
  min-height: unset;
  min-width: unset;
}

.copy-btn:hover {
  color: var(--accent-magenta);
  border-color: var(--accent-magenta);
}

.copy-btn.copied {
  color: #28ca41;
  border-color: #28ca41;
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: `[build] Complete!`

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add code block terminal chrome CSS classes"
```

---

## Task 3: Create 6 Matplotlib-Style SVG Files

**Files:**
- Create: `public/assets/blog/linear-regression.svg`
- Create: `public/assets/blog/logistic-regression.svg`
- Create: `public/assets/blog/decision-trees.svg`
- Create: `public/assets/blog/random-forest.svg`
- Create: `public/assets/blog/support-vector-machines.svg`
- Create: `public/assets/blog/k-nearest-neighbors.svg`

All SVGs: 400×200, background `#0d0d1a`, grid `#2d1a5e`, primary `#7c3aed`, accent `#e879f9`, labels `#a78bfa`.

- [ ] **Step 1: Create linear-regression.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
  <rect width="400" height="200" fill="#0d0d1a"/>
  <!-- grid -->
  <line x1="70" y1="20" x2="70" y2="165" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="130" y1="20" x2="130" y2="165" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="190" y1="20" x2="190" y2="165" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="250" y1="20" x2="250" y2="165" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="310" y1="20" x2="310" y2="165" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="50" y1="40" x2="370" y2="40" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="50" y1="80" x2="370" y2="80" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="50" y1="120" x2="370" y2="120" stroke="#2d1a5e" stroke-width="0.5"/>
  <!-- axes -->
  <line x1="50" y1="165" x2="370" y2="165" stroke="#a78bfa" stroke-width="1.5"/>
  <line x1="50" y1="20" x2="50" y2="165" stroke="#a78bfa" stroke-width="1.5"/>
  <!-- axis labels -->
  <text x="210" y="185" fill="#a78bfa" font-size="10" text-anchor="middle" font-family="monospace">x</text>
  <text x="22" y="97" fill="#a78bfa" font-size="10" text-anchor="middle" font-family="monospace" transform="rotate(-90,22,97)">y</text>
  <!-- regression line -->
  <line x1="55" y1="158" x2="365" y2="32" stroke="#e879f9" stroke-width="2" opacity="0.9"/>
  <!-- scatter points -->
  <circle cx="75"  cy="152" r="4" fill="#7c3aed" opacity="0.9"/>
  <circle cx="90"  cy="160" r="4" fill="#7c3aed" opacity="0.9"/>
  <circle cx="110" cy="140" r="4" fill="#c4b5fd" opacity="0.9"/>
  <circle cx="135" cy="133" r="4" fill="#7c3aed" opacity="0.9"/>
  <circle cx="150" cy="125" r="4" fill="#c4b5fd" opacity="0.9"/>
  <circle cx="170" cy="118" r="4" fill="#7c3aed" opacity="0.9"/>
  <circle cx="190" cy="108" r="4" fill="#c4b5fd" opacity="0.9"/>
  <circle cx="210" cy="100" r="4" fill="#7c3aed" opacity="0.9"/>
  <circle cx="225" cy="92"  r="4" fill="#c4b5fd" opacity="0.9"/>
  <circle cx="250" cy="80"  r="4" fill="#7c3aed" opacity="0.9"/>
  <circle cx="270" cy="75"  r="4" fill="#c4b5fd" opacity="0.9"/>
  <circle cx="295" cy="65"  r="4" fill="#7c3aed" opacity="0.9"/>
  <circle cx="320" cy="55"  r="4" fill="#c4b5fd" opacity="0.9"/>
  <circle cx="345" cy="42"  r="4" fill="#7c3aed" opacity="0.9"/>
  <!-- title -->
  <text x="210" y="13" fill="#a78bfa" font-size="9" text-anchor="middle" font-family="monospace" opacity="0.7">linear_regression.py</text>
</svg>
```

- [ ] **Step 2: Create logistic-regression.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
  <rect width="400" height="200" fill="#0d0d1a"/>
  <!-- grid -->
  <line x1="80" y1="20" x2="80" y2="170" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="150" y1="20" x2="150" y2="170" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="220" y1="20" x2="220" y2="170" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="290" y1="20" x2="290" y2="170" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="50" y1="50" x2="370" y2="50" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="50" y1="95" x2="370" y2="95" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="50" y1="140" x2="370" y2="140" stroke="#2d1a5e" stroke-width="0.5"/>
  <!-- axes -->
  <line x1="50" y1="170" x2="370" y2="170" stroke="#a78bfa" stroke-width="1.5"/>
  <line x1="50" y1="20" x2="50" y2="170" stroke="#a78bfa" stroke-width="1.5"/>
  <!-- y-axis labels -->
  <text x="42" y="54"  fill="#a78bfa" font-size="8" text-anchor="end" font-family="monospace">1.0</text>
  <text x="42" y="99"  fill="#a78bfa" font-size="8" text-anchor="end" font-family="monospace">0.5</text>
  <text x="42" y="144" fill="#a78bfa" font-size="8" text-anchor="end" font-family="monospace">0.0</text>
  <!-- threshold dashed line -->
  <line x1="50" y1="95" x2="370" y2="95" stroke="#7c3aed" stroke-width="1" stroke-dasharray="5,4" opacity="0.7"/>
  <!-- sigmoid S-curve path -->
  <path d="M 55 145
           C 80 145, 100 143, 120 138
           C 140 133, 155 125, 175 115
           C 190 107, 205 95, 210 95
           C 215 95, 225 83, 240 75
           C 260 65, 275 57, 295 53
           C 315 50, 340 49, 365 49"
        fill="none" stroke="#e879f9" stroke-width="2.5"/>
  <!-- axis label -->
  <text x="210" y="188" fill="#a78bfa" font-size="10" text-anchor="middle" font-family="monospace">z</text>
  <text x="22" y="97" fill="#a78bfa" font-size="10" text-anchor="middle" font-family="monospace" transform="rotate(-90,22,97)">P(y=1)</text>
  <!-- title -->
  <text x="210" y="13" fill="#a78bfa" font-size="9" text-anchor="middle" font-family="monospace" opacity="0.7">logistic_regression.py</text>
</svg>
```

- [ ] **Step 3: Create decision-trees.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
  <rect width="400" height="200" fill="#0d0d1a"/>
  <!-- edges -->
  <line x1="200" y1="42" x2="120" y2="90" stroke="#2d1a5e" stroke-width="1.5"/>
  <line x1="200" y1="42" x2="280" y2="90" stroke="#2d1a5e" stroke-width="1.5"/>
  <line x1="120" y1="107" x2="75"  y2="150" stroke="#2d1a5e" stroke-width="1.5"/>
  <line x1="120" y1="107" x2="165" y2="150" stroke="#2d1a5e" stroke-width="1.5"/>
  <line x1="280" y1="107" x2="235" y2="150" stroke="#2d1a5e" stroke-width="1.5"/>
  <line x1="280" y1="107" x2="325" y2="150" stroke="#2d1a5e" stroke-width="1.5"/>
  <!-- edge labels -->
  <text x="148" y="70" fill="#a78bfa" font-size="8" text-anchor="middle" font-family="monospace">≤ 2.5</text>
  <text x="255" y="70" fill="#a78bfa" font-size="8" text-anchor="middle" font-family="monospace">&gt; 2.5</text>
  <!-- root node -->
  <rect x="158" y="20" width="84" height="24" rx="4" fill="#1a1033" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="200" y="36" fill="#c4b5fd" font-size="9" text-anchor="middle" font-family="monospace">feature_0</text>
  <!-- internal nodes -->
  <rect x="86" y="88" width="68" height="22" rx="4" fill="#1a1033" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="120" y="103" fill="#c4b5fd" font-size="9" text-anchor="middle" font-family="monospace">feature_1</text>
  <rect x="246" y="88" width="68" height="22" rx="4" fill="#1a1033" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="280" y="103" fill="#c4b5fd" font-size="9" text-anchor="middle" font-family="monospace">feature_2</text>
  <!-- leaf nodes -->
  <rect x="50"  y="148" width="50" height="22" rx="4" fill="#7c3aed" opacity="0.8"/>
  <text x="75"  y="163" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">class 0</text>
  <rect x="140" y="148" width="50" height="22" rx="4" fill="#e879f9" opacity="0.8"/>
  <text x="165" y="163" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">class 1</text>
  <rect x="210" y="148" width="50" height="22" rx="4" fill="#e879f9" opacity="0.8"/>
  <text x="235" y="163" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">class 1</text>
  <rect x="300" y="148" width="50" height="22" rx="4" fill="#7c3aed" opacity="0.8"/>
  <text x="325" y="163" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">class 0</text>
  <!-- depth labels -->
  <text x="14" y="36"  fill="#2d1a5e" font-size="8" font-family="monospace">depth 0</text>
  <text x="14" y="102" fill="#2d1a5e" font-size="8" font-family="monospace">depth 1</text>
  <text x="14" y="163" fill="#2d1a5e" font-size="8" font-family="monospace">depth 2</text>
  <!-- title -->
  <text x="210" y="192" fill="#a78bfa" font-size="9" text-anchor="middle" font-family="monospace" opacity="0.7">decision_trees.py</text>
</svg>
```

- [ ] **Step 4: Create random-forest.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
  <rect width="400" height="200" fill="#0d0d1a"/>
  <!-- helper: mini tree function approximated with 3 trees -->
  <!-- Tree 1 -->
  <line x1="65" y1="52" x2="45" y2="80" stroke="#2d1a5e" stroke-width="1"/>
  <line x1="65" y1="52" x2="85" y2="80" stroke="#2d1a5e" stroke-width="1"/>
  <rect x="50" y="42" width="30" height="16" rx="3" fill="#1a1033" stroke="#7c3aed" stroke-width="1.2"/>
  <text x="65" y="54" fill="#c4b5fd" font-size="7" text-anchor="middle" font-family="monospace">f≤1.2</text>
  <rect x="32" y="78" width="26" height="16" rx="3" fill="#7c3aed" opacity="0.8"/>
  <text x="45" y="90" fill="#fff" font-size="7" text-anchor="middle" font-family="monospace">cls 0</text>
  <rect x="72" y="78" width="26" height="16" rx="3" fill="#e879f9" opacity="0.8"/>
  <text x="85" y="90" fill="#fff" font-size="7" text-anchor="middle" font-family="monospace">cls 1</text>
  <text x="65" y="120" fill="#a78bfa" font-size="8" text-anchor="middle" font-family="monospace">tree_1</text>

  <!-- Tree 2 -->
  <line x1="200" y1="52" x2="180" y2="80" stroke="#2d1a5e" stroke-width="1"/>
  <line x1="200" y1="52" x2="220" y2="80" stroke="#2d1a5e" stroke-width="1"/>
  <rect x="185" y="42" width="30" height="16" rx="3" fill="#1a1033" stroke="#7c3aed" stroke-width="1.2"/>
  <text x="200" y="54" fill="#c4b5fd" font-size="7" text-anchor="middle" font-family="monospace">f≤2.5</text>
  <rect x="167" y="78" width="26" height="16" rx="3" fill="#e879f9" opacity="0.8"/>
  <text x="180" y="90" fill="#fff" font-size="7" text-anchor="middle" font-family="monospace">cls 1</text>
  <rect x="207" y="78" width="26" height="16" rx="3" fill="#7c3aed" opacity="0.8"/>
  <text x="220" y="90" fill="#fff" font-size="7" text-anchor="middle" font-family="monospace">cls 0</text>
  <text x="200" y="120" fill="#a78bfa" font-size="8" text-anchor="middle" font-family="monospace">tree_2</text>

  <!-- Tree 3 -->
  <line x1="335" y1="52" x2="315" y2="80" stroke="#2d1a5e" stroke-width="1"/>
  <line x1="335" y1="52" x2="355" y2="80" stroke="#2d1a5e" stroke-width="1"/>
  <rect x="320" y="42" width="30" height="16" rx="3" fill="#1a1033" stroke="#7c3aed" stroke-width="1.2"/>
  <text x="335" y="54" fill="#c4b5fd" font-size="7" text-anchor="middle" font-family="monospace">f≤0.8</text>
  <rect x="302" y="78" width="26" height="16" rx="3" fill="#7c3aed" opacity="0.8"/>
  <text x="315" y="90" fill="#fff" font-size="7" text-anchor="middle" font-family="monospace">cls 0</text>
  <rect x="342" y="78" width="26" height="16" rx="3" fill="#e879f9" opacity="0.8"/>
  <text x="355" y="90" fill="#fff" font-size="7" text-anchor="middle" font-family="monospace">cls 1</text>
  <text x="335" y="120" fill="#a78bfa" font-size="8" text-anchor="middle" font-family="monospace">tree_3</text>

  <!-- Aggregation arrows -->
  <line x1="65" y1="128" x2="190" y2="158" stroke="#7c3aed" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="200" y1="128" x2="200" y2="158" stroke="#7c3aed" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="335" y1="128" x2="210" y2="158" stroke="#7c3aed" stroke-width="1" stroke-dasharray="3,3"/>

  <!-- Output box -->
  <rect x="150" y="158" width="100" height="24" rx="4" fill="#1a1033" stroke="#e879f9" stroke-width="1.5"/>
  <text x="200" y="174" fill="#e879f9" font-size="9" text-anchor="middle" font-family="monospace">majority vote</text>

  <!-- label -->
  <text x="200" y="196" fill="#a78bfa" font-size="9" text-anchor="middle" font-family="monospace" opacity="0.7">random_forest.py</text>
</svg>
```

- [ ] **Step 5: Create support-vector-machines.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
  <rect width="400" height="200" fill="#0d0d1a"/>
  <!-- grid -->
  <line x1="50" y1="175" x2="375" y2="175" stroke="#a78bfa" stroke-width="1.5"/>
  <line x1="50" y1="15"  x2="50"  y2="175" stroke="#a78bfa" stroke-width="1.5"/>
  <line x1="80"  y1="15" x2="80"  y2="175" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="140" y1="15" x2="140" y2="175" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="200" y1="15" x2="200" y2="175" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="260" y1="15" x2="260" y2="175" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="320" y1="15" x2="320" y2="175" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="50" y1="45"  x2="375" y2="45"  stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="50" y1="85"  x2="375" y2="85"  stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="50" y1="125" x2="375" y2="125" stroke="#2d1a5e" stroke-width="0.5"/>

  <!-- class 0 points (violet, top-right) -->
  <circle cx="230" cy="55"  r="5" fill="none" stroke="#7c3aed" stroke-width="2"/>
  <circle cx="265" cy="40"  r="5" fill="none" stroke="#7c3aed" stroke-width="2"/>
  <circle cx="290" cy="70"  r="5" fill="none" stroke="#7c3aed" stroke-width="2"/>
  <circle cx="310" cy="50"  r="5" fill="none" stroke="#7c3aed" stroke-width="2"/>
  <circle cx="340" cy="80"  r="5" fill="none" stroke="#7c3aed" stroke-width="2"/>
  <circle cx="255" cy="90"  r="5" fill="none" stroke="#7c3aed" stroke-width="2"/>
  <circle cx="320" cy="35"  r="5" fill="none" stroke="#7c3aed" stroke-width="2"/>

  <!-- class 1 points (magenta, bottom-left) -->
  <circle cx="80"  cy="140" r="5" fill="#e879f9" opacity="0.7"/>
  <circle cx="110" cy="125" r="5" fill="#e879f9" opacity="0.7"/>
  <circle cx="90"  cy="160" r="5" fill="#e879f9" opacity="0.7"/>
  <circle cx="130" cy="150" r="5" fill="#e879f9" opacity="0.7"/>
  <circle cx="155" cy="135" r="5" fill="#e879f9" opacity="0.7"/>
  <circle cx="115" cy="108" r="5" fill="#e879f9" opacity="0.7"/>
  <circle cx="165" cy="155" r="5" fill="#e879f9" opacity="0.7"/>

  <!-- support vectors (circled) -->
  <circle cx="155" cy="135" r="9" fill="none" stroke="#e879f9" stroke-width="1" stroke-dasharray="2,2"/>
  <circle cx="230" cy="55"  r="9" fill="none" stroke="#7c3aed" stroke-width="1" stroke-dasharray="2,2"/>

  <!-- decision boundary (solid) -->
  <line x1="55" y1="170" x2="375" y2="25" stroke="#f0abfc" stroke-width="2" opacity="0.9"/>
  <!-- margin lines (dashed) -->
  <line x1="55" y1="185" x2="355" y2="40" stroke="#7c3aed" stroke-width="1" stroke-dasharray="6,4" opacity="0.6"/>
  <line x1="75" y1="155" x2="385" y2="10" stroke="#e879f9" stroke-width="1" stroke-dasharray="6,4" opacity="0.6"/>

  <!-- labels -->
  <text x="356" y="22"  fill="#f0abfc" font-size="8" font-family="monospace">hyperplane</text>
  <text x="210" y="192" fill="#a78bfa" font-size="10" text-anchor="middle" font-family="monospace">x₁</text>
  <text x="24"  y="97"  fill="#a78bfa" font-size="10" text-anchor="middle" font-family="monospace" transform="rotate(-90,24,97)">x₂</text>
  <text x="210" y="13"  fill="#a78bfa" font-size="9"  text-anchor="middle" font-family="monospace" opacity="0.7">support_vector_machines.py</text>
</svg>
```

- [ ] **Step 6: Create k-nearest-neighbors.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
  <rect width="400" height="200" fill="#0d0d1a"/>
  <!-- grid -->
  <line x1="50" y1="175" x2="375" y2="175" stroke="#a78bfa" stroke-width="1.5"/>
  <line x1="50" y1="15"  x2="50"  y2="175" stroke="#a78bfa" stroke-width="1.5"/>
  <line x1="110" y1="15" x2="110" y2="175" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="170" y1="15" x2="170" y2="175" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="230" y1="15" x2="230" y2="175" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="290" y1="15" x2="290" y2="175" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="350" y1="15" x2="350" y2="175" stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="50" y1="55"  x2="375" y2="55"  stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="50" y1="95"  x2="375" y2="95"  stroke="#2d1a5e" stroke-width="0.5"/>
  <line x1="50" y1="135" x2="375" y2="135" stroke="#2d1a5e" stroke-width="0.5"/>

  <!-- class A cluster (violet, bottom-left) -->
  <circle cx="85"  cy="145" r="5" fill="#7c3aed" opacity="0.9"/>
  <circle cx="100" cy="160" r="5" fill="#7c3aed" opacity="0.9"/>
  <circle cx="120" cy="148" r="5" fill="#7c3aed" opacity="0.9"/>
  <circle cx="80"  cy="130" r="5" fill="#7c3aed" opacity="0.9"/>
  <circle cx="108" cy="135" r="5" fill="#7c3aed" opacity="0.9"/>
  <circle cx="135" cy="160" r="5" fill="#7c3aed" opacity="0.9"/>

  <!-- class B cluster (magenta, top-right) -->
  <circle cx="280" cy="45"  r="5" fill="#e879f9" opacity="0.9"/>
  <circle cx="305" cy="60"  r="5" fill="#e879f9" opacity="0.9"/>
  <circle cx="320" cy="40"  r="5" fill="#e879f9" opacity="0.9"/>
  <circle cx="295" cy="75"  r="5" fill="#e879f9" opacity="0.9"/>
  <circle cx="340" cy="55"  r="5" fill="#e879f9" opacity="0.9"/>
  <circle cx="310" cy="82"  r="5" fill="#e879f9" opacity="0.9"/>

  <!-- mixed middle -->
  <circle cx="175" cy="110" r="5" fill="#7c3aed" opacity="0.7"/>
  <circle cx="210" cy="98"  r="5" fill="#e879f9" opacity="0.7"/>
  <circle cx="195" cy="130" r="5" fill="#7c3aed" opacity="0.7"/>
  <circle cx="225" cy="118" r="5" fill="#e879f9" opacity="0.7"/>

  <!-- query point (star) -->
  <polygon points="200,78 203,87 213,87 205,93 208,102 200,96 192,102 195,93 187,87 197,87"
           fill="#f0abfc" stroke="#fff" stroke-width="0.5"/>

  <!-- k=3 radius circle (dashed) -->
  <circle cx="200" cy="90" r="32" fill="none" stroke="#f0abfc" stroke-width="1.2" stroke-dasharray="5,4" opacity="0.6"/>

  <!-- k=3 nearest neighbors lines -->
  <line x1="200" y1="90" x2="175" y2="110" stroke="#f0abfc" stroke-width="1" opacity="0.4"/>
  <line x1="200" y1="90" x2="195" y2="130" stroke="#f0abfc" stroke-width="1" opacity="0.4"/>
  <line x1="200" y1="90" x2="210" y2="98"  stroke="#f0abfc" stroke-width="1" opacity="0.4"/>

  <!-- legend -->
  <circle cx="62" cy="25" r="4" fill="#7c3aed"/>
  <text x="70" y="29" fill="#a78bfa" font-size="8" font-family="monospace">class A</text>
  <circle cx="105" cy="25" r="4" fill="#e879f9"/>
  <text x="113" y="29" fill="#a78bfa" font-size="8" font-family="monospace">class B</text>
  <polygon points="155,25 157,31 163,31 158,35 160,41 155,37 150,41 152,35 147,31 153,31" fill="#f0abfc" transform="scale(0.6) translate(103,15)"/>
  <text x="168" y="29" fill="#a78bfa" font-size="8" font-family="monospace">query (k=3)</text>

  <!-- axis labels -->
  <text x="213" y="192" fill="#a78bfa" font-size="10" text-anchor="middle" font-family="monospace">x₁</text>
  <text x="24"  y="97"  fill="#a78bfa" font-size="10" text-anchor="middle" font-family="monospace" transform="rotate(-90,24,97)">x₂</text>
  <text x="213" y="13"  fill="#a78bfa" font-size="9"  text-anchor="middle" font-family="monospace" opacity="0.7">k_nearest_neighbors.py</text>
</svg>
```

- [ ] **Step 7: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: `[build] Complete!`

- [ ] **Step 8: Commit**

```bash
git add public/assets/blog/ src/styles/shiki-theme.json astro.config.mjs
git commit -m "feat: add matplotlib-style SVG thumbnails for blog posts"
```

---

## Task 4: Blog Index — Add SVG Images, Remove Emojis

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Read the current file**

```bash
cat src/pages/blog/index.astro
```

Identify the 6 model card entries. Each has: an `<a>` wrapping a `<TerminalCard>`, inside which is a `<div>` with an emoji, the model name `<h3>`, description `<p>`, and a prompt line.

- [ ] **Step 2: Update each of the 6 model cards**

For EACH model card, make two changes:
1. Remove the emoji element (the `<div>` containing just the emoji character)
2. Add an `<img>` tag as the FIRST element inside the TerminalCard's body div (before the h3), with these attributes:

```html
<!-- Linear Regression card example -->
<a href="/blog/linear-regression" style="text-decoration: none; display: block;">
  <TerminalCard filename="linear-regression.py">
    <img
      src="/assets/blog/linear-regression.svg"
      alt="Linear Regression plot"
      style="width: 100%; height: 160px; object-fit: cover; display: block; border-bottom: 1px solid var(--border);"
    />
    <div style="padding: 1.25rem;">
      <h3 style="font-size: 1rem; font-weight: bold; color: var(--text-primary); margin-bottom: 6px;">Linear Regression</h3>
      <p style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 12px;">
        <!-- original description preserved -->
      </p>
      <div style="font-size: 0.75rem; color: var(--accent-magenta);">
        <span style="color: var(--accent-violet);">$</span> cat ./linear-regression.md →
      </div>
    </div>
  </TerminalCard>
</a>
```

Apply the same pattern for all 6 cards with their respective SVG paths:
- `logistic-regression` → `/assets/blog/logistic-regression.svg`
- `decision-trees` → `/assets/blog/decision-trees.svg`
- `random-forest` → `/assets/blog/random-forest.svg`
- `support-vector-machines` → `/assets/blog/support-vector-machines.svg`
- `k-nearest-neighbors` → `/assets/blog/k-nearest-neighbors.svg`

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: `[build] Complete!`

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: add SVG plot thumbnails to blog cards, remove emojis"
```

---

## Task 5: Blog Post — Terminal Chrome + Copy Button Script

**Files:**
- Modify: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Read the current file**

```bash
cat "src/pages/blog/[slug].astro"
```

Find where the `</BaseLayout>` closing tag is. The script and style blocks go before it.

- [ ] **Step 2: Add the terminal chrome script and styles**

Add the following just before the closing `</BaseLayout>` tag:

```astro
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const proseEl = document.querySelector('.prose');
    if (!proseEl) return;

    proseEl.querySelectorAll('pre').forEach((pre) => {
      // Extract language from Shiki's code element class
      const codeEl = pre.querySelector('code');
      const langClass = codeEl
        ? Array.from(codeEl.classList).find(c => c.startsWith('language-'))
        : null;
      const lang = langClass ? langClass.replace('language-', '') : 'code';

      // Build terminal header
      const header = document.createElement('div');
      header.className = 'code-terminal-header';
      header.innerHTML = `
        <span class="code-dot code-dot-red"></span>
        <span class="code-dot code-dot-yellow"></span>
        <span class="code-dot code-dot-green"></span>
        <span class="code-filename">script.${lang}</span>
        <button class="copy-btn" type="button">Copy</button>
      `;

      // Wrap pre in terminal card
      const wrapper = document.createElement('div');
      wrapper.className = 'code-terminal-card';
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      // Copy button logic
      const copyBtn = header.querySelector('.copy-btn');
      copyBtn?.addEventListener('click', async () => {
        const text = pre.innerText;
        try {
          await navigator.clipboard.writeText(text);
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
          }, 2000);
        } catch {
          // Fallback for browsers without clipboard API
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
          }, 2000);
        }
      });
    });
  });
</script>
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: `[build] Complete!`

- [ ] **Step 4: Verify in dev server**

```bash
npm run dev -- --port 4322 &
sleep 3 && echo "ready"
```

Open http://localhost:4322/blog/linear-regression (or any blog post) and confirm:
- Code blocks have terminal window chrome (dots + `script.python` label + Copy button)
- Copy button copies code to clipboard and shows "Copied!" for 2s
- Syntax colors match the design system (violet keywords, magenta strings, muted comments)

- [ ] **Step 5: Commit**

```bash
git add "src/pages/blog/[slug].astro"
git commit -m "feat: add terminal chrome and copy-to-clipboard to blog code blocks"
```

---

## Self-Review

**Spec coverage:**
- ✅ Remove emojis from blog index: Task 4
- ✅ 6 matplotlib-style SVG thumbnails: Task 3
- ✅ SVGs added to blog index cards: Task 4
- ✅ Custom Shiki theme with design system colors: Task 1
- ✅ Code block CSS overrides (prose pre, astro-code): Task 2
- ✅ Terminal chrome wrapper script: Task 5
- ✅ Copy to clipboard button with feedback: Task 5

**Type/name consistency:**
- CSS classes `.code-terminal-card`, `.code-terminal-header`, `.code-dot`, `.code-filename`, `.copy-btn`, `.copied` defined in Task 2 (global.css) and used in Task 5 (script). Consistent throughout.
- SVG filenames match between Task 3 (file creation) and Task 4 (img src attributes): `linear-regression.svg`, `logistic-regression.svg`, `decision-trees.svg`, `random-forest.svg`, `support-vector-machines.svg`, `k-nearest-neighbors.svg`.

**No placeholders:** All code is complete. No TBDs.
