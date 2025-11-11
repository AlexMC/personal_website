import Link from 'next/link';
import { getImagePath } from '../lib/utils';

const Projects = ({ projects, limit }) => {
  const displayProjects = limit ? projects.slice(0, limit) : projects;

  if (!displayProjects || displayProjects.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {displayProjects.map((project, index) => (
        <div key={index} className="block bg-surface p-6 border border-primary-dark hover:border-primary transition-colors duration-300 group">
          <Link href={`/work/${project.slug}`} className="block">
            <div className="relative h-48 mb-6 bg-primary-dark/20">
              {project.image && (
                <img
                  src={getImagePath(project.image)}
                  alt={project.title}
                  className="w-full h-48 object-cover mix-blend-luminosity group-hover:mix-blend-normal duration-300"
                />
              )}
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary">{project.title}</h3>
            <p className="text-primary-light mb-6">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="px-3 py-1 text-sm bg-primary-dark text-primary border border-primary-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Link>
          {project.link && (
            <div className="mt-4">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-light hover:text-primary transition-colors"
              >
                VIEW PROJECT &rarr;
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Projects;
