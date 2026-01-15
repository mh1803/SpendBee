import styles from "./OverviewCard.module.css";

interface OverviewCardProps {
  currency?: string;
  label: string;
  value: number;
  showSign?: boolean;
}

export function OverviewCard({
  currency,
  label,
  value,
  showSign = false,
}: OverviewCardProps) {
  const isNetChange = label.toLowerCase() === "net change";

  const colourClass = isNetChange
    ? value > 0
      ? styles.positive
      : value < 0
      ? styles.negative
      : styles.neutral
    : styles.neutral;

  const sign =
    isNetChange && showSign && value !== 0 ? (value > 0 ? "+" : "−") : "";

  return (
    <div className={`${styles.overviewCard} ${colourClass}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        {sign}
        {currency}
        {Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}
