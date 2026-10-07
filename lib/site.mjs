// Single source of truth for who Alexandre is. Feeds page meta tags, JSON-LD,
// the About page, and the generated llms.txt / sitemap / RSS files, so search
// engines and AI answer engines see one consistent set of facts.

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://alexcarvalho.me',
  name: 'Alexandre Carvalho',
  alternateName: 'Alex Carvalho',
  jobTitle: 'CTPO, AI Product & Engineering Leader',
  tagline: 'CTPO | AI Product & Engineering Leader',
  // Answer-first, quotable summary. Keep it factual: engines repeat it verbatim.
  summary:
    "Alexandre Carvalho is a Lisbon-based CTPO and AI product & engineering leader with 20+ years building and scaling technology products. He was Chief Product & Technology Officer at Metaphysic.ai, the generative AI company behind the de-aging visual effects in Robert Zemeckis' film Here, and now runs Abstract Extraordinary, a senior engineering studio that takes AI systems from sketch to production.",
  description:
    'Alexandre Carvalho is a Lisbon-based CTPO and AI product & engineering leader, ex-CPTO at Metaphysic.ai (Here) and founder of Abstract Extraordinary.',
  image: '/images/alexandre-carvalho.jpg',
  // 1200x630 social card generated at build time by scripts/og-image.mjs.
  ogImage: '/og/default.png',
  locale: 'en_US',
  location: { locality: 'Lisbon', country: 'PT', label: 'Lisbon, Portugal' },
  languages: ['Portuguese', 'English'],
  sameAs: [
    'https://www.linkedin.com/in/alexandremcarvalho/',
    'https://github.com/AlexMC',
  ],
  company: {
    name: 'Abstract Extraordinary',
    url: 'https://abstractextraordinary.com/',
    description:
      'A senior engineering studio for AI systems that have to work in production, in public, in real time.',
  },
  education: {
    name: 'Instituto Superior Técnico',
    url: 'https://tecnico.ulisboa.pt/',
    credential: "Engineer's degree, Computer Science",
    year: 2008,
  },
  knowsAbout: [
    'Generative AI',
    'AI product management',
    'Machine learning infrastructure',
    'Synthetic media',
    'Engineering leadership',
    'Product management',
    'Software architecture',
    'Startup scaling',
    'Retrieval-augmented generation (RAG)',
  ],
  // Newest first. Dates are YYYY or YYYY-MM; end: null means current.
  career: [
    {
      role: 'Founder & CEO',
      org: 'Abstract Extraordinary',
      url: 'https://abstractextraordinary.com/',
      start: '2025-01',
      end: null,
      location: 'Lisbon, Portugal',
      highlight: 'Senior engineering studio taking AI systems from first sketch to production: retrieval and reasoning systems, real-time AI, product design and full-stack delivery.',
    },
    {
      role: 'Co-Founder',
      org: 'Byteline',
      start: '2025-02',
      end: null,
    },
    {
      role: 'Advisor / Chief Product & Technology Officer',
      org: 'SheerME',
      start: '2020-11',
      end: '2025-11',
      location: 'Lisbon, Portugal',
    },
    {
      role: 'Chief Product & Technology Officer',
      org: 'Metaphysic.ai',
      start: '2021-05',
      end: '2025-02',
      location: 'London, UK',
      highlight: "Led ML research, ML engineering and product. Metaphysic was the sole AI VFX provider on Robert Zemeckis' Here (Tom Hanks, Robin Wright) and was named one of TIME's 100 Most Influential Companies of 2023.",
    },
    {
      role: 'Founding Member',
      org: 'Blokssom DAO',
      start: '2021-12',
      end: '2023-01',
    },
    {
      role: 'Director of Product & Technology',
      org: 'Indie Campers',
      start: '2018-05',
      end: '2020-10',
      location: 'Lisbon, Portugal',
      highlight: 'Built the technology and product team from 0 to 30 people.',
    },
    {
      role: 'VP of Engineering (previously Technical Lead)',
      org: 'Streetbees',
      start: '2016-03',
      end: '2018-04',
      location: 'London, UK',
      highlight: "Scaled tech and product from 0 to 100 people through one of the UK's most successful Series A rounds.",
    },
    {
      role: 'Chief Technology & Product Officer',
      org: 'LinkedCare',
      start: '2013-01',
      end: '2016-02',
      location: 'Lisbon, Portugal',
      highlight: 'Designed the microservices architecture for an electronic and personal health record platform and led its expansion into the US market.',
    },
    {
      role: 'Founder & CEO',
      org: 'Outitude',
      start: '2011-08',
      end: '2013-12',
      highlight: 'Raised a €100k seed round in two weeks for an outdoor-activities marketplace.',
    },
    {
      role: 'Web Developer, Project Manager & Scrum Master',
      org: 'RUPEAL',
      start: '2008-09',
      end: '2011-07',
      highlight: 'Led tech and product on Besttables from idea to its acquisition by TripAdvisor; also built InvoiceXpress.',
    },
  ],
}

export const absoluteUrl = (path = '/') => new URL(path, site.url).toString()

// Generated social card for a blog post that has no front-matter image.
export const postCardPath = (slug) => `/og/blog/${slug}.png`

export function formatCareerDates({ start, end }) {
  const fmt = (d) => d.slice(0, 4)
  if (!start) return end === null ? 'Present' : fmt(end)
  return `${fmt(start)} – ${end === null ? 'present' : fmt(end)}`
}
