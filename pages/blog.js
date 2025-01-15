import Head from 'next/head'

export default function Blog() {
  const posts = [
    {
      title: "Sample Blog Post 1",
      date: "2025-01-13",
      summary: "This is a summary of the first blog post",
      slug: "post-1"
    },
    {
      title: "Sample Blog Post 2",
      date: "2025-01-12",
      summary: "This is a summary of the second blog post",
      slug: "post-2"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Blog - Alexandre Carvalho</title>
        <meta name="description" content="My blog posts" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        
        <div className="space-y-8">
          {posts.map((post, index) => (
            <article key={index} className="border-b pb-8">
              <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
              <time className="text-gray-500 text-sm">{post.date}</time>
              <p className="mt-4 text-gray-600">{post.summary}</p>
              <a href={`/blog/${post.slug}`} className="mt-4 inline-block text-blue-600 hover:underline">
                Read more →
              </a>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
