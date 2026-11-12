import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testIgnore: ['tests/e2e/live.spec.ts'],
  timeout: 120000,
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'mobile-pixel',
      use: {
        ...devices['Pixel 7'],
        hasTouch: true,
      },
    },
  ],
});
