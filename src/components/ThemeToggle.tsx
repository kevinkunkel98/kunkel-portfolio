import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        fontFamily: 'inherit',
        fontSize: '0.75rem',
        padding: '2px 10px',
        border: '1px solid var(--border)',
        borderRadius: '3px',
        background: 'transparent',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        minHeight: '28px',
        minWidth: 'unset',
        lineHeight: 1,
      }}
    >
      {isDark ? '☀' : '☾'}
    </button>
  );
}
