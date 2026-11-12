import { defineConfig, devices } from '@playwright/test';

/**
 * Dedicated Playwright Configuration for Converze.ai Chatroom Multi-User Test Suite
 * 
 * Configured specifically to ensure:
 * - Isolation: Reports saved to 'chatroom-report', outputs/videos to 'chatroom-test-results'
 * - Does NOT overwrite previous test reports in 'playwright-report'
 * - Full video recording enabled for all participants
 * - Trace and screenshot collection enabled
 * - Browser permissions pre-granted for camera and microphone media streams
 */
export default defineConfig({
  testDir: './tests/chatroom',
  timeout: 180 * 1000,
  expect: {
    timeout: 20 * 1000,
  },
  fullyParallel: false,
  workers: 1,
  outputDir: './chatroom-test-results',
  reporter: [
    ['html', { open: 'never', outputFolder: 'chatroom-report' }],
    ['json', { outputFile: 'chatroom-report/chatroom-results.json' }],
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
