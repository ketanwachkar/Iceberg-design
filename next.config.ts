import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  /* Silence the "multiple lockfiles" workspace-root warning */
  turbopack: {
    root: path.resolve(__dirname),
  },

  /* Allow Next.js <Image> to serve local /public assets */
  images: {
    localPatterns: [{ pathname: '/images/**' }],
  },

  reactStrictMode: true,
}

export default nextConfig
