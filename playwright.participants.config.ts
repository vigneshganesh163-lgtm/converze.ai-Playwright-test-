import { defineConfig, devices } from '@playwright/test';

/**
 * Dedicated Playwright Configuration for Converze.ai Chatroom Participant Flow
 * 
 * Configured specifically to ensure:
 * - Isolation: Reports saved to 'chatroom-participants-report', outputs/videos to 'chatroom-participants-test-results'
 * - Zero overwriting of previous reports
 * - Full video recording enabled for all 4 participants
 * - Trace and screenshot collection enabled
 * - Pre-granted camera and microphone media permissions
 */
export default defineConfig({
  testDir: './tests/chatroom-participants',
  timeout: 600 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  fullyParallel: false,
  workers: 1,
  outputDir: './chatroom-participants-test-results',
  reporter: [
    ['html', { open: 'never', outputFolder: 'chatroom-participants-report' }],
    ['json', { outputFile: 'chatroom-participants-report/participants-results.json' }],
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
