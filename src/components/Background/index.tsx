import styles from "./styles.module.css";
import gigachadImg from "../../assets/images/gigachad-bg.png";

const Background = () => {
  return (
    <div className={styles.container}>
      {/* Контейнер для картинки, чтобы центрировать её */}
      <div className={styles.imageWrapper}>
        <img src={gigachadImg} alt="Gigachad" className={styles.image} />
      </div>

      {/* Свечение снизу */}
      <div className={styles.bottomGlow} />

      {/* Общая виньетка (затемнение по краям экрана), чтобы текст читался лучше */}
      <div className={styles.vignette} />
    </div>
  );
};

export default Background;
