# AI Chat Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/about` page with a floating AI chat widget that answers questions in Kevin's voice using Groq (Llama 3.3 70B) and a stuffed-context approach.

**Architecture:** A new static `/about` Astro page hosts the bio + hardware/software/tech grid. A React island (`ChatWidget.tsx`) renders a floating 420px terminal-chrome panel that POSTs to a Netlify Function (`netlify/functions/chat.ts`). The function builds a system prompt from `src/data/kevin-context.ts` + `src/data/projects.ts` and calls the Groq API.

**Tech Stack:** Astro 5, React 19, groq-sdk, Netlify Functions v2, TypeScript, CSS custom properties (no extra CSS libraries)

---

## File Map

| File | Action |
|---|---|
| `src/data/projects.ts` | Create — typed projects array extracted from projects.astro |
| `src/data/kevin-context.ts` | Create — Kevin's knowledge base as exported string |
| `netlify/functions/chat.ts` | Create — Groq API handler |
| `src/components/ChatWidget.tsx` | Create — floating chat UI |
| `src/pages/about.astro` | Create — About page |
| `src/components/Navigation.astro` | Modify — add /about link |
| `src/pages/projects.astro` | Modify — import from src/data/projects.ts |
| `.env.example` | Create |

---

## Task 1: Extract Projects Data

**Files:**
- Create: `src/data/projects.ts`
- Modify: `src/pages/projects.astro`

- [ ] **Step 1: Create `src/data/projects.ts`**

```typescript
export interface Project {
  title: string;
  description: string;
  technologies: string[];
  category: 'ML' | 'WebDev';
  githubUrl?: string;
  liveUrl?: string;
  imageUrl: string;
}

export const allProjects: Project[] = [
  {
    title: "LibreChat LiteLLM Proxy",
    description: "A lightweight proxy implementation that bridges LibreChat with LiteLLM, enabling unified access to multiple LLMs. Experimental setup trying to replace Openwebui and being the real open-source Cuba Libre.",
    technologies: ["litellm", "librechat", "docker", "fastapi"],
    category: "ML",
    githubUrl: "https://github.com/kevinkunkel98/LibreChat-LiteLLM-Proxy",
    imageUrl: "/assets/libre.jpeg"
  },
  {
    title: "FSR RAG Chat Assistant",
    description: "The FSR RAG Chat Assistant is a Retrieval-Augmented Generation (RAG) chatbot designed to support the student council of the computer science faculty at the University of Leipzig.",
    technologies: ["ollama", "spring-ai", "react", "shadcn-ui", "pgvector"],
    category: "ML",
    githubUrl: "https://github.com/kevinkunkel98/fsr-rag-assistant.git",
    imageUrl: "/assets/fsrchat.png"
  },
  {
    title: "Computer Science Faculty Website",
    description: "Web presence static page that displays all relevant information, news, and events related to the elected council members of the computer science faculty at the University of Leipzig.",
    technologies: ["astro", "node", "flowbite", "netlify"],
    category: "WebDev",
    liveUrl: "https://fsinf.informatik.uni-leipzig.de/",
    imageUrl: "/assets/fsinf.png"
  },
  {
    title: "90s Forum Post SVM Classifier",
    description: "Support Vector Machine that classifies forum posts from the 90s into different topics based on their content using TF-IDF vectorization and gives insights into early internet shitposting.",
    technologies: ["scikit-learn", "kaggle", "fastapi", "react"],
    category: "ML",
    githubUrl: "https://github.com/kevinkunkel98/90sInternetSVM.git",
    imageUrl: "/assets/netscape.jpg"
  },
  {
    title: "Vilkulakis - The Online Game",
    description: "Online real-time multiplayer version of the card game Werewolves that has one lobby and supports 20 active players with a chat GUI.",
    technologies: ["node", "socket-io", "express", "mongodb"],
    category: "WebDev",
    githubUrl: "https://github.com/kevinkunkel98/VilkulakisGame.git",
    imageUrl: "/assets/vilkulakis.png"
  },
  {
    title: "Study BrAIn - Study Smarter Chat",
    description: "RAG Chat that helps you study and chat with your lecture slides and embed notes using GPT 3.5 and ChromaDB.",
    technologies: ["flask", "bootstrap", "langchain", "chromadb"],
    category: "ML",
    githubUrl: "https://github.com/kevinkunkel98/Study-Brain-Chatbot",
    imageUrl: "/assets/studybrain.png"
  },
  {
    title: "Linux Dev Blog and Portfolio Website",
    description: "My first real portfolio website that I used to document my journey into web development and Arch Linux customizations.",
    technologies: ["astro", "react", "express", "tailwind"],
    category: "WebDev",
    liveUrl: "https://kevin-kunkel.netlify.app/",
    imageUrl: "/assets/devblog.png"
  }
];
```

- [ ] **Step 2: Update `src/pages/projects.astro` — replace hardcoded array with import**

Remove the `const allProjects = [...]` block (lines 7–64) and replace with:

```typescript
import { allProjects } from '../data/projects';
import type { Project } from '../data/projects';
```

Keep the `mlProjects` / `webDevProjects` filter lines and all the JSX unchanged.

- [ ] **Step 3: Verify build**

```bash
cd /Users/macbook/Documents/Dev/kunkel-portfolio && npm run build 2>&1 | tail -6
```

Expected: `[build] Complete!`

- [ ] **Step 4: Commit**

```bash
git add src/data/projects.ts src/pages/projects.astro
git commit -m "refactor: extract projects data to src/data/projects.ts"
```

---

## Task 2: Create Kevin Context Scaffold

**Files:**
- Create: `src/data/kevin-context.ts`

This file is the bot's entire knowledge base. The scaffold has the right structure — Kevin fills in his actual content.

- [ ] **Step 1: Create `src/data/kevin-context.ts`**

```typescript
// This is the knowledge base for the AI chat widget.
// Fill in your actual content here — the more detail, the better the bot.
// The bot will use this verbatim in its system prompt.

export const kevinContext = `
## About Kevin

Hi, I'm Kevin Kunkel — a machine learning engineer and web developer based in Leipzig, Germany.
I'm passionate about building things that actually work and that people actually use.
I study computer science and split my time between ML research, web dev, and tinkering with my setup.

[FILL IN: 2-3 more sentences about yourself, your background, what drives you]

## Personality & Voice

- Casual and direct — no corporate speak
- Dry humour, occasionally self-deprecating
- Honest about what I know and what I don't
- Short sentences. Get to the point.
- Opinionated but open to being wrong

## Hardware

[FILL IN: your machine (e.g. "MacBook Pro M3 14-inch"), monitor, keyboard, mouse/trackpad, desk setup]

Example format:
- Machine: MacBook Pro M3 14-inch
- Monitor: LG 27UK850 4K
- Keyboard: Keychron Q1 (Gateron Browns)
- Mouse: Logitech MX Master 3

## Software & Daily Tools

[FILL IN: OS, editor, terminal, shell, dotfiles, apps you actually use every day]

Example format:
- OS: Arch Linux (btw) / macOS
- Editor: Neovim with lazy.nvim
- Terminal: Alacritty + tmux
- Shell: zsh with starship prompt
- Browser: Firefox

## Tech Stack

Languages I'm comfortable with: [FILL IN e.g. Python, TypeScript, Java, Go]
ML/Data: [FILL IN e.g. scikit-learn, PyTorch, LangChain, Ollama]
Web: [FILL IN e.g. Astro, React, FastAPI, Express]
Infra: [FILL IN e.g. Docker, Netlify, PostgreSQL]

## Projects I'm Proud Of

**FSR RAG Chat Assistant** — RAG chatbot for the CS faculty student council at Leipzig University.
Built with Spring AI, Ollama, pgvector, React and shadcn-ui. First thing I built that people used daily without me nagging them.

**Study BrAIn** — RAG chatbot for studying with your own lecture slides. GPT 3.5 + ChromaDB + Flask.
Built this during exam season out of pure desperation. It helped.

**LibreChat LiteLLM Proxy** — bridges LibreChat with LiteLLM for unified multi-LLM access.
Ongoing experiment to build a self-hosted alternative to paying for ChatGPT Plus.

[FILL IN: add opinions, war stories, what you learned from each project]

## Opinions & Takes

Tabs vs spaces: [FILL IN your take]
Best language for ML: [FILL IN]
Most overrated tech: [FILL IN]
Most underrated tech: [FILL IN]
Vim vs Emacs: [FILL IN]
What I think about AI hype: [FILL IN]

## Sample Q&A (use these to learn my tone)

Q: What are you working on right now?
A: [FILL IN — something real and current]

Q: What's your favourite project?
A: Probably the FSR RAG assistant. First time I built something people actually used daily without me nagging them.

Q: Tabs or spaces?
A: [FILL IN]

Q: What do you do when you're not coding?
A: [FILL IN]

Q: What's your hot take on AI?
A: [FILL IN]

Q: Why Leipzig?
A: [FILL IN]

## Things the bot should NEVER say

- Don't claim to be the real Kevin
- Don't make up specific details that aren't in this file
- Don't oversell or use marketing language
- If asked something not covered here, say "honestly not sure, ask the real Kevin at [contact page]"
`;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/macbook/Documents/Dev/kunkel-portfolio && npm run build 2>&1 | tail -6
```

Expected: `[build] Complete!`

- [ ] **Step 3: Commit**

```bash
git add src/data/kevin-context.ts
git commit -m "feat: add kevin-context scaffold for AI chat bot"
```

---

## Task 3: Install groq-sdk + Create Netlify Function

**Files:**
- Modify: `package.json` (via npm install)
- Create: `netlify/functions/chat.ts`

- [ ] **Step 1: Install groq-sdk**

```bash
cd /Users/macbook/Documents/Dev/kunkel-portfolio && npm install groq-sdk
```

Expected: package added to `dependencies` in package.json.

- [ ] **Step 2: Create `netlify/functions/chat.ts`**

```typescript
import Groq from 'groq-sdk';
import { kevinContext } from '../../src/data/kevin-context';
import { allProjects } from '../../src/data/projects';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildSystemPrompt(): string {
  const projectList = allProjects
    .map(p => `- ${p.title} (${p.category}): ${p.description} [${p.technologies.join(', ')}]`)
    .join('\n');

  return `You are an AI version of Kevin Kunkel, a machine learning engineer and web developer.
You are embedded on his portfolio site at kevinkunkel.dev.
You speak in first person as Kevin — casual, technically direct, dry humour, honest.
Do not oversell or use corporate speak. Short sentences preferred.
If you genuinely don't know something, say so honestly — never make things up.
If asked about something not in your knowledge base, say "honestly not sure, ask the real Kevin at kevinkunkel.dev/contact".

Always open your FIRST message by telling the user you're an AI trained on Kevin's writing and projects, not the real Kevin.
After that first disclosure, stay in character.

--- KEVIN'S KNOWLEDGE BASE ---
${kevinContext}

--- PROJECTS ---
${projectList}`;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!process.env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Chat unavailable' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages)) throw new Error('invalid');
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 512,
      temperature: 0.8,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        ...messages.slice(-10),
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Kevin's AI is having a moment, try again" }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const config = { path: '/api/chat' };
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/macbook/Documents/Dev/kunkel-portfolio && npm run build 2>&1 | tail -6
```

Expected: `[build] Complete!`

- [ ] **Step 4: Create `.env.example`**

```bash
cat > /Users/macbook/Documents/Dev/kunkel-portfolio/.env.example << 'EOF'
# Get your free API key at https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here
EOF
```

- [ ] **Step 5: Commit**

```bash
git add netlify/functions/chat.ts package.json package-lock.json .env.example
git commit -m "feat: add Netlify function for Groq-powered AI chat"
```

---

## Task 4: Create ChatWidget React Component

**Files:**
- Create: `src/components/ChatWidget.tsx`

- [ ] **Step 1: Create `src/components/ChatWidget.tsx`**

```tsx
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content: "Hey! Quick heads up — I'm an AI trained on Kevin's writing and projects, not the real Kevin. I'll do my best to answer as he would. What do you want to know?",
  },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated.slice(-10) }),
      });
      const data = await res.json();
      const reply = data.reply ?? data.error ?? 'Something went wrong.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Something broke on my end. Try again?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const bubbleStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'var(--accent-violet)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    boxShadow: '0 4px 20px color-mix(in srgb, var(--accent-violet) 40%, transparent)',
    zIndex: 100,
    transition: 'transform 0.15s',
  };

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '5rem',
    right: '1.5rem',
    width: '420px',
    maxWidth: 'calc(100vw - 2rem)',
    maxHeight: '520px',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-surface)',
    border: '1px solid var(--accent-violet)',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 8px 40px color-mix(in srgb, var(--accent-violet) 20%, transparent)',
    zIndex: 100,
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
  };

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={bubbleStyle}
        aria-label={isOpen ? 'Close chat' : 'Chat with Kevin AI'}
        title={isOpen ? 'Close chat' : 'Chat with Kevin AI'}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div style={panelStyle}>
          {/* Header */}
          <div style={{
            background: 'var(--bg-elevated)',
            borderBottom: '1px solid var(--border)',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
          }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28ca41', display: 'inline-block' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flex: 1, marginLeft: 4 }}>kevin-ai.ts</span>
            <span style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: '3px',
              padding: '1px 6px',
            }}>
              ⚠ AI clone
            </span>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  maxWidth: '85%',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user'
                    ? 'color-mix(in srgb, var(--accent-violet) 20%, transparent)'
                    : 'var(--bg-elevated)',
                  border: `1px solid ${msg.role === 'user' ? 'color-mix(in srgb, var(--accent-violet) 40%, transparent)' : 'var(--border)'}`,
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '0.8125rem',
                color: 'var(--accent-magenta)',
              }}>
                ▋
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{
            borderTop: '1px solid var(--border)',
            padding: '8px 10px',
            display: 'flex',
            gap: '6px',
            background: 'var(--bg-elevated)',
            flexShrink: 0,
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              disabled={loading}
              style={{
                flex: 1,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '6px 10px',
                fontSize: '0.8125rem',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                outline: 'none',
                minHeight: 'unset',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? 'var(--border)' : 'var(--accent-magenta)',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '0.8125rem',
                color: '#fff',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.15s',
                minHeight: 'unset',
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/macbook/Documents/Dev/kunkel-portfolio && npm run build 2>&1 | tail -6
```

Expected: `[build] Complete!`

- [ ] **Step 3: Commit**

```bash
git add src/components/ChatWidget.tsx
git commit -m "feat: add ChatWidget React component with terminal chrome"
```

---

## Task 5: Create About Page

**Files:**
- Create: `src/pages/about.astro`

The hardware/software/tech content in this page should be updated by Kevin to match his actual setup. The structure is fixed; the content inside each card is editable.

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TerminalCard from '../components/TerminalCard.astro';
import ChatWidget from '../components/ChatWidget';
---

<BaseLayout title="About - Kevin Kunkel" description="About Kevin Kunkel — ML engineer, web developer, terminal enthusiast">

  <div style="max-width: 56rem; margin: 0 auto; padding: 2rem 1rem;">

    <!-- Page header -->
    <div style="margin-bottom: 2rem; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace; text-align: center;">
      <div style="font-size: clamp(1rem, 3vw, 1.5rem); color: var(--accent-magenta); margin-bottom: 0.5rem; font-weight: 600;">
        // cat about.md
      </div>
      <div style="font-size: 0.875rem; color: var(--text-muted);">
        # Human-readable documentation
      </div>
    </div>

    <!-- Bio card -->
    <div style="margin-bottom: 1.5rem;">
      <TerminalCard filename="kevin.md">
        <div style="padding: 1.5rem;">
          <h1 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin: 0 0 1rem; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;">
            Kevin Kunkel
          </h1>
          <p style="font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.7; margin: 0 0 0.75rem;">
            ML engineer and web developer based in Leipzig, Germany.
            I build things that actually work — RAG chatbots, classifiers, web apps — and document the journey along the way.
          </p>
          <p style="font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.7; margin: 0;">
            Currently studying computer science and spending too much time on my Neovim config.
          </p>
          <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="/projects" style="font-size: 0.8125rem; color: var(--accent-magenta); text-decoration: none; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;">$ ls ./projects →</a>
            <a href="/blog" style="font-size: 0.8125rem; color: var(--accent-magenta); text-decoration: none; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;">$ ls ./blog →</a>
            <a href="/contact" style="font-size: 0.8125rem; color: var(--accent-magenta); text-decoration: none; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;">$ ./contact.sh →</a>
          </div>
        </div>
      </TerminalCard>
    </div>
  </div>

  <!-- Chat widget — floats fixed over the page -->
  <ChatWidget client:load />

</BaseLayout>

<style>
  @media (min-width: 640px) {
    .stack-grid {
      grid-template-columns: repeat(3, 1fr) !important;
    }
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/macbook/Documents/Dev/kunkel-portfolio && npm run build 2>&1 | tail -6
```

Expected: `[build] Complete!`

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add About page with bio and hardware/software/stack cards"
```

---

## Task 6: Update Navigation + Wrap Up

**Files:**
- Modify: `src/components/Navigation.astro`

- [ ] **Step 1: Add `/about` to the navItems array in `src/components/Navigation.astro`**

Change:

```typescript
const navItems = [
  { path: '/home',     href: '/' },
  { path: '/projects', href: '/projects' },
  { path: '/blog',     href: '/blog' },
  { path: '/contact',  href: '/contact' },
];
```

To:

```typescript
const navItems = [
  { path: '/home',     href: '/' },
  { path: '/about',    href: '/about' },
  { path: '/projects', href: '/projects' },
  { path: '/blog',     href: '/blog' },
  { path: '/contact',  href: '/contact' },
];
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/macbook/Documents/Dev/kunkel-portfolio && npm run build 2>&1 | tail -6
```

Expected: `[build] Complete!`

- [ ] **Step 3: Manual smoke test**

Start the dev server and verify:

```bash
cd /Users/macbook/Documents/Dev/kunkel-portfolio && npm run dev
```

Open http://localhost:4321/about and check:
- [ ] Navigation shows `/about` link, highlighted when on that page
- [ ] Bio terminal card renders
- [ ] 3-column grid (hardware/software/stack) renders on desktop, stacks on mobile
- [ ] Purple `💬` bubble is visible bottom-right
- [ ] Clicking bubble opens the chat panel with terminal chrome header
- [ ] `⚠ AI clone` badge visible in header
- [ ] First message shows the AI disclosure text (no API call needed — it's hardcoded)
- [ ] Input and `→` button are present

Note: To test the actual chat, you need a `GROQ_API_KEY` in `.env`. Get a free key at https://console.groq.com — it takes 30 seconds.

- [ ] **Step 4: Final commit**

```bash
git add src/components/Navigation.astro
git commit -m "feat: add /about to navigation"
```
