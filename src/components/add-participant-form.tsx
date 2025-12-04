"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "./icon";
import PlusIcon from "@/icons/plus.svg";

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
            const response = await fetch(
                `/api/groups/${groupId}/participants`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                    }),
                },
            );

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
        <form onSubmit={handleSubmit} className="relative">
            {/* Festive background */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-base-200 to-primary/5 rounded-2xl" />

            <div className="relative bg-base-200/80 backdrop-blur-sm rounded-2xl p-5 border border-secondary/10">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Name input with icon */}
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                            👤
                        </span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t("group.participantNamePlaceholder")}
                            className="input input-bordered w-full pl-10 focus:input-secondary transition-all"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Email input with icon */}
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                            📧
                        </span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("group.participantEmailPlaceholder")}
                            className="input input-bordered w-full pl-10 focus:input-secondary transition-all"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-secondary gap-2 min-w-[120px] shadow-md hover:shadow-lg transition-all hover:scale-105"
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <>
                                <Icon
                                    Render={PlusIcon}
                                    size="xs"
                                    className="fill-[currentColor]"
                                />
                                {t("common.add")}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
