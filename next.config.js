/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: 'http://localhost:3000', // Set the correct URL for local development
  },
}

module.exports = nextConfig
