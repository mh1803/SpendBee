import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  // Shared settings for all browsers
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    trace: "on-first-retry",
  },

  // Run tests against multiple browsers
  projects: [
    {
      name: "Chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "WebKit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  // Start dev server before running tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
