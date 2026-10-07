import Head from 'next/head'
import { site, absoluteUrl } from '../lib/site.mjs'
import { personSchema, websiteSchema } from '../lib/schema'

// Per-page <head>: title, description, canonical, Open Graph, Twitter card, and
// a JSON-LD @graph that always includes the site-wide Person + WebSite entities.
export default function Seo({
  title,
  description = site.description,
  path = '/',
  image,
  imageAlt,
  type = 'website',
  article,
  schema = [],
}) {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | ${site.jobTitle}`
  const url = absoluteUrl(path)
  const ogImage = absoluteUrl(image || site.ogImage)
  const ogImageAlt = image ? imageAlt || title : `${site.name}, ${site.tagline}`
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema(), personSchema(), ...schema],
  }

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} key="description" />
      <meta name="author" content={site.name} key="author" />
      <link rel="canonical" href={url} key="canonical" />

      <meta property="og:site_name" content={site.name} key="og:site_name" />
      <meta property="og:locale" content={site.locale} key="og:locale" />
      <meta property="og:type" content={type} key="og:type" />
      <meta property="og:url" content={url} key="og:url" />
      <meta property="og:title" content={fullTitle} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:image" content={ogImage} key="og:image" />
      <meta property="og:image:alt" content={ogImageAlt} key="og:image:alt" />

      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={fullTitle} key="twitter:title" />
      <meta name="twitter:description" content={description} key="twitter:description" />
      <meta name="twitter:image" content={ogImage} key="twitter:image" />

      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} key="article:published_time" />
      )}
      {article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} key="article:modified_time" />
      )}
      {type === 'article' && (
        <meta property="article:author" content={absoluteUrl('/about')} key="article:author" />
      )}
      {article?.tags?.map((tag) => (
        <meta property="article:tag" content={tag} key={`article:tag:${tag}`} />
      ))}

      <script
        type="application/ld+json"
        key="jsonld"
        // Escape "<" so post content can never close the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}
      />
    </Head>
  )
}
