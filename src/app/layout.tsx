import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Providers } from "@/components/providers";
import { type Locale, locales } from "@/i18n";
import { Montserrat, Quicksand } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
    title: "Secret Santa",
    description: "Organize Secret Santa gift exchanges with ease",
};

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
