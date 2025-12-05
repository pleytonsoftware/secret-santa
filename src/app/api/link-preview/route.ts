import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const HOUR_IN_SECONDS = 3600;
const FETCH_TIMEOUT_MS = 7000; // 7 seconds

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
        const validUrl = new URL(url);

        // Setup AbortController for timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        // Fetch the page with timeout
        const response = await fetch(validUrl.toString(), {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (compatible; SecretSantaBot/1.0; +https://secretsanta.app)",
            },
            next: {
                revalidate:
                    process.env.NODE_ENV === "development"
                        ? 1
                        : HOUR_IN_SECONDS * 24,
            },
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error("Failed to fetch URL");
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const metadata = {
            title:
                $('meta[property="og:title"]').attr("content") ||
                $("title").text() ||
                validUrl.hostname,
            description:
                $('meta[property="og:description"]').attr("content") ||
                $('meta[name="description"]').attr("content") ||
                null,
            image:
                $('meta[property="og:image"]').attr("content") ||
                $('meta[property="og:image:url"]').attr("content") ||
                $('meta[name="twitter:image"]').attr("content") ||
                null,
            url: validUrl.toString(),
            siteName:
                $('meta[property="og:site_name"]').attr("content") ||
                validUrl.hostname,
        };

        if (metadata.image && !metadata.image.startsWith("http")) {
            metadata.image = new URL(
                metadata.image,
                validUrl.origin,
            ).toString();
        }

        return NextResponse.json(metadata);
    } catch (error) {
        console.error("Error fetching link preview:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch link preview",
                url: url,
                title: new URL(url).hostname,
                description: null,
                image: null,
                siteName: new URL(url).hostname,
            },
            { status: 200 },
        );
    }
}
