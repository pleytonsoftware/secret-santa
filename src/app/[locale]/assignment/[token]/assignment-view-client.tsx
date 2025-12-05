"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Snowfall } from "@/components/snowfall";
import { LoadingSpinner } from "@/components/loading-spinner";
import { WishlistManager } from "@/components/wishlist-manager";
import { WishlistItemPreview } from "@/components/wishlist/wishlist-item-preview";
import { useTranslations } from "next-intl";
import GiftIcon from "@/icons/gift.svg";
import SparkleIcon from "@/icons/sparkles.svg";
import { Icon } from "@/components/icon";

interface WishlistLink {
    id: string;
    url: string;
    storeName: string | null;
}

interface WishlistItem {
    id: string;
    name: string;
    description: string | null;
    links: WishlistLink[];
    price: string | null;
    priority: number;
}

interface AssignmentData {
    giverName: string;
    giverId: string;
    receiverName: string;
    receiverId: string;
    groupName: string;
    groupDescription?: string;
    spendingLimit?: string;
    theme?: string;
    exchangeDate?: string;
    location?: string;
    additionalRules?: string;
    giverWishlist: WishlistItem[];
    receiverWishlist: WishlistItem[];
}

interface AssignmentViewClientProps {
    token: string;
}

export function AssignmentViewClient({ token }: AssignmentViewClientProps) {
    const t = useTranslations();
    const [assignment, setAssignment] = useState<AssignmentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAssignment = async () => {
        try {
            const response = await fetch(`/api/assignments/${token}`);
            if (!response.ok) {
                throw new Error("Assignment not found");
            }
            const data = await response.json();
            setAssignment(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load assignment",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignment();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !assignment) {
        return (
            <div className="min-h-screen flex flex-col relative overflow-hidden snow-bg">
                <Snowfall />
                <div className="flex-1 flex items-center justify-center px-4 z-10">
                    <div className="text-center max-w-md">
                        <div className="text-6xl mb-6">🎅</div>
                        <h1 className="text-3xl font-bold mb-4 gradient-text">
                            Assignment Not Found
                        </h1>
                        <p className="text-base-content/70 mb-8">
                            This assignment link is invalid or has expired.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden snow-bg">
            <Snowfall />

            {/* Decorative Background */}
            <div className="absolute inset-0 festive-bg pointer-events-none" />

            <div className="flex-1 flex items-center justify-center px-4 py-12 z-10">
                <div className="max-w-2xl w-full">
                    {/* Card */}
                    <div className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
                            <div className="mb-4 inline-block">
                                <Logo width={80} height={80} />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                🎅 {t("header.title")}
                            </h1>
                            <p className="text-white/90 text-lg">
                                {assignment.groupName}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="text-6xl mb-4 animate-bounce-subtle">
                                    <Icon Render={GiftIcon} size="lg" />
                                </div>
                                <h2 className="text-2xl font-semibold text-base-content mb-2 capitalize">
                                    {t("dashboard.hello")},{" "}
                                    {assignment.giverName}!
                                </h2>
                                <p className="text-base-content/70">
                                    {t("group.assignment")}
                                </p>
                            </div>

                            {/* Assignment Card */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl" />
                                <div className="relative bg-base-200 rounded-2xl p-8 border-2 border-accent shadow-lg">
                                    <div className="text-center">
                                        <p className="text-sm text-base-content/60 uppercase tracking-wider mb-3 font-semibold">
                                            {t("group.youreGivingTo")}
                                        </p>
                                        <div className="flex items-center justify-center gap-3 mb-4">
                                            <span className="text-4xl animate-sparkle">
                                                <Icon
                                                    Render={SparkleIcon}
                                                    size="md"
                                                />
                                            </span>
                                            <p className="text-4xl font-bold gradient-text capitalize">
                                                {assignment.receiverName}
                                            </p>
                                            <span
                                                className="text-4xl animate-sparkle"
                                                style={{
                                                    animationDelay: "0.3s",
                                                }}
                                            >
                                                <Icon
                                                    Render={SparkleIcon}
                                                    size="md"
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reminder */}
                            <div className="mt-8 bg-error/10 border-l-4 border-error rounded-lg p-4">
                                <p className="text-error font-semibold text-center">
                                    🤫 {t("randomize.reminder")}
                                </p>
                            </div>

                            {/* Description if exists */}
                            {assignment.groupDescription && (
                                <div className="mt-6 p-4 bg-base-200 rounded-lg">
                                    <p className="text-sm text-base-content/70 text-center">
                                        <strong>
                                            {t("group.description")}:
                                        </strong>{" "}
                                        {assignment.groupDescription}
                                    </p>
                                </div>
                            )}

                            {/* Group Settings */}
                            {(assignment.spendingLimit ||
                                assignment.theme ||
                                assignment.exchangeDate ||
                                assignment.location ||
                                assignment.additionalRules) && (
                                <div className="mt-6 space-y-2">
                                    <h3 className="font-semibold text-center mb-3">
                                        {t("group.settings")}
                                    </h3>
                                    <div className="grid gap-2">
                                        {assignment.spendingLimit && (
                                            <div className="flex justify-between items-center bg-base-200 rounded-lg px-4 py-2">
                                                <span className="text-sm text-base-content/70">
                                                    {t("group.spendingLimit")}:
                                                </span>
                                                <span className="font-semibold">
                                                    {assignment.spendingLimit}
                                                </span>
                                            </div>
                                        )}
                                        {assignment.theme && (
                                            <div className="flex justify-between items-center bg-base-200 rounded-lg px-4 py-2">
                                                <span className="text-sm text-base-content/70">
                                                    {t("group.theme")}:
                                                </span>
                                                <span className="font-semibold">
                                                    {assignment.theme}
                                                </span>
                                            </div>
                                        )}
                                        {assignment.exchangeDate && (
                                            <div className="flex justify-between items-center bg-base-200 rounded-lg px-4 py-2">
                                                <span className="text-sm text-base-content/70">
                                                    {t("group.exchangeDate")}:
                                                </span>
                                                <span className="font-semibold">
                                                    {new Date(
                                                        assignment.exchangeDate,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                        {assignment.location && (
                                            <div className="flex justify-between items-center bg-base-200 rounded-lg px-4 py-2">
                                                <span className="text-sm text-base-content/70">
                                                    {t("group.location")}:
                                                </span>
                                                <span className="font-semibold">
                                                    {assignment.location}
                                                </span>
                                            </div>
                                        )}
                                        {assignment.additionalRules && (
                                            <div className="bg-base-200 rounded-lg px-4 py-2">
                                                <span className="text-sm text-base-content/70">
                                                    {t("group.additionalRules")}
                                                    :
                                                </span>
                                                <p className="mt-1 text-sm">
                                                    {assignment.additionalRules}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Receiver's Wishlist */}
                            {assignment.receiverWishlist &&
                                assignment.receiverWishlist.length > 0 && (
                                    <div className="mt-8 p-6 bg-base-200 rounded-lg">
                                        <h3 className="text-xl font-semibold mb-4 text-center">
                                            {t("wishlist.receiverWishlist", {
                                                name: assignment.receiverName,
                                            })}
                                        </h3>
                                        <div className="space-y-3">
                                            {assignment.receiverWishlist.map(
                                                (item) => (
                                                    <WishlistItemPreview
                                                        key={item.id}
                                                        item={item}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Giver's Wishlist Manager */}
                            <div className="mt-8 p-6 bg-base-200 rounded-lg">
                                <WishlistManager
                                    participantId={assignment.giverId}
                                    initialItems={assignment.giverWishlist}
                                    onUpdate={fetchAssignment}
                                />
                            </div>

                            {/* Footer Message */}
                            <div className="mt-8 text-center">
                                <p className="text-base-content/70">
                                    {t("randomize.happyHolidays")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
