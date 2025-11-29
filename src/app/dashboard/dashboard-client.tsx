"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/header";
import { GroupCard } from "@/components/group-card";
import { CreateGroupForm } from "@/components/create-group-form";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Group {
  id: string;
  name: string;
  description: string | null;
  isFinalized: boolean;
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header locale={locale} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {t("dashboard.title")}
            </h1>
            <p className="text-gray-600 mt-1">{t("dashboard.subtitle")}</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            <span className="text-xl">+</span>
            {t("dashboard.createGroup")}
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🎄</span>
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              {t("dashboard.noGroups")}
            </h2>
            <p className="text-gray-500">{t("dashboard.noGroupsHint")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                description={group.description}
                participantCount={group._count.participants}
                isFinalized={group.isFinalized}
              />
            ))}
          </div>
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
