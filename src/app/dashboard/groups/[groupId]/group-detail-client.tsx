"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { ParticipantTable } from "@/components/participant-table";
import { AddParticipantForm } from "@/components/add-participant-form";
import { RandomizeButton } from "@/components/randomize-button";
import { ResendEmailButton } from "@/components/resend-email-button";
import { LoadingSpinner } from "@/components/loading-spinner";
import MemoIcon from "@/icons/memo.svg";
import ClipboardIcon from "@/icons/clipboard.svg";
import { Icon } from "@/components/icon";
import FloppyDiskIcon from "@/icons/floppy-disk.svg";
import PartyPopperIcon from "@/icons/party-popper.svg";
import GiftIcon from "@/icons/gift.svg";
import PackageIcon from "@/icons/package.svg";
import CheckMarkIcon from "@/icons/check-mark.svg";
import HourglassIcon from "@/icons/hourglass.svg";
import PencilIcon from "@/icons/pencil.svg";
import BinIcon from "@/icons/bin.svg";
import IncomingEnvelopeIcon from "@/icons/incoming-envelope.svg";
import PlusIcon from "@/icons/plus.svg";
import SilhouetteIcon from "@/icons/silhouette.svg";
import DiceIcon from "@/icons/dice.svg";

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

interface Group {
    id: string;
    name: string;
    description: string | null;
    isFinalized: boolean;
    lastEmailSentAt: string | null;
    participants: Participant[];
    assignments: Assignment[];
}

interface GroupDetailClientProps {
    groupId: string;
    locale: string;
}

export function GroupDetailClient({ groupId, locale }: GroupDetailClientProps) {
    const { status } = useSession();
    const router = useRouter();
    const t = useTranslations();
    const [group, setGroup] = useState<Group | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Shared function to handle API errors and display toast messages
    const handleApiError = (error: unknown, fallbackMessage: string) => {
        console.error(fallbackMessage, error);
        toast.error(t("toast.errorGeneric"));
    };

    // Shared function to fetch group data
    const fetchGroupData = async () => {
        try {
            const response = await fetch(`/api/groups/${groupId}`);
            if (response.ok) {
                const data = await response.json();
                setGroup(data);
                setEditName(data.name);
                setEditDescription(data.description || "");
            } else if (response.status === 404) {
                toast.error("Group not found");
                router.push("/dashboard");
            }
        } catch (error) {
            handleApiError(error, "Error fetching group:");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchGroupData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, groupId]);

    const handleRemoveParticipant = async (participantId: string) => {
        try {
            const response = await fetch(
                `/api/groups/${groupId}/participants/${participantId}`,
                { method: "DELETE" },
            );

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.error || t("toast.errorGeneric"));
                return;
            }

            toast.success(t("toast.participantRemoved"));
            fetchGroupData();
        } catch {
            toast.error(t("toast.errorGeneric"));
        }
    };

    const handleUpdateGroup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editName.trim()) {
            toast.error(t("validation.groupNameRequired"));
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(`/api/groups/${groupId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editName.trim(),
                    description: editDescription.trim() || null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.error || t("toast.errorGeneric"));
                return;
            }

            toast.success(t("toast.groupUpdated"));
            setIsEditing(false);
            fetchGroupData();
        } catch {
            toast.error(t("toast.errorGeneric"));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteGroup = async () => {
        if (!confirm(t("group.deleteConfirm"))) return;

        try {
            const response = await fetch(`/api/groups/${groupId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.error || t("toast.errorGeneric"));
                return;
            }

            toast.success(t("toast.groupDeleted"));
            router.push("/dashboard");
        } catch {
            toast.error(t("toast.errorGeneric"));
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center snow-bg">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-base-content/60 animate-pulse">
                        {t("group.loadingGroup")}
                    </p>
                </div>
            </div>
        );
    }

    if (!group) {
        return null;
    }

    return (
        <div className="min-h-screen snow-bg relative">
            {/* Festive Background */}
            <div className="absolute inset-0 festive-bg pointer-events-none" />

            {/* Top Decorative Border */}
            <div className="absolute top-0 left-0 right-0 h-1 shimmer-border z-20" />

            <Header locale={locale} />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Back button with festive styling */}
                <button
                    onClick={() => router.push("/dashboard")}
                    className="btn btn-ghost btn-sm gap-2 mb-6 group hover:bg-base-100/50"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">
                        ←
                    </span>
                    <span>{t("common.back")}</span>
                </button>

                {/* Finalized banner with festive styling */}
                {group.isFinalized && (
                    <div className="relative mb-6 overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-tl from-success/20 via-success/10 to-success/20 animate-pulse" />
                        <div className="relative alert bg-linear-to-tl from-success/90 to-success border-2 border-success shadow-lg">
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">
                                    <Icon Render={PartyPopperIcon} size="lg" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-lg text-success-content">
                                        {t("group.finalized")}
                                    </h3>
                                    <p className="text-sm text-success-content/80">
                                        {t("group.finalizedDescription")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Group header card with festive styling */}
                <div className="christmas-card card bg-base-100/95 backdrop-blur-sm shadow-xl mb-6 border-2 border-transparent hover:border-accent/30">
                    <div className="card-body relative">
                        {isEditing && !group.isFinalized ? (
                            <form
                                onSubmit={handleUpdateGroup}
                                className="space-y-4"
                            >
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-2">
                                            <span>
                                                <Icon
                                                    Render={MemoIcon}
                                                    size="xs"
                                                />
                                            </span>{" "}
                                            {t("group.name")}
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) =>
                                            setEditName(e.target.value)
                                        }
                                        className="input input-bordered w-full focus:input-primary transition-all"
                                        disabled={isSaving}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-2">
                                            <Icon
                                                Render={ClipboardIcon}
                                                size="xs"
                                            />
                                            {t("group.description")}
                                        </span>
                                    </label>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) =>
                                            setEditDescription(e.target.value)
                                        }
                                        rows={2}
                                        className="textarea textarea-bordered w-full focus:textarea-primary transition-all"
                                        disabled={isSaving}
                                    />
                                </div>
                                <div className="flex gap-3 justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditName(group.name);
                                            setEditDescription(
                                                group.description || "",
                                            );
                                        }}
                                        disabled={isSaving}
                                        className="btn btn-ghost"
                                    >
                                        {t("common.cancel")}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="btn btn-primary gap-2"
                                    >
                                        {isSaving ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : (
                                            <>
                                                <span>
                                                    <Icon
                                                        Render={FloppyDiskIcon}
                                                        size="xs"
                                                    />
                                                </span>
                                                {t("common.save")}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">
                                        <Icon
                                            Render={
                                                group.isFinalized
                                                    ? GiftIcon
                                                    : PackageIcon
                                            }
                                            size="md"
                                        />
                                    </div>
                                    <div>
                                        <h1 className="card-title text-2xl gradient-text">
                                            {group.name}
                                        </h1>
                                        {group.description && (
                                            <p className="text-base-content/70 mt-2">
                                                {group.description}
                                            </p>
                                        )}
                                        {/* Status badge */}
                                        <div className="mt-3">
                                            <span className="badge badge-success gap-2 badge-lg text-sm w-max">
                                                {group.isFinalized ? (
                                                    <>
                                                        <Icon
                                                            Render={
                                                                CheckMarkIcon
                                                            }
                                                            className="size-3!"
                                                        />
                                                        {t("group.completed")}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Icon
                                                            Render={
                                                                HourglassIcon
                                                            }
                                                            size="xs"
                                                        />
                                                        {t(
                                                            "dashboard.inProgress",
                                                        )}
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {!group.isFinalized && (
                                    <div className="flex flex-col md:flex-row md:gap-2">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="btn btn-ghost btn-sm gap-1 hover:btn-primary hover:text-primary-content transition-all"
                                        >
                                            <Icon
                                                Render={PencilIcon}
                                                size="xs"
                                            />
                                            {t("common.edit")}
                                        </button>
                                        <button
                                            onClick={handleDeleteGroup}
                                            className="btn btn-ghost btn-sm text-error gap-1 hover:btn-error hover:text-error-content transition-all"
                                        >
                                            <Icon Render={BinIcon} size="xs" />
                                            {t("common.delete")}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Participants section with festive styling */}
                <div className="christmas-card card bg-base-100/95 backdrop-blur-sm shadow-xl mb-6 border-2 border-transparent hover:border-secondary/30">
                    <div className="card-body">
                        {/* Section header */}
                        <div className="flex items-center gap-3 mb-4">
                            <Icon Render={SilhouetteIcon} size="md" />
                            <h2 className="card-title text-xl">
                                {t("group.participants")}
                            </h2>
                            <div className="badge badge-primary badge-lg">
                                {group.participants.length}
                            </div>
                            <div className="flex-1 h-px bg-linear-to-tl from-primary/20 via-secondary/20 to-transparent" />
                        </div>

                        {/* Stats mini-bar for participants */}
                        {group.participants.length > 0 && (
                            <div className="flex gap-4 mb-4 text-sm">
                                <div className="flex items-center gap-2 px-3 py-1 bg-base-200/50 rounded-full">
                                    <span className="text-base-content/70">
                                        {group.participants.length}{" "}
                                        {t("dashboard.participants")}
                                    </span>
                                </div>
                                {group.isFinalized && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full">
                                        <Icon
                                            Render={IncomingEnvelopeIcon}
                                            size="xs"
                                        />
                                        <span className="text-success">
                                            {t("group.emailsSent")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        <ParticipantTable
                            participants={group.participants}
                            isFinalized={group.isFinalized}
                            onRemove={handleRemoveParticipant}
                            groupId={groupId}
                            assignments={group.assignments}
                            onResendSuccess={fetchGroupData}
                        />

                        {!group.isFinalized && (
                            <div className="mt-6 pt-6 border-t border-base-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <Icon
                                        Render={PlusIcon}
                                        size="xs"
                                        className="fill-[currentColor]"
                                    />
                                    <h3 className="font-semibold text-base-content/80">
                                        {t("group.addParticipant")}
                                    </h3>
                                </div>
                                <AddParticipantForm
                                    groupId={groupId}
                                    isFinalized={group.isFinalized}
                                    onAdd={fetchGroupData}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Action section with festive styling */}
                <div className="christmas-card card bg-base-100/95 backdrop-blur-sm shadow-xl border-2 border-transparent hover:border-accent/30">
                    <div className="card-body">
                        {/* Section header */}
                        <div className="flex items-center gap-3 mb-4">
                            <Icon Render={DiceIcon} size="md" />
                            <h2 className="card-title text-xl">
                                {group.isFinalized
                                    ? t("group.emailManagement")
                                    : t("group.drawAssignments")}
                            </h2>
                            <div className="flex-1 h-px bg-linear-to-tl from-accent/20 via-primary/20 to-transparent" />
                        </div>

                        {/* Description text */}
                        <p className="text-base-content/60 mb-4 text-sm">
                            {group.isFinalized
                                ? t("group.resendDescription")
                                : t("group.drawDescription")}
                        </p>

                        {group.isFinalized ? (
                            <ResendEmailButton
                                groupId={groupId}
                                lastEmailSentAt={group.lastEmailSentAt}
                            />
                        ) : (
                            <RandomizeButton
                                groupId={groupId}
                                participantCount={group.participants.length}
                                isFinalized={group.isFinalized}
                                onRandomize={fetchGroupData}
                            />
                        )}
                    </div>
                </div>

                {/* Bottom decorative elements */}
                <div className="mt-12 flex justify-center gap-4 text-2xl opacity-30">
                    <span className="animate-float">🎄</span>
                    <span className="animate-float-delayed">⭐</span>
                    <span className="animate-float">🎁</span>
                    <span className="animate-float-delayed">❄️</span>
                    <span className="animate-float">🦌</span>
                </div>
            </main>
        </div>
    );
}
