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

// Christmas-themed avatars for participants
const avatarEmojis = ['🎅', '🤶', '🦌', '⛄', '🎄', '🎁', '⭐', '❄️', '🔔', '🧝'];

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

  // Get a consistent emoji for each participant based on their index
  const getParticipantEmoji = (index: number) => {
    return avatarEmojis[index % avatarEmojis.length];
  };

  if (participants.length === 0) {
    return (
      <div className="text-center py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl" />
        <div className="relative">
          <span className="text-6xl mb-4 block animate-bounce-subtle">👥</span>
          <p className="text-base-content/60 text-lg">{t("group.noParticipants")}</p>
          <div className="mt-4 flex justify-center gap-2 text-2xl opacity-40">
            <span>🎅</span>
            <span>🤶</span>
            <span>🦌</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="table table-zebra">
        <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <tr>
            <th className="text-base-content/80">
              <span className="flex items-center gap-2">
                <span>👤</span>
                {t("common.name")}
              </span>
            </th>
            <th className="text-base-content/80">
              <span className="flex items-center gap-2">
                <span>📧</span>
                {t("common.email")}
              </span>
            </th>
            <th className="text-right text-base-content/80">{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant, index) => (
            <tr 
              key={participant.id} 
              className="hover:bg-accent/5 transition-colors group"
            >
              <td>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {getParticipantEmoji(index)}
                  </div>
                  <span className="font-medium">{participant.name}</span>
                </div>
              </td>
              <td className="text-base-content/60">{participant.email}</td>
              <td className="text-right">
                {isFinalized ? (
                  <span className="badge badge-success badge-sm gap-1">
                    <span>✅</span>
                    {t("group.assigned")}
                  </span>
                ) : (
                  <button
                    onClick={() => handleRemove(participant.id)}
                    disabled={removingId === participant.id}
                    className="btn btn-sm btn-error btn-outline gap-1 hover:gap-2 transition-all"
                  >
                    {removingId === participant.id ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <>
                        <span>🗑️</span>
                        {t("common.remove")}
                      </>
                    )}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
