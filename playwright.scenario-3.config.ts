import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/scenario-3',
  timeout: 1800 * 1000, // 30 minutes for full 8-user 5-round meeting flow
  expect: {
    timeout: 30 * 1000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  outputDir: 'scenario-3-test-results',
  reporter: [
    ['html', { open: 'never', outputFolder: 'scenario-3-report' }],
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
