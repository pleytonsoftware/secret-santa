"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

interface WishlistLink {
    url: string;
    storeName?: string;
}

interface WishlistFormData {
    name: string;
    description: string;
    links: WishlistLink[];
    price: string;
    priority: number;
}

interface WishlistFormProps {
    formData: WishlistFormData;
    isSubmitting: boolean;
    isEditing: boolean;
    onChange: (data: WishlistFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export function WishlistForm({
    formData,
    isSubmitting,
    isEditing,
    onChange,
    onSubmit,
    onCancel,
}: WishlistFormProps) {
    const t = useTranslations("wishlist");
    const tCommon = useTranslations("common");
    const [newLinkUrl, setNewLinkUrl] = useState("");
    const [newLinkStore, setNewLinkStore] = useState("");

    const handleAddLink = () => {
        if (!newLinkUrl.trim()) return;
        if (formData.links.length >= 5) {
            return; // Max 5 links
        }

        onChange({
            ...formData,
            links: [
                ...formData.links,
                {
                    url: newLinkUrl.trim(),
                    storeName: newLinkStore.trim() || undefined,
                },
            ],
        });
        setNewLinkUrl("");
        setNewLinkStore("");
    };

    const handleRemoveLink = (index: number) => {
        onChange({
            ...formData,
            links: formData.links.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="card bg-base-100 border-2 border-primary/20 shadow-lg">
            <div className="card-body p-6">
                <h4 className="font-semibold text-lg mb-4">
                    {isEditing ? t("editItem") : t("addItem")}
                </h4>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">
                                {t("itemName")} *
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                onChange({ ...formData, name: e.target.value })
                            }
                            placeholder={t("itemNamePlaceholder")}
                            className="input input-bordered w-full"
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">
                                {t("description")}
                            </span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                onChange({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            placeholder={t("descriptionPlaceholder")}
                            className="textarea textarea-bordered w-full"
                            rows={3}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Links Section */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">
                                {t("links")} ({formData.links.length}/5)
                            </span>
                        </label>

                        {/* Existing Links */}
                        {formData.links.length > 0 && (
                            <div className="space-y-2 mb-3">
                                {formData.links.map((link, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 p-2 bg-base-300 rounded"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-base-content/60 truncate">
                                                {link.storeName || t("link")}
                                            </div>
                                            <div className="text-sm truncate">
                                                {link.url}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveLink(index)
                                            }
                                            className="btn btn-ghost btn-xs text-error"
                                            disabled={isSubmitting}
                                        >
                                            {tCommon("delete")}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add New Link */}
                        {formData.links.length < 5 && (
                            <div className="space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <input
                                        type="url"
                                        value={newLinkUrl}
                                        onChange={(e) =>
                                            setNewLinkUrl(e.target.value)
                                        }
                                        placeholder={t("linkPlaceholder")}
                                        className="input input-bordered input-sm w-full"
                                        disabled={isSubmitting}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddLink();
                                            }
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={newLinkStore}
                                        onChange={(e) =>
                                            setNewLinkStore(e.target.value)
                                        }
                                        placeholder={t("storeName")}
                                        className="input input-bordered input-sm w-full"
                                        disabled={isSubmitting}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddLink();
                                            }
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddLink}
                                    className="btn btn-sm btn-outline w-full"
                                    disabled={
                                        isSubmitting || !newLinkUrl.trim()
                                    }
                                >
                                    {t("addLink")}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    {t("price")}
                                </span>
                            </label>
                            <input
                                type="text"
                                value={formData.price}
                                onChange={(e) =>
                                    onChange({
                                        ...formData,
                                        price: e.target.value,
                                    })
                                }
                                placeholder={t("pricePlaceholder")}
                                className="input input-bordered w-full"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    {t("priority")}
                                </span>
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) =>
                                    onChange({
                                        ...formData,
                                        priority: parseInt(e.target.value),
                                    })
                                }
                                className="select select-bordered w-full"
                                disabled={isSubmitting}
                            >
                                <option value={0}>{t("priorityNormal")}</option>
                                <option value={1}>
                                    {t("priorityPreferred")}
                                </option>
                                <option value={2}>
                                    {t("priorityMustHave")}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn btn-ghost"
                            disabled={isSubmitting}
                        >
                            {tCommon("cancel")}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                tCommon("save")
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
