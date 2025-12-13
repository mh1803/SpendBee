// Transaction categories
export type IncomeCategory =
  | "salary"
  | "freelance"
  | "gifts"
  | "refunds"
  | "other";

export type SpendingCategory =
  | "groceries"
  | "dining"
  | "bills"
  | "transport"
  | "health"
  | "shopping"
  | "leisure"
  | "other";

export type TransactionCategory = IncomeCategory | SpendingCategory;

export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
}

export interface SpendBeeAnalysis {
  initial_balance: number;
  final_balance: number;
  total_income: number;
  total_spending: number;
  summary: string;
  insights: string[];
  tips: string[];
  transactions: Transaction[];
}
