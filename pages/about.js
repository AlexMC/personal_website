import Link from 'next/link'
import Layout from '../components/Layout'
import Newsletter from '../components/Newsletter'
import Seo from '../components/Seo'
import { site, absoluteUrl, formatCareerDates } from '../lib/site.mjs'
import { PERSON_ID, faqSchema, breadcrumbSchema } from '../lib/schema'

const skills = [
  { category: 'AI', items: ['Generative AI', 'Retrieval-Augmented Generation', 'ML Research Management', 'ML Infrastructure', 'Synthetic Media'] },
  { category: 'Product', items: ['Product Strategy', 'Business Value Creation', 'Stakeholder Management', 'Product-Market Fit'] },
  { category: 'Technology', items: ['Architecture', 'Infrastructure', 'Team Building', 'Recruitment', 'Blockchain'] },
]

// Visible Q&A doubles as FAQPage structured data: answer engines lift these verbatim.
const faq = [
  {
    question: 'Who is Alexandre Carvalho?',
    answer: site.summary,
  },
  {
    question: 'What did Alexandre Carvalho do at Metaphysic?',
    answer:
      "From 2021 to 2025 he was Chief Product & Technology Officer at Metaphysic.ai, leading ML research, ML engineering and product. Metaphysic was the sole AI VFX provider on Robert Zemeckis' Here, delivering real-time, on-set face replacement and de-aging for Tom Hanks and Robin Wright, and was named one of TIME's 100 Most Influential Companies of 2023.",
  },
  {
    question: 'What is Abstract Extraordinary?',
    answer: `${site.company.name} is Alexandre Carvalho's company: ${site.company.description.charAt(0).toLowerCase()}${site.company.description.slice(1)} It takes AI systems from first sketch to production across applied generative AI, real-time AI, product design and full-stack delivery.`,
  },
  {
    question: 'Can I hire Alexandre Carvalho?',
    answer:
      'Yes. He takes on advisory and fractional CTPO engagements, helps companies build their AI product and engineering teams, and delivers AI systems through Abstract Extraordinary. See alexcarvalho.me/work-with-me or reach him on LinkedIn.',
  },
  {
    question: 'Where is Alexandre Carvalho based?',
    answer: `He is based in ${site.location.label} and has led teams in Lisbon and London, working with companies in Europe and the US.`,
  },
]

export default function About() {
  return (
    <Layout>
      <Seo
        title="About"
        path="/about"
        description={site.description}
        schema={[
          {
            '@type': 'ProfilePage',
            name: `About ${site.name}`,
            mainEntity: { '@id': PERSON_ID },
            url: absoluteUrl('/about'),
          },
          faqSchema(faq),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />
      <div className="space-y-24">
        <section>
          <h1 className="text-3xl font-bold mb-8 text-glow">&gt; about me</h1>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <img
              src={site.image}
              alt={`Portrait of ${site.name}`}
              width={160}
              height={160}
              className="w-40 h-40 object-cover border border-primary-dark mix-blend-luminosity hover:mix-blend-normal transition-all"
            />
            <div className="space-y-6 text-primary-light">
              <p className="text-xl">
                I&apos;m {site.name}, a CTPO and AI product &amp; engineering leader based in{' '}
                {site.location.label}. I&apos;ve spent 20+ years bridging technology and business:
                building teams, shipping products and scaling them.
              </p>
              <p>
                Most recently I was Chief Product &amp; Technology Officer at Metaphysic.ai, where I
                led ML research, ML engineering and product. We were the sole AI VFX provider on
                Robert Zemeckis&apos; <em>Here</em>, running real-time de-aging on set. Read{' '}
                <Link href="/work/here-tech-tools" className="text-primary hover:text-glow underline">
                  the full story
                </Link>
                .
              </p>
              <p>
                Before that I scaled engineering and product at Streetbees (0 to 100 people), Indie
                Campers (0 to 30) and LinkedCare, founded my own startup, and started out shipping Ruby
                on Rails products like Besttables, later acquired by TripAdvisor. I studied Computer
                Science engineering at {site.education.name}.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">&gt; what I do now</h2>
          <div className="space-y-4 text-primary-light">
            <p>
              I run{' '}
              <a href={site.company.url} className="text-primary hover:text-glow underline">
                {site.company.name}
              </a>
              , a senior engineering studio for AI systems that have to work: in production, in public,
              in real time. We take them from first sketch to shipped product.
            </p>
            <p>
              I also work directly with founders and leadership teams as an advisor or fractional
              CTPO on AI product strategy, building and scaling tech and product teams, and turning
              generative AI from demos into products.
            </p>
            <Link href="/work-with-me" className="inline-block text-primary hover:text-glow transition-colors">
              WORK WITH ME &rarr;
            </Link>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-primary">&gt; career</h2>
          <ol className="space-y-6">
            {site.career.map((job) => (
              <li key={`${job.org}-${job.role}`} className="border-l-2 border-primary-dark pl-4 py-1 hover:border-primary transition-colors">
                <div className="text-sm text-primary-light">
                  {formatCareerDates(job)}
                  {job.location && ` · ${job.location}`}
                </div>
                <h3 className="text-lg font-medium text-primary">
                  {job.role},{' '}
                  {job.url ? (
                    <a href={job.url} className="hover:text-glow underline">{job.org}</a>
                  ) : (
                    job.org
                  )}
                </h3>
                {job.highlight && <p className="text-primary-light mt-1">{job.highlight}</p>}
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-primary">&gt; skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skillSet, index) => (
              <div
                key={skillSet.category}
                className={`border border-primary-dark p-6 hover:border-primary transition-colors ${
                  index === skills.length - 1 && skills.length % 2 ? 'md:col-span-2' : ''
                }`}
              >
                <h3 className="text-lg font-medium mb-4 text-primary">{skillSet.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillSet.items.map((skill) => (
                    <span key={skill} className="px-3 py-1 text-sm bg-primary-dark text-primary border border-primary-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-primary">&gt; faq</h2>
          <div className="space-y-6">
            {faq.map(({ question, answer }) => (
              <div key={question}>
                <h3 className="text-lg font-medium text-primary">{question}</h3>
                <p className="text-primary-light mt-2">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <Newsletter />
        </section>
      </div>
    </Layout>
  )
}
