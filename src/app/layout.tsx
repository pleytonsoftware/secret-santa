import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secret Santa",
  description: "Organize Secret Santa gift exchanges with ease",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale")?.value;
  const locale = ["en", "es"].includes(localeCookie || "") ? localeCookie! : "en";
  
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} data-theme="christmas">
      <body className="font-sans antialiased bg-base-200 min-h-screen">
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
