import { routing } from "@/routing";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Montserrat, Quicksand } from "next/font/google";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
    style: ["italic", "normal"],
});

const quicksand = Quicksand({
    variable: "--font-quicksand",
    subsets: ["latin"],
    display: "swap",
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo.home" });

    return {
        title: t("title"),
        description: t("description"),
        keywords: t("keywords"),
        authors: [{ name: "Secret Santa App" }],
        creator: "Secret Santa",
        publisher: "Secret Santa",
        metadataBase: new URL(
            process.env.NEXTAUTH_URL || "http://localhost:3000",
        ),
        icons: {
            icon: [{ url: "/favicon.ico" }],
            shortcut: "/favicon.ico",
        },
        alternates: {
            canonical: `/${locale}`,
            languages: {
                en: "/en",
                es: "/es",
            },
        },
        openGraph: {
            type: "website",
            locale: locale === "es" ? "es_ES" : "en_US",
            alternateLocale: locale === "es" ? "en_US" : "es_ES",
            siteName: "Secret Santa",
            title: t("title"),
            description: t("description"),
            images: [
                {
                    url: "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: t("title"),
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: t("title"),
            description: t("description"),
            images: ["/og-image.png"],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as Locale)) {
        notFound();
    }

    const messages = await getMessages({ locale });

    return (
        <html
            lang={locale}
            data-theme="christmas"
            className={[montserrat.variable, quicksand.variable].join(" ")}
        >
            <body className="font-sans antialiased bg-base-200 min-h-screen">
                <Providers messages={messages} locale={locale}>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
