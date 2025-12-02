"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const { data: session } = useSession();
  const t = useTranslations();

  return (
    <header className="navbar bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg">
      <div className="navbar-start">
        <Link href="/dashboard" className="btn btn-ghost text-xl gap-2">
          <span className="text-2xl">🎅</span>
          <span className="font-bold">{t("header.title")}</span>
        </Link>
      </div>

      <div className="navbar-end gap-4">
        <LanguageSwitcher currentLocale={locale} />

        {session?.user && (
          <div className="flex items-center gap-3">
            {session.user.image && (
              <div className="avatar">
                <div className="w-8 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-1">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                  />
                </div>
              </div>
            )}
            <span className="hidden sm:block text-sm">
              {session.user.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="btn btn-sm btn-ghost bg-white/20 hover:bg-white/30"
            >
              {t("auth.logout")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
