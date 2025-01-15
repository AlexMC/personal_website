import Head from 'next/head'
import Layout from '../components/Layout'
import Projects from '../components/Projects'
import ContributionsChart from '../components/ContributionsChart'
import Newsletter from '../components/Newsletter'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Alexandre Carvalho</title>
        <meta name="description" content="Personal website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-24">
        <section className="py-16">
          <div className="container-custom">
            <p className="text-xl text-primary-light max-w-3xl">
              Building fast apps that feel like a physical extension 
              of your mind with considerate motion design for fluid 
              interfaces.
            </p>
          </div>
        </section>

        <Projects />
        <ContributionsChart />
        <Newsletter />
      </div>
    </Layout>
  )
}
