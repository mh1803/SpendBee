import "dotenv/config";
import express, { type Request, type Response } from "express";
import multer from "multer";
import cors, { type CorsOptions } from "cors";
import OpenAI from "openai";

import type { SpendBeeAnalysis } from "./types/analysis.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// CORS
const allowedOrigins: string[] = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : [];

const corsOptions: CorsOptions = {
  origin: process.env.CI
    ? true
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

// Multer (in-memory uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// penAI (disabled in CI)
const openai =
  process.env.CI || !process.env.OPENAI_API_KEY
    ? null
    : new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

// Upload + analysis endpoint
app.post(
  "/api/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // CI mock response
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

      if (file.mimetype === "text/csv") {
        const csvText = file.buffer.toString("utf-8");
        fileContent = csvText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .join("\n");
      } else if (file.mimetype === "application/pdf") {
        const { PDFParse } = await import("pdf-parse");
        const parser = new PDFParse({ data: file.buffer });
        const result = await parser.getText();

        fileContent = result.text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .join("\n");
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }

      // OpenAI analysis
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
              You are SpendBee, an AI-powered personal finance assistant.

              Analyze the provided bank statement text and return ONLY valid JSON.
              Do NOT include explanations, markdown, or extra text.

              The JSON response MUST include:

              - currency: string  
                The currency symbol used in the statement (e.g., $, £, €). Never use a 3-letter code.

              - initial_balance: number  
              - final_balance: number  
              - total_income: number  
              - total_spending: number  

              - summary: string  
                4–6 friendly, concise sentences describing the user's overall financial health,
                based STRICTLY on the transaction data.

              - insights: string[]  
                3–5 concise observations highlighting patterns, trends, or anomalies
                directly supported by the transactions.

              - tips: string[]  
                3–5 practical, actionable suggestions based ONLY on the transaction data.

              - transactions: array of objects with:
                - date: string
                - description: string
                - amount: number
                - category: string (MUST be one of the exact values below)

              Income categories (amount > 0):
              - salary
              - freelance
              - gifts
              - refunds
              - other

              Spending categories (amount < 0):
              - groceries
              - dining
              - bills
              - transport
              - health
              - shopping
              - leisure
              - other

              Rules:
              - Income MUST be positive, spending MUST be negative
              - Totals MUST exactly match the transactions
              - Detect and use the currency consistently
              - Use realistic assumptions ONLY if balances are missing
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
    } catch {
      res.status(500).json({ error: "Failed to process file" });
    }
  },
);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("ok");
});

// Server start
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
  console.log("CI:", process.env.CI);
});
