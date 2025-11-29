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
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          isDisabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-red-600 to-green-600 text-white hover:from-red-700 hover:to-green-700 shadow-md hover:shadow-lg"
        }`}
      >
        {isLoading ? (
          <>
            <span className="animate-spin">🎲</span>
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
        <p className="text-sm text-yellow-600 text-center">
          {t("group.minParticipants")}
        </p>
      )}
    </div>
  );
}
