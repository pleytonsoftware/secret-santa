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
      <div className="christmas-card card bg-base-100 shadow-lg cursor-pointer overflow-hidden group">
        {/* Top decorative border */}
        <div className={`h-1 w-full ${isFinalized ? 'bg-gradient-to-r from-success via-accent to-success' : 'bg-gradient-to-r from-primary via-accent to-secondary'}`} />
        
        <div className="card-body relative">
          {/* Background decoration */}
          <div className="absolute top-2 right-2 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">
            {isFinalized ? '🎅' : '🎄'}
          </div>
          
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:animate-bounce-subtle">
                {isFinalized ? '🎁' : '📝'}
              </span>
              <h3 className="card-title text-base-content group-hover:text-primary transition-colors">
                {name}
              </h3>
            </div>
            <span
              className={`badge gap-1 ${
                isFinalized 
                  ? "badge-success text-white" 
                  : "badge-warning"
              }`}
            >
              {isFinalized ? '✓' : '⏳'} {isFinalized ? t("finalized") : t("notFinalized")}
            </span>
          </div>
          
          {description && (
            <p className="text-base-content/60 text-sm line-clamp-2 mt-2 pl-10">
              {description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-base-content/70 text-sm">
              <span className="text-xl">👥</span>
              <span className="font-medium">
                {participantCount} {t("participants")}
              </span>
            </div>
            
            {/* Arrow indicator */}
            <div className="text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
              →
            </div>
          </div>
          
          {/* Participant preview dots */}
          {participantCount > 0 && (
            <div className="flex gap-1 mt-2">
              {Array.from({ length: Math.min(participantCount, 5) }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-secondary opacity-40"
                />
              ))}
              {participantCount > 5 && (
                <span className="text-xs text-base-content/40">+{participantCount - 5}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
