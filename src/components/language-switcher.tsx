"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

const locales = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

interface LanguageSwitcherProps {
  currentLocale: string;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = async (locale: string) => {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });

    startTransition(() => {
      router.refresh();
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
