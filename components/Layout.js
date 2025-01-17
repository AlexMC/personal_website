import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }) {
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
    </div>
  )
}
