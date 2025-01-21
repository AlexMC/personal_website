/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'export',
    basePath: '/personal_website',
    images: {
      unoptimized: true,
    },
  } : {
    images: {
      domains: ['github.com', 'raw.githubusercontent.com'],
    },
  })
}

module.exports = nextConfig
