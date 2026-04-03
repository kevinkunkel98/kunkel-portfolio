# Spec: SkillsCloud Badge Redesign + LossLandscape Speed Fix

**Date:** 2026-04-03

---

## Overview

Two visual polish changes:

1. **SkillsCloud** — replace white circle badges with dark rounded-square tiles (macOS/skillicons.dev app icon style)
2. **LossLandscape** — slow the gradient descent balls from a 9-second run to ~40 seconds for a smooth, meditative feel

---

## SkillsCloud Badge Redesign

### Goal

Match the skillicons.dev reference aesthetic: dark tile (`#242938`), rounded square (`border-radius: 22%`), brand-colored icon centered inside. No shadow, no border, no pseudo-elements.

### Changes to `src/components/SkillsCloud.astro`

- `.skill-badge`:
  - `background: #242938` (was `#ffffff`)
  - `border-radius: 22%` (was `50%`)
  - Remove `border`, `box-shadow`
  - Remove `overflow: hidden` (no longer needed without sheen)
  - Keep: `width: 92px`, `height: 92px`, `position: absolute`, `display: flex`, animation props, `opacity: 0.9`, `transition`, `cursor: default`

- `.skill-badge:hover`:
  - Keep opacity bump and z-index
  - Remove box-shadow (was the sphere glow) — optionally add a subtle `transform: scale(1.08)` on hover

- `.badge-icon` and `.badge-icon :global(svg)`:
  - Keep `width: 46px`, `height: 46px`
  - Keep `fill: var(--icon-color) !important`

- No `::before` pseudo-element (already removed in previous session)

- Mobile (`max-width: 639px`): keep `64px` tile / `32px` icon

### No layout or animation changes

Floating positions, durations, delays, and keyframe values remain unchanged.

---

## LossLandscape Speed Fix

### Goal

Balls should roll smoothly and slowly — a full descent takes ~40 seconds rather than ~9.

### Change to `src/components/LossLandscape.tsx`

- In the `draw()` loop, change `t += 0.0018` → `t += 0.0004`
- No other changes (reset-on-1 behavior and simultaneous starts from previous session are already in place)

---

## Files Changed

| File | Change |
|---|---|
| `src/components/SkillsCloud.astro` | Badge shape: circle→rounded square, white→dark, remove shadow/border |
| `src/components/LossLandscape.tsx` | Ball speed: 0.0018→0.0004 |

---

## Acceptance Criteria

- Badges render as dark rounded squares matching `#242938` background with brand-colored icons
- No circle shape, no white fill, no drop shadow visible
- Floating animation continues unchanged
- LossLandscape balls take ~40 seconds to traverse their full paths before resetting
- `npm run astro -- check` reports 0 errors
