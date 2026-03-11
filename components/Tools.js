import Link from 'next/link';
import { getImagePath } from '../lib/utils';

const Tools = ({ tools, limit }) => {
  const displayTools = limit ? tools.slice(0, limit) : tools;
  if (!tools || tools.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayTools.map((tool, index) => (
        <a
          key={index}
          href={tool.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-surface p-6 border border-primary-dark hover:border-primary transition-colors duration-300 group"
        >
          <div className="relative h-56 mb-6 bg-primary-dark/20">
            {tool.image && (
              <img
                src={getImagePath(tool.image)}
                alt={tool.title}
                className="w-full h-56 object-cover mix-blend-luminosity group-hover:mix-blend-normal duration-300"
              />
            )}
          </div>
          <h3 className="text-xl font-bold mb-3 text-primary">{tool.title}</h3>
          <p className="text-primary-light mb-6">{tool.description}</p>
          <span className="text-primary-light group-hover:text-primary transition-colors">
            OPEN TOOL &rarr;
          </span>
        </a>
        ))}
      </div>
      {limit && (
        <div className="pt-8">
          <Link href="/tools" className="text-primary-light hover:text-primary transition-colors">
            VIEW ALL TOOLS &rarr;
          </Link>
        </div>
      )}
    </div>
  );
};

export default Tools;
