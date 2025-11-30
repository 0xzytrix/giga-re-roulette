import { useState, useMemo } from "react";
import styles from "./App.module.css";
import type { IPlayer } from "./types";
import { fetchXUserProfile } from "./services/api";

import Background from "./components/Background";
import Header from "./components/Header";
import PlayerInput from "./components/PlayerInput";
import RouletteWheel from "./components/Roulette";
import PlayerList from "./components/PlayerList";
import WinnerModal from "./components/WinnerModal";
import FloatingOctopuses from "./components/FloatingOctopuses";

function App() {
  // Состояние: false = стартовый экран, true = экран игры
  const [isGameStarted, setIsGameStarted] = useState(false);

  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState<IPlayer | null>(null);

  const activePlayers = useMemo(
    () => players.filter((p) => !p.isEliminated),
    [players]
  );

  const handleStartGame = () => {
    setIsGameStarted(true);
  };

  const handleAddPlayer = async (username: string) => {
    if (
      players.some((p) =>
        p.username
          .toLowerCase()
          .includes(username.toLowerCase().replace("@", ""))
      )
    ) {
      alert("Candidate exists.");
      return;
    }
    setLoading(true);
    try {
      const newPlayer = await fetchXUserProfile(username);
      setPlayers((prev) => [...prev, newPlayer]);
    } catch (error) {
      alert("Target not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpinClick = () => {
    if (isSpinning || activePlayers.length < 2) return;
    const newPrizeIndex = Math.floor(Math.random() * activePlayers.length);
    setPrizeIndex(newPrizeIndex);
    setMustSpin(true);
    setIsSpinning(true);
  };

  const handleSpinStop = () => {
    setMustSpin(false);
    setIsSpinning(false);
    const eliminatedPlayer = activePlayers[prizeIndex];
    if (!eliminatedPlayer) return;

    const updatedPlayers = players.map((p) =>
      p.id === eliminatedPlayer.id ? { ...p, isEliminated: true } : p
    );
    setPlayers(updatedPlayers);

    const remaining = updatedPlayers.filter((p) => !p.isEliminated);
    if (remaining.length === 1) {
      setTimeout(() => setWinner(remaining[0]), 500);
    }
  };

  const resetGame = () => {
    setPlayers([]);
    setWinner(null);
    setMustSpin(false);
    setIsSpinning(false);
  };

  return (
    <div className={styles.appContainer}>
      <Background />
      <FloatingOctopuses />

      <div className={styles.contentWrapper}>
        <Header />

        {!isGameStarted ? (
          /* START SCREEN */
          <div className={styles.startScreen}>
            <button className={styles.bigStartButton} onClick={handleStartGame}>
              REVEAL THE GIGACHAD
            </button>
          </div>
        ) : (
          /* GAME SCREEN (Fade in effect) */
          <div className={styles.gameContainer}>
            <div className={styles.wheelSection}>
              <RouletteWheel
                players={activePlayers}
                mustSpin={mustSpin}
                prizeIndex={prizeIndex}
                onSpinEnd={handleSpinStop}
              />
            </div>

            <div className={styles.controlsSection}>
              <PlayerInput onAddPlayer={handleAddPlayer} isLoading={loading} />

              <button
                className={styles.actionButton}
                onClick={handleSpinClick}
                disabled={isSpinning || activePlayers.length < 2}
              >
                {isSpinning ? "CALCULATING..." : "ELIMINATE WEAKNESS"}
              </button>
            </div>

            <PlayerList players={players} />
          </div>
        )}
      </div>

      {winner && <WinnerModal winner={winner} onReset={resetGame} />}
    </div>
  );
}

export default App;
