import styles from "./Dashboard.module.css";

interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <div className={styles.summary}>
      <h3 className={styles.title}>Summary</h3>
      <p>{summary}</p>
    </div>
  );
}
