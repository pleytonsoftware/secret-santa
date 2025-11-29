"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { ParticipantTable } from "@/components/ParticipantTable";
import { AddParticipantForm } from "@/components/AddParticipantForm";
import { RandomizeButton } from "@/components/RandomizeButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Participant {
  id: string;
  name: string;
  email: string;
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  isFinalized: boolean;
  participants: Participant[];
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

  useEffect(() => {
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
        console.error("Error fetching group:", error);
        toast.error(t("toast.errorGeneric"));
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchGroupData();
    }
  }, [status, groupId, router, t]);

  const fetchGroup = async () => {
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
      console.error("Error fetching group:", error);
      toast.error(t("toast.errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    try {
      const response = await fetch(
        `/api/groups/${groupId}/participants/${participantId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || t("toast.errorGeneric"));
        return;
      }

      toast.success(t("toast.participantRemoved"));
      fetchGroup();
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
      fetchGroup();
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!group) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header locale={locale} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          ← {t("common.back")}
        </button>

        {/* Finalized banner */}
        {group.isFinalized && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h3 className="font-medium text-green-800">
                  {t("group.finalized")}
                </h3>
                <p className="text-sm text-green-700">
                  {t("group.finalizedDescription")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Group header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          {isEditing && !group.isFinalized ? (
            <form onSubmit={handleUpdateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("group.name")}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("group.description")}
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  disabled={isSaving}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(group.name);
                    setEditDescription(group.description || "");
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? t("common.loading") : t("common.save")}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {group.name}
                </h1>
                {group.description && (
                  <p className="text-gray-600 mt-1">{group.description}</p>
                )}
              </div>
              {!group.isFinalized && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={handleDeleteGroup}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    {t("common.delete")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Participants section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t("group.participants")} ({group.participants.length})
          </h2>

          <ParticipantTable
            participants={group.participants}
            isFinalized={group.isFinalized}
            onRemove={handleRemoveParticipant}
          />

          {!group.isFinalized && (
            <div className="mt-6">
              <AddParticipantForm
                groupId={groupId}
                isFinalized={group.isFinalized}
                onAdd={fetchGroup}
              />
            </div>
          )}
        </div>

        {/* Randomize button */}
        {!group.isFinalized && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <RandomizeButton
              groupId={groupId}
              participantCount={group.participants.length}
              isFinalized={group.isFinalized}
              onRandomize={fetchGroup}
            />
          </div>
        )}
      </main>
    </div>
  );
}
