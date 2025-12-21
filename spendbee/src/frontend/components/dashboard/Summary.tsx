import styles from "./Dashboard.module.css";

interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <div className={styles.summary}>
      <h3>Summary</h3>
      <p>{summary}</p>
    </div>
  );
}
