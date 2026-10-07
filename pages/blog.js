import Layout from '../components/Layout'
import Posts from '../components/Posts'
import { getAllMarkdownFiles } from '../lib/markdown'
import Seo from '../components/Seo'
import { site, absoluteUrl } from '../lib/site.mjs'
import { PERSON_ID, breadcrumbSchema } from '../lib/schema'

export default function Blog({ posts }) {
  return (
    <Layout>
      <Seo
        title="Blog"
        path="/blog"
        description={`Writing by ${site.name} on AI in product development, engineering leadership, developer tooling and self-hosting.`}
        schema={[
          {
            '@type': 'Blog',
            '@id': absoluteUrl('/blog#blog'),
            url: absoluteUrl('/blog'),
            name: `${site.name} | Blog`,
            author: { '@id': PERSON_ID },
            blogPost: posts.map((post) => ({
              '@type': 'BlogPosting',
              '@id': absoluteUrl(`/blog/${post.slug}#article`),
              headline: post.title,
              url: absoluteUrl(`/blog/${post.slug}`),
              datePublished: post.date,
            })),
          },
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        ]}
      />
      <div className="space-y-32">
        <section>
          <p className="text-xl text-primary-light">
            Notes on building AI products, leading engineering and product teams, and the tools I use along the way.
          </p>
        </section>

        <section>
          <h1 className="text-2xl font-bold mb-12 text-primary">&gt; all posts</h1>
          <Posts posts={posts} />
        </section>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = getAllMarkdownFiles('data/posts')
  
  // Sort posts by date
  posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  
  return { props: { posts } }
}
