import Layout from '../components/Layout'
import Head from 'next/head'
import Slashpages from '../components/Slashpages'
import { getAllMarkdownFiles } from '../lib/markdown'

export default function Slashes({ pages }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alexcarvalho.me'
  const pageUrl = `${siteUrl}/slashes`

  return (
    <Layout>
      <Head>
        <title>/slashes | Alex Carvalho</title>
        <meta name="title" content="/slashes | Alex Carvalho" />
        <meta name="description" content="A collection of slashpages - standardized pages about me and my interests" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content="/slashes | Alex Carvalho" />
        <meta property="og:description" content="A collection of slashpages - standardized pages about me and my interests" />

        <meta property="twitter:card" content="summary" />
        <meta property="twitter:url" content={pageUrl} />
        <meta property="twitter:title" content="/slashes | Alex Carvalho" />
        <meta property="twitter:description" content="A collection of slashpages - standardized pages about me and my interests" />
      </Head>
      <div className="space-y-12">
        <section className="space-y-6">
          <h1 className="text-3xl font-bold text-glow">&gt; slashpages</h1>
          <div className="space-y-4">
            <p className="text-xl text-primary-light">
              A collection of standardized pages about me, my interests, and the things I use.
            </p>
            <p className="text-primary-light">
              Slashpages are part of the{' '}
              <a
                href="https://slashpages.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-glow transition-colors underline"
              >
                indie web movement
              </a>
              {' '}- simple, discoverable pages that help you learn more about the person behind the website.
            </p>
          </div>
        </section>

        <section>
          <Slashpages pages={pages} />
        </section>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const pages = getAllMarkdownFiles('data/slashpages')

  // Sort pages by order field, then alphabetically by slug
  pages.sort((a, b) => {
    if (a.order && b.order) {
      return a.order - b.order
    }
    return a.slug.localeCompare(b.slug)
  })

  return { props: { pages } }
}
