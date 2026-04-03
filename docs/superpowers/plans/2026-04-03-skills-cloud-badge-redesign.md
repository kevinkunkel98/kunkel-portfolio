# SkillsCloud Badge Redesign + LossLandscape Speed Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace white-circle skill badges with dark rounded-square tiles (macOS/skillicons.dev style) and slow the LossLandscape gradient-descent balls to a smooth ~40-second descent.

**Architecture:** Two isolated CSS/TSX edits — no new files, no layout or data changes. SkillsCloud.astro gets a badge shape/color swap; LossLandscape.tsx gets a single float increment change.

**Tech Stack:** Astro 5, React 19, TypeScript strict, CSS custom properties, no test runner

---

## File Map

| File | Change |
|---|---|
| `src/components/SkillsCloud.astro` | `.skill-badge`: bg `#ffffff`→`#242938`, `border-radius: 50%`→`22%`, remove `border` + `box-shadow`; `.skill-badge:hover`: remove box-shadow, add `transform: scale(1.08)` |
| `src/components/LossLandscape.tsx` | `t += 0.0018` → `t += 0.0004` |

---

## Task 1: Swap SkillsCloud badge style to dark rounded square

**Files:**
- Modify: `src/components/SkillsCloud.astro` (`.skill-badge`, `.skill-badge:hover` rules)

- [ ] **Step 1: Open the file and locate `.skill-badge`**

In `src/components/SkillsCloud.astro`, find the `.skill-badge` rule (around line 71).
Current state:
```css
.skill-badge {
  position: absolute;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow:
    inset -4px -4px 8px rgba(0, 0, 0, 0.18),
    inset 4px 4px 8px rgba(255, 255, 255, 0.55),
    0 6px 18px rgba(0, 0, 0, 0.22);
  animation-name: float-drift;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  opacity: 0.9;
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
  cursor: default;
  overflow: hidden;
}
```

- [ ] **Step 2: Replace `.skill-badge` with dark rounded-square version**

Replace the entire `.skill-badge` rule with:
```css
.skill-badge {
  position: absolute;
  width: 92px;
  height: 92px;
  border-radius: 22%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #242938;
  animation-name: float-drift;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  opacity: 0.9;
  transition: opacity 0.2s, transform 0.2s;
  cursor: default;
}
```

- [ ] **Step 3: Update `.skill-badge:hover`**

Current state:
```css
.skill-badge:hover {
  opacity: 1;
  z-index: 10;
  box-shadow:
    inset -4px -4px 8px rgba(0, 0, 0, 0.18),
    inset 4px 4px 8px rgba(255, 255, 255, 0.55),
    0 10px 28px rgba(0, 0, 0, 0.32);
}
```

Replace with:
```css
.skill-badge:hover {
  opacity: 1;
  z-index: 10;
  transform: scale(1.08);
}
```

- [ ] **Step 4: Verify type check passes**

Run: `npm run astro -- check`
Expected: `0 errors, 0 warnings, 0 hints`

- [ ] **Step 5: Commit**

```bash
git add src/components/SkillsCloud.astro
git commit -m "feat: redesign skill badges as dark rounded squares (macOS app icon style)"
```

---

## Task 2: Slow LossLandscape ball speed

**Files:**
- Modify: `src/components/LossLandscape.tsx` (draw loop, line ~97)

- [ ] **Step 1: Locate and update the speed increment**

In `src/components/LossLandscape.tsx`, find:
```ts
      t += 0.0018;
      if (t >= 1) t = 0;
```

Replace with:
```ts
      t += 0.0004;
      if (t >= 1) t = 0;
```

- [ ] **Step 2: Verify type check passes**

Run: `npm run astro -- check`
Expected: `0 errors, 0 warnings, 0 hints`

- [ ] **Step 3: Commit**

```bash
git add src/components/LossLandscape.tsx
git commit -m "fix: slow LossLandscape ball descent to ~40s for smooth animation"
```

---

## Verification

After both tasks:

- [ ] Run `npm run dev` and visually confirm:
  - Skill badges are dark rounded squares with brand-colored icons, no shadow/circle
  - Hover produces a subtle scale-up, no box shadow
  - LossLandscape balls move slowly and smoothly, resetting every ~40 seconds
- [ ] Run `npm run astro -- check` one final time: `0 errors`
