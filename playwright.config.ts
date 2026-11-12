import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Configuration
 * Configured for Converze.ai article survey test with:
 * - HTML report generation
 * - Video recording enabled for all tests
 * - Screenshot capture
 * - Trace recording
 * - Extended timeouts for survey reading timer
 */
export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for (accommodates 20-30s survey wait) */
  timeout: 120 * 1000,
  expect: {
    timeout: 15 * 1000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://newsapp.thedevdemo.in',

    /* Record video for all tests */
    video: 'on',

    /* Capture screenshot after each test */
    screenshot: 'on',

    /* Collect trace for all tests */
    trace: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
