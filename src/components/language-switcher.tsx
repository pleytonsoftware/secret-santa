"use client";

import type { Locale } from "@/i18n";
import { usePathname, useRouter } from "@/routing";
import { useTransition } from "react";

const locales = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
] satisfies { code: Locale; label: string; flag: string }[];

interface LanguageSwitcherProps {
    currentLocale: string;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleLocaleChange = (locale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale });
        });
    };

    return (
        <div className="join">
            {locales.map((locale) => (
                <button
                    key={locale.code}
                    onClick={() => handleLocaleChange(locale.code)}
                    disabled={isPending}
                    className={`btn btn-sm join-item ${
                        currentLocale === locale.code
                            ? "btn-primary"
                            : "btn-ghost bg-base-100"
                    } ${isPending ? "loading" : ""}`}
                    title={locale.label}
                >
                    {locale.flag}
                </button>
            ))}
        </div>
    );
}
