import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'
import GameBar from './GameBar'
import { useEffect } from 'react'

export default function Layout({ children }) {
  // Global ESC key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Create a custom event when ESC is pressed
      if (e.key === 'Escape' || e.keyCode === 27) {
        console.log('Global ESC key detected');
        const escEvent = new CustomEvent('escapeKeyPressed');
        document.dispatchEvent(escEvent);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-primary">
      <Head>
        <title>Alexandre Carvalho</title>
        <meta name="description" content="Software Engineer & Developer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10">
        {children}
      </main>

      <Footer />
      <GameBar />
    </div>
  )
}
