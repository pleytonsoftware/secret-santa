import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const COOKIE_NAME = "NEXT_LOCALE";

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale as Locale)) {
        locale = routing.defaultLocale;
    }

    return {
        locale: locale as string,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});
