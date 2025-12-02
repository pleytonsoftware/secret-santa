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
    <form onSubmit={handleSubmit} className="bg-base-200 rounded-box p-4">
      <h4 className="font-medium text-base-content mb-3">
        {t("group.addParticipant")}
      </h4>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("group.participantNamePlaceholder")}
          className="input input-bordered flex-1"
          disabled={isLoading}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("group.participantEmailPlaceholder")}
          className="input input-bordered flex-1"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-secondary"
        >
          {isLoading ? <span className="loading loading-spinner loading-sm"></span> : t("common.add")}
        </button>
      </div>
    </form>
  );
}
