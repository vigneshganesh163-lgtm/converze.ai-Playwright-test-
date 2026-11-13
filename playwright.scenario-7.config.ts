import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/scenario-7',
  timeout: 1800 * 1000, // 30 minutes for complete 16-user mixed perspective meeting
  expect: {
    timeout: 30 * 1000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  outputDir: 'scenario-7-test-results',
  reporter: [
    ['html', { open: 'never', outputFolder: 'scenario-7-playwright-report' }],
    ['list']
  ],
  use: {
    baseURL: 'https://newsapp.thedevdemo.in',
    viewport: { width: 1280, height: 720 },
    video: 'on',
    screenshot: 'on',
    trace: 'on',
    permissions: ['camera', 'microphone'],
    launchOptions: {
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--allow-file-access'
      ]
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
