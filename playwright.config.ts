import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

// Load environment variables
config();

// ReportPortal configuration
const rpConfig = {
  apiKey: process.env.REPORTPORTAL_API_KEY,
  endpoint: process.env.REPORTPORTAL_ENDPOINT,
  project: process.env.REPORTPORTAL_PROJECT,
  launch: 'Playwright SDD Tests',
  attributes: [
    { key: 'framework', value: 'playwright' },
    { key: 'env', value: process.env.ENV || 'dev' }
  ],
  description: 'Automated tests from Playwright SDD Framework',
  skippedIssue: false,
  includeTestSteps: true,  // Include @step annotations as nested steps in ReportPortal
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  workers: 4,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['@reportportal/agent-js-playwright', rpConfig]
  ],
  use: {
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },
  projects: [
    {
      name: 'chromium',
      testDir: './tests/specs',
      use: {
        ...devices['Desktop Chrome'],
      }
    },
  ],
});
