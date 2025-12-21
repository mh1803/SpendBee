import styles from "./Dashboard.module.css";

interface InsightsProps {
  insights: string[];
}

export function Insights({ insights }: InsightsProps) {
  return (
    <div className={styles.insights}>
      <h3>Insights</h3>
      <ul>
        {insights.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
