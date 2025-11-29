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
    <div className="flex gap-1">
      {locales.map((locale) => (
        <button
          key={locale.code}
          onClick={() => handleLocaleChange(locale.code)}
          disabled={isPending}
          className={`px-2 py-1 rounded text-sm transition-all ${
            currentLocale === locale.code
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
          title={locale.label}
        >
          {locale.flag}
        </button>
      ))}
    </div>
  );
}
