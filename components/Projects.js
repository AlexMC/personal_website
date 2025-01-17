import { projects } from '../data/projects';
import Image from 'next/image';

const Projects = () => {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-surface p-6 border border-primary-dark hover:border-primary transition-all duration-300"
            >
              <div className="relative h-48 mb-6 bg-primary-dark/20">
                {project.image && (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity duration-300"
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
            </a>
          ))}
        </div>
      </div>
  );
};

export default Projects;
