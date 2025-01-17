import Head from 'next/head'
import Layout from '../components/Layout'
import Projects from '../components/Projects'
import Posts from '../components/Posts'
import ContributionsChart from '../components/ContributionsChart'
import Newsletter from '../components/Newsletter'
import { getAllMarkdownFiles } from '../lib/markdown'

export default function Home({ posts, projects }) {
  return (
    <Layout>
      <Head>
        <title>Alexandre Carvalho</title>
        <meta name="description" content="Personal website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-32">
        <section>
          <p className="text-xl text-primary-light max-w-3xl">
            I leverage technology to bridge the gap between market needs and business goals, driving maximum value creation and impactful solutions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-12 text-primary">&gt; featured projects</h2>
          <Projects projects={projects} limit={2} />
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-8 text-primary">&gt; latest posts</h2>
          <Posts posts={posts} limit={3} />
        </section>

        <section>
          <ContributionsChart />
        </section>

        <section className="mb-16">
          <Newsletter />
        </section>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = getAllMarkdownFiles('data/posts')
  const projects = getAllMarkdownFiles('data/projects')
  
  // Sort posts by date
  posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  
  return {
    props: {
      posts,
      projects
    }
  }
}
