import Head from 'next/head'

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>About - Alexandre Carvalho</title>
        <meta name="description" content="About me" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">About Me</h1>
        
        <div className="prose lg:prose-xl">
          <p className="text-xl text-gray-600 mb-6">
            I'm a software engineer passionate about building great products and solving interesting problems.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Skills</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Frontend Development (React, Next.js)</li>
            <li>Backend Development</li>
            <li>Cloud Architecture</li>
            <li>System Design</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Interests</h2>
          <p className="text-gray-600">
            When I'm not coding, you can find me reading about technology, 
            exploring new tools and frameworks, or contributing to open-source projects.
          </p>
        </div>
      </main>
    </div>
  )
}
