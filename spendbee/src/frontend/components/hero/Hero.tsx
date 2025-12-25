import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.hexWrapper}>
        {[...Array(30)].map((_, rowIndex) => (
          <div key={rowIndex} className={styles.hexRow}>
            {[...Array(30)].map((_, hexIndex) => (
              <div key={hexIndex} className={styles.hexagon}></div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.greeting}>
        <h1 className={styles.title}>Take Control of Your Money</h1>
        <p className={styles.description}>
          Instantly understand your spending habits with SpendBee, an AI-powered
          bank statement analyser. Track your expenses and make smarter
          financial decisions in seconds.
        </p>
        <div className={styles.buttons}>
          <button className={styles.primaryBtn}>Get Started for Free</button>
          <button className={styles.secondaryBtn}>Learn How It Works</button>
        </div>
      </div>
    </section>
  );
}
