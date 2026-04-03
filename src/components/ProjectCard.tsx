import { useRef } from 'react';
import type { Project } from '../data/projects';

// Slugs that exist on skillicons.dev — everything else is skipped silently
const SKILL_ICON_SLUGS = new Set([
  'python', 'pytorch', 'fastapi', 'react', 'docker',
  'nodejs', 'express', 'mongodb', 'flask', 'astro',
  'tailwind', 'opencv', 'sklearn',
]);

// Normalize project tech strings to skillicons slugs
function toSkillSlug(tech: string): string | null {
  const normalized = tech.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (normalized === 'scikitlearn' || normalized === 'sklearn') return 'sklearn';
  if (normalized === 'nodejs' || normalized === 'node') return 'nodejs';
  if (SKILL_ICON_SLUGS.has(normalized)) return normalized;
  return null;
}

interface Props {
  project: Project;
  onExpand: (project: Project, el: HTMLElement) => void;
}

export default function ProjectCard({ project, onExpand }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const icons = project.technologies
    .map(toSkillSlug)
    .filter((s): s is string => s !== null)
    .slice(0, 4);

  const isML = project.category === 'ML';
  const badgeColor = isML ? 'var(--accent-violet)' : 'var(--accent-magenta)';
  const badgeBg = isML ? 'rgba(124,58,237,0.15)' : 'rgba(192,38,211,0.15)';
  const badgeBorder = isML ? 'rgba(124,58,237,0.4)' : 'rgba(192,38,211,0.4)';

  // First sentence of description for the hover excerpt
  const excerpt = project.description.split(/[.!?]/)[0] + '.';

  return (
    <div
      ref={cardRef}
      className="proj-card"
      role="button"
      aria-label={`Expand ${project.title}`}
      tabIndex={0}
      onClick={() => onExpand(project, cardRef.current!)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onExpand(project, cardRef.current!); } }}
    >
      {/* Image / gradient area */}
      <div className="proj-card-image">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt="" className="proj-card-img" />
        ) : (
          <div className="proj-card-gradient">
            <span className="proj-card-glyph">{'{ }'}</span>
          </div>
        )}

        {/* Category badge */}
        <span
          className="proj-card-badge"
          style={{ color: badgeColor, background: badgeBg, border: `1px solid ${badgeBorder}` }}
        >
          {project.category}
        </span>

        {/* Hover overlay */}
        <div className="proj-card-overlay">
          <p className="proj-card-excerpt">{excerpt}</p>
          <div className="proj-card-overlay-links">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="proj-card-link"
              >
                GitHub
              </a>
            )}
            <button className="proj-card-link" onClick={(e) => { e.stopPropagation(); onExpand(project, cardRef.current!); }}>
              Expand ↗
            </button>
          </div>
        </div>

        <span className="proj-card-expand-hint">click to expand</span>
      </div>

      {/* Footer */}
      <div className="proj-card-footer">
        <span className="proj-card-title">{project.title}</span>
        <div className="proj-card-icons">
          {icons.map((slug) => (
            <img
              key={slug}
              src={`https://skillicons.dev/icons?i=${slug}`}
              alt={slug}
              width={16}
              height={16}
              className="proj-card-icon"
            />
          ))}
        </div>
      </div>

      <style>{`
        .proj-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace;
          display: flex;
          flex-direction: column;
        }
        .proj-card:hover,
        .proj-card:focus-visible {
          border-color: var(--accent-violet);
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(124,58,237,0.25);
          outline: none;
        }
        .proj-card:focus-visible {
          outline: 2px solid var(--accent-violet);
          outline-offset: 2px;
        }

        /* Image area */
        .proj-card-image {
          position: relative;
          height: 160px;
          overflow: hidden;
          background: #0a0a12;
          flex-shrink: 0;
        }
        .proj-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.7;
          transition: opacity 0.3s ease, transform 0.3s ease;
          display: block;
        }
        .proj-card:hover .proj-card-img {
          opacity: 0.3;
          transform: scale(1.04);
        }
        .proj-card-gradient {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a0a2e 0%, #0d0d1f 60%, #1a0a15 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .proj-card-glyph {
          font-size: 2rem;
          color: var(--text-primary);
          opacity: 0.12;
        }

        /* Badge */
        .proj-card-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          border-radius: 3px;
          padding: 2px 7px;
          font-family: inherit;
        }

        /* Hover overlay */
        .proj-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10,10,18,0.92);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 16px;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .proj-card:hover .proj-card-overlay {
          opacity: 1;
        }
        .proj-card-excerpt {
          font-size: 11px;
          color: #ccc;
          line-height: 1.6;
          margin: 0 0 12px 0;
        }
        .proj-card-overlay-links {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .proj-card-link {
          font-size: 10px;
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid var(--accent-violet);
          color: var(--accent-violet);
          text-decoration: none;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
        }
        .proj-card-link:hover {
          background: rgba(124,58,237,0.2);
        }

        /* Expand hint */
        .proj-card-expand-hint {
          position: absolute;
          bottom: 8px;
          right: 10px;
          font-size: 9px;
          color: var(--accent-violet);
          opacity: 0;
          transition: opacity 0.25s ease;
          letter-spacing: 1px;
          text-transform: uppercase;
          pointer-events: none;
        }
        .proj-card:hover .proj-card-expand-hint {
          opacity: 1;
        }

        /* Footer */
        .proj-card-footer {
          padding: 10px 14px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-shrink: 0;
        }
        .proj-card-title {
          font-size: 12px;
          color: var(--text-primary);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }
        .proj-card-icons {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }
        .proj-card-icon {
          border-radius: 2px;
          display: block;
        }
      `}</style>
    </div>
  );
}
