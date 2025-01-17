import Link from 'next/link'

export default function Header() {
  return (
    <header className="pt-16">
      <div className="max-w-3xl mx-auto px-4">
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
  )
}
