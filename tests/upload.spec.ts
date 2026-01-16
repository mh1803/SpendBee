import { test, expect, APIRequestContext } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to upload file and check response
async function uploadFile(
  request: APIRequestContext,
  filePath: string,
  mimeType: string
) {
  const response = await request.post("http://localhost:3000/api/upload", {
    multipart: {
      file: {
        name: path.basename(filePath),
        mimeType,
        buffer: fs.readFileSync(filePath),
      },
    },
  });

  // Ensure API responded successfully
  expect(response.ok()).toBeTruthy();

  // Response must include 'analysis'
  const body = await response.json();
  expect(body).toHaveProperty("analysis");
}

// PDF upload test
test("PDF upload returns valid JSON response", async ({ request }) => {
  const pdfPath = path.join(__dirname, "fixtures", "sample-statement.pdf");
  await uploadFile(request, pdfPath, "application/pdf");
});

// CSV upload test
test("CSV upload returns valid JSON response", async ({ request }) => {
  const csvPath = path.join(__dirname, "fixtures", "sample-statement.csv");
  await uploadFile(request, csvPath, "text/csv");
});
