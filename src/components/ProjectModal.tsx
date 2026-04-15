import { useEffect, useRef } from 'react';
import type { Project } from '../data/projects';

interface Props {
  project: Project | null;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export default function ProjectModal({ project, onClose, triggerRef }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus management: move focus in on open, return it on close
  useEffect(() => {
    if (project) {
      closeButtonRef.current?.focus();
    } else {
      (triggerRef?.current as HTMLElement | null)?.focus();
    }
  }, [project]);

  // Escape key + body scroll lock + focus trap
  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      // Focus trap: keep Tab/Shift+Tab inside the modal panel
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('disabled'));
        if (focusable.length === 0) { e.preventDefault(); return; }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  const isML = project.category === 'ML';
  const badgeColor = isML ? 'var(--accent-violet)' : 'var(--accent-magenta)';
  const badgeBg = isML ? 'rgba(124,58,237,0.15)' : 'rgba(192,38,211,0.15)';
  const badgeBorder = isML ? 'rgba(124,58,237,0.4)' : 'rgba(192,38,211,0.4)';
  const hasLinks = project.githubUrl || project.liveUrl;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-modal="true"
      role="dialog"
      aria-label={project.title}
    >
      <div className="modal-panel" ref={panelRef}>
        {/* Hero strip */}
        <div className="modal-hero">
          {project.imageUrl ? (
            <img src={project.imageUrl} alt="" className="modal-hero-img" />
          ) : (
            <div className="modal-hero-gradient" />
          )}
          <div className="modal-hero-fade" />

          <span
            className="modal-badge"
            style={{ color: badgeColor, background: badgeBg, border: `1px solid ${badgeBorder}` }}
          >
            {project.category}
          </span>

          <button
            ref={closeButtonRef}
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>

          <div className="modal-hero-title">
            <h2 className="modal-title">{project.title}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="modal-label">// about</div>
          <p className="modal-description">{project.description}</p>

          <div className="modal-label">// stack</div>
          <div className="modal-chips">
            {project.technologies.map((tech) => (
              <span key={tech} className="modal-chip">{tech}</span>
            ))}
          </div>

          {hasLinks && (
            <div className="modal-footer">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-btn modal-btn-primary"
                >
                  GitHub →
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-btn"
                >
                  Live Demo ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(5,5,10,0.92);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: modal-fade-in 0.2s ease;
        }
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .modal-panel {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace;
          animation: modal-slide-up 0.2s ease;
        }
        @keyframes modal-slide-up {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        /* Hero */
        .modal-hero {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #0a0a12;
          flex-shrink: 0;
        }
        .modal-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.55;
          display: block;
        }
        .modal-hero-gradient {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a0a2e 0%, #0d0d1f 60%, #1a0a15 100%);
        }
        .modal-hero-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--bg-surface) 0%, transparent 60%);
        }
        .modal-badge {
          position: absolute;
          top: 12px;
          left: 14px;
          font-size: 0.6rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          border-radius: 3px;
          padding: 2px 7px;
        }
        .modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(0,0,0,0.6);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
          font-family: inherit;
        }
        .modal-close:hover {
          color: var(--text-primary);
          border-color: var(--accent-violet);
        }
        .modal-close:focus-visible {
          outline: 2px solid var(--accent-violet);
          outline-offset: 2px;
        }
        .modal-hero-title {
          position: absolute;
          bottom: 14px;
          left: 16px;
          right: 16px;
        }
        .modal-title {
          font-size: 1.2rem;
          color: var(--text-primary);
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.5px;
          line-height: 1.3;
        }

        /* Body */
        .modal-body {
          padding: 18px 20px 20px;
        }
        .modal-label {
          font-size: 0.6rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .modal-description {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0 0 18px 0;
        }
        .modal-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 20px;
        }
        .modal-chip {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 3px 9px;
          font-size: 0.6rem;
          color: var(--text-muted);
          letter-spacing: 0.3px;
        }
        .modal-footer {
          display: flex;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .modal-btn {
          display: inline-flex;
          align-items: center;
          padding: 7px 16px;
          border-radius: 5px;
          font-size: 0.65rem;
          font-family: inherit;
          cursor: pointer;
          text-decoration: none;
          border: 1px solid var(--accent-violet);
          color: var(--accent-violet);
          background: transparent;
          transition: background 0.15s;
        }
        .modal-btn:hover {
          background: rgba(124,58,237,0.15);
        }
        .modal-btn-primary {
          background: var(--accent-violet);
          color: #fff;
        }
        .modal-btn-primary:hover {
          background: #6d28d9;
        }
        .modal-btn:focus-visible {
          outline: 2px solid var(--accent-violet);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
