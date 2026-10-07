import { Html, Head, Main, NextScript } from 'next/document'
import { site } from '../lib/site.mjs'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="alternate" type="application/rss+xml" title={`${site.name} | Blog`} href="/feed.xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
