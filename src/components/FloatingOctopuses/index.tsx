import { useState } from "react";
import styles from "./styles.module.css";

import img1 from "../../assets/images/octopuses/octo1.png";
import img2 from "../../assets/images/octopuses/octo2.png";
import img3 from "../../assets/images/octopuses/octo3.png";

const IMAGES = [img1, img2, img3];
const COUNT = 15;

interface OctoStyle extends React.CSSProperties {
  "--x-start": string;
  "--y-start": string;
  "--x-end": string;
  "--y-end": string;
  "--duration": string;
  "--delay": string;
  "--size": string;
  "--rotation": string;
}

interface OctopusData {
  id: number;
  image: string;
  style: OctoStyle;
}

const generateOctopuses = (): OctopusData[] => {
  return Array.from({ length: COUNT }, (_, i) => {
    const isMobile =
      typeof window !== "undefined" ? window.innerWidth < 600 : false;

    const startX = Math.random() * 100;
    const startY = Math.random() * 100;

    const endXDir = (Math.random() - 0.5) * 200;
    const endYDir = (Math.random() - 0.5) * 200;

    const sizeBase = isMobile ? 30 : 50;
    const size = sizeBase + Math.random() * (isMobile ? 40 : 80);

    const style: OctoStyle = {
      "--x-start": `${startX}vw`,
      "--y-start": `${startY}vh`,
      "--x-end": `${endXDir}vw`,
      "--y-end": `${endYDir}vh`,
      "--duration": `${20 + Math.random() * 20}s`,
      "--delay": `-${Math.random() * 20}s`,
      "--size": `${size}px`,
      "--rotation": `${Math.random() * 360}deg`,
    };

    return {
      id: i,
      image: IMAGES[i % IMAGES.length],
      style: style,
    };
  });
};

const FloatingOctopuses = () => {
  const [octopuses] = useState(() => generateOctopuses());

  return (
    <div className={styles.container}>
      {octopuses.map((octo) => (
        <img
          key={octo.id}
          src={octo.image}
          className={styles.octopus}
          style={octo.style}
          alt=""
        />
      ))}
    </div>
  );
};

export default FloatingOctopuses;
