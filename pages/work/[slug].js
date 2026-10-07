import Layout from '../../components/Layout'
import Link from 'next/link'
import { getMarkdownData, getMarkdownPaths } from '../../lib/markdown'
import path from 'path'
import { getImagePath } from '../../lib/utils';
import Seo from '../../components/Seo'
import { projectSchema, breadcrumbSchema } from '../../lib/schema'
import { cardPath } from '../../lib/site.mjs'

export default function Project({ project }) {
  if (!project) return null

  const projectPath = `/work/${project.slug}`
  const image = project.image ? getImagePath(project.image) : cardPath('work', project.slug)
  const context = [project.role && project.company ? `${project.role}, ${project.company}` : project.role, project.period, project.location]
    .filter(Boolean)
    .join(' · ')

  return (
    <Layout>
      <Seo
        title={project.title}
        description={project.description}
        path={projectPath}
        image={image}
        imageAlt={project.title}
        type="article"
        article={{ tags: project.technologies }}
        schema={[
          projectSchema({ ...project, image }, projectPath),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: project.title, path: projectPath },
          ]),
        ]}
      />
      <article className="space-y-8">
        <header className="space-y-4">
          <Link href="/work" className="text-primary-light hover:text-primary transition-colors">
            &larr; BACK TO PROJECTS
          </Link>
          <h1 className="text-3xl font-bold text-glow">{project.title}</h1>
          {context && <p className="text-primary-light">{context}</p>}
          <div className="flex items-center space-x-4">
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-primary-dark text-primary border border-primary-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          {project.image && (
            <img 
              src={getImagePath(project.image)} 
              alt={project.title}
              className="w-full h-64 object-cover rounded-lg border border-primary-dark"
            />
          )}
        </header>

        <div 
          className="prose prose-invert prose-primary max-w-none"
          dangerouslySetInnerHTML={{ __html: project.content }}
        />

        {project.link && (
          <div className="pt-8">
            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-glow transition-colors"
            >
              VIEW PROJECT &rarr;
            </a>
          </div>
        )}
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getMarkdownPaths('data/projects')
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'data/projects', `${params.slug}.md`)
  const project = await getMarkdownData(filePath)
  project.slug = params.slug

  return { props: { project } }
}
