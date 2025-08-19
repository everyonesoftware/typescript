// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.ts'], // adjust to your folder structure
    // testTimeout: 15000, // 15 seconds
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['html', 'lcovonly']
    },
  },
})
