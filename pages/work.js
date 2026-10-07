import Layout from '../components/Layout'
import Projects from '../components/Projects'
import { getAllMarkdownFiles } from '../lib/markdown'
import Seo from '../components/Seo'
import { site } from '../lib/site.mjs'
import { breadcrumbSchema } from '../lib/schema'

export default function Work({ projects }) {
  return (
    <Layout>
      <Seo
        title="Work"
        path="/work"
        description={`Selected work by ${site.name}: AI VFX tooling for Robert Zemeckis' Here at Metaphysic.ai, the LinkedCare health record platform, and more.`}
        schema={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
          ]),
        ]}
      />
      <div className="space-y-32">
        <section>
          <p className="text-xl text-primary-light">
            Selected projects showcasing my work in AI, software development, and technology leadership.
          </p>
        </section>

        <section>
          <h1 className="text-2xl font-bold mb-12 text-primary">&gt; projects</h1>
          <Projects projects={projects} />
        </section>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // Featured projects first; archived side projects after.
  const projects = getAllMarkdownFiles('data/projects')
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))

  return { props: { projects } }
}
