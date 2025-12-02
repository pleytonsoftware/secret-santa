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
          `Some emails failed: ${data.emailErrors.map((e: { participant: string }) => e.participant).join(", ")}`
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
    <div className="space-y-2">
      <button
        onClick={handleRandomize}
        disabled={isDisabled}
        className={`btn btn-lg w-full gap-2 ${
          isDisabled
            ? "btn-disabled"
            : "btn-primary bg-gradient-to-r from-primary to-secondary border-0 hover:from-primary/90 hover:to-secondary/90"
        }`}
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner"></span>
            {t("randomize.sending")}
          </>
        ) : (
          <>
            <span>🎲</span>
            {t("randomize.button")}
          </>
        )}
      </button>
      {!isFinalized && participantCount < 2 && (
        <p className="text-sm text-warning text-center">
          {t("group.minParticipants")}
        </p>
      )}
    </div>
  );
}
