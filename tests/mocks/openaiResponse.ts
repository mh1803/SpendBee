export const mockSpendBeeAnalysis = {
  currency: "£",
  initial_balance: 1000,
  final_balance: 850,
  total_income: 500,
  total_spending: -650,
  summary:
    "Your finances are stable with moderate spending and regular income.",
  insights: [
    "Most spending is on groceries and dining",
    "Income appears consistent",
    "No unusual transactions detected",
  ],
  tips: [
    "Reduce dining out to save more",
    "Set aside savings after income",
    "Monitor discretionary spending",
  ],
  transactions: [
    {
      date: "2024-01-01",
      description: "Salary",
      amount: 500,
      category: "salary",
    },
    {
      date: "2024-01-05",
      description: "Supermarket",
      amount: -150,
      category: "groceries",
    },
  ],
};
