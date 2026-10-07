import { site, absoluteUrl } from './site.mjs'

// Stable @ids let every page reference the same Person/WebSite entity, which is
// how search and answer engines merge facts about "this" Alexandre Carvalho.
export const PERSON_ID = absoluteUrl('/#person')
export const WEBSITE_ID = absoluteUrl('/#website')

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    alternateName: site.alternateName,
    url: absoluteUrl('/'),
    image: absoluteUrl(site.image),
    jobTitle: site.jobTitle,
    description: site.summary,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location.locality,
      addressCountry: site.location.country,
    },
    worksFor: {
      '@type': 'Organization',
      name: site.company.name,
      url: site.company.url,
      description: site.company.description,
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: site.education.name,
      url: site.education.url,
    },
    knowsAbout: site.knowsAbout,
    knowsLanguage: site.languages,
    sameAs: site.sameAs,
  }
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl('/'),
    name: site.name,
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  }
}

export function breadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, path }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  }
}

export function faqSchema(faq) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

export function blogPostingSchema(post, path) {
  const url = absoluteUrl(path)
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: url,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    ...(post.image && { image: absoluteUrl(post.image) }),
    ...(post.tags?.length && { keywords: post.tags.join(', ') }),
    inLanguage: 'en',
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    isPartOf: { '@id': WEBSITE_ID },
  }
}

export function projectSchema(project, path) {
  const url = absoluteUrl(path)
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: project.title,
    description: project.description,
    url,
    mainEntityOfPage: url,
    ...(project.image && { image: absoluteUrl(project.image) }),
    ...(project.technologies?.length && { keywords: project.technologies.join(', ') }),
    ...(project.company && { about: { '@type': 'Organization', name: project.company } }),
    inLanguage: 'en',
    author: { '@id': PERSON_ID },
    isPartOf: { '@id': WEBSITE_ID },
  }
}
