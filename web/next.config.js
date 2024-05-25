/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@hamsurang/ui', '@hamsurang/icon'],
  experimental: {
    typedRoutes: true,
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'))

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}
