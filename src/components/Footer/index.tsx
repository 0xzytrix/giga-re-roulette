import styles from "./styles.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <span className={styles.text}>Created by </span>
      <a
        href="https://x.com/0xzytrix"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        @0xzytrix
      </a>
    </footer>
  );
};

export default Footer;
