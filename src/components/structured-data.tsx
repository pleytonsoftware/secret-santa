export function StructuredData({ locale }: { locale: string }) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: locale === "es" ? "Amigo Invisible" : "Secret Santa",
        description:
            locale === "es"
                ? "Organiza intercambios de Amigo Invisible con facilidad. Asignación automática, notificaciones por email y privacidad total."
                : "Organize Secret Santa gift exchanges with ease. Automated assignment, email notifications, and complete privacy.",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            locale === "es"
                ? "Asignación automática de Amigo Invisible"
                : "Automatic Secret Santa assignment",
            locale === "es"
                ? "Notificaciones por email"
                : "Email notifications",
            locale === "es" ? "Privacidad total" : "Complete privacy",
            locale === "es"
                ? "Gestión de múltiples grupos"
                : "Multiple group management",
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
