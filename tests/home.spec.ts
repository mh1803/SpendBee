// Import Playwright test utilities
import { test, expect } from "@playwright/test";

// Test that the homepage loads correctly
test("homepage loads", async ({ page }) => {
  // Open the homepage
  await page.goto("/");

  // Check the page title includes "SpendBee"
  await expect(page).toHaveTitle(/SpendBee/i);
});
