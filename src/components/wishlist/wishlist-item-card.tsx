"use client";

import { useTranslations } from "next-intl";

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

interface WishlistItemCardProps {
    item: WishlistItem;
    onEdit?: (item: WishlistItem) => void;
    onDelete?: (id: string) => void;
    readOnly?: boolean;
}

export function WishlistItemCard({
    item,
    onEdit,
    onDelete,
    readOnly = false,
}: WishlistItemCardProps) {
    const t = useTranslations("wishlist");
    const tCommon = useTranslations("common");

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
        <div className="card bg-base-200 p-3 hover:bg-base-300 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold wrap-break-word">
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
                        <p className="text-sm text-base-content/70 wrap-break-word">
                            {item.description}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-2 text-sm">
                        {item.price && (
                            <span className="text-base-content/60">
                                {item.price}
                            </span>
                        )}
                        {item.links && item.links.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {item.links.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link link-primary text-xs break-all"
                                        title={link.url}
                                    >
                                        {link.storeName || t("link")}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {!readOnly && onEdit && onDelete && (
                    <div className="flex gap-1 mt-2 sm:mt-0">
                        <button
                            onClick={() => onEdit(item)}
                            className="btn btn-outline btn-xs"
                        >
                            {tCommon("edit")}
                        </button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="btn btn-outline btn-xs text-error"
                        >
                            {tCommon("delete")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
