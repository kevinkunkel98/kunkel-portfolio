import { useState, useRef } from 'react';
import { allProjects } from '../data/projects';
import type { Project } from '../data/projects';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

type Filter = 'All' | 'ML' | 'WebDev';

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const filtered = activeFilter === 'All'
    ? allProjects
    : allProjects.filter((p) => p.category === activeFilter);

  const filters: Filter[] = ['All', 'ML', 'WebDev'];
  const filterLabels: Record<Filter, string> = {
    All: './all',
    ML: './machine_learning',
    WebDev: './web_development',
  };

  function handleExpand(project: Project, el: HTMLElement) {
    triggerRef.current = el;
    setSelectedProject(project);
  }

  return (
    <>
      {/* Filter buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.75rem',
        marginBottom: '2.5rem',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
      }}>
        {filters.map((f) => {
          const active = f === activeFilter;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                border: `1px solid ${active ? 'var(--accent-violet)' : 'var(--border)'}`,
                color: active ? 'var(--accent-violet)' : 'var(--text-muted)',
                background: 'transparent',
                fontFamily: 'inherit',
                fontSize: '0.8125rem',
                padding: '0.4rem 1rem',
                borderRadius: '3px',
                cursor: 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>{filterLabels[f].split('/')[0] + '/'}</span>
              {filterLabels[f].split('/')[1]}
            </button>
          );
        })}
      </div>

      {/* Card grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
        gap: '1.5rem',
      }}>
        {filtered.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
            onExpand={(p, el) => handleExpand(p, el)}
          />
        ))}
      </div>

      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        triggerRef={triggerRef}
      />
    </>
  );
}
