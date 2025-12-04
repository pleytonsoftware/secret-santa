import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Providers } from "@/components/providers";
import { type Locale, locales } from "@/i18n";
import { Montserrat, Quicksand } from "next/font/google";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("locale")?.value;
    const locale = locales.includes((localeCookie as Locale) || "en")
        ? localeCookie!
        : "en";

    const messages = (await import(`@/messages/${locale}.json`)).default;
    const seo = messages.seo.home;

    return {
        title: {
            default: seo.title,
            template: "%s | Secret Santa",
        },
        description: seo.description,
        keywords: seo.keywords,
        authors: [{ name: "Secret Santa App" }],
        creator: "Secret Santa",
        publisher: "Secret Santa",
        metadataBase: new URL(
            process.env.NEXTAUTH_URL || "http://localhost:3000",
        ),
        // Add icons/logos here
        icons: {
            icon: [
                { url: "/favicon.ico" },
                // { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
                // { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
            ],
            // apple: [
            //     { url: "/apple-icon.png" },
            //     { url: "/apple-icon-180.png", sizes: "180x180", type: "image/png" },
            // ],
            shortcut: "/favicon.ico",
        },
        alternates: {
            languages: {
                en: "/",
                es: "/",
            },
        },
        openGraph: {
            type: "website",
            locale: locale === "es" ? "es_ES" : "en_US",
            alternateLocale: locale === "es" ? "en_US" : "es_ES",
            siteName: "Secret Santa",
            title: seo.title,
            description: seo.description,
            // Add OG image here
            // images: [
            //     {
            //         url: "/og-image.png", // 1200x630 recommended
            //         width: 1200,
            //         height: 630,
            //         alt: seo.title,
            //     },
            // ],
        },
        twitter: {
            card: "summary_large_image",
            title: seo.title,
            description: seo.description,
            // Add Twitter image here
            // images: ["/twitter-image.png"], // 1200x600 recommended
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
        verification: {
            // Add your verification codes here when ready
            // google: 'your-google-verification-code',
            // yandex: 'your-yandex-verification-code',
        },
    };
}

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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("locale")?.value;
    const locale = locales.includes((localeCookie as Locale) || "en")
        ? localeCookie!
        : "en";

    const messages = (await import(`@/messages/${locale}.json`)).default;

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
