# Experience Timeline Redesign — Design Spec

**Date:** 2026-04-03  
**Scope:** `src/pages/about.astro`, new `src/components/ExperienceTimeline.astro`

---

## Goal

Replace the flat, bordered list of experience entries (currently inside a `TerminalCard`) with a vertical alternating-card timeline — matching the reference design while staying on-brand with the site's existing color tokens and monospace aesthetic.

---

## What Changes

| File | Change |
|---|---|
| `src/components/ExperienceTimeline.astro` | **New.** Self-contained timeline component with inline data and scoped styles. |
| `src/pages/about.astro` | Replace the experience block inside `TerminalCard filename="cv.md"` with `<ExperienceTimeline />`. Education + Skills remain inside their existing `TerminalCard`. |

The `TerminalCard` that wraps the full CV section is **split**: the timeline lives outside any `TerminalCard` (free-standing), while Education and Skills stay inside one.

---

## Component: `ExperienceTimeline.astro`

### Data Interface

```ts
interface ExperienceEntry {
  role: string;        // "AI Engineer"
  company: string;     // "Exxeta AG · Leipzig, DE"
  initials: string;    // "EX" — shown in the spine circle
  period: string;      // "2025 — present"
  description: string; // 1–2 sentence prose
  tags: string[];      // ["FastAPI", "OpenWebUI", ...]
}
```

Data is defined as a `const entries: ExperienceEntry[]` array inline in the component frontmatter. Four entries total (current data from `about.astro`):

1. AI Engineer — Exxeta AG (2025 — present)
2. Fullstack Developer — Exxeta AG (2024 — 2025)
3. Junior Consultant — M&L AG (2020 — 2021)
4. Fullstack Developer — M&L AG (2017 — 2019)

### Rendering

The component renders:
- A section heading: `"// experience"` styled in `var(--accent-magenta)`, monospace, matching the existing page header style
- The timeline container with a vertical center spine

For each entry at index `i`:
- `i % 2 === 0` (even, 0-indexed): card on left, spine marker on right of center
- `i % 2 === 1` (odd): spine marker on left of center, card on right

Each row is a flex container:
```
[card / spacer] [spine column] [spacer / card]
```

The spine column contains:
- The vertical line segment (a CSS border on the column itself)
- The initials circle (centered on the spine) with the date label beside it

### Card Anatomy

```
┌──────────────────────────────────►
│  Role Title (bold, --text-primary)
│  Company (--accent-violet, smaller)
│  
│  Description text (--text-secondary, 0.85rem, 1.6 line-height)
│
│  [tag] [tag] [tag]
└─────────────────────────────────┘
```

- `background: var(--bg-surface)`
- `border: 1px solid var(--border)`
- `border-radius: 8px`
- `padding: 1.25rem 1.5rem`
- The notch/arrow pointing toward the spine is a CSS pseudo-element (`::before`) using a rotated square (`transform: rotate(45deg)`) matching `var(--bg-surface)` fill and `var(--border)` on the two exposed sides
- Cards take up roughly 45% of the row width on desktop

### Spine Circle

- Size: 36px × 36px
- `background: var(--bg-elevated)`
- `border: 2px solid var(--accent-violet)`
- `border-radius: 50%`
- 2-letter initials in `var(--accent-violet)`, 0.7rem, bold, centered
- Positioned centered on the vertical spine line

### Date Label

- Monospace, 0.75rem, `var(--text-muted)`
- Placed adjacent to the spine circle, on the side opposite the card
- On even entries: date is to the right of the spine → `margin-left: 0.75rem`
- On odd entries: date is to the left of the spine → `margin-right: 0.75rem; text-align: right`

### Tech Tags (existing pill style)

```astro
<span style="font-size: 0.7rem; color: var(--accent-magenta); background: color-mix(in srgb, var(--accent-magenta) 10%, transparent); border: 1px solid color-mix(in srgb, var(--accent-magenta) 25%, transparent); border-radius: 3px; padding: 0.1rem 0.45rem;">{t}</span>
```

Identical to the current style — no change here.

---

## Responsive Behavior

### Desktop (≥640px)
- Three-column flex row: `[card or spacer 45%] [spine 10%] [spacer or card 45%]`
- Alternating left/right placement
- Spine line is a 2px `border-left` on the spine column, `var(--border)` color

### Mobile (<640px)
- Single column: spine moves to the left edge
- All cards span full width, indented to the right of the spine
- Spine circle sits on the left, date appears above the card
- CSS class `timeline-row` gets `flex-direction: column` overridden with a left-aligned stack

---

## Integration in `about.astro`

The current layout inside `TerminalCard filename="cv.md"`:

```
TerminalCard (cv.md)
  ├── Experience section  ← REMOVED from here
  ├── Education section   ← STAYS
  └── Skills section      ← STAYS
```

New layout:

```
<ExperienceTimeline />           ← new, free-standing
<TerminalCard filename="cv.md">
  Education section
  Skills section
</TerminalCard>
```

The `margin-bottom` spacing between sections is maintained.

---

## What Does NOT Change

- Bio card (`kevin.md` TerminalCard) — unchanged
- Education section — unchanged, stays in `TerminalCard`
- Skills section — unchanged, stays in `TerminalCard`
- Hardware / Software / Tech-stack grid — unchanged
- `TerminalCard.astro` component — unchanged
- Color tokens — all existing tokens used as-is
- No new dependencies or data files

---

## Acceptance Criteria

- [ ] Experience section renders as a vertical alternating timeline on desktop
- [ ] Spine has a visible vertical line connecting all entries
- [ ] Each entry has an initials circle centered on the spine
- [ ] Date labels appear adjacent to the spine on the side opposite the card
- [ ] Cards have a directional notch pointing toward the spine
- [ ] On mobile, all cards stack single-column with the spine on the left
- [ ] Existing Education and Skills sections are visually unchanged
- [ ] `npm run astro -- check` passes with no type errors
- [ ] No `any` types introduced
