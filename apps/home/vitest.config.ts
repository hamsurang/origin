import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    alias: {
      '@/_shared': resolve(__dirname, 'app/_shared'),
    },
  },
})
