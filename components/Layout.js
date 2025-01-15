import Head from 'next/head'
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-primary">
      <Head>
        <title>Alexandre Carvalho</title>
        <meta name="description" content="Software Engineer & Developer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="py-8">
        <div className="container-custom">
          <div className="flex flex-col space-y-4">
            <h1 className="text-4xl font-bold text-glow">ALEXANDRE CARVALHO</h1>
            <h2 className="text-primary-light">CTPO | GEN AI | DECENTRALIZED LEDGER TECH</h2>
            <nav className="flex space-x-8 text-primary-light">
              <Link href="/" className="hover:text-primary transition-colors">
                HOME
              </Link>
              <Link href="/work" className="hover:text-primary transition-colors">
                WORK
              </Link>
              <Link href="/blog" className="hover:text-primary transition-colors">
                BLOG
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors">
                ABOUT
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        {children}
      </main>

      <footer className="py-8 mt-16 border-t border-primary-dark">
        <div className="container-custom text-center">
          <div className="flex justify-center space-x-8 mb-6">
            <a href="https://github.com/alexmc" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary transition-colors">
              GITHUB
            </a>
            <a href="https://twitter.com/alexmc" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary transition-colors">
              TWITTER
            </a>
            <a href="https://linkedin.com/in/alexmc" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary transition-colors">
              LINKEDIN
            </a>
          </div>
          <p className="text-primary-light text-sm">
            {new Date().getFullYear()} - BUILT WITH NEXT.JS
          </p>
        </div>
      </footer>
    </div>
  )
}
