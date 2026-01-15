# SpendBee: Bank Statement Analyzer

SpendBee is a bank statement analysis application that transforms raw data from PDF and CSV files into insightful financial visualizations. It categorizes transactions, presents spending patterns through graphs, and leverages AI to provide personalized financial insights.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd spendbee
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Environment Variables

Before running the application, you need to create a `.env` file in the root of the project. This file should contain the following environment variables:

```
OPENAI_API_KEY=<your-openai-api-key>
BACKEND_PORT=3000
CORS_ORIGINS=http://localhost:5173
```

- `OPENAI_API_KEY`: Your API key for the OpenAI service.
- `BACKEND_PORT`: The port for the backend server. Defaults to 3000.
- `CORS_ORIGINS`: A comma-separated list of allowed origins for CORS.

## Running the Application

To run both the frontend and backend servers concurrently in development mode, use the following command:

```bash
npm run start
```

This will:

- Start the React frontend development server on `http://localhost:5173`.
- Start the Node.js backend server on `http://localhost:3000`.

## Available Scripts

- `npm run dev`: Starts only the frontend development server.
- `npm run backend:dev`: Starts only the backend server in development mode with auto-reloading.
- `npm run build`: Builds the frontend for production.
- `npm run lint`: Lints the codebase using ESLint.
