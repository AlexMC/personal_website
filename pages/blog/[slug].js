import Layout from '../../components/Layout'
import Head from 'next/head'
import Link from 'next/link'
import { getMarkdownData, getMarkdownPaths } from '../../lib/markdown'
import path from 'path'
import { getImagePath } from '../../lib/utils'
import BlueskyComments from '../../components/BlueskyComments'

export default function BlogPost({ post }) {
  if (!post) return null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alexcarvalho.me'
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const ogImage = post.image ? `${siteUrl}${getImagePath(post.image)}` : null

  return (
    <Layout>
      <Head>
        {/* Primary Meta Tags */}
        <title>{post.title} | Alex Carvalho</title>
        <meta name="title" content={post.title} />
        <meta name="description" content={post.excerpt} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {ogImage && <meta property="og:image" content={ogImage} />}

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={postUrl} />
        <meta property="twitter:title" content={post.title} />
        <meta property="twitter:description" content={post.excerpt} />
        {ogImage && <meta property="twitter:image" content={ogImage} />}

        {/* Article specific */}
        <meta property="article:published_time" content={post.date} />
        {post.tags && post.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
      </Head>
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
                src={getImagePath(post.image)} 
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

        {/* Bluesky Comments */}
        {post.bsky && post.bsky.uri && (
          <BlueskyComments
            uri={post.bsky.uri}
            author={post.bsky.author}
          />
        )}
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

  // Add slug to post data for use in OG tags
  post.slug = params.slug

  return { props: { post } }
}
