import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
    turbopack: {
        rules: {
            "*.svg": {
                as: "*.js",
                loaders: ["@svgr/webpack"],
            },
        },
    },
};

export default withNextIntl(nextConfig);
