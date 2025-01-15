import Layout from '../../components/Layout'
import { posts } from '../../data/posts'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function BlogPost({ post }) {
  const router = useRouter()
  const { slug } = router.query

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
        </header>

        <div className="prose prose-invert prose-primary max-w-none">
          {post.content}
        </div>
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const post = posts.find((post) => post.slug === params.slug)
  return { props: { post } }
}
