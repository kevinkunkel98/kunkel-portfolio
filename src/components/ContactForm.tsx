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

    // Simulate form submission
    try {
      // In a real app, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black/60 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg font-mono">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-green-500 text-sm ml-2">~/contact-form</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-green-500 text-sm mb-2 flex items-center">
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
            className="w-full px-4 py-3 bg-gray-900 border-2 border-green-500/50 text-green-400 rounded font-mono text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 placeholder-green-800 transition-all"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-green-500 text-sm mb-2 flex items-center">
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
            className="w-full px-4 py-3 bg-gray-900 border-2 border-green-500/50 text-green-400 rounded font-mono text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 placeholder-green-800 transition-all"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-green-500 text-sm mb-2 flex items-center">
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
            className="w-full px-4 py-3 bg-gray-900 border-2 border-green-500/50 text-green-400 rounded font-mono text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 placeholder-green-800 resize-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold py-3 px-4 rounded font-mono text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] border-2 border-green-500 shadow-lg shadow-green-500/20"
        >
          <span className="flex items-center justify-center gap-2">
            <span>{isSubmitting ? '⏳' : '>'}</span>
            <span>{isSubmitting ? 'EXECUTING...' : 'EXECUTE SEND_MESSAGE'}</span>
          </span>
        </button>

        {submitStatus === 'success' && (
          <div className="p-4 bg-green-900/30 border-2 border-green-500 text-green-400 rounded font-mono text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <div>
                <div className="font-bold mb-1">[SUCCESS]</div>
                <div>Message transmitted successfully. Response received: 200 OK</div>
              </div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-900/30 border-2 border-red-500 text-red-400 rounded font-mono text-sm">
            <div className="flex items-start gap-2">
              <span className="text-red-500">✗</span>
              <div>
                <div className="font-bold mb-1">[ERROR]</div>
                <div>Transmission failed. Please retry operation.</div>
              </div>
            </div>
          </div>
        )}

        {/* Terminal cursor effect when typing */}
        {(formData.name || formData.email || formData.message) && (
          <div className="text-green-500 text-xs opacity-60 flex items-center gap-2">
            <span className="animate-pulse">▊</span>
            <span>Awaiting input...</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
