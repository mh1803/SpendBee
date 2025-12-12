import express, { type Request, type Response } from "express";
import multer from "multer";
import OpenAI from "openai";
import { parse as csvParse } from "csv-parse/sync";

// Express app
const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

// Multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper: parse CSV into text for AI
function parseCSV(buffer: Buffer) {
  const records = csvParse(buffer.toString("utf-8"), {
    columns: true,
    skip_empty_lines: true,
  });
  return JSON.stringify(records);
}

// Upload endpoint
app.post(
  "/api/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    try {
      let fileContent = "";

      // CSV
      if (file.mimetype === "text/csv") {
        // Convert buffer to string
        const csvText = file.buffer.toString("utf-8");
        // Split into lines
        const lines = csvText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        fileContent = lines.join("\n");
      }
      // PDF
      else if (file.mimetype === "application/pdf") {
        const { PDFParse } = await import("pdf-parse");
        const parser = new PDFParse({ data: file.buffer });
        const result = await parser.getText();
        // Split PDF text into lines
        const lines = result.text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        fileContent = lines.join("\n");
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }

      // Send structured lines to OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [
          {
            role: "system",
            content: `
You are SpendBee, a personal finance assistant.
Analyze this bank statement text and return ONLY valid JSON with:
- initial_balance
- final_balance
- total_income
- total_spending
- transactions: array with date, description, amount, category

Categories:
- salary, freelance, gifts, refunds, other
- groceries, dining, bills, transport, health, shopping, leisure, other

Output strict JSON only. No extra text.
            `,
          },
          {
            role: "user",
            content: `Bank statement lines:\n${fileContent}`,
          },
        ],
      });

      const analysisText = completion.choices[0].message?.content || "";
      let analysisJSON = null;

      try {
        analysisJSON = JSON.parse(analysisText);
      } catch (err) {
        console.error("Failed to parse AI response as JSON:", err);
        return res.status(500).json({ error: "AI returned invalid JSON" });
      }

      res.json({ analysis: analysisJSON });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to process file" });
    }
  }
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
