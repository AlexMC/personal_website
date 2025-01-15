import Head from 'next/head'

export default function Work() {
  const projects = [
    {
      title: "Project 1",
      description: "Description of project 1",
      link: "https://project1.com"
    },
    {
      title: "Project 2",
      description: "Description of project 2",
      link: "https://project2.com"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Work - Alexandre Carvalho</title>
        <meta name="description" content="My work and projects" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Work</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="border p-6 rounded-lg hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <a href={project.link} className="text-blue-600 hover:underline">View Project →</a>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
