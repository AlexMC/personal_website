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

        <Projects />
        
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-primary">&gt; contributions</h2>
          <ContributionsChart />
        </section>
      </div>
    </Layout>
  )
}
