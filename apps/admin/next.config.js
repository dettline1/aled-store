/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'placehold.co'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:4000/api/v1',
  },
}

module.exports = nextConfig
