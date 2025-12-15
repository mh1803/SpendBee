import { useState } from "react";
import styles from "./Navbar.module.css";
import logo from "../../../../public/images/logo.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className={`${styles.hamburger} ${isOpen ? styles.hidden : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className={styles.overlay} onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <nav className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        {/* Close button for mobile */}
        <button
          className={styles.closeButton}
          onClick={closeSidebar}
          aria-label="Close menu"
        >
          ×
        </button>

        {/* Logo Section */}
        <div className={styles.logoSection}>
          <img className={styles.logo} src={logo} alt="SpendBee Logo" />
          <h1 className={styles.title}>SpendBee</h1>
        </div>

        {/* Navigation Links */}
        <ul className={styles.navLinks}>
          <li>
            <a href="#home" onClick={closeSidebar}>
              Home
            </a>
          </li>
          <li>
            <a href="#about" onClick={closeSidebar}>
              About
            </a>
          </li>
          <li>
            <a href="#upload" onClick={closeSidebar}>
              Upload
            </a>
          </li>
        </ul>

        {/* Footer / Optional */}
        <div className={styles.footer}>
          <p>&copy; 2025 SpendBee</p>
        </div>
      </nav>
    </>
  );
}
