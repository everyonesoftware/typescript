import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['test/**/*.{ts,tsx}'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['html', 'lcovonly'],
      exclude: ['test/**/*', '**/*.config.*']
    },
  },
})