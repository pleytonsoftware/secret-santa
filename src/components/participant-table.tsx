"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "./icon";
import SilhouetteIcon from "@/icons/silhouette.svg";
import SilhouetteSingleIcon from "@/icons/silhouette-single.svg";
import IncomingEnvelopeIcon from "@/icons/incoming-envelope.svg";
import CheckMarkIcon from "@/icons/check-mark.svg";
import EnvelopeIcon from "@/icons/envelope.svg";
import BinIcon from "@/icons/bin.svg";
import SantaClausIcon from "@/icons/santa-claus.svg";
import SantaClausIcon2 from "@/icons/santa-claus-dark-skin.svg";
import SantaClausIcon3 from "@/icons/santa-claus-mrs.svg";
import SantaClausIcon4 from "@/icons/santa-claus-mx.svg";
import DeerIcon from "@/icons/deer.svg";
import TreeIcon from "@/icons/tree.svg";
import GiftIcon from "@/icons/gift.svg";
import BellIcon from "@/icons/bell.svg";

interface Participant {
    id: string;
    name: string;
    email: string;
}

interface Assignment {
    id: string;
    giverId: string;
    lastEmailSentAt: string | null;
}

interface ParticipantTableProps {
    participants: Participant[];
    isFinalized: boolean;
    onRemove: (participantId: string) => Promise<void>;
    groupId?: string;
    assignments?: Assignment[];
    onResendSuccess?: () => void;
}

// Christmas-themed avatars for participants
const avatarEmojis = [
    "🎅",
    "🤶",
    "🦌",
    "⛄",
    "🎄",
    "🎁",
    "⭐",
    "❄️",
    "🔔",
    "🧝",
];
const AvatarIcons = [
    SantaClausIcon,
    SantaClausIcon2,
    SantaClausIcon3,
    SantaClausIcon4,
    DeerIcon,
    TreeIcon,
    GiftIcon,
    BellIcon,
];

export function ParticipantTable({
    participants,
    isFinalized,
    onRemove,
    groupId,
    assignments = [],
    onResendSuccess,
}: ParticipantTableProps) {
    const t = useTranslations();
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [resendingId, setResendingId] = useState<string | null>(null);

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

    const getAssignmentForParticipant = (participantId: string) => {
        return assignments.find((a) => a.giverId === participantId);
    };

    const canResendToParticipant = (participantId: string) => {
        const assignment = getAssignmentForParticipant(participantId);
        if (!assignment?.lastEmailSentAt) return true;

        const lastSent = new Date(assignment.lastEmailSentAt);
        const now = new Date();
        const hoursSinceLastSend =
            (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);

        return hoursSinceLastSend >= 24;
    };

    const getTimeUntilResendForParticipant = (
        participantId: string,
    ): string => {
        const assignment = getAssignmentForParticipant(participantId);
        if (!assignment?.lastEmailSentAt) return "";

        const lastSent = new Date(assignment.lastEmailSentAt);
        const nextAllowed = new Date(lastSent.getTime() + 24 * 60 * 60 * 1000);
        const now = new Date();

        const hoursRemaining = Math.ceil(
            (nextAllowed.getTime() - now.getTime()) / (1000 * 60 * 60),
        );

        if (hoursRemaining <= 0) return "";
        if (hoursRemaining === 1) return t("resend.waitOneHour");
        return t("resend.waitHours", { hours: hoursRemaining });
    };

    const handleResendToParticipant = async (
        participantId: string,
        participantName: string,
    ) => {
        if (!groupId) return;

        if (!canResendToParticipant(participantId)) {
            toast.error(getTimeUntilResendForParticipant(participantId));
            return;
        }

        if (
            !confirm(t("resend.confirmIndividual", { name: participantName }))
        ) {
            return;
        }

        setResendingId(participantId);
        try {
            const response = await fetch(
                `/api/groups/${groupId}/participants/${participantId}/resend`,
                {
                    method: "POST",
                },
            );

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.error || t("resend.error"));
                return;
            }

            toast.success(
                t("resend.successIndividual", { name: participantName }),
            );
            onResendSuccess?.();
        } catch {
            toast.error(t("resend.error"));
        } finally {
            setResendingId(null);
        }
    };

    // Get a consistent emoji for each participant based on their index
    const getParticipantEmoji = (index: number) => {
        // return avatarEmojis[index % avatarEmojis.length];
        return AvatarIcons[index % AvatarIcons.length];
    };

    if (participants.length === 0) {
        return (
            <div className="text-center py-12 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl" />
                <div className="relative flex flex-col items-center justify-center gap-4">
                    <Icon Render={SilhouetteIcon} size="md" />
                    <p className="text-base-content/60 text-lg">
                        {t("group.noParticipants")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl">
            <table className="table table-zebra">
                <thead className="bg-linear-to-tl from-primary/10 to-secondary/10">
                    <tr>
                        <th className="text-base-content/80">
                            <span className="flex items-center gap-2">
                                <Icon Render={SilhouetteSingleIcon} size="xs" />
                                {t("common.name")}
                            </span>
                        </th>
                        <th className="text-base-content/80">
                            <span className="flex items-center gap-2">
                                <Icon Render={IncomingEnvelopeIcon} size="sm" />
                                {t("common.email")}
                            </span>
                        </th>
                        <th className="text-right text-base-content/80">
                            {t("common.actions")}
                        </th>
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
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl transition-transform">
                                        <Icon
                                            Render={getParticipantEmoji(index)}
                                            size="xs"
                                        />
                                    </div>
                                    <span className="font-medium">
                                        {participant.name}
                                    </span>
                                </div>
                            </td>
                            <td className="text-base-content/60">
                                {participant.email}
                            </td>
                            <td className="text-right">
                                {isFinalized ? (
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="badge badge-success badge-sm gap-1">
                                            <Icon
                                                Render={CheckMarkIcon}
                                                className="text-[currentColor] size-2.5!"
                                            />
                                            {t("group.assigned")}
                                        </span>
                                        {groupId && (
                                            <button
                                                onClick={() =>
                                                    handleResendToParticipant(
                                                        participant.id,
                                                        participant.name,
                                                    )
                                                }
                                                disabled={
                                                    resendingId ===
                                                        participant.id ||
                                                    !canResendToParticipant(
                                                        participant.id,
                                                    )
                                                }
                                                className={`btn btn-xs gap-1 ${
                                                    canResendToParticipant(
                                                        participant.id,
                                                    )
                                                        ? "btn-accent btn-outline hover:btn-accent"
                                                        : "btn-disabled opacity-50"
                                                }`}
                                                title={
                                                    canResendToParticipant(
                                                        participant.id,
                                                    )
                                                        ? t(
                                                              "resend.buttonIndividual",
                                                          )
                                                        : getTimeUntilResendForParticipant(
                                                              participant.id,
                                                          )
                                                }
                                            >
                                                {resendingId ===
                                                participant.id ? (
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                ) : (
                                                    <>
                                                        <Icon
                                                            Render={
                                                                EnvelopeIcon
                                                            }
                                                            className="fill-[currentColor] size-2.5!"
                                                        />
                                                        {t(
                                                            "resend.buttonIndividualShort",
                                                        )}
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() =>
                                            handleRemove(participant.id)
                                        }
                                        disabled={removingId === participant.id}
                                        className="btn btn-sm btn-error btn-outline gap-1 hover:gap-2 transition-all"
                                    >
                                        {removingId === participant.id ? (
                                            <span className="loading loading-spinner loading-xs"></span>
                                        ) : (
                                            <>
                                                <Icon
                                                    Render={BinIcon}
                                                    size="xs"
                                                />
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
