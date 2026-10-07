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
        description={`Case studies by ${site.name}: AI de-aging for Robert Zemeckis' Here at Metaphysic.ai, scaling engineering at Streetbees and Indie Campers, LinkedCare's health records, and Besttables.`}
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
  // Curated order from front matter (`order`); unordered projects go last.
  const projects = getAllMarkdownFiles('data/projects').sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return { props: { projects } }
}
