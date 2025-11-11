import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [tapCount, setTapCount] = useState(0);
  const [tapTimer, setTapTimer] = useState(null);

  // Trigger Trakt modal when 5 taps detected
  useEffect(() => {
    if (tapCount >= 5) {
      // Dispatch Trakt modal event
      const traktEvent = new CustomEvent('traktModalActivated');
      document.dispatchEvent(traktEvent);

      // Reset
      setTapCount(0);
      if (tapTimer) clearTimeout(tapTimer);
    }
  }, [tapCount, tapTimer]);

  const handleTap = () => {
    // Clear existing timer
    if (tapTimer) clearTimeout(tapTimer);

    // Increment tap count
    setTapCount(prev => prev + 1);

    // Reset after 1 second of no taps
    const timer = setTimeout(() => {
      setTapCount(0);
    }, 1000);
    setTapTimer(timer);
  };

  return (
    <header className="pt-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col space-y-4">
          <h1
            className="text-4xl font-bold text-glow select-none cursor-default"
            onClick={handleTap}
            onTouchEnd={handleTap}
          >
            ALEXANDRE CARVALHO
          </h1>
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
