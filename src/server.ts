import "dotenv/config";
import express, { type Request, type Response } from "express";
import multer from "multer";
import cors, { type CorsOptions } from "cors";
import OpenAI from "openai";

import type { SpendBeeAnalysis } from "./types/analysis.js";

const app = express();
const PORT = Number(process.env.BACKEND_PORT) || 3000;

/**
 * CORS
 */
const allowedOrigins: string[] = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : [];

const corsOptions: CorsOptions = {
  origin: process.env.CI
    ? true // allow all origins in CI (Playwright / GitHub Actions)
    : (origin, callback) => {
        if (!origin) return callback(null, true);

        const normalizedOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.includes(normalizedOrigin)) {
          return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

/**
 * Multer (in-memory uploads)
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

/**
 * OpenAI (disabled in CI)
 */
const openai =
  process.env.CI || !process.env.OPENAI_API_KEY
    ? null
    : new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

/**
 * Upload + analysis endpoint
 */
app.post(
  "/api/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    /**
     * CI mock response (Playwright-safe)
     */
    if (process.env.CI) {
      return res.json({
        analysis: {
          currency: "£",
          initial_balance: 1000,
          final_balance: 900,
          total_income: 0,
          total_spending: -100,
          summary: "Mock analysis for CI.",
          insights: [],
          tips: [],
          transactions: [],
        },
      });
    }

    if (!openai) {
      return res.status(500).json({ error: "OpenAI not configured" });
    }

    try {
      let fileContent = "";

      /**
       * CSV parsing
       */
      if (file.mimetype === "text/csv") {
        const csvText = file.buffer.toString("utf-8");
        const lines = csvText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        fileContent = lines.join("\n");
      } else if (file.mimetype === "application/pdf") {
        /**
         * PDF parsing
         */
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

      /**
       * OpenAI analysis
       */
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are SpendBee, an AI-powered personal finance assistant.

Analyze the provided bank statement text and return ONLY valid JSON.
Do not include explanations, markdown, or extra text.

The JSON response MUST include:
- currency (symbol)
- initial_balance
- final_balance
- total_income
- total_spending
- summary (4–6 sentences)
- insights (3–5)
- tips (3–5)
- transactions

Rules:
- Spending must be negative, income positive
- Totals must match transactions
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
        analysisJSON = JSON.parse(analysisText);
      } catch (err) {
        console.error("Invalid JSON from OpenAI:", analysisText);
        return res.status(500).json({ error: "AI returned invalid JSON" });
      }

      res.json({ analysis: analysisJSON });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to process file" });
    }
  },
);

/**
 * Health check (used by Playwright + CI)
 */
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("ok");
});

/**
 * Server start
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
  console.log("CI:", process.env.CI);
});
