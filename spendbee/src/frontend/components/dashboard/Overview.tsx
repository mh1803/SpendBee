import type { SpendBeeAnalysis } from "../../../types/analysis";
import styles from "./Overview.module.css";
import { OverviewCard } from "./OverviewCard";

interface OverviewProps {
  analysis: SpendBeeAnalysis;
}

export function Overview({ analysis }: OverviewProps) {
  const { currency, initial_balance, final_balance } = analysis;

  return (
    <div className={styles.overview}>
      <div className={styles.overviewGrid}>
        <OverviewCard
          label="Net Change"
          value={final_balance - initial_balance}
          currency={currency}
          showSign
        />

        <OverviewCard
          label="Final Balance"
          value={final_balance}
          currency={currency}
        />

        <OverviewCard
          label="Initial Balance"
          value={initial_balance}
          currency={currency}
        />
      </div>
    </div>
  );
}
