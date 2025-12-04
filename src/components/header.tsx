"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";

interface HeaderProps {
    locale: string;
}

export function Header({ locale }: HeaderProps) {
    const { data: session } = useSession();
    const t = useTranslations();

    return (
        <header className="navbar bg-linear-to-tl from-primary to-secondary text-primary-content shadow-lg px-4">
            <div className="navbar-start flex-1 w-auto">
                <Link
                    href="/dashboard"
                    className="flex items-center text-xl gap-2 px-2"
                >
                    <span className="text-2xl">
                        <Logo />
                    </span>
                    <span className="font-bold font-title inline">
                        {t("header.title")}
                    </span>
                </Link>
            </div>

            <div className="navbar-end w-auto">
                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-3">
                    <LanguageSwitcher currentLocale={locale} />

                    {session?.user && (
                        <>
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
                            <span className="text-sm max-w-[150px] truncate">
                                {session.user.name}
                            </span>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="btn btn-sm btn-ghost bg-white/20 hover:bg-white/30"
                            >
                                {t("auth.logout")}
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="dropdown dropdown-end md:hidden">
                    <div tabIndex={0} role="button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow-xl bg-base-100 rounded-box w-64"
                    >
                        {session?.user && (
                            <>
                                <li className="menu-title">
                                    <div className="flex items-center gap-2 px-2 py-2">
                                        {session.user.image && (
                                            <div className="avatar">
                                                <div className="w-8 rounded-full">
                                                    <Image
                                                        src={session.user.image}
                                                        alt={
                                                            session.user.name ||
                                                            "User"
                                                        }
                                                        width={32}
                                                        height={32}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <span className="text-base-content font-semibold">
                                            {session.user.name}
                                        </span>
                                    </div>
                                </li>
                                <div className="divider my-0"></div>
                            </>
                        )}

                        <li>
                            <div className="flex items-center justify-between px-2">
                                <span className="text-base-content">
                                    {t("header.language")}
                                </span>
                                <LanguageSwitcher currentLocale={locale} />
                            </div>
                        </li>

                        {session?.user && (
                            <>
                                <div className="divider my-0"></div>
                                <li>
                                    <button
                                        onClick={() =>
                                            signOut({ callbackUrl: "/" })
                                        }
                                        className="text-error"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        {t("auth.logout")}
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
}
