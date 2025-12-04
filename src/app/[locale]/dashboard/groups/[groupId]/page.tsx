import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { redirect as nextIntlRedirect } from "@/routing";
import { GroupDetailClient } from "./group-detail-client";
import { getTranslations } from "next-intl/server";

interface GroupDetailPageProps {
    params: Promise<{ locale: string; groupId: string }>;
}

export async function generateMetadata({
    params,
}: GroupDetailPageProps): Promise<Metadata> {
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

export default async function GroupDetailPage({
    params,
}: GroupDetailPageProps) {
    const { locale, groupId } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        nextIntlRedirect({ href: "/", locale });
    }

    return <GroupDetailClient groupId={groupId} locale={locale} />;
}
