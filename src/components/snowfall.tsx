"use client";

import { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
  fontSize: string;
  opacity: number;
}

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = [];
    const snowEmojis = ["❄", "❅", "❆", "✻", "✼"];
    
    for (let i = 0; i < 30; i++) {
      flakes.push({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${8 + Math.random() * 12}s`,
        animationDelay: `${Math.random() * 10}s`,
        fontSize: `${0.5 + Math.random() * 1}rem`,
        opacity: 0.3 + Math.random() * 0.5,
      });
    }
    setSnowflakes(flakes);
  }, []);

  const snowEmojis = ["❄", "❅", "❆", "✻", "✼"];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            fontSize: flake.fontSize,
            opacity: flake.opacity,
          }}
        >
          {snowEmojis[flake.id % snowEmojis.length]}
        </span>
      ))}
    </div>
  );
}
