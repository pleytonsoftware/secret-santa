import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/logo";
import { Snowfall } from "@/components/snowfall";
import TreeIcon from "@/icons/tree.svg";
import GiftIcon from "@/icons/gift.svg";
import { Icon } from "@/components/icon";
import Link from "next/link";

export default async function NotFound() {
    const t = await getTranslations();

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden snow-bg">
            <Snowfall />

            {/* Decorative Background */}
            <div className="absolute inset-0 festive-bg pointer-events-none" />

            {/* Decorative elements */}
            <div className="absolute top-8 left-8 text-4xl opacity-20 animate-float hidden md:block">
                <Icon Render={TreeIcon} size="lg" />
            </div>
            <div className="absolute bottom-16 right-8 text-4xl opacity-20 animate-float-delayed hidden md:block">
                <Icon Render={GiftIcon} size="lg" />
            </div>

            <div className="flex-1 flex items-center justify-center px-4 py-12 z-10">
                <div className="text-center max-w-2xl mx-auto">
                    {/* Sad Santa */}
                    <div className="mb-8 animate-bounce-subtle">
                        <Logo width={150} height={150} />
                    </div>

                    {/* 404 Number */}
                    <h1 className="text-9xl font-extrabold mb-4 gradient-text drop-shadow-lg">
                        404
                    </h1>

                    {/* Title */}
                    <h2 className="text-4xl font-bold mb-4 text-base-content">
                        {t("notFound.title")}
                    </h2>

                    {/* Description */}
                    <p className="text-xl text-base-content/70 mb-8 max-w-md mx-auto">
                        {t("notFound.description")}
                    </p>

                    {/* Suggestions */}
                    <div className="bg-base-200 rounded-2xl p-6 mb-8 max-w-md mx-auto">
                        <p className="text-sm text-base-content/60 mb-4">
                            {t("notFound.suggestions")}
                        </p>
                        <ul className="text-left text-base-content/80 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">🎁</span>
                                <span>{t("notFound.checkUrl")}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">🎄</span>
                                <span>{t("notFound.goHome")}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">🎅</span>
                                <span>{t("notFound.contactSupport")}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/" className="btn btn-primary btn-lg gap-2">
                            🏠 {t("notFound.backHome")}
                        </Link>
                        <Link
                            href="/dashboard"
                            className="btn btn-outline btn-lg gap-2"
                        >
                            📋 {t("notFound.viewGroups")}
                        </Link>
                    </div>

                    {/* Footer Message */}
                    <p className="mt-12 text-base-content/50 text-sm">
                        {t("notFound.santaMessage")}
                    </p>
                </div>
            </div>
        </div>
    );
}
