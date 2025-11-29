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
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isFinalized
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {isFinalized ? t("finalized") : t("notFinalized")}
          </span>
        </div>
        {description && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span className="text-lg">👥</span>
          <span>
            {participantCount} {t("participants")}
          </span>
        </div>
      </div>
    </Link>
  );
}
