import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { DashboardClient } from "./dashboard-client";

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const locale = cookieStore.get("locale")?.value || "en";
    const messages = (await import(`@/messages/${locale}.json`)).default;
    const seo = messages.seo.home;

    return {
        title: seo.title,
        description: seo.description,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    const cookieStore = await cookies();
    const locale = cookieStore.get("locale")?.value || "en";

    return <DashboardClient locale={locale} />;
}
