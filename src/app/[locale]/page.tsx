import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginButton } from "@/components/login-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Snowfall } from "@/components/snowfall";
import { StructuredData } from "@/components/structured-data";
import TreeIcon from "@/icons/tree.svg";
import SparkleIcon from "@/icons/sparkles.svg";
import GiftIcon from "@/icons/gift.svg";
import DeerIcon from "@/icons/deer.svg";
import RibbonIcon from "@/icons/ribbon.svg";
import CookieIcon from "@/icons/cookie.svg";
import GlassMilkIcon from "@/icons/glass-of-milk.svg";
import BellIcon from "@/icons/bell.svg";
import { Icon } from "@/components/icon";
import { getTranslations } from "next-intl/server";
import { redirect as nextIntlRedirect } from "@/routing";
import { SuperSanta64Logo } from "@/components/super-santa64-logo";

export default async function Home({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const session = await getServerSession(authOptions);

    if (session) {
        nextIntlRedirect({ href: "/dashboard", locale });
    }

    const t = await getTranslations();

    return (
        <>
            <StructuredData locale={locale} />
            <div className="min-h-screen flex flex-col relative overflow-hidden snow-bg">
                {/* Snowfall Effect */}
                <Snowfall />

                {/* Decorative Background Elements */}
                <div className="absolute inset-0 festive-bg pointer-events-none" />

                {/* Top Decorative Border */}
                <div className="absolute top-0 left-0 right-0 h-2 shimmer-border" />

                {/* Corner Decorations */}
                <div className="absolute top-8 left-8 text-4xl opacity-30 animate-float hidden md:block">
                    <Icon Render={TreeIcon} size="lg" />
                </div>
                <div className="absolute top-16 right-12 text-3xl opacity-30 animate-float-delayed hidden md:block">
                    <Icon Render={SparkleIcon} size="lg" />
                </div>
                <div className="absolute bottom-20 left-12 text-3xl opacity-30 animate-float-delayed hidden md:block">
                    <Icon Render={GiftIcon} size="lg" />
                </div>
                <div className="absolute bottom-16 right-8 text-4xl opacity-30 animate-float hidden md:block">
                    <Icon Render={DeerIcon} size="lg" />
                </div>

                {/* Language Switcher */}
                <div className="absolute top-6 right-6 z-20">
                    <LanguageSwitcher currentLocale={locale} />
                </div>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center px-4 py-12 z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        {/* Animated Santa */}
                        <div className="relative mb-8">
                            <div className="inline-block">
                                <SuperSanta64Logo />
                            </div>
                            {/* Sparkle effects around Santa */}
                            <span className="absolute top-4 left-1/4 text-2xl animate-sparkle">
                                <Icon Render={SparkleIcon} size="xs" />
                            </span>
                            <span
                                className="absolute top-8 right-1/4 text-xl animate-sparkle"
                                style={{ animationDelay: "0.3s" }}
                            >
                                <Icon Render={SparkleIcon} size="xs" />
                            </span>
                            <span
                                className="absolute bottom-12 left-1/3 text-lg animate-sparkle"
                                style={{ animationDelay: "0.6s" }}
                            >
                                <Icon Render={SparkleIcon} size="xs" />
                            </span>
                        </div>

                        {/* Title with Gradient */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl pb-2 font-extrabold mb-6 gradient-text drop-shadow-lg">
                            {t("header.title")}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl sm:text-2xl text-base-content/80 mb-10 max-w-lg mx-auto leading-relaxed">
                            {t("auth.signInPrompt")}
                        </p>

                        {/* Login Button with Glow */}
                        <div className="animate-pulse-glow rounded-2xl p-1 inline-block bg-linear-to-tl from-primary via-secondary to-accent">
                            <div className="bg-base-100 rounded-xl p-1">
                                <LoginButton />
                            </div>
                        </div>

                        {/* Feature Icons */}
                        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
                            <div className="flex flex-col items-center gap-3 group">
                                <div className="text-5xl sm:text-6xl animate-float group-hover:scale-125 transition-transform duration-300">
                                    <Icon Render={GiftIcon} size="lg" />
                                </div>
                                <span className="text-sm text-base-content/60 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    {t("home.gifts")}
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-3 group">
                                <div className="text-5xl sm:text-6xl animate-float-delayed group-hover:scale-125 transition-transform duration-300">
                                    <Icon Render={TreeIcon} size="lg" />
                                </div>
                                <span className="text-sm text-base-content/60 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    {t("home.holiday")}
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-3 group">
                                <div
                                    className="text-5xl sm:text-6xl animate-float group-hover:scale-125 transition-transform duration-300"
                                    style={{ animationDelay: "0.25s" }}
                                >
                                    <Icon Render={SparkleIcon} size="lg" />
                                </div>
                                <span className="text-sm text-base-content/60 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    {t("home.magic")}
                                </span>
                            </div>
                        </div>

                        {/* Additional decorative elements */}
                        <div className="mt-12 flex justify-center gap-4 text-3xl opacity-50">
                            <span
                                className="animate-bounce-subtle"
                                style={{ animationDelay: "0s" }}
                            >
                                <Icon Render={SparkleIcon} size="md" />
                            </span>
                            <span
                                className="animate-bounce-subtle"
                                style={{ animationDelay: "0.2s" }}
                            >
                                <Icon Render={RibbonIcon} size="md" />
                            </span>
                            <span
                                className="animate-bounce-subtle"
                                style={{ animationDelay: "0.4s" }}
                            >
                                <Icon Render={CookieIcon} size="md" />
                            </span>
                            <span
                                className="animate-bounce-subtle"
                                style={{ animationDelay: "0.6s" }}
                            >
                                <Icon Render={GlassMilkIcon} size="md" />
                            </span>
                            <span
                                className="animate-bounce-subtle"
                                style={{ animationDelay: "0.8s" }}
                            >
                                <Icon Render={BellIcon} size="md" />
                            </span>
                        </div>
                    </div>
                </main>

                {/* Footer with decorative border */}
                <footer className="relative py-6 text-center z-10">
                    <div className="absolute bottom-0 left-0 right-0 h-2 shimmer-border" />
                    <div className="flex items-center justify-center gap-2 text-base-content/60 text-sm">
                        <span>🎄</span>
                        <span>
                            © {new Date().getFullYear()} {t("appNameBy")}{" "}
                            <a
                                href="https://pleyt.dev"
                                className="btn btn-link p-0 border-0 h-auto"
                            >
                                @pleyt.dev
                            </a>
                        </span>
                        <span>🎄</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
