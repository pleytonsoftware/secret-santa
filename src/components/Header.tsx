"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const { data: session } = useSession();
  const t = useTranslations();

  return (
    <header className="bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🎅</span>
            <span className="font-bold text-xl">{t("header.title")}</span>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />

            {session?.user && (
              <div className="flex items-center gap-3">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-white"
                  />
                )}
                <span className="hidden sm:block text-sm">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
                >
                  {t("auth.logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
