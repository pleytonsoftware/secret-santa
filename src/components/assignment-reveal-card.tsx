"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "./icon";
import SparkleIcon from "@/icons/sparkles.svg";

interface AssignmentRevealCardProps {
    receiverName: string;
}

export function AssignmentRevealCard({
    receiverName,
}: AssignmentRevealCardProps) {
    const t = useTranslations("group");
    // const mysteryWords: string[] = t.raw("mysteryWords") as string[];
    const [isRevealed, setIsRevealed] = useState(false);
    // const [mysteryWord] = useState(() => {
    //     return mysteryWords[Math.floor(Math.random() * mysteryWords.length)];
    // });

    const handleReveal = () => {
        setIsRevealed(true);
    };

    const handleHide = () => {
        setIsRevealed(false);
    };

    return (
        <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl" />
            <div className="relative bg-base-200 rounded-2xl p-6 sm:p-8 border-2 border-accent shadow-lg">
                <div className="text-center">
                    <p className="text-sm text-base-content/60 uppercase tracking-wider mb-3 font-semibold">
                        {t("youreGivingTo")}
                    </p>

                    {/* Name display area */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
                        <span className="text-2xl sm:text-4xl animate-sparkle">
                            <Icon Render={SparkleIcon} size="md" />
                        </span>

                        <div className="relative">
                            {/* Revealed name */}
                            <p
                                className={`text-2xl sm:text-4xl font-bold gradient-text capitalize transition-all duration-500 ${
                                    isRevealed
                                        ? "opacity-100 blur-none scale-100"
                                        : "opacity-0 blur-xl scale-95 absolute inset-0"
                                }`}
                            >
                                {receiverName}
                            </p>

                            {/* Mystery placeholder */}
                            <p
                                className={`text-2xl sm:text-4xl font-bold text-base-content/30 transition-all duration-500 select-none ${
                                    isRevealed
                                        ? "opacity-0 blur-xl scale-95 absolute inset-0"
                                        : "opacity-100 blur-sm scale-100"
                                }`}
                                aria-hidden="true"
                            >
                                {/* {mysteryWord} */}
                                {receiverName}
                            </p>
                        </div>

                        <span
                            className="text-2xl sm:text-4xl animate-sparkle"
                            style={{
                                animationDelay: "0.3s",
                            }}
                        >
                            <Icon Render={SparkleIcon} size="md" />
                        </span>
                    </div>

                    {/* Reveal/Hide button */}
                    {!isRevealed ? (
                        <button
                            onClick={handleReveal}
                            className="btn btn-primary btn-lg gap-2 text-lg px-8 py-4 h-auto min-h-0 animate-pulse hover:animate-none shadow-lg hover:shadow-xl transition-all"
                        >
                            {/* <span className="text-2xl">👀</span> */}
                            <span>{t("tapToReveal")}</span>
                            {/* <span className="text-2xl">🎁</span> */}
                        </button>
                    ) : (
                        <button
                            onClick={handleHide}
                            className="btn btn-outline btn-md gap-2 opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <span>{t("hideAgain")}</span>
                        </button>
                    )}

                    {/* Help text for elderly */}
                    {!isRevealed && (
                        <p className="text-xs sm:text-sm text-base-content/50 mt-4">
                            {t("tapToRevealHint")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
