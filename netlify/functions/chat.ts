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
