import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './qa/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:4180', channel: process.env.PLAYWRIGHT_CHANNEL === 'chrome' ? 'chrome' : undefined, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'npm run preview -- --host 127.0.0.1 --port 4180 --strictPort', url: 'http://127.0.0.1:4180', reuseExistingServer: !process.env.CI },
});
