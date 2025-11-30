import type { IPlayer } from "../../types";
import styles from "./styles.module.css";

interface Props {
  players: IPlayer[];
}

const PlayerList = ({ players }: Props) => {
  if (players.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.countTitle}>
        Participants [{players.filter((p) => !p.isEliminated).length}/
        {players.length}]
      </h3>
      <div className={styles.grid}>
        {players.map((player) => (
          <div
            key={player.id}
            className={`${styles.card} ${
              player.isEliminated ? styles.eliminated : ""
            }`}
          >
            <div className={styles.avatarWrapper}>
              <img
                src={player.avatarUrl}
                alt={player.displayName}
                className={styles.avatar}
              />
              {player.isEliminated && (
                <div className={styles.skullOverlay}>💀</div>
              )}
            </div>
            <div className={styles.info}>
              <span className={styles.name}>{player.displayName}</span>
              <span className={styles.username}>{player.username}</span>
            </div>
            <div className={styles.status}>
              {player.isEliminated ? "ELIMINATED" : "ACTIVE"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
