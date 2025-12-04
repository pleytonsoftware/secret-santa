"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icon";
import SnowflakeIcon from "@/icons/snowflake.svg";

interface Snowflake {
    id: number;
    left: string;
    animationDuration: string;
    animationDelay: string;
    fontSize: string;
    opacity: number;
    rotation: number;
}

export function Snowfall() {
    const [snowflakes] = useState<Snowflake[]>(() => {
        const flakes: Snowflake[] = [];

        for (let i = 0; i < 30; i++) {
            flakes.push({
                id: i,
                left: `${Math.random() * 100}%`,
                animationDuration: `${8 + Math.random() * 12}s`,
                animationDelay: `${Math.random() * 10}s`,
                fontSize: `${0.33 + Math.random() * 0.66}rem`,
                opacity: 0.3 + Math.random() * 0.5,
                rotation: Math.random() * 360,
            });
        }

        return flakes;
    });

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {snowflakes.map((flake) => (
                <span
                    key={flake.id}
                    className="snowflake"
                    style={
                        {
                            left: flake.left,
                            animationDuration: flake.animationDuration,
                            animationDelay: flake.animationDelay,
                            fontSize: flake.fontSize,
                            opacity: flake.opacity,
                            "--rotation": `${flake.rotation}deg`,
                        } as React.CSSProperties & { "--rotation": string }
                    }
                >
                    <Icon
                        Render={SnowflakeIcon}
                        style={{
                            width: flake.fontSize,
                            height: flake.fontSize,
                        }}
                    />
                </span>
            ))}
        </div>
    );
}
