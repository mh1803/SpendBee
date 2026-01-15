import styles from "./Dashboard.module.css";
import type { SpendBeeAnalysis } from "../../../types/analysis";
import { Overview } from "./Overview";
import { Transactions } from "./Transactions";
import { Summary } from "./Summary";
import { Insights } from "./Insights";
import { Tips } from "./Tips";
import { IncomeSpendingDoughnuts } from "./IncomeSpendingDoughnuts";
import { SpendingOverTime } from "./SpendingOverTime";

interface DashboardProps {
  analysis: SpendBeeAnalysis | null;
}

export function Dashboard({ analysis }: DashboardProps) {
  return (
    <div className={styles.dashboard}>
      {!analysis ? (
        <div className={styles.emptyDashboard}>
          <p>No data uploaded yet.</p>
        </div>
      ) : (
        <>
          <Overview analysis={analysis} />

          <Transactions
            transactions={analysis.transactions}
            currency={analysis.currency}
          />

          <IncomeSpendingDoughnuts
            transactions={analysis.transactions}
            currency={analysis.currency}
            totalIncome={analysis.total_income}
            totalSpending={analysis.total_spending}
          />

          <SpendingOverTime
            transactions={analysis.transactions}
            currency={analysis.currency}
          />

          <Summary summary={analysis.summary} />

          <Insights insights={analysis.insights} />

          <Tips tips={analysis.tips} />
        </>
      )}
    </div>
  );
}
