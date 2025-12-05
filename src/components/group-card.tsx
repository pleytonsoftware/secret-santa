"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "./icon";
import GiftIcon from "@/icons/gift.svg";
import MemoIcon from "@/icons/memo.svg";
import SantaClausIcon from "@/icons/santa-claus.svg";
import TreeIcon from "@/icons/tree.svg";
import CheckMarkIcon from "@/icons/check-mark.svg";
import HourglassIcon from "@/icons/hourglass.svg";
import CalendarIcon from "@/icons/calendar.svg";
import SilhouetteIcon from "@/icons/silhouette.svg";

interface GroupCardProps {
    id: string;
    name: string;
    description?: string | null;
    participantCount: number;
    isFinalized: boolean;
    createdAt: string;
    locale: string;
}

export function GroupCard({
    id,
    name,
    description,
    participantCount,
    isFinalized,
    createdAt,
    locale,
}: GroupCardProps) {
    const t = useTranslations("dashboard");

    return (
        <Link href={`/dashboard/groups/${id}`}>
            <div className="christmas-card card bg-base-100 h-full shadow-lg cursor-pointer overflow-hidden group">
                {/* Top decorative border */}
                <div
                    className={`h-1 w-full ${
                        isFinalized
                            ? "bg-linear-to-tl from-success via-accent to-success"
                            : "bg-linear-to-tl from-primary via-accent to-secondary"
                    }`}
                />

                <div className="card-body relative">
                    {/* Background decoration */}
                    <div className="absolute top-2 right-2 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">
                        <Icon
                            Render={isFinalized ? SantaClausIcon : TreeIcon}
                            size="sm"
                        />
                    </div>

                    <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl group-hover:animate-bounce-subtle">
                                <Icon
                                    Render={isFinalized ? GiftIcon : MemoIcon}
                                    size="sm"
                                />
                            </span>
                            <h3 className="card-title text-base-content group-hover:text-primary transition-colors">
                                {name}
                            </h3>
                        </div>
                        <span
                            className={`badge gap-2 py-3 self-center ${
                                isFinalized
                                    ? "badge-success text-white"
                                    : "badge-warning"
                            }`}
                        >
                            <Icon
                                Render={
                                    isFinalized ? CheckMarkIcon : HourglassIcon
                                }
                                size="xs"
                                className={[
                                    isFinalized
                                        ? "fill-[currentColor]"
                                        : undefined,
                                    "size-3!",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            />
                            {isFinalized ? t("finalized") : t("notFinalized")}
                        </span>
                    </div>

                    {description && (
                        <p className="text-base-content/60 text-sm line-clamp-2 mt-2 pl-10">
                            {description}
                        </p>
                    )}

                    <div className="mt-auto flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-base-content/70 text-sm">
                                <Icon Render={SilhouetteIcon} size="xs" />
                                <span className="font-medium">
                                    {participantCount} {t("participants")}
                                </span>
                            </div>

                            {/* Arrow indicator */}
                            <div className="text-primary opacity-0 group-hover:opacity-100 transform -translate-x-2.5 group-hover:translate-x-0 transition-all duration-300">
                                →
                            </div>
                        </div>

                        {/* Creation date */}
                        <div className="flex items-center gap-2 text-xs text-base-content/50">
                            <Icon Render={CalendarIcon} size="xs" />
                            {new Date(createdAt).toLocaleDateString(locale, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </div>

                    {/* Participant preview dots */}
                    {/* {participantCount > 0 && (
                        <div className="flex gap-1 mt-2">
                            {Array.from({
                                length: Math.min(participantCount, 5),
                            }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-linear-to-br from-primary to-secondary opacity-40"
                                />
                            ))}
                            {participantCount > 5 && (
                                <span className="text-xs text-base-content/40">
                                    +{participantCount - 5}
                                </span>
                            )}
                        </div>
                    )} */}
                </div>
            </div>
        </Link>
    );
}
