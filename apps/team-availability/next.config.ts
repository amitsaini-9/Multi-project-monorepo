import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@mini-apps/ui', '@mini-apps/database'],
}

export default nextConfig
