const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  transpilePackages: ['@hamsurang/ui'],
  experimental: {
    typedRoutes: true,
    missingSuspenseWithCSRBailout: false,
  },
}
module.exports = withMDX(nextConfig)
