import Layout from '../components/Layout'
import Posts from '../components/Posts'
import { getAllMarkdownFiles } from '../lib/markdown'

export default function Blog({ posts }) {
  return (
    <Layout>
      <div className="space-y-32">
        <section>
          <p className="text-xl text-primary-light">
            Thoughts on software development, AI, and technology.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-12 text-primary">&gt; all posts</h2>
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
