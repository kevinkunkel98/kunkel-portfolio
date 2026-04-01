import React, { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to Netlify Forms
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="backdrop-blur-sm p-6 rounded-lg font-mono"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      {/* Terminal Header */}
      <div
        className="flex items-center gap-2 mb-4 pb-2"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-green-500 text-sm ml-2">~/contact-form</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
        {/* Hidden fields for Netlify */}
        <input type="hidden" name="form-name" value="contact" />
        <div hidden>
          <input name="bot-field" />
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm mb-2 flex items-center"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="text-green-400">$</span>
            <span className="ml-2">--name</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name..."
            className="w-full px-4 py-3 rounded font-mono text-sm focus:outline-none transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm mb-2 flex items-center"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="text-green-400">$</span>
            <span className="ml-2">--email</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 rounded font-mono text-sm focus:outline-none transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm mb-2 flex items-center"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="text-green-400">$</span>
            <span className="ml-2">--message</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            required
            placeholder="Type your message here..."
            className="w-full px-4 py-3 rounded font-mono text-sm focus:outline-none resize-none transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-bold py-3 px-4 rounded font-mono text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          style={{
            background: isSubmitting ? 'var(--bg-elevated)' : 'var(--accent-violet)',
            color: isSubmitting ? 'var(--text-muted)' : 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <span>{isSubmitting ? '⏳' : '>'}</span>
            <span>{isSubmitting ? 'EXECUTING...' : 'EXECUTE SEND_MESSAGE'}</span>
          </span>
        </button>

        {submitStatus === 'success' && (
          <div
            className="p-4 rounded font-mono text-sm"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--accent-magenta)',
              color: 'var(--text-muted)',
            }}
          >
            <div className="flex items-start gap-2">
              <span style={{ color: 'var(--accent-magenta)' }}>✓</span>
              <div>
                <div className="font-bold mb-1">[SUCCESS]</div>
                <div>Message transmitted successfully. Response received: 200 OK</div>
              </div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div
            className="p-4 rounded font-mono text-sm"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--accent-magenta)',
              color: 'var(--text-muted)',
            }}
          >
            <div className="flex items-start gap-2">
              <span style={{ color: 'var(--accent-magenta)' }}>✗</span>
              <div>
                <div className="font-bold mb-1">[ERROR]</div>
                <div>Transmission failed. Please retry operation.</div>
              </div>
            </div>
          </div>
        )}

        {/* Terminal cursor effect when typing */}
        {(formData.name || formData.email || formData.message) && (
          <div
            className="text-xs opacity-60 flex items-center gap-2"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="animate-pulse">▊</span>
            <span>Awaiting input...</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
