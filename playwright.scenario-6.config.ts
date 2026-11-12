import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/scenario-6',
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  timeout: 1800000, // 30 minutes per test
  reporter: [
    ['html', { outputFolder: 'scenario-6-playwright-report', open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: 'https://newsapp.thedevdemo.in',
    headless: true,
    video: 'on',
    screenshot: 'on',
    trace: 'on',
    permissions: ['camera', 'microphone'],
    launchOptions: {
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--disable-web-security',
        '--allow-running-insecure-content'
      ]
    }
  },
  outputDir: 'scenario-6-test-results',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
