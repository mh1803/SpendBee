import { useState } from "react";
import styles from "./Navbar.module.css";
import logo from "../../../../public/images/logo.png";

import { HiHome, HiInformationCircle, HiUpload } from "react-icons/hi";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    closeSidebar();
  };

  return (
    <>
      <button
        className={`${styles.hamburger} ${isOpen ? styles.hidden : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
      </button>

      {isOpen && <div className={styles.overlay} onClick={closeSidebar} />}

      <nav className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <button
          className={styles.closeButton}
          onClick={closeSidebar}
          aria-label="Close menu"
        >
          ×
        </button>

        <div className={styles.logoSection}>
          <img className={styles.logo} src={logo} alt="SpendBee Logo" />
          <h1 className={styles.title}>SpendBee</h1>
        </div>

        <ul className={styles.navLinks}>
          <li>
            <a href="#home" onClick={(e) => handleSmoothScroll(e, "home")}>
              <HiHome />
              <span>Home</span>
            </a>
          </li>

          <li>
            <a href="#about" onClick={(e) => handleSmoothScroll(e, "about")}>
              <HiInformationCircle />
              <span>About</span>
            </a>
          </li>

          <li>
            <a href="#upload" onClick={(e) => handleSmoothScroll(e, "upload")}>
              <HiUpload />
              <span>Upload</span>
            </a>
          </li>
        </ul>

        <div className={styles.footer}>
          <p>&copy; 2025 SpendBee</p>
        </div>
      </nav>
    </>
  );
}
