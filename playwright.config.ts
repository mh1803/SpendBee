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
      // Start the frontend dev server (Vite)
      command: "npm run dev", // Command to start frontend
      url: "http://localhost:5173", // Wait for this URL to be available before starting tests
      reuseExistingServer: !process.env.CI, // Reuse if already running locally (skip starting a new server)
      timeout: 120_000, // Wait up to 120 seconds for the server to be ready
    },
    {
      // Start the backend server (Express)
      command: "npm run backend:dev", // Command to start backend
      url: "http://localhost:3000", // Wait for backend API to be available before tests
      reuseExistingServer: !process.env.CI, // Reuse if already running locally
      timeout: 20_000, // Wait up to 20 seconds for backend to be ready
    },
  ],
});
