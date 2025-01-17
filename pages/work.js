import Layout from '../components/Layout'
import Projects from '../components/Projects'
import ContributionsChart from '../components/ContributionsChart'

export default function Work() {
  return (
    <Layout>
      <div className="space-y-24">
        <section>
          <h1 className="text-3xl font-bold mb-8 text-glow">&gt; my work</h1>
          <p className="text-xl text-primary-light mb-16">
            A collection of projects I've worked on, from personal experiments to professional work.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-12 text-primary">&gt; projects</h2>
          <Projects />
        </section>

        <ContributionsChart />
      </div>
    </Layout>
  )
}
