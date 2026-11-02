import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  use: {
    // VERIFY_BASE_URL lets a run point at a build served on another port (the
    // sandbox keeps :3000 for the team site). Default stays :3000 for CI.
    baseURL: process.env.VERIFY_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          // Bumped from chromium-1228 (removed from the sandbox) — 1248 is what
          // is installed. Without this every e2e spec fails to launch.
          executablePath: '/opt/browsers/chromium-1248/chrome-linux64/chrome',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ]
        }
      },
    },
  ],

  // Dev server is already running on port 3000 — no webServer needed
});