import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { site } from '../lib/site.mjs'

export default function Header() {
  const [tapCount, setTapCount] = useState(0);
  const [tapTimer, setTapTimer] = useState(null);
  const NameTag = useRouter().pathname === '/' ? 'h1' : 'p';

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
          {/* The name is the page's h1 only on the home page; elsewhere each page owns its h1. */}
          <NameTag
            className="text-4xl font-bold text-glow select-none cursor-default"
            onClick={handleTap}
            onTouchEnd={handleTap}
          >
            ALEXANDRE CARVALHO
          </NameTag>
          <p className="text-primary-light">{site.tagline.toUpperCase()}</p>
          <nav className="flex space-x-8 text-primary-light">
            <Link href="/" className="hover:text-primary transition-colors">
              HOME
            </Link>
            <Link href="/work" className="hover:text-primary transition-colors">
              WORK
            </Link>
            <Link href="/tools" className="hover:text-primary transition-colors">
              TOOLS
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
