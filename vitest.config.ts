import solid from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solid() as never],
  resolve: {
    conditions: ['development', 'browser'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    projects: ['ui/form', 'ui/react-form', 'ui/solid-form'],
    reporters: ['default', 'html'],
    outputFile: 'docs/.vitepress/dist/coverage/index.html',
    coverage: {
      provider: 'v8',
      enabled: true,
      include: ['ui/form/src/**/*.{ts,tsx}', 'ui/react-form/src/**/*.{ts,tsx}', 'ui/solid-form/src/**/*.{ts,tsx}'],
      exclude: ['ui/form/src/**/types.ts'],
      reportsDirectory: 'docs/.vitepress/dist/coverage/details',
    },
  },
});
