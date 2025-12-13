import express, { type Request, type Response } from "express";
import multer from "multer";
import OpenAI from "openai";

import type { SpendBeeAnalysis } from "./types/analysis";

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
        const csvText = file.buffer.toString("utf-8");
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
              You are SpendBee, an AI-powered personal finance assistant.

              Analyze the provided bank statement text and return ONLY valid JSON.
              Do not include explanations, markdown, or extra text.

              The JSON response MUST include:

              - initial_balance: number
              - final_balance: number
              - total_income: number
              - total_spending: number
              - summary: string
              - insights: string[]
              - tips: string[]
              - transactions: array of objects with:
                - date: string
                - description: string
                - amount: number
                - category: string

              Rules:
              - Amounts spent should be negative, income positive
              - Ensure totals match transactions
              - Output STRICT JSON only
            `,
          },
          {
            role: "user",
            content: `Bank statement lines:\n${fileContent}`,
          },
        ],
      });

      const analysisText = completion.choices[0].message?.content ?? "";

      let analysisJSON: SpendBeeAnalysis;

      try {
        analysisJSON = JSON.parse(analysisText) as SpendBeeAnalysis;
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
