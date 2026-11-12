import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/admin',
  timeout: 180 * 1000,
  expect: {
    timeout: 20 * 1000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  outputDir: 'admin-test-results',
  reporter: [
    ['html', { open: 'never', outputFolder: 'admin-test-report' }],
    ['list']
  ],
  use: {
    baseURL: 'https://newsadmin.thedevdemo.in',
    viewport: { width: 1440, height: 900 },
    video: 'on',
    screenshot: 'on',
    trace: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
