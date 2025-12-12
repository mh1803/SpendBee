import styles from "./About.module.css";

export function About() {
  return (
    <div className={styles.about}>
      <div className={styles.features}>
        <ul>
          <li>
            <strong>AI-Powered Insights:</strong> Spend Bee automatically
            analyses your bank statements, detects spending patterns, and
            highlights where your money truly goes.
          </li>

          <li>
            <strong>Smart Categorisation:</strong> Your transactions are
            instantly sorted into clear categories like food, travel, bills,
            subscriptions, and more — no manual work.
          </li>

          <li>
            <strong>Privacy First:</strong> Spend Bee processes statements
            securely and never stores your data — analysis happens instantly and
            privately.
          </li>

          <li>
            <strong>Simple & Fast:</strong> Upload your statement and get your
            insights in just seconds with a clean, beginner-friendly interface.
          </li>
        </ul>
      </div>
    </div>
  );
}
