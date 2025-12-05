"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Icon } from "./icon";
import TreeIcon from "@/icons/tree.svg";
import GiftIcon from "@/icons/gift.svg";

interface CreateGroupFormProps {
    onCancel: () => void;
    onSuccess: () => void;
}

export function CreateGroupForm({ onCancel, onSuccess }: CreateGroupFormProps) {
    const t = useTranslations();
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [spendingLimit, setSpendingLimit] = useState("");
    const [theme, setTheme] = useState("");
    const [exchangeDate, setExchangeDate] = useState("");
    const [location, setLocation] = useState("");
    const [additionalRules, setAdditionalRules] = useState("");
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
                    spendingLimit: spendingLimit.trim() || undefined,
                    theme: theme.trim() || undefined,
                    exchangeDate: exchangeDate || undefined,
                    location: location.trim() || undefined,
                    additionalRules: additionalRules.trim() || undefined,
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
        <dialog className="modal modal-open">
            <div className="modal-box bg-base-100 shadow-2xl border border-base-300">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <div className="flex">
                        <Icon Render={TreeIcon} size="sm" />
                        <Icon Render={GiftIcon} className="self-end size-3!" />
                    </div>
                    {t("dashboard.createGroup")}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                {t("group.name")} *
                            </span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t("group.namePlaceholder")}
                            className="input input-bordered w-full"
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                {t("group.description")}
                            </span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t("group.descriptionPlaceholder")}
                            rows={3}
                            className="textarea textarea-bordered w-full"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="divider">{t("group.settings")}</div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                {t("group.spendingLimit")}
                            </span>
                        </label>
                        <input
                            type="text"
                            value={spendingLimit}
                            onChange={(e) => setSpendingLimit(e.target.value)}
                            placeholder={t("group.spendingLimitPlaceholder")}
                            className="input input-bordered w-full"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                {t("group.theme")}
                            </span>
                        </label>
                        <input
                            type="text"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            placeholder={t("group.themePlaceholder")}
                            className="input input-bordered w-full"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                {t("group.exchangeDate")}
                            </span>
                        </label>
                        <input
                            type="date"
                            value={exchangeDate}
                            onChange={(e) => setExchangeDate(e.target.value)}
                            className="input input-bordered w-full"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                {t("group.location")}
                            </span>
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder={t("group.locationPlaceholder")}
                            className="input input-bordered w-full"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                {t("group.additionalRules")}
                            </span>
                        </label>
                        <textarea
                            value={additionalRules}
                            onChange={(e) => setAdditionalRules(e.target.value)}
                            placeholder={t("group.additionalRulesPlaceholder")}
                            rows={3}
                            className="textarea textarea-bordered w-full"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="modal-action">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="btn btn-ghost"
                        >
                            {t("common.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary"
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                t("group.create")
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onCancel}>close</button>
            </form>
        </dialog>
    );
}
