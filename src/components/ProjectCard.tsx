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
  const categoryColors = {
    ML: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    WebDev: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  };

  return (
    <div className="group relative bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:-rotate-1 h-full flex flex-col">
      {/* Animated glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

      {/* Project image with overlay */}
      {project.imageUrl && (
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 right-4 z-20">
            <span className={`px-3 py-1 text-xs font-bold rounded-full border backdrop-blur-sm ${
              project.category === 'ML'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            }`}>
              {project.category}
            </span>
          </div>
        </div>
      )}

      <div className="p-6 relative z-10 flex flex-col flex-grow min-h-[380px]">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
          {project.title}
        </h3>

        <p className="text-gray-300 mb-4 leading-relaxed line-clamp-6 flex-grow">
          {project.description}
        </p>

        {/* Tech stack with staggered animation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-800/50 border border-gray-600/50 text-gray-300 text-sm rounded-full hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-300 transition-all duration-300 transform hover:scale-110 whitespace-nowrap h-7 flex items-center"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4 mt-auto">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn flex items-center text-gray-300 hover:text-white transition-colors duration-300"
            >
              <div className="p-2 rounded-full bg-gray-800/50 border border-gray-600/50 group-hover/btn:bg-purple-500/20 group-hover/btn:border-purple-500/50 transition-all duration-300 mr-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <span className="text-sm font-medium">Code</span>
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn flex items-center text-gray-300 hover:text-white transition-colors duration-300"
            >
              <div className="p-2 rounded-full bg-gray-800/50 border border-gray-600/50 group-hover/btn:bg-blue-500/20 group-hover/btn:border-blue-500/50 transition-all duration-300 mr-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <span className="text-sm font-medium">Live</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
