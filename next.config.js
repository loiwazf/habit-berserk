/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'export', // Commenting out static export
  images: {
    unoptimized: true,
    domains: ['habit-berserk.netlify.app'],
  },
  trailingSlash: true,
}

module.exports = nextConfig
