import Head from 'next/head'
import Layout from '../components/Layout'
import Projects from '../components/Projects'
import ContributionsChart from '../components/ContributionsChart'
import Newsletter from '../components/Newsletter'
import Link from 'next/link'
import { posts } from '../data/posts'

export default function Home() {
  const latestPosts = posts.slice(0, 5)

  return (
    <Layout>
      <Head>
        <title>Alexandre Carvalho</title>
        <meta name="description" content="Personal website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-24">
        <section className="py-16">
          <div className="space-y-6">
            <p className="text-xl text-primary-light max-w-3xl">
              Building fast apps that feel like a physical extension 
              of your mind with considerate motion design for fluid 
              interfaces.
            </p>
          </div>
        </section>

        <Projects />
        
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-primary">&gt; latest posts</h2>
          <div className="space-y-6">
            {latestPosts.map((post, index) => (
              <article key={index} className="border-l-2 border-primary-dark pl-4 py-2 hover:border-primary transition-colors">
                <Link href={`/blog/${post.slug}`} className="block group">
                  <time className="text-sm text-primary-light">{post.date}</time>
                  <h3 className="text-lg font-medium group-hover:text-glow transition-colors">{post.title}</h3>
                </Link>
              </article>
            ))}
            <div className="pt-4">
              <Link href="/blog" className="text-primary-light hover:text-primary transition-colors">
                VIEW ALL POSTS &rarr;
              </Link>
            </div>
          </div>
        </section>

        <ContributionsChart />
        <Newsletter />
      </div>
    </Layout>
  )
}
