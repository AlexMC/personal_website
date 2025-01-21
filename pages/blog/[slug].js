import Layout from '../../components/Layout'
import Link from 'next/link'
import { getMarkdownData, getMarkdownPaths } from '../../lib/markdown'
import path from 'path'

export default function BlogPost({ post }) {
  if (!post) return null

  return (
    <Layout>
      <article className="space-y-8">
        <header className="space-y-4">
          <Link href="/blog" className="text-primary-light hover:text-primary transition-colors">
            &larr; BACK TO BLOG
          </Link>
          <h1 className="text-3xl font-bold text-glow">{post.title}</h1>
          <div className="flex items-center space-x-4">
            <time className="text-primary-light">{post.date}</time>
            <div className="flex gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-primary-dark text-primary border border-primary-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {post.image && (
            <div className="relative h-64 w-full">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover rounded-lg border border-primary-dark"
              />
            </div>
          )}
        </header>

        <div 
          className="prose prose-invert prose-primary max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getMarkdownPaths('data/posts')
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'data/posts', `${params.slug}.md`)
  const post = await getMarkdownData(filePath)
  
  return { props: { post } }
}
