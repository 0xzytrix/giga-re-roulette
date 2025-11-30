import type { IPlayer } from "../../types";
import styles from "./styles.module.css";

interface Props {
  winner: IPlayer;
  onReset: () => void;
}

const WinnerModal = ({ winner, onReset }: Props) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>GIGACHAD DETECTED</h2>
        <div className={styles.avatarContainer}>
          <img
            src={winner.avatarUrl}
            alt={winner.displayName}
            className={styles.avatar}
          />
          <div className={styles.crown}>👑</div>
        </div>
        <p className={styles.name}>{winner.displayName}</p>
        <p className={styles.username}>{winner.username}</p>
        <button onClick={onReset} className={styles.button}>
          NEW ROUND
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;
