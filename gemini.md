# Project: SpendBee

## Overview
SpendBee is a bank statement analysis application that transforms raw data from PDF and CSV files into insightful financial visualizations. It categorizes transactions, presents spending patterns through graphs, and leverages AI to provide personalized financial insights.

## Technologies
- **Frontend:**
  - **Framework:** React with Vite
  - **Data Visualization:** Chart.js, Recharts
  - **UI/Icons:** Lucide-React
- **Backend:**
  - **Framework:** Node.js with Express.js
  - **Language:** TypeScript
  - **AI & Data Processing:**
    - `openai`: For AI-powered insights.
    - `pdf-parse`: For extracting data from PDF bank statements.
    - `csv-parse`: For parsing CSV bank statements.
    - `multer`: For handling file uploads.
    - `crypto-js`: For data security.
- **Development & Tooling:**
  - `nodemon`: For automatic server restarts during development.
  - `ts-node`: To run TypeScript directly in Node.js.
  - `concurrently`: To run frontend and backend servers simultaneously.
  - `eslint`: For code linting and quality assurance.

## Key Directories
- `src/frontend/components`: Contains React components for the user interface.
- `src/server.ts`: The main entry point for the backend server.
- `public/`: Static assets like images.

## Development Commands
- `npm install`: Install all dependencies.
- `npm run dev`: Starts the frontend development server (Vite).
- `npm run build`: Builds the frontend for production.
- `npm run backend:build`: Compiles TypeScript for the backend.
- `npm run backend`: Starts the compiled backend server.
- `npm run backend:dev`: Starts the backend server in development mode with hot-reloading (nodemon).
- `npm run start`: Starts both frontend and backend development servers concurrently.
- `npm run lint`: Runs ESLint for code linting.
