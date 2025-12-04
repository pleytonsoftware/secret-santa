"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "./icon";
import GiftIcon from "@/icons/gift.svg";

interface WishlistItem {
    id: string;
    name: string;
    description: string | null;
    link: string | null;
    price: string | null;
    priority: number;
}

interface WishlistManagerProps {
    participantId: string;
    initialItems: WishlistItem[];
    onUpdate: () => void;
}

export function WishlistManager({
    participantId,
    initialItems,
    onUpdate,
}: WishlistManagerProps) {
    const t = useTranslations("wishlist");
    const tCommon = useTranslations("common");
    const [items, setItems] = useState<WishlistItem[]>(initialItems);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        link: "",
        price: "",
        priority: 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            link: "",
            price: "",
            priority: 0,
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleAdd = () => {
        setFormData({
            name: "",
            description: "",
            link: "",
            price: "",
            priority: 0,
        });
        setEditingId(null);
        setIsAdding(true);
    };

    const handleEdit = (item: WishlistItem) => {
        setFormData({
            name: item.name,
            description: item.description || "",
            link: item.link || "",
            price: item.price || "",
            priority: item.priority,
        });
        setEditingId(item.id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error(t("itemName") + " " + tCommon("required"));
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingId) {
                // Update existing item
                const response = await fetch(
                    `/api/wishlist/${participantId}/${editingId}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData),
                    },
                );

                if (!response.ok) {
                    throw new Error("Failed to update");
                }

                const updatedItem = await response.json();
                setItems(
                    items.map((item) =>
                        item.id === editingId ? updatedItem : item,
                    ),
                );
                toast.success(t("../toast.itemUpdated"));
            } else {
                // Create new item
                const response = await fetch(`/api/wishlist/${participantId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error("Failed to create");
                }

                const newItem = await response.json();
                setItems([...items, newItem]);
                toast.success(t("../toast.itemAdded"));
            }

            resetForm();
            onUpdate();
        } catch {
            toast.error(t("../toast.errorGeneric"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("deleteConfirm"))) return;

        try {
            const response = await fetch(
                `/api/wishlist/${participantId}/${id}`,
                {
                    method: "DELETE",
                },
            );

            if (!response.ok) {
                throw new Error("Failed to delete");
            }

            setItems(items.filter((item) => item.id !== id));
            toast.success(t("../toast.itemDeleted"));
            onUpdate();
        } catch {
            toast.error(t("../toast.errorGeneric"));
        }
    };

    const getPriorityLabel = (priority: number) => {
        switch (priority) {
            case 2:
                return t("priorityMustHave");
            case 1:
                return t("priorityPreferred");
            default:
                return t("priorityNormal");
        }
    };

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 2:
                return "badge-error";
            case 1:
                return "badge-warning";
            default:
                return "badge-ghost";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Icon Render={GiftIcon} size="sm" />
                    {t("title")}
                </h3>
                {!isAdding && !editingId && (
                    <button
                        onClick={handleAdd}
                        className="btn btn-sm btn-primary"
                    >
                        {t("addItem")}
                    </button>
                )}
            </div>

            {(isAdding || editingId) && (
                <form
                    onSubmit={handleSubmit}
                    className="card bg-base-200 p-4 space-y-3"
                >
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                {t("itemName")} *
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            placeholder={t("itemNamePlaceholder")}
                            className="input input-bordered input-sm"
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                {t("description")}
                            </span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            placeholder={t("descriptionPlaceholder")}
                            className="textarea textarea-bordered textarea-sm"
                            rows={2}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">{t("link")}</span>
                            </label>
                            <input
                                type="url"
                                value={formData.link}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        link: e.target.value,
                                    })
                                }
                                placeholder={t("linkPlaceholder")}
                                className="input input-bordered input-sm"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">{t("price")}</span>
                            </label>
                            <input
                                type="text"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price: e.target.value,
                                    })
                                }
                                placeholder={t("pricePlaceholder")}
                                className="input input-bordered input-sm"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">{t("priority")}</span>
                        </label>
                        <select
                            value={formData.priority}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    priority: parseInt(e.target.value),
                                })
                            }
                            className="select select-bordered select-sm"
                            disabled={isSubmitting}
                        >
                            <option value={0}>{t("priorityNormal")}</option>
                            <option value={1}>{t("priorityPreferred")}</option>
                            <option value={2}>{t("priorityMustHave")}</option>
                        </select>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="btn btn-sm btn-ghost"
                            disabled={isSubmitting}
                        >
                            {tCommon("cancel")}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-sm btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                tCommon("save")
                            )}
                        </button>
                    </div>
                </form>
            )}

            {items.length === 0 ? (
                <p className="text-center text-base-content/60 py-8">
                    {t("noItems")}
                </p>
            ) : (
                <div className="space-y-2">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="card bg-base-200 p-3 hover:bg-base-300 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold">
                                            {item.name}
                                        </h4>
                                        <span
                                            className={`badge badge-sm ${getPriorityColor(
                                                item.priority,
                                            )}`}
                                        >
                                            {getPriorityLabel(item.priority)}
                                        </span>
                                    </div>
                                    {item.description && (
                                        <p className="text-sm text-base-content/70">
                                            {item.description}
                                        </p>
                                    )}
                                    <div className="flex gap-3 text-sm">
                                        {item.price && (
                                            <span className="text-base-content/60">
                                                {item.price}
                                            </span>
                                        )}
                                        {item.link && (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="link link-primary"
                                            >
                                                {t("link")}
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="btn btn-ghost btn-xs"
                                    >
                                        {tCommon("edit")}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="btn btn-ghost btn-xs text-error"
                                    >
                                        {tCommon("delete")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
