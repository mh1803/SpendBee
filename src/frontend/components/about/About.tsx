import styles from "./About.module.css";

export function About() {
  return (
    <div id="about" className={styles.about}>
      <div className={styles.features}>
        <ul>
          <li>
            <h3>Simple & Fast</h3>
            <p>
              Upload your statement and receive meaningful insights in seconds
              through a clean, beginner-friendly interface.
            </p>
          </li>

          <li>
            <h3>AI-Powered Insights</h3>
            <p>
              Spend Bee intelligently analyses your bank statements to uncover
              spending patterns and reveal exactly where your money goes.
            </p>
          </li>

          <li>
            <h3>Smart Categorisation</h3>
            <p>
              Transactions are automatically organised into clear categories
              such as groceries, transport and shopping — no manual effort
              required.
            </p>
          </li>

          <li>
            <h3>Privacy First</h3>
            <p>
              Your data is processed securely and never stored. All analysis
              happens instantly and remains completely private.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
