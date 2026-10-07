import Link from 'next/link'
import Seo from '../components/Seo'
import { site } from '../lib/site.mjs'
import Layout from '../components/Layout'
import Projects from '../components/Projects'
import Tools from '../components/Tools'
import Posts from '../components/Posts'
import ContributionsChart from '../components/ContributionsChart'
import Newsletter from '../components/Newsletter'
import { getAllMarkdownFiles } from '../lib/markdown'

export default function Home({ posts, projects, tools }) {
  return (
    <Layout>
      <Seo path="/" />

      <div className="space-y-32">
        <section className="space-y-6 text-primary-light max-w-3xl">
          <p className="text-xl">
            I&apos;m a Lisbon-based CTPO and AI product &amp; engineering leader. For 20+ years I&apos;ve
            turned market needs into shipped products, most recently as Chief Product &amp; Technology
            Officer at Metaphysic.ai, the generative AI company behind the de-aging in Robert
            Zemeckis&apos; <em>Here</em>.
          </p>
          <p>
            Today I run{' '}
            <a href={site.company.url} className="text-primary hover:text-glow underline">
              {site.company.name}
            </a>
            , a senior engineering studio for AI systems that have to work in production, and take on
            select advisory and fractional CTPO engagements.
          </p>
          <div className="flex flex-wrap gap-8">
            <Link href="/work-with-me" className="text-primary hover:text-glow transition-colors">
              WORK WITH ME &rarr;
            </Link>
            <Link href="/about" className="text-primary-light hover:text-primary transition-colors">
              MORE ABOUT ME &rarr;
            </Link>
          </div>
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
          <h2 className="text-2xl font-bold mb-12 text-primary">&gt; latest tools</h2>
          <Tools tools={tools} limit={2} />
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
    .filter((project) => project.featured)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  const tools = getAllMarkdownFiles('data/tools')
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  // Sort posts by date
  posts.sort((a, b) => new Date(b.date) - new Date(a.date))

  return {
    props: {
      posts,
      projects,
      tools
    }
  }
}
