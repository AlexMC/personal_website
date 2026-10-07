import Layout from '../../components/Layout'
import Link from 'next/link'
import { getMarkdownData, getMarkdownPaths } from '../../lib/markdown'
import path from 'path'
import { getImagePath } from '../../lib/utils'
import BlueskyComments from '../../components/BlueskyComments'
import Seo from '../../components/Seo'
import { site, postCardPath } from '../../lib/site.mjs'
import { blogPostingSchema, breadcrumbSchema } from '../../lib/schema'

export default function BlogPost({ post }) {
  if (!post) return null

  const postPath = `/blog/${post.slug}`
  const image = post.image ? getImagePath(post.image) : postCardPath(post.slug)

  return (
    <Layout>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={postPath}
        image={image}
        imageAlt={post.title}
        type="article"
        article={{ publishedTime: post.date, modifiedTime: post.updated, tags: post.tags }}
        schema={[
          blogPostingSchema({ ...post, image }, postPath),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: postPath },
          ]),
        ]}
      />
      <article className="space-y-8">
        <header className="space-y-4">
          <Link href="/blog" className="text-primary-light hover:text-primary transition-colors">
            &larr; BACK TO BLOG
          </Link>
          <h1 className="text-3xl font-bold text-glow">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-primary-light">
              by{' '}
              <Link href="/about" rel="author" className="hover:text-primary transition-colors underline">
                {site.name}
              </Link>
            </span>
            <time dateTime={post.date} className="text-primary-light">{post.date}</time>
            <div className="flex flex-wrap gap-2">
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
