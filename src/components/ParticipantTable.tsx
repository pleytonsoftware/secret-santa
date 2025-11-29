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
      <div className="text-center py-8 text-gray-500">
        <span className="text-4xl mb-2 block">👥</span>
        <p>{t("group.noParticipants")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-gray-600 font-medium">
              {t("common.name")}
            </th>
            <th className="text-left py-3 px-4 text-gray-600 font-medium">
              {t("common.email")}
            </th>
            <th className="text-right py-3 px-4 text-gray-600 font-medium">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr
              key={participant.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4">{participant.name}</td>
              <td className="py-3 px-4 text-gray-600">{participant.email}</td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => handleRemove(participant.id)}
                  disabled={isFinalized || removingId === participant.id}
                  className={`text-sm px-3 py-1 rounded transition-colors ${
                    isFinalized
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {removingId === participant.id
                    ? t("common.loading")
                    : t("common.remove")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
