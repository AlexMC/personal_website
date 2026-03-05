/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: 'github.com' },
      { hostname: 'raw.githubusercontent.com' },
      { hostname: 'neoclone.screenscraper.fr' },
      { hostname: 'cdn.thegamesdb.net' },
    ],
  },
  basePath: '',
  assetPrefix: '',
}

module.exports = nextConfig
