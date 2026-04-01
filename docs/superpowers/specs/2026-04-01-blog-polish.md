# Blog Polish Spec
**Date:** 2026-04-01

## Goal

Polish the blog section: replace emoji thumbnails with matplotlib-style SVG plot images, fix code block styling to match the homepage terminal card aesthetic, and add copy-to-clipboard buttons to all code blocks.

---

## 1. Blog Index — SVG Plot Images + Remove Emojis

### SVG Files

Six SVG files created at `/public/assets/blog/`, 400×200px each. All share:
- Background: `#0d0d1a`
- Grid lines: `#2d1a5e`
- Primary accent: `#7c3aed` (violet)
- Secondary accent: `#e879f9` (magenta)
- Axis/label text: `#a78bfa`
- Data points/lines: mix of violet, magenta, `#c4b5fd`

| File | Plot type |
|---|---|
| `linear-regression.svg` | Scatter points + regression line, x/y axes, grid |
| `logistic-regression.svg` | Sigmoid S-curve, probability y-axis 0→1, threshold dashed line |
| `decision-trees.svg` | Binary tree — root node, 2 decision nodes, 4 leaf nodes with labels |
| `random-forest.svg` | 3 small trees side-by-side + arrow pointing to output box |
| `support-vector-machines.svg` | Two-class scatter plot + solid hyperplane + dashed margin lines |
| `k-nearest-neighbors.svg` | Colored cluster blobs + star query point + radius circle |

### Blog Index Card Changes (`src/pages/blog/index.astro`)

Each of the 6 model cards:
- Add `<img>` tag above the TerminalCard body content pointing to the corresponding SVG
- Image sits between the TerminalCard header strip and the text content (inside the card body, at the top)
- Remove emoji from card content
- Image: `width: 100%; height: 160px; object-fit: cover; display: block;`

Model → SVG mapping:
- Linear Regression → `/assets/blog/linear-regression.svg`
- Logistic Regression → `/assets/blog/logistic-regression.svg`
- Decision Trees → `/assets/blog/decision-trees.svg`
- Random Forest → `/assets/blog/random-forest.svg`
- Support Vector Machines → `/assets/blog/support-vector-machines.svg`
- K-Nearest Neighbors → `/assets/blog/k-nearest-neighbors.svg`

---

## 2. Code Block Styling — Terminal Chrome + Shiki Theme

### Custom Shiki Theme (`src/styles/shiki-theme.json`)

A JSON file defining a custom VS Code–compatible Shiki theme with our palette:

| Token type | Color |
|---|---|
| Background | `#1a1033` (--bg-elevated) |
| Default text | `#c4b5fd` (--text-secondary) |
| Keywords (`keyword`, `storage`, `control`) | `#7c3aed` |
| Strings (`string`, `string.quoted`) | `#e879f9` |
| Comments (`comment`) | `#a78bfa` |
| Functions (`entity.name.function`) | `#f0abfc` |
| Numbers/constants (`constant.numeric`, `constant.language`) | `#e879f9` |
| Types/classes (`entity.name.type`, `entity.name.class`) | `#c4b5fd` |
| Variables (`variable`) | `#c4b5fd` |
| Operators (`keyword.operator`) | `#7c3aed` |
| Punctuation | `#a78bfa` |

### Astro Config (`astro.config.mjs`)

Add `markdown.shikiConfig` pointing to the custom theme file:

```js
markdown: {
  shikiConfig: {
    theme: './src/styles/shiki-theme.json',
  },
}
```

### CSS (`src/styles/global.css`)

Override Typography's prose pre/code defaults so Shiki output renders on our background without conflicts:

```css
.prose pre {
  background-color: var(--bg-elevated) !important;
  border: 1px solid var(--border);
  border-radius: 0;           /* terminal chrome handles radius */
  padding: 0 !important;      /* terminal chrome script handles padding */
  margin: 0 !important;
}

.prose :not(pre) > code {
  background-color: var(--bg-elevated);
  color: var(--accent-magenta);
  border: 1px solid var(--border);
}

/* Shiki output */
.astro-code {
  background-color: var(--bg-elevated) !important;
  padding: 1rem 1.25rem !important;
  overflow-x: auto;
}
```

### Terminal Chrome Script (`src/pages/blog/[slug].astro`)

Inline `<script>` that runs after DOM load:

1. Finds all `pre` elements inside `.prose`
2. For each `pre`:
   - Reads the language from the inner `code` element's class (e.g. `language-python` → `python`) or falls back to `code`
   - Wraps the `pre` in a terminal card structure:
     ```html
     <div class="code-terminal-card">
       <div class="code-terminal-header">
         <!-- traffic lights -->
         <span class="dot red"></span>
         <span class="dot yellow"></span>
         <span class="dot green"></span>
         <!-- filename label -->
         <span class="code-filename">script.python</span>
         <!-- copy button (right side) -->
         <button class="copy-btn">Copy</button>
       </div>
       <!-- pre goes here -->
     </div>
     ```
3. Copy button:
   - On click: reads `pre.innerText`, writes to clipboard via `navigator.clipboard.writeText()`
   - Text changes to `Copied!` for 2 seconds then resets
4. All wrapper styles injected as a `<style>` block or via inline styles — using CSS vars

### Terminal Card Wrapper Styles

```css
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

.dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.dot.red    { background: #ff5f57; }
.dot.yellow { background: #ffbd2e; }
.dot.green  { background: #28ca41; }

.code-filename {
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
  min-height: unset;
  transition: color 0.15s, border-color 0.15s;
}

.copy-btn:hover { color: var(--accent-magenta); border-color: var(--accent-magenta); }
.copy-btn.copied { color: #28ca41; border-color: #28ca41; }
```

---

## Files to Create / Modify

| File | Action |
|---|---|
| `public/assets/blog/linear-regression.svg` | Create |
| `public/assets/blog/logistic-regression.svg` | Create |
| `public/assets/blog/decision-trees.svg` | Create |
| `public/assets/blog/random-forest.svg` | Create |
| `public/assets/blog/support-vector-machines.svg` | Create |
| `public/assets/blog/k-nearest-neighbors.svg` | Create |
| `src/styles/shiki-theme.json` | Create |
| `astro.config.mjs` | Modify — add shikiConfig |
| `src/styles/global.css` | Modify — add .prose pre / .astro-code overrides |
| `src/pages/blog/index.astro` | Modify — add SVG images, remove emojis |
| `src/pages/blog/[slug].astro` | Modify — add terminal chrome + copy button script + styles |
