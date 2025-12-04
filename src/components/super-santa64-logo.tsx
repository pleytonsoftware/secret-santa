"use client";

import { useEffect, useState, useRef } from "react";
import { Logo } from "./logo";

const SANTA_PHRASES = [
    "Ho Ho Ho! 🎅",
    "Have you been naughty or nice?",
    "Making my list, checking it twice!",
    "Ready for some Secret Santa fun?",
    "The elves are working overtime!",
    "Christmas magic is in the air! ✨",
    "Time to spread some holiday cheer!",
    "Who's getting the best gift this year?",
    "North Pole approved! ❄️",
    "Jingle all the way! 🔔",
];

export function SuperSanta64Logo() {
    const [rotation, setRotation] = useState({ tiltX: 0, tiltY: 0, rotate: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [currentPhrase, setCurrentPhrase] = useState("");
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!logoRef.current) return;

            // Get the logo's position and dimensions
            const rect = logoRef.current.getBoundingClientRect();
            const logoCenterX = rect.left + rect.width / 2;
            const logoCenterY = rect.top + rect.height / 2;

            // Calculate distance from logo center
            const deltaX = e.clientX - logoCenterX;
            const deltaY = e.clientY - logoCenterY;

            // Calculate angle for Z-axis rotation (2D rotation pointing to mouse)
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            // Calculate distance from logo center to viewport edges
            const distanceToLeft = logoCenterX;
            const distanceToRight = window.innerWidth - logoCenterX;
            const distanceToTop = logoCenterY;
            const distanceToBottom = window.innerHeight - logoCenterY;

            // Maximum distance is to the furthest corner
            const maxDistanceX = Math.max(distanceToLeft, distanceToRight);
            const maxDistanceY = Math.max(distanceToTop, distanceToBottom);

            // Normalize to -1 to 1 range based on distance to edges
            const normalizedX = Math.max(
                -1,
                Math.min(1, deltaX / maxDistanceX),
            );
            const normalizedY = Math.max(
                -1,
                Math.min(1, deltaY / maxDistanceY),
            );

            // Convert to degrees for 3D rotation (max 45 degrees when at viewport edge)
            const tiltY = normalizedX * 25; // Horizontal tilt
            const tiltX = -normalizedY * 25; // Vertical tilt (negative for natural feel)

            setRotation({ tiltX, tiltY, rotate: angle });

            // Check if mouse is hovering over the logo
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const isNearLogo = distance < 100; // 100px radius

            if (isNearLogo && !isHovered) {
                setIsHovered(true);
                // Pick a random phrase
                const randomPhrase =
                    SANTA_PHRASES[
                        Math.floor(Math.random() * SANTA_PHRASES.length)
                    ];
                setCurrentPhrase(randomPhrase);
            } else if (!isNearLogo && isHovered) {
                setIsHovered(false);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isHovered]);

    return (
        <div className="pointer-events-none z-50 relative" ref={logoRef}>
            {/* Thought bubble */}
            {isHovered && (
                <div className="absolute -top-14 lg:-top-16 left-0 -translate-x-1/2 lg:left-0 lg:translate-x-[66%] animate-in fade-in zoom-in duration-200">
                    <div className="relative bg-white text-gray-800 mt-2 px-4 py-2 rounded-2xl shadow-lg whitespace-nowrap">
                        <p className="text-sm font-medium">{currentPhrase}</p>
                        {/* Bubble tail */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 lg:-bottom-4 lg:-left-2 lg:translate-0">
                            <div className="w-4 h-4 bg-white rotate-45 rounded-sm" />
                        </div>
                        {/* Small bubbles */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 lg:-bottom-7 lg:-left-6 lg:translate-0">
                            <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 ml-1 lg:-bottom-10 lg:-left-9 lg:translate-0 lg:ml-0">
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                    </div>
                </div>
            )}

            <div
                className="transition-transform duration-150 ease-out"
                style={{
                    transform: `perspective(1000px) rotateX(${rotation.tiltX}deg) rotateY(${rotation.tiltY}deg)`,
                    transformStyle: "preserve-3d",
                }}
            >
                <Logo width={150} height={150} />
            </div>
        </div>
    );
}
