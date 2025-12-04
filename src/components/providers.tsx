"use client";

import { SessionProvider } from "next-auth/react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";

interface ProvidersProps {
    children: React.ReactNode;
    messages: AbstractIntlMessages;
    locale: string;
}

export function Providers({ children, messages, locale }: ProvidersProps) {
    return (
        <SessionProvider>
            <NextIntlClientProvider messages={messages} locale={locale}>
                {children}
                <Toaster position="top-right" richColors />
            </NextIntlClientProvider>
        </SessionProvider>
    );
}
