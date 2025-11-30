import { useState } from "react";
import styles from "./styles.module.css";

interface Props {
  onAddPlayer: (username: string) => void;
  isLoading: boolean;
}

const PlayerInput = ({ onAddPlayer, isLoading }: Props) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAddPlayer(value);
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputWrapper}>
        <span className={styles.prefix}>@</span>
        <input
          type="text"
          className={styles.input}
          placeholder="username"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        className={styles.button}
        disabled={isLoading || !value}
      >
        {isLoading ? "Searching..." : "Add Gigachad"}
      </button>
    </form>
  );
};

export default PlayerInput;
