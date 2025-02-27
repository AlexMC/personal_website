/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: [
      'github.com', 
      'raw.githubusercontent.com',
      'neoclone.screenscraper.fr',
      'cdn.thegamesdb.net'
    ],
  },
  basePath: '',
  assetPrefix: '',
}

module.exports = nextConfig
