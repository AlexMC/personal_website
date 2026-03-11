import Layout from '../components/Layout'
import Tools from '../components/Tools'
import { getAllMarkdownFiles } from '../lib/markdown'

export default function ToolsPage({ tools }) {
  return (
    <Layout>
      <div className="space-y-32">
        <section>
          <p className="text-xl text-primary-light">
            Standalone tools and utilities I've built to solve real problems.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-12 text-primary">&gt; tools</h2>
          <Tools tools={tools} />
        </section>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const tools = getAllMarkdownFiles('data/tools')
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  return { props: { tools } }
}
