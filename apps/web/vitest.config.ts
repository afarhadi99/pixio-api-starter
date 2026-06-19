import { defineConfig } from 'vitest/config';

// The web app's end-to-end tests live in ./e2e and run under Playwright
// (`pnpm test:e2e`). This Vitest config is for any colocated unit tests and
// deliberately bypasses the Next/Tailwind PostCSS pipeline.
export default defineConfig({
  css: { postcss: { plugins: [] } },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', '.next/**'],
    passWithNoTests: true,
  },
});
