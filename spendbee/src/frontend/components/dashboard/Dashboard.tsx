import styles from "./Dashboard.module.css";

interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface DashboardProps {
  analysis: {
    initial_balance: number;
    final_balance: number;
    total_income: number;
    total_spending: number;
    transactions: Transaction[];
  } | null;
}

export function Dashboard({ analysis }: DashboardProps) {
  return <div></div>;
}
