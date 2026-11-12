import { defineConfig, devices } from '@playwright/test';

/**
 * Dedicated Playwright Configuration for Converze.ai Chatroom UX & Round Verification
 * 
 * Separate directories to prevent overwriting prior reports:
 * - HTML/JSON reports: ./chatroom-experience-report
 * - Videos, traces, screenshots: ./chatroom-experience-test-results
 */
export default defineConfig({
  testDir: './tests/chatroom-experience',
  timeout: 240 * 1000,
  expect: {
    timeout: 25 * 1000,
  },
  fullyParallel: false,
  workers: 1,
  outputDir: './chatroom-experience-test-results',
  reporter: [
    ['html', { open: 'never', outputFolder: 'chatroom-experience-report' }],
    ['json', { outputFile: 'chatroom-experience-report/experience-results.json' }],
    ['list']
  ],
  use: {
    baseURL: 'https://newsapp.thedevdemo.in',
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
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
  ],
});
