import "dotenv/config";
import express, { type Request, type Response } from "express";
import multer from "multer";
import cors, { type CorsOptions } from "cors";
import OpenAI from "openai";

import type { SpendBeeAnalysis } from "./types/analysis.js";

const app = express();
const PORT = Number(process.env.BACKEND_PORT) || 3000;

const allowedOrigins: string[] = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : [];

// CORS options
const corsOptions: CorsOptions = {
  origin: process.env.CI
    ? true
    : (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalizedOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.includes(normalizedOrigin))
          return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

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
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
            You are SpendBee, an AI-powered personal finance assistant.

            Analyze the provided bank statement text and return ONLY valid JSON.
            Do not include explanations, markdown, or extra text.

            The JSON response MUST include:

            - currency: string
            The currency symbol used in the statement (e.g., $, £, €), instead of a 3-letter code.

            - initial_balance: number
            - final_balance: number
            - total_income: number
            - total_spending: number

            - summary: string
              4–6 sentences, friendly and concise, describing the user's overall financial health
              based strictly on the data in the transactions.

            - insights: string[] 
              3–5 concise points highlighting patterns, trends, or anomalies
              that are directly supported by the transaction data.

            - tips: string[]
              3–5 practical, actionable suggestions based ONLY on the data.

            - transactions: array of objects with:
            - date: string
            - description: string
            - amount: number
            - category: string (MUST be one of the following exact values)

            Income categories (amount > 0):
            - salary
            - freelance
            - gifts
            - refunds
            - other

            Spending categories (amount < 0):
            - groceries        (food, supermarkets, dining essentials)
            - dining           (restaurants, cafes, takeaways)
            - bills            (rent, utilities, phone, subscriptions)
            - transport        (fuel, public transport, parking)
            - health           (pharmacy, medical, fitness)
            - shopping         (retail, online shopping)
            - leisure          (entertainment, hobbies)
            - other            (cash withdrawals, uncategorised)

            Rules:
            - Amounts spent should be negative, income positive.
            - Ensure totals match transactions.
            - Output STRICT JSON only.
            - Use realistic assumptions only if balances are missing.
            - Detect and return the currency consistently across transactions.
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
  },
);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("ok");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
  console.log("CI:", process.env.CI);
});
