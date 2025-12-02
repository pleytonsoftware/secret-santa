"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

interface Participant {
  id: string;
  name: string;
  email: string;
}

interface ParticipantTableProps {
  participants: Participant[];
  isFinalized: boolean;
  onRemove: (participantId: string) => Promise<void>;
}

export function ParticipantTable({
  participants,
  isFinalized,
  onRemove,
}: ParticipantTableProps) {
  const t = useTranslations();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (participantId: string) => {
    if (isFinalized) return;

    if (!confirm(t("group.removeParticipantConfirm"))) return;

    setRemovingId(participantId);
    try {
      await onRemove(participantId);
    } finally {
      setRemovingId(null);
    }
  };

  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-base-content/60">
        <span className="text-4xl mb-2 block">👥</span>
        <p>{t("group.noParticipants")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>{t("common.name")}</th>
            <th>{t("common.email")}</th>
            <th className="text-right">{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id} className="hover">
              <td>{participant.name}</td>
              <td className="text-base-content/70">{participant.email}</td>
              <td className="text-right">
                <button
                  onClick={() => handleRemove(participant.id)}
                  disabled={isFinalized || removingId === participant.id}
                  className={`btn btn-sm ${
                    isFinalized
                      ? "btn-disabled"
                      : "btn-error btn-outline"
                  }`}
                >
                  {removingId === participant.id ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    t("common.remove")
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
