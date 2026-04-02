# AI Chat Widget — Design Spec
**Date:** 2026-04-02

## Goal

Add a new `/about` page and a floating AI chat widget that lets visitors talk to an AI version of Kevin. The bot is trained on Kevin's curated knowledge doc plus existing site content (blog posts, projects), uses stuffed-context (no vector DB), and speaks in Kevin's voice while explicitly disclosing it's an AI clone.

---

## 1. About Page (`/about`)

Single-column layout:

1. **Bio terminal card** — `kevin.md` filename, short paragraph about Kevin in his own voice
2. **3-column grid of terminal cards**:
   - `hardware.py` — machine, peripherals, desk setup
   - `software.sh` — OS, editor, terminal, daily tools
   - `tech-stack.ts` — languages, frameworks, ML tools
3. **Chat widget** — React island floating fixed bottom-right (see §3)

Navigation gets a new `about` link.

---

## 2. Knowledge Base

### `src/data/kevin-context.md`

Kevin writes this file. It is the sole source of truth for the bot's knowledge and persona. It should include:

- Bio / background
- Personality description and voice notes (casual, dry humour, honest, technically direct)
- Hardware, software, daily tools
- Project summaries with opinions
- Favourite technologies and why
- Sample Q&A pairs in Kevin's actual voice, e.g.:
  ```
  Q: What's your favourite project?
  A: Probably the FSR RAG assistant. First time I built something people actually used daily without me nagging them.

  Q: Tabs or spaces?
  A: Spaces. Fight me.
  ```
- Anything the bot should never say or get wrong

### Existing content bundled at build time

- `src/content/blog/*.md` — frontmatter (title, description, tags) only, not full body
- Project list from a new `src/data/projects.ts` — extracted from `projects.astro`

---

## 3. Chat Widget (`src/components/ChatWidget.tsx`)

React component, `client:load`.

### Closed state
Purple `💬` circle button fixed bottom-right (`right: 1.5rem`, `bottom: 1.5rem`). On click → opens panel.

### Open state
420px wide panel, fixed bottom-right above the bubble. Terminal chrome header:
- Traffic light dots (red/yellow/green)
- Filename: `kevin-ai.ts`
- `⚠ AI clone` badge (right-aligned, small, muted)
- `✕` close button

Chat body:
- Scrollable message list
- Kevin's messages: left-aligned, `var(--bg-elevated)` background
- User messages: right-aligned, `var(--accent-violet)` tinted background
- First message auto-sent on open: AI introduces itself and discloses it's an AI clone

Input bar at bottom:
- Text input + send button (magenta `→`)
- `Enter` key submits

### State
- Conversation history in React state (resets on page reload — no persistence)
- Last 10 messages sent per API request
- Loading indicator while awaiting response (blinking `▋` cursor)

---

## 4. Netlify Function (`netlify/functions/chat.ts`)

**Endpoint:** `POST /.netlify/functions/chat`

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "what are you working on?" }
  ]
}
```

**Response:** JSON `{ "reply": "..." }`

### System prompt construction

```
You are an AI version of Kevin Kunkel, a machine learning engineer and web developer based in Leipzig.
You are embedded on his portfolio site at kevinkunkel.dev.
You speak in first person as Kevin — casual, technically direct, dry humour, honest.
Do not oversell or use corporate speak. Short sentences preferred.
If you genuinely don't know something, say so — don't make things up.

Always open your FIRST message by telling the user you're an AI trained on Kevin's writing and projects, not the real Kevin.
After that first disclosure, stay in character.

--- KEVIN'S KNOWLEDGE BASE ---
{contents of kevin-context.md}

--- PROJECTS ---
{project list}

--- BLOG POSTS ---
{blog post titles + descriptions}
```

### Groq API call

- Model: `llama-3.3-70b-versatile`
- Max tokens: 512 per reply
- Temperature: 0.8 (conversational but not unhinged)
- API key: `process.env.GROQ_API_KEY`

### Error handling

- Missing `GROQ_API_KEY` → 500 with message "Chat unavailable"
- Groq API error → 502 with message "Kevin's AI is having a moment, try again"
- Malformed request → 400

---

## 5. Project Data Extraction

Extract the hardcoded `allProjects` array from `src/pages/projects.astro` into `src/data/projects.ts` so both the projects page and the Netlify function can import it without duplication.

---

## 6. Environment & Config

**`.env.example`** (committed):
```
GROQ_API_KEY=your_groq_api_key_here
```

**`.env`** (gitignored — already in `.gitignore`):
```
GROQ_API_KEY=gsk_...
```

Netlify: add `GROQ_API_KEY` as an environment variable in the Netlify dashboard.

---

## Files to Create / Modify

| File | Action |
|---|---|
| `src/data/kevin-context.md` | Create — Kevin fills in |
| `src/data/projects.ts` | Create — extracted from projects.astro |
| `netlify/functions/chat.ts` | Create — Groq API handler |
| `src/components/ChatWidget.tsx` | Create — React chat UI |
| `src/pages/about.astro` | Create — About page |
| `src/components/Navigation.astro` | Modify — add About nav link |
| `src/pages/projects.astro` | Modify — import from src/data/projects.ts |
| `.env.example` | Create |
