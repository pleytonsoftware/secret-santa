"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface RandomizeButtonProps {
    groupId: string;
    participantCount: number;
    isFinalized: boolean;
    onRandomize: () => void;
}

export function RandomizeButton({
    groupId,
    participantCount,
    isFinalized,
    onRandomize,
}: RandomizeButtonProps) {
    const t = useTranslations();
    const [isLoading, setIsLoading] = useState(false);

    const handleRandomize = async () => {
        if (participantCount < 2) {
            toast.error(t("toast.errorMinParticipants"));
            return;
        }

        if (!confirm(t("randomize.confirm"))) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/groups/${groupId}/randomize`, {
                method: "POST",
            });

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.error || t("randomize.error"));
                return;
            }

            const data = await response.json();

            if (data.emailErrors && data.emailErrors.length > 0) {
                toast.success(t("randomize.success"));
                toast.warning(
                    `Some emails failed: ${data.emailErrors
                        .map((e: { participant: string }) => e.participant)
                        .join(", ")}`,
                );
            } else {
                toast.success(t("randomize.success"));
            }

            onRandomize();
        } catch {
            toast.error(t("randomize.error"));
        } finally {
            setIsLoading(false);
        }
    };

    const isDisabled = isFinalized || participantCount < 2 || isLoading;

    return (
        <div className="space-y-4">
            {/* Main action button */}
            <div className="relative">
                {/* Glow effect background */}
                {!isDisabled && (
                    <div className="absolute inset-0 bg-linear-to-tl from-primary via-accent to-secondary rounded-xl blur-lg opacity-30 animate-pulse" />
                )}

                <button
                    onClick={handleRandomize}
                    disabled={isDisabled}
                    className={`relative btn btn-lg w-full gap-3 text-lg ${
                        isDisabled
                            ? "btn-disabled"
                            : "btn-primary bg-linear-to-tl from-primary via-primary to-secondary border-0 hover:from-primary/90 hover:to-secondary/90 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                    }`}
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner loading-md"></span>
                            <span className="animate-pulse">
                                {t("randomize.sending")}
                            </span>
                            <span className="text-2xl animate-bounce">🎄</span>
                        </>
                    ) : (
                        <>
                            <span className="text-2xl animate-bounce-subtle">
                                🎲
                            </span>
                            {t("randomize.button")}
                            <span className="text-2xl">✨</span>
                        </>
                    )}
                </button>
            </div>

            {/* Warning message if not enough participants */}
            {!isFinalized && participantCount < 2 && (
                <div className="flex items-center justify-center gap-2 p-3 bg-warning/10 rounded-xl border border-warning/20">
                    <span className="text-xl">⚠️</span>
                    <p className="text-sm text-warning font-medium">
                        {t("group.minParticipants")}
                    </p>
                </div>
            )}

            {/* Helpful tip */}
            {!isFinalized && participantCount >= 2 && (
                <div className="flex items-center justify-center gap-2 text-sm text-base-content/50">
                    <span>💡</span>
                    <span>
                        {t("randomize.tip") ||
                            "This action is permanent and will send emails to all participants."}
                    </span>
                </div>
            )}
        </div>
    );
}
