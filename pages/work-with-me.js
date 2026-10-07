import Link from 'next/link'
import Layout from '../components/Layout'
import Seo from '../components/Seo'
import { site, absoluteUrl } from '../lib/site.mjs'
import { PERSON_ID, faqSchema, breadcrumbSchema } from '../lib/schema'

const offers = [
  {
    name: 'Fractional CTPO',
    description:
      'Part-time technology and product leadership inside your executive team: product and technology strategy, architecture decisions, team structure and hiring, and a delivery rhythm that ships. For companies that need senior leadership before, or instead of, a full-time CTO or CPO.',
    provider: 'person',
  },
  {
    name: 'Advisory',
    description:
      'Regular sessions with founders, CTOs and leadership teams on AI product strategy, roadmap reviews, building and scaling tech and product teams, and taking generative AI from prototype to production.',
    provider: 'person',
  },
  {
    name: 'AI systems, built and shipped',
    description: `When you need a system in production, not just advice: my studio, ${site.company.name}, embeds a small senior team with yours, from architecture through build, launch and operations. Retrieval and reasoning systems, real-time AI, product design and full-stack delivery.`,
    provider: 'company',
  },
]

const proof = [
  { text: "Chief Product & Technology Officer at Metaphysic.ai: sole AI VFX provider on Robert Zemeckis' Here, named one of TIME's 100 Most Influential Companies of 2023.", href: '/work/here-tech-tools' },
  { text: 'VP of Engineering at Streetbees: built the engineering team as the company grew from ~20 to ~75 people, through a $12M Series A led by Atomico.', href: '/work/streetbees' },
  { text: 'Director of Product & Technology at Indie Campers: built the tech and product team from 0 to 30 and the platform behind a fleet that grew to 1,200+ vans in 15 countries.', href: '/work/indie-campers' },
  { text: 'CTPO at LinkedCare: microservices EHR/PHR platform, taken from Portugal into the US market.', href: '/work/linkedcare-ehr-and-phr' },
  { text: 'Besttables: led the team that built the restaurant booking platform from proposal to launch; TripAdvisor acquired it in 2015.', href: '/work/besttables' },
  { text: `Two-time founder: Outitude (€100k seed raised in two weeks) and ${site.company.name}.` },
]

const faq = [
  {
    question: 'What is a fractional CTPO?',
    answer:
      'A fractional CTPO is a part-time Chief Technology & Product Officer who joins your leadership team for a set share of their time, owning technology and product direction without the cost and commitment of a full-time executive hire.',
  },
  {
    question: `What is the difference between working with Alexandre and with ${site.company.name}?`,
    answer: `Fractional CTPO and advisory work is Alexandre Carvalho personally, as part of your leadership team. ${site.company.name} is his studio: a senior team that designs, builds and operates the AI system with you.`,
  },
  {
    question: 'Does Alexandre work remotely?',
    answer: `Yes. He is based in ${site.location.label} and has led teams in Lisbon and London, working with companies in Europe and the US.`,
  },
]

export default function WorkWithMe() {
  return (
    <Layout>
      <Seo
        title="Work With Me: Fractional CTPO & AI Advisory"
        path="/work-with-me"
        description={`Hire ${site.name} as a fractional CTPO or AI advisor, or build production AI systems with ${site.company.name}. Ex-CPTO at Metaphysic.ai, based in Lisbon.`}
        schema={[
          ...offers.map((offer) => ({
            '@type': 'Service',
            name: offer.name,
            serviceType: offer.name,
            description: offer.description,
            url: absoluteUrl('/work-with-me'),
            provider:
              offer.provider === 'person'
                ? { '@id': PERSON_ID }
                : { '@type': 'Organization', name: site.company.name, url: site.company.url, founder: { '@id': PERSON_ID } },
          })),
          faqSchema(faq),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work With Me', path: '/work-with-me' },
          ]),
        ]}
      />
      <div className="space-y-24">
        <section className="space-y-6">
          <h1 className="text-3xl font-bold text-glow">&gt; work with me</h1>
          <p className="text-xl text-primary-light">
            I help founders and leadership teams turn AI from demos into products, and build the teams
            that ship them. There are three ways to work together.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-primary">&gt; how I can help</h2>
          <div className="space-y-6">
            {offers.map((offer) => (
              <div key={offer.name} className="border border-primary-dark p-6 hover:border-primary transition-colors">
                <h3 className="text-lg font-medium mb-3 text-primary">{offer.name}</h3>
                <p className="text-primary-light">{offer.description}</p>
                {offer.provider === 'company' && (
                  <a href={site.company.url} className="inline-block mt-4 text-primary hover:text-glow transition-colors">
                    {site.company.name.toUpperCase()} &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-primary">&gt; track record</h2>
          <ul className="space-y-4">
            {proof.map(({ text, href }) => (
              <li key={text} className="border-l-2 border-primary-dark pl-4 py-1 text-primary-light hover:border-primary transition-colors">
                {text}
                {href && (
                  <>
                    {' '}
                    <Link href={href} className="text-primary hover:text-glow underline">
                      Read more
                    </Link>
                  </>
                )}
              </li>
            ))}
          </ul>
          <Link href="/about" className="inline-block text-primary-light hover:text-primary transition-colors">
            FULL CAREER &rarr;
          </Link>
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

        <section className="space-y-4 border border-primary p-6">
          <h2 className="text-2xl font-bold text-primary">&gt; get in touch</h2>
          <p className="text-primary-light">
            Tell me what you&apos;re building, where it runs, and what&apos;s in the way. I&apos;ll tell you
            plainly whether and how I can help.
          </p>
          <ul className="space-y-2 text-primary-light">
            <li>Email: alexandre.carvalho [at] gmail.com</li>
            <li>
              LinkedIn:{' '}
              <a href="https://www.linkedin.com/in/alexandremcarvalho/" className="text-primary hover:text-glow underline">
                linkedin.com/in/alexandremcarvalho
              </a>
            </li>
          </ul>
        </section>
      </div>
    </Layout>
  )
}
