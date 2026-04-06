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
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: isOpen
      ? 'color-mix(in srgb, var(--accent-violet) 80%, #000)'
      : 'var(--accent-violet)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    boxShadow: '0 4px 20px color-mix(in srgb, var(--accent-violet) 40%, transparent)',
    zIndex: 100,
    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease',
    transform: isOpen ? 'rotate(90deg) scale(1.1)' : 'rotate(0deg) scale(1)',
  };

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '5.5rem',
    right: '1.5rem',
    width: '760px',
    maxWidth: 'calc(100vw - 2rem)',
    maxHeight: '82vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-surface)',
    border: '1px solid var(--accent-violet)',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 16px 60px color-mix(in srgb, var(--accent-violet) 25%, transparent)',
    zIndex: 100,
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
    animation: 'chatSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
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
              }} className="chat-cursor">
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
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .chat-cursor { animation: blink 1s step-end infinite; }

        @keyframes chatSlideIn {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.94);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
