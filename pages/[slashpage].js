import Layout from '../components/Layout'
import Seo from '../components/Seo'
import Link from 'next/link'
import { getMarkdownData, getMarkdownPaths } from '../lib/markdown'
import path from 'path'

export default function Slashpage({ page }) {
  if (!page) return null

  return (
    <Layout>
      <Seo title={page.title} description={page.description} path={`/${page.slug}`} />
      <article className="space-y-8">
        <header className="space-y-4">
          <Link href="/slashes" className="text-primary-light hover:text-primary transition-colors">
            &larr; ALL SLASHPAGES
          </Link>
          <h1 className="text-3xl font-bold text-glow">{page.title}</h1>
          {page.updatedAt && (
            <div className="text-sm text-primary-light">
              Last updated: {page.updatedAt}
            </div>
          )}
        </header>

        <div
          className="prose prose-invert prose-primary max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getMarkdownPaths('data/slashpages')
  // Map slug to slashpage parameter name and filter out 'slashes' (has its own page)
  const mappedPaths = paths
    .filter(p => p.params.slug !== 'slashes')
    .map(p => ({
      params: { slashpage: p.params.slug }
    }))
  return { paths: mappedPaths, fallback: false }
}

export async function getStaticProps({ params }) {
  try {
    const filePath = path.join(process.cwd(), 'data/slashpages', `${params.slashpage}.md`)
    const page = await getMarkdownData(filePath)

    // Add slug to page data
    page.slug = params.slashpage

    return { props: { page } }
  } catch (error) {
    // If the file doesn't exist, return 404
    return { notFound: true }
  }
}
