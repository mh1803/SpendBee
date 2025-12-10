import styles from "./Navbar.module.css";
import logo from "../../../../public/images/logo.png";

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      {/* LEFT SIDE */}
      <div className={styles.left}>
        <a href="#home">
          <img className={styles.logo} src={logo} alt="Logo" />
        </a>
        <h1 className="title">SpendBee</h1>
      </div>

      {/* RIGHT SIDE */}
      <ul className={styles.right}>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#upload">Upload</a>
        </li>
      </ul>
    </nav>
  );
}
