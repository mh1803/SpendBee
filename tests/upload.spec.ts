import { test, expect, type APIRequestContext } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Mocked OpenAI analysis response
import { mockSpendBeeAnalysis } from "./mocks/openaiResponse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Helper function to upload a file to the backend
 * and assert a successful response containing `analysis`
 */
async function uploadFile(
  request: APIRequestContext,
  filePath: string,
  mimeType: string
): Promise<void> {
  // Send multipart/form-data POST request to upload endpoint
  const response = await request.post("http://localhost:3000/api/upload", {
    multipart: {
      file: {
        name: path.basename(filePath), // File name sent to backend
        mimeType, // Explicit MIME type (PDF / CSV)
        buffer: fs.readFileSync(filePath), // File contents
      },
    },
  });

  // Ensure the API responded with a 2xx status
  expect(response.ok()).toBeTruthy();

  // Parse JSON response and verify expected shape
  const body: { analysis?: unknown } = await response.json();
  expect(body).toHaveProperty("analysis");
}

/**
 * Before each test:
 * Intercept OpenAI chat completion requests and return a mocked response.
 */

test.beforeEach(async ({ page }) => {
  await page.route("**/v1/chat/completions", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        choices: [
          {
            message: {
              // Backend expects OpenAI to return JSON as a string
              content: JSON.stringify(mockSpendBeeAnalysis),
            },
          },
        ],
      }),
    });
  });
});

// Verify that uploading a PDF statement returns valid JSON analysis
test("PDF upload returns valid JSON response", async ({ request }) => {
  const pdfPath = path.join(__dirname, "fixtures", "sample-statement.pdf");
  await uploadFile(request, pdfPath, "application/pdf");
});

// Verify that uploading a CSV statement returns valid JSON analysis
test("CSV upload returns valid JSON response", async ({ request }) => {
  const csvPath = path.join(__dirname, "fixtures", "sample-statement.csv");
  await uploadFile(request, csvPath, "text/csv");
});
