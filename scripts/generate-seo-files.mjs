#!/usr/bin/env node
// Runs after `next build` (npm postbuild) and writes crawler-facing files into
// the static export: sitemap.xml, feed.xml (RSS), llms.txt (llmstxt.org) and
// social preview cards (og/default.png, og/blog/<slug>.png for posts without an image).

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { site, absoluteUrl, formatCareerDates, cardPath } from '../lib/site.mjs'
import { renderDefaultCard, renderTitleCard } from './og-image.mjs'

const OUT_DIR = path.join(process.cwd(), 'out')

const isoDate = (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : String(value))

function readCollection(dir) {
  const fullDir = path.join(process.cwd(), dir)
  return fs
    .readdirSync(fullDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => ({
      ...matter(fs.readFileSync(path.join(fullDir, file), 'utf8')).data,
      slug: file.replace(/\.md$/, ''),
    }))
}

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const posts = readCollection('data/posts')
  .map((post) => ({ ...post, date: isoDate(post.date), path: `/blog/${post.slug}` }))
  .sort((a, b) => b.date.localeCompare(a.date))
const projects = readCollection('data/projects')
  .map((project) => ({ ...project, path: `/work/${project.slug}` }))
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
// /slashes has its own page; pages/[slashpage].js skips the markdown file of the same name.
const slashpages = readCollection('data/slashpages')
  .filter((page) => page.slug !== 'slashes')
  .map((page) => ({ ...page, path: `/${page.slug}` }))

function sitemap() {
  const entries = [
    ...['/', '/about', '/work-with-me', '/work', '/blog', '/tools', '/slashes'].map((p) => ({ path: p })),
    ...posts.map((post) => ({ path: post.path, lastmod: isoDate(post.updated || post.date) })),
    ...projects.map((project) => ({ path: project.path })),
    ...slashpages.map((page) => ({ path: page.path, lastmod: page.updatedAt && isoDate(page.updatedAt) })),
  ]
  const urls = entries
    .map(({ path: p, lastmod }) =>
      [`  <url>`, `    <loc>${escapeXml(absoluteUrl(p))}</loc>`, lastmod && `    <lastmod>${lastmod}</lastmod>`, `  </url>`]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function rss() {
  const items = posts
    .map((post) =>
      [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(absoluteUrl(post.path))}</link>`,
        `      <guid isPermaLink="true">${escapeXml(absoluteUrl(post.path))}</guid>`,
        `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `      <dc:creator>${escapeXml(site.name)}</dc:creator>`,
        `      <description>${escapeXml(post.excerpt || '')}</description>`,
        ...(post.tags || []).map((tag) => `      <category>${escapeXml(tag)}</category>`),
        '    </item>',
      ].join('\n'),
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(`${site.name} | Blog`)}</title>
    <link>${escapeXml(absoluteUrl('/blog'))}</link>
    <atom:link href="${escapeXml(absoluteUrl('/feed.xml'))}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(`Writing by ${site.name} on AI, product and engineering leadership.`)}</description>
    <language>en</language>
    <lastBuildDate>${new Date(posts[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`
}

function llmsTxt() {
  const link = (title, p, note) => `- [${title}](${absoluteUrl(p)})${note ? `: ${note}` : ''}`
  return [
    `# ${site.name}`,
    '',
    `> ${site.summary}`,
    '',
    `${site.name} (also known as ${site.alternateName}) is based in ${site.location.label}. He works as an advisor and fractional CTPO, and builds production AI systems through ${site.company.name} (${site.company.url}).`,
    '',
    `- Role: ${site.jobTitle}`,
    `- Expertise: ${site.knowsAbout.join(', ')}`,
    `- Education: ${site.education.credential}, ${site.education.name} (${site.education.year})`,
    `- Profiles: ${site.sameAs.join(', ')}`,
    `- Hiring (fractional CTPO, advisory, AI builds): ${absoluteUrl('/work-with-me')}`,
    `- Contact: ${absoluteUrl('/hello')}`,
    '',
    '## About',
    '',
    link(`About ${site.name}`, '/about', 'bio, career history, skills and FAQ'),
    link('Work with me', '/work-with-me', 'fractional CTPO, advisory, and AI systems built with Abstract Extraordinary'),
    '',
    '## Career',
    '',
    ...site.career.map(
      (job) => `- ${formatCareerDates(job)}: ${job.role}, ${job.org}${job.highlight ? `. ${job.highlight}` : ''}`,
    ),
    '',
    '## Writing',
    '',
    ...posts.map((post) => link(post.title, post.path, `${post.excerpt ? post.excerpt.trim() : ''} (${post.date})`)),
    '',
    '## Work',
    '',
    ...projects.map((project) => link(project.title, project.path, project.description)),
    '',
    '## Optional',
    '',
    ...slashpages.map((page) => link(page.title, page.path, page.description)),
    '',
  ].join('\n')
}

if (!fs.existsSync(OUT_DIR)) {
  console.error(`generate-seo-files: ${OUT_DIR} not found; run next build first`)
  process.exit(1)
}

const files = {
  'sitemap.xml': sitemap(),
  'feed.xml': rss(),
  'llms.txt': llmsTxt(),
  [site.ogImage]: renderDefaultCard(),
  ...Object.fromEntries(
    posts
      .filter((post) => !post.image)
      .map((post) => [cardPath('blog', post.slug), renderTitleCard({ title: post.title, meta: post.date })]),
  ),
  ...Object.fromEntries(
    projects
      .filter((project) => !project.image)
      .map((project) => [
        cardPath('work', project.slug),
        renderTitleCard({ title: project.title, meta: project.period, label: '> case study' }),
      ]),
  ),
}
for (const [name, content] of Object.entries(files)) {
  const target = path.join(OUT_DIR, name)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, content)
}
console.log(`generate-seo-files: wrote ${Object.keys(files).join(', ')}`)
