import React from 'react';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  category: 'ML' | 'WebDev';
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const filename = project.category === 'ML'
    ? project.title.toLowerCase().replace(/\s+/g, '-') + '.py'
    : project.title.toLowerCase().replace(/\s+/g, '-') + '.tsx';

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: '6px',
        overflow: 'hidden',
        background: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'border-color 0.2s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-violet)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Terminal header */}
      <div style={{
        background: 'var(--bg-elevated)',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28ca41', display: 'inline-block' }} />
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{filename}</span>
      </div>

      {/* Project image */}
      {project.imageUrl && (
        <div style={{ position: 'relative', height: '160px', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={project.imageUrl}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'var(--accent-violet)',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            padding: '2px 8px',
            borderRadius: '3px',
          }}>
            {project.category}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
          {project.title}
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px', flexGrow: 1 }}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {project.technologies.map((tech, i) => (
            <span key={i} style={{
              fontSize: '0.7rem',
              padding: '2px 8px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--accent-magenta)',
              borderRadius: '3px',
            }}>
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-magenta)')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)')}
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-magenta)')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)')}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
