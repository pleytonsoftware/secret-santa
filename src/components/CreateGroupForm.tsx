"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateGroupFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export function CreateGroupForm({ onCancel, onSuccess }: CreateGroupFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t("validation.groupNameRequired"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || t("toast.errorGeneric"));
        return;
      }

      const group = await response.json();
      toast.success(t("toast.groupCreated"));
      onSuccess();
      router.push(`/dashboard/groups/${group.id}`);
    } catch {
      toast.error(t("toast.errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {t("dashboard.createGroup")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("group.name")} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("group.namePlaceholder")}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("group.description")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("group.descriptionPlaceholder")}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("common.loading") : t("group.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
