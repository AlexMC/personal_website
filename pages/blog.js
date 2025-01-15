import Layout from '../components/Layout'
import Link from 'next/link'
import { posts } from '../data/posts'

export default function Blog() {
  return (
    <Layout>
      <div className="space-y-12">
        <section>
          <h1 className="text-3xl font-bold mb-8 text-glow">&gt; blog posts</h1>
          <div className="space-y-8">
            {posts.map((post, index) => (
              <article key={index} className="border-l-2 border-primary-dark pl-4 py-2 hover:border-primary transition-colors">
                <Link href={`/blog/${post.slug}`} className="block group">
                  <time className="text-sm text-primary-light">{post.date}</time>
                  <h2 className="text-xl font-medium group-hover:text-glow transition-colors">{post.title}</h2>
                  <p className="text-primary-light mt-2">{post.excerpt}</p>
                  <div className="flex gap-2 mt-3">
                    {post.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs px-2 py-1 bg-primary-dark text-primary border border-primary-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}
