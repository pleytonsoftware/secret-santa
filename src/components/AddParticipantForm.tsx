"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface AddParticipantFormProps {
  groupId: string;
  isFinalized: boolean;
  onAdd: () => void;
}

export function AddParticipantForm({
  groupId,
  isFinalized,
  onAdd,
}: AddParticipantFormProps) {
  const t = useTranslations();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFinalized) {
      toast.error(t("group.cannotEditFinalized"));
      return;
    }

    if (!name.trim()) {
      toast.error(t("validation.nameRequired"));
      return;
    }

    if (!email.trim()) {
      toast.error(t("validation.emailRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("validation.emailInvalid"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error?.includes("already exists")) {
          toast.error(t("toast.errorDuplicateEmail"));
        } else {
          toast.error(data.error || t("toast.errorGeneric"));
        }
        return;
      }

      toast.success(t("toast.participantAdded"));
      setName("");
      setEmail("");
      onAdd();
    } catch {
      toast.error(t("toast.errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isFinalized) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium text-gray-700 mb-3">
        {t("group.addParticipant")}
      </h4>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("group.participantNamePlaceholder")}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={isLoading}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("group.participantEmailPlaceholder")}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t("common.loading") : t("common.add")}
        </button>
      </div>
    </form>
  );
}
