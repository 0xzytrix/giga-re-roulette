import React, { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";
import type { IPlayer } from "../../types";
import styles from "./styles.module.css";

interface RouletteWheelProps {
  players: IPlayer[];
  mustSpin: boolean;
  prizeIndex: number;
  onSpinEnd: () => void;
}

const generateData = (players: IPlayer[]) => {
  return players.map((player) => ({
    id: player.id,
    option: player.displayName,
    image: { uri: player.avatarUrl },
    style: { backgroundColor: "#111", textColor: "#fff" },
  }));
};

const RouletteWheel: React.FC<RouletteWheelProps> = ({
  players,
  mustSpin,
  prizeIndex,
  onSpinEnd,
}) => {
  const [wheelData, setWheelData] = useState(() => generateData(players));

  useEffect(() => {
    setWheelData(generateData(players));
  }, [players]);

  if (players.length < 2) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyWheel}>
          <div className={styles.emptyContent}>
            <span className={styles.emptyIcon}>+</span>
            <p>add 2 users</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pointer} />
      <div className={styles.wheelWrapper}>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeIndex}
          data={wheelData}
          onStopSpinning={onSpinEnd}
          backgroundColors={["#1a1a1a", "#0a0a0a"]}
          textColors={["#e0e0e0"]}
          outerBorderColor="#9d4edd"
          outerBorderWidth={2}
          innerRadius={15}
          innerBorderColor="#333"
          radiusLineColor="#333"
          fontSize={14}
          perpendicularText={true}
          textDistance={60}
          spinDuration={0.8}
        />
      </div>
    </div>
  );
};

export default RouletteWheel;
