"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "./icon";
import { WishlistForm } from "./wishlist/wishlist-form";
import { WishlistItemCard } from "./wishlist/wishlist-item-card";
import GiftIcon from "@/icons/gift.svg";

interface WishlistLink {
    id: string;
    url: string;
    storeName: string | null;
}

interface WishlistItem {
    id: string;
    name: string;
    description: string | null;
    links: WishlistLink[];
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
    const tToast = useTranslations("toast");
    const tCommon = useTranslations("common");
    const [items, setItems] = useState<WishlistItem[]>(initialItems);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        links: [] as { url: string; storeName?: string }[],
        price: "",
        priority: 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            links: [],
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
            links: [],
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
            links: item.links.map((link) => ({
                url: link.url,
                storeName: link.storeName || undefined,
            })),
            price: item.price || "",
            priority: item.priority,
        });
        setEditingId(item.id);
        setIsAdding(false);
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
                toast.success(tToast("itemUpdated"));
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
                toast.success(tToast("itemAdded"));
            }

            resetForm();
            onUpdate();
        } catch {
            toast.error(tToast("errorGeneric"));
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
            toast.success(tToast("itemDeleted"));
            onUpdate();
        } catch {
            toast.error(tToast("errorGeneric"));
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
                <WishlistForm
                    formData={formData}
                    isSubmitting={isSubmitting}
                    isEditing={!!editingId}
                    onChange={setFormData}
                    onSubmit={handleSubmit}
                    onCancel={resetForm}
                />
            )}

            {items.length === 0 ? (
                <p className="text-center text-base-content/60 py-8">
                    {t("noItems")}
                </p>
            ) : (
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <>
                            <hr className="border-base-content/10" />
                            <WishlistItemCard
                                key={item.id}
                                item={item}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </>
                    ))}
                </div>
            )}
        </div>
    );
}
