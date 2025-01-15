import { useRouter } from 'next/router'
import Head from 'next/head'

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Blog Post - Alexandre Carvalho</title>
        <meta name="description" content="Blog post" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <article className="prose lg:prose-xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Blog Post Title</h1>
          <time className="text-gray-500">Publication Date</time>
          
          <div className="mt-8">
            {/* Content will be dynamically loaded from markdown files */}
            <p>This is a placeholder for the blog post content.</p>
          </div>
        </article>
      </main>
    </div>
  )
}
