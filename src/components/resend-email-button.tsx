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
    const hoursSinceLastSend = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);
    
    // Default: 24 hours between resends
    return hoursSinceLastSend >= 24;
  };

  const getTimeUntilResend = (): string => {
    if (!lastEmailSentAt) return "";
    
    const lastSent = new Date(lastEmailSentAt);
    const nextAllowed = new Date(lastSent.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    
    const hoursRemaining = Math.ceil((nextAllowed.getTime() - now.getTime()) / (1000 * 60 * 60));
    
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
          `Some emails failed: ${data.emailErrors.map((e: { participant: string }) => e.participant).join(", ")}`
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
    <div className="space-y-2">
      <button
        onClick={handleResendEmails}
        disabled={isDisabled}
        className={`btn btn-outline btn-accent w-full gap-2 ${
          isDisabled ? "btn-disabled" : ""
        }`}
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            {t("resend.sending")}
          </>
        ) : (
          <>
            <span>📧</span>
            {t("resend.button")}
          </>
        )}
      </button>
      {!canResendEmail() && (
        <p className="text-sm text-base-content/60 text-center">
          {getTimeUntilResend()}
        </p>
      )}
    </div>
  );
}
