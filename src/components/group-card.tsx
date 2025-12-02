"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

interface GroupCardProps {
  id: string;
  name: string;
  description?: string | null;
  participantCount: number;
  isFinalized: boolean;
}

export function GroupCard({
  id,
  name,
  description,
  participantCount,
  isFinalized,
}: GroupCardProps) {
  const t = useTranslations("dashboard");

  return (
    <Link href={`/dashboard/groups/${id}`}>
      <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <h3 className="card-title text-base-content">{name}</h3>
            <span
              className={`badge ${
                isFinalized ? "badge-success" : "badge-warning"
              }`}
            >
              {isFinalized ? t("finalized") : t("notFinalized")}
            </span>
          </div>
          {description && (
            <p className="text-base-content/60 text-sm line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex items-center gap-2 text-base-content/70 text-sm mt-2">
            <span className="text-lg">👥</span>
            <span>
              {participantCount} {t("participants")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
