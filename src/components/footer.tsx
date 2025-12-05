"use client";

import { useTranslations } from "next-intl";

type FooterProps = {
    withShimmer?: boolean;
};

export const Footer = ({ withShimmer = false }: FooterProps) => {
    const t = useTranslations();

    return (
        <footer className="relative py-6 text-center z-10">
            {withShimmer && (
                <div className="absolute bottom-0 left-0 right-0 h-2 shimmer-border" />
            )}
            <div className="flex items-center justify-center gap-2 text-base-content/60 text-sm">
                <span>🎄</span>
                <span>
                    © {new Date().getFullYear()} {t("appNameBy")}{" "}
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://pleyt.dev"
                        className="btn btn-link p-0 border-0 h-auto"
                    >
                        @pleyt.dev
                    </a>
                </span>
                <span>🎄</span>
            </div>
        </footer>
    );
};
