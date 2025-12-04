"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/header";
import { GroupCard } from "@/components/group-card";
import { CreateGroupForm } from "@/components/create-group-form";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Icon } from "@/components/icon";
import TreeIcon from "@/icons/tree.svg";
import GiftIcon from "@/icons/gift.svg";
import SantaIcon from "@/icons/santa-claus.svg";
import SilhouetteIcon from "@/icons/silhouette.svg";
import CheckIcon from "@/icons/check.svg";
import HourglassIcon from "@/icons/hourglass.svg";

interface Group {
    id: string;
    name: string;
    description: string | null;
    isFinalized: boolean;
    createdAt: string;
    _count: {
        participants: number;
    };
}

interface DashboardClientProps {
    locale: string;
}

export function DashboardClient({ locale }: DashboardClientProps) {
    const { status } = useSession();
    const t = useTranslations();
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const fetchGroups = async () => {
        try {
            const response = await fetch("/api/groups");
            if (response.ok) {
                const data = await response.json();
                setGroups(data);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchGroups();
        }
    }, [status]);

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center snow-bg">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-base-content/60 animate-pulse">
                        {t("dashboard.loadingMagic")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen snow-bg relative">
            {/* Festive Background */}
            <div className="absolute inset-0 festive-bg pointer-events-none" />

            {/* Top Decorative Border */}
            <div className="absolute top-0 left-0 right-0 h-1 shimmer-border z-20" />

            <Header locale={locale} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Hero Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                    <div className="flex items-start gap-4">
                        <Icon Render={TreeIcon} size="lg" />
                        <div>
                            <h1 className="text-4xl font-extrabold gradient-text">
                                {t("dashboard.title")}
                            </h1>
                            <p className="text-base-content/70 mt-2 text-lg">
                                {t("dashboard.subtitle")}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="btn btn-secondary btn-lg gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                    >
                        <Icon Render={GiftIcon} size="sm" />
                        {t("dashboard.createGroup")}
                    </button>
                </div>

                {/* Stats Bar */}
                {groups.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                        <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-primary/10 christmas-card">
                            <div className="text-3xl mb-2">
                                <Icon Render={SantaIcon} size="lg" />
                            </div>
                            <div className="text-2xl font-bold text-primary">
                                {groups.length}
                            </div>
                            <div className="text-sm text-base-content/60">
                                {t("dashboard.totalGroups")}
                            </div>
                        </div>
                        <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-secondary/10 christmas-card">
                            <div className="text-3xl mb-2">
                                <Icon Render={SilhouetteIcon} size="lg" />
                            </div>
                            <div className="text-2xl font-bold text-secondary">
                                {groups.reduce(
                                    (acc, g) => acc + g._count.participants,
                                    0,
                                )}
                            </div>
                            <div className="text-sm text-base-content/60 capitalize">
                                {t("dashboard.participants")}
                            </div>
                        </div>
                        <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-accent/10 christmas-card">
                            <div className="text-3xl mb-2">
                                <Icon Render={CheckIcon} size="lg" />
                            </div>
                            <div className="text-2xl font-bold text-accent">
                                {groups.filter((g) => g.isFinalized).length}
                            </div>
                            <div className="text-sm text-base-content/60">
                                {t("dashboard.finalized")}
                            </div>
                        </div>
                        <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-info/10 christmas-card">
                            <div className="text-3xl mb-2">
                                <Icon Render={HourglassIcon} size="lg" />
                            </div>
                            <div className="text-2xl font-bold text-info">
                                {groups.filter((g) => !g.isFinalized).length}
                            </div>
                            <div className="text-sm text-base-content/60">
                                {t("dashboard.inProgress")}
                            </div>
                        </div>
                    </div>
                )}

                {groups.length === 0 ? (
                    <div className="text-center py-20 relative">
                        {/* Decorative background card */}
                        <div className="absolute inset-0 mx-auto max-w-lg bg-gradient-to-br from-primary/5 via-base-100/50 to-secondary/5 rounded-3xl" />

                        <div className="relative">
                            {/* Animated Christmas Tree */}
                            <div className="relative inline-block mb-8">
                                <span className="text-[100px] block animate-float">
                                    🎄
                                </span>
                                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-3xl animate-sparkle">
                                    ⭐
                                </span>
                                <span
                                    className="absolute top-12 left-4 text-xl animate-sparkle"
                                    style={{ animationDelay: "0.3s" }}
                                >
                                    ✨
                                </span>
                                <span
                                    className="absolute top-16 right-4 text-xl animate-sparkle"
                                    style={{ animationDelay: "0.6s" }}
                                >
                                    ✨
                                </span>
                            </div>

                            <h2 className="text-3xl font-bold gradient-text mb-4">
                                {t("dashboard.noGroups")}
                            </h2>
                            <p className="text-lg text-base-content/60 mb-8 max-w-md mx-auto">
                                {t("dashboard.noGroupsHint")}
                            </p>

                            {/* Call to action */}
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="btn btn-primary btn-lg gap-3 animate-pulse-glow"
                            >
                                <Icon Render={GiftIcon} size="sm" />
                                {t("dashboard.createGroup")}
                            </button>

                            {/* Decorative elements */}
                            <div className="mt-12 flex justify-center gap-6 text-4xl opacity-40">
                                <span className="animate-float">🎅</span>
                                <span className="animate-float-delayed">
                                    🦌
                                </span>
                                <span className="animate-float">⛄</span>
                                <span className="animate-float-delayed">
                                    🎿
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Section Title */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-end">
                                <Icon Render={TreeIcon} size="sm" />
                                <Icon
                                    Render={GiftIcon}
                                    size="sm"
                                    className="size-2.5!"
                                />
                            </div>
                            <h2 className="text-xl font-semibold text-base-content">
                                {t("dashboard.yourGroups")}
                            </h2>
                            <div className="flex-1 h-px bg-linear-to-tl from-primary/20 via-secondary/20 to-transparent" />
                        </div>

                        {/* Groups Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groups.map((group, index) => (
                                <div
                                    key={group.id}
                                    className="transform transition-all duration-300"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                    }}
                                >
                                    <GroupCard
                                        id={group.id}
                                        name={group.name}
                                        description={group.description}
                                        participantCount={
                                            group._count.participants
                                        }
                                        isFinalized={group.isFinalized}
                                        createdAt={group.createdAt}
                                        locale={locale}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>

            {showCreateForm && (
                <CreateGroupForm
                    onCancel={() => setShowCreateForm(false)}
                    onSuccess={() => {
                        setShowCreateForm(false);
                        fetchGroups();
                    }}
                />
            )}
        </div>
    );
}
