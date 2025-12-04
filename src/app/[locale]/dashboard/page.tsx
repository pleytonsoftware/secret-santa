import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { redirect as nextIntlRedirect } from "@/routing";
import { DashboardClient } from "./dashboard-client";
import { getTranslations } from "next-intl/server";

interface DashboardPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({
    params,
}: DashboardPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo.home" });

    return {
        title: t("title"),
        description: t("description"),
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
    const { locale } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        nextIntlRedirect({ href: "/", locale });
    }

    return <DashboardClient locale={locale} />;
}
