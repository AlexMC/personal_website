import Layout from '../components/Layout'
import Newsletter from '../components/Newsletter'

export default function About() {
  const skills = [
    { category: "Languages", items: ["JavaScript", "TypeScript", "Python", "Solidity"] },
    { category: "Frontend", items: ["React", "Next.js", "TailwindCSS", "GraphQL"] },
    { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "MongoDB"] },
    { category: "Tools", items: ["Git", "Docker", "AWS", "Web3"] }
  ]

  return (
    <Layout>
      <div className="space-y-24">
        <section>
          <h1 className="text-3xl font-bold mb-8 text-glow">&gt; about me</h1>
          <div className="space-y-8 text-primary-light">
            <p className="text-xl">
              CTPO with a passion for building innovative solutions in AI and blockchain.
              Currently focused on developing scalable applications and exploring the
              intersection of artificial intelligence and decentralized systems.
            </p>
            <p>
              With over a decade of experience in software development and technical leadership,
              I've led teams in delivering complex projects across various domains.
            </p>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-primary">&gt; skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skillSet, index) => (
              <div key={index} className="border border-primary-dark p-6 hover:border-primary transition-colors">
                <h3 className="text-lg font-medium mb-4 text-primary">{skillSet.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillSet.items.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-3 py-1 text-sm bg-primary-dark text-primary border border-primary-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-primary">&gt; connect</h2>
          <Newsletter />
        </section>
      </div>
    </Layout>
  )
}
