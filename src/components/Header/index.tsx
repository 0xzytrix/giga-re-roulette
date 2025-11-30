import styles from "./styles.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        GIGACHAD
        <br />
        <span className={styles.accent}>re</span> ROULETTE
      </h1>
      <div className={styles.separator} />
    </header>
  );
};

export default Header;
