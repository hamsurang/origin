import path from 'node:path'

module.exports = {
  ...require('@hamsurang/tailwind-config'),
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    path.join(path.dirname(require.resolve('@hamsurang/ui')), '**/*.{ts,tsx}'),
  ],
}
