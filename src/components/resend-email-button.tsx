"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface ResendEmailButtonProps {
    groupId: string;
    lastEmailSentAt: string | null;
}

export function ResendEmailButton({
    groupId,
    lastEmailSentAt,
}: ResendEmailButtonProps) {
    const t = useTranslations();
    const [isLoading, setIsLoading] = useState(false);

    const canResendEmail = () => {
        if (!lastEmailSentAt) return true;

        const lastSent = new Date(lastEmailSentAt);
        const now = new Date();
        const hoursSinceLastSend =
            (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);

        // Default: 24 hours between resends
        return hoursSinceLastSend >= 24;
    };

    const getTimeUntilResend = (): string => {
        if (!lastEmailSentAt) return "";

        const lastSent = new Date(lastEmailSentAt);
        const nextAllowed = new Date(lastSent.getTime() + 24 * 60 * 60 * 1000);
        const now = new Date();

        const hoursRemaining = Math.ceil(
            (nextAllowed.getTime() - now.getTime()) / (1000 * 60 * 60),
        );

        if (hoursRemaining <= 0) return "";
        if (hoursRemaining === 1) return t("resend.waitOneHour");
        return t("resend.waitHours", { hours: hoursRemaining });
    };

    const handleResendEmails = async () => {
        if (!canResendEmail()) {
            toast.error(getTimeUntilResend());
            return;
        }

        if (!confirm(t("resend.confirm"))) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/groups/${groupId}/resend`, {
                method: "POST",
            });

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.error || t("resend.error"));
                return;
            }

            const data = await response.json();

            if (data.emailErrors && data.emailErrors.length > 0) {
                toast.success(t("resend.success"));
                toast.warning(
                    `Some emails failed: ${data.emailErrors
                        .map((e: { participant: string }) => e.participant)
                        .join(", ")}`,
                );
            } else {
                toast.success(t("resend.success"));
            }
        } catch {
            toast.error(t("resend.error"));
        } finally {
            setIsLoading(false);
        }
    };

    const isDisabled = !canResendEmail() || isLoading;

    return (
        <div className="space-y-4">
            {/* Main resend button */}
            <div className="relative">
                {/* Glow effect for enabled state */}
                {!isDisabled && (
                    <div className="absolute inset-0 bg-linear-to-tl from-accent via-warning to-accent rounded-xl blur-lg opacity-20 animate-pulse" />
                )}

                <button
                    onClick={handleResendEmails}
                    disabled={isDisabled}
                    className={`relative btn btn-lg w-full gap-3 text-lg ${
                        isDisabled
                            ? "btn-disabled opacity-50"
                            : "btn-accent bg-linear-to-tl from-accent to-warning border-0 text-accent-content shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                    }`}
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner loading-md"></span>
                            <span className="animate-pulse">
                                {t("resend.sending")}
                            </span>
                            <span className="text-2xl animate-bounce">✉️</span>
                        </>
                    ) : (
                        <>
                            <span className="text-2xl">📧</span>
                            {t("resend.button")}
                            <span className="text-2xl">✨</span>
                        </>
                    )}
                </button>
            </div>

            {/* Time remaining indicator */}
            {!canResendEmail() && (
                <div className="flex items-center justify-center gap-2 p-3 bg-base-200/50 rounded-xl border border-base-300">
                    <span className="text-xl">⏳</span>
                    <p className="text-sm text-base-content/60">
                        {getTimeUntilResend()}
                    </p>
                </div>
            )}

            {/* Last sent indicator */}
            {lastEmailSentAt && canResendEmail() && (
                <div className="flex items-center justify-center gap-2 text-sm text-base-content/50">
                    <span>✅</span>
                    <span>
                        {t("resend.lastSent") || "Last sent:"}{" "}
                        {new Date(lastEmailSentAt).toLocaleDateString()}
                    </span>
                </div>
            )}
        </div>
    );
}
