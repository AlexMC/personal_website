import Layout from '../components/Layout'
import Projects from '../components/Projects'
import { getAllMarkdownFiles } from '../lib/markdown'

export default function Work({ projects }) {
  return (
    <Layout>
      <div className="space-y-32">
        <section>
          <p className="text-xl text-primary-light">
            Selected projects showcasing my work in AI, software development, and technology leadership.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-12 text-primary">&gt; projects</h2>
          <Projects projects={projects} />
        </section>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const projects = await getAllMarkdownFiles('data/projects')
  
  return { props: { projects } }
}
