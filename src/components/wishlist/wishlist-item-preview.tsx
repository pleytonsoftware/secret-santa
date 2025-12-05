"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Image from "next/image";

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

interface LinkPreviewData {
    title: string;
    description: string | null;
    image: string | null;
    url: string;
    siteName: string;
}

interface WishlistItemPreviewProps {
    item: WishlistItem;
}

export function WishlistItemPreview({ item }: WishlistItemPreviewProps) {
    const t = useTranslations("wishlist");
    const [linkPreviews, setLinkPreviews] = useState<
        Map<string, LinkPreviewData>
    >(new Map());
    const [loadingPreviews, setLoadingPreviews] = useState<Set<string>>(
        new Set(),
    );

    useEffect(() => {
        if (!item.links || item.links.length === 0) return;

        const loading = new Set<string>();

        item.links.forEach((link) => {
            loading.add(link.id);
            setLoadingPreviews(new Set(loading));

            fetch(`/api/link-preview?url=${encodeURIComponent(link.url)}`)
                .then((res) => res.json())
                .then((data) => {
                    setLinkPreviews((prev) => {
                        const updated = new Map(prev);
                        updated.set(link.id, data);
                        return updated;
                    });
                    setLoadingPreviews((prev) => {
                        const updated = new Set(prev);
                        updated.delete(link.id);
                        return updated;
                    });
                })
                .catch((error) => {
                    console.error("Error fetching link preview:", error);
                    try {
                        setLinkPreviews((prev) => {
                            const updated = new Map(prev);
                            updated.set(link.id, {
                                url: link.url,
                                title: new URL(link.url).hostname,
                                description: null,
                                image: null,
                                siteName:
                                    link.storeName ||
                                    new URL(link.url).hostname,
                            });
                            return updated;
                        });
                    } catch {
                        // Invalid URL
                    }
                    setLoadingPreviews((prev) => {
                        const updated = new Set(prev);
                        updated.delete(link.id);
                        return updated;
                    });
                });
        });

        return () => {
            // Cleanup if needed
        };
    }, [item.links]);

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
        <div className="bg-base-100 p-4 rounded-lg space-y-3">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        {item.priority > 0 && (
                            <span
                                className={`badge badge-sm ${getPriorityColor(
                                    item.priority,
                                )}`}
                            >
                                {item.priority === 2
                                    ? t("priorityMustHave")
                                    : t("priorityPreferred")}
                            </span>
                        )}
                    </div>
                    {item.description && (
                        <p className="text-sm text-base-content/70 mb-2">
                            {item.description}
                        </p>
                    )}
                    <div className="flex gap-3 text-sm">
                        {item.price && (
                            <span className="text-base-content/60">
                                {item.price}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Link Preview Cards */}
            {item.links && item.links.length > 0 && (
                <div className="space-y-2">
                    {item.links.map((link) => {
                        const preview = linkPreviews.get(link.id);
                        const isLoading = loadingPreviews.has(link.id);

                        return (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block border border-base-300 rounded-lg overflow-hidden hover:border-primary transition-colors hover:shadow-md"
                            >
                                {isLoading ? (
                                    <div className="flex flex-col sm:flex-row gap-3 h-auto sm:h-24">
                                        <div className="w-full sm:w-24 h-32 sm:h-24 bg-base-200 skeleton rounded-none shrink-0"></div>
                                        <div className="flex-1 p-3 bg-base-200/50 min-w-0 flex flex-col justify-center space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="skeleton h-3 w-20"></div>
                                            </div>
                                            <div className="skeleton h-4 w-3/4"></div>
                                            <div className="skeleton h-3 w-full"></div>
                                            <div className="skeleton h-3 w-2/3"></div>
                                        </div>
                                    </div>
                                ) : preview ? (
                                    <div className="flex flex-col sm:flex-row gap-3 min-h-32 sm:min-h-24">
                                        {preview.image && (
                                            <div className="w-full sm:w-24 h-32 sm:h-24 bg-base-200 relative shrink-0">
                                                <Image
                                                    src={preview.image}
                                                    alt={preview.title}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 p-3 bg-base-200/50 min-w-0 flex flex-col justify-center max-h-32 sm:max-h-24 overflow-hidden">
                                            <div className="flex items-center gap-2 text-xs text-base-content/60 mb-1">
                                                <svg
                                                    className="w-3 h-3 shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                                    />
                                                </svg>
                                                <span className="truncate">
                                                    {link.storeName ||
                                                        preview.siteName}
                                                </span>
                                            </div>
                                            <h5 className="font-semibold text-sm line-clamp-1 mb-1">
                                                {preview.title}
                                            </h5>
                                            {preview.description && (
                                                <p className="text-xs text-base-content/60 line-clamp-2">
                                                    {preview.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-base-200/50">
                                        <div className="text-xs text-base-content/60 mb-1">
                                            {link.storeName || t("link")}
                                        </div>
                                        <p className="text-xs text-primary truncate">
                                            {link.url}
                                        </p>
                                    </div>
                                )}
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
