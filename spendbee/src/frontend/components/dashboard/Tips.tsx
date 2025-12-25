import styles from "./Dashboard.module.css";

interface TipsProps {
  tips: string[];
}

export function Tips({ tips }: TipsProps) {
  return (
    <div className={styles.tips}>
      <h3 className={styles.title}>Tips</h3>
      <ul>
        {tips.map((t, idx) => (
          <li key={idx}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
