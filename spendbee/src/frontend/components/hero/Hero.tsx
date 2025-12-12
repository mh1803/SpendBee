import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.greeting}>
        <h1 className={styles.title}>Take Control of Your Money</h1>
        <p className={styles.description}>
          Instantly understand your spending habits, track your expenses, and
          make smarter financial decisions.
        </p>
        <div className={styles.buttons}>
          <button className={styles.primaryBtn}>Get Started for Free</button>
          <button className={styles.secondaryBtn}>Learn How It Works</button>
        </div>
      </div>
    </section>
  );
}
