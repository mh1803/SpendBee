import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Directory where all test files are located
  testDir: "./tests",

  // Shared settings for all tests
  use: {
    baseURL: "http://localhost:5173", // Base URL for frontend tests
    headless: true, // Run tests without opening the browser window
    trace: "on-first-retry", // Record a trace only when a test fails on the first retry
  },

  // Projects define which browsers/devices the tests will run on
  projects: [
    {
      name: "Chromium", // Project name
      use: { ...devices["Desktop Chrome"] }, // Use Playwright's built-in desktop Chrome configuration
    },
  ],

  // Start web servers before running tests
  webServer: [
    {
      command: "npm run backend:dev",
      url: "http://localhost:3000/health",
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: "npm run dev",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
