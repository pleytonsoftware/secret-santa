import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ participantId: string }>;
}

// GET wishlist items for a participant
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { participantId } = await params;

        const items = await prisma.wishlistItem.findMany({
            where: { participantId },
            include: {
                links: {
                    orderBy: { createdAt: "asc" },
                },
            },
            orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return NextResponse.json(
            { error: "Failed to fetch wishlist" },
            { status: 500 },
        );
    }
}

// POST create a new wishlist item
export async function POST(request: Request, { params }: RouteParams) {
    try {
        const { participantId } = await params;
        const body = await request.json();

        const { name, description, links, price, priority } = body;

        if (!name || name.trim() === "") {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 },
            );
        }

        // Validate links array
        if (links && (!Array.isArray(links) || links.length > 5)) {
            return NextResponse.json(
                { error: "Links must be an array with maximum 5 items" },
                { status: 400 },
            );
        }

        // Verify participant exists
        const participant = await prisma.participant.findUnique({
            where: { id: participantId },
        });

        if (!participant) {
            return NextResponse.json(
                { error: "Participant not found" },
                { status: 404 },
            );
        }

        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                participantId,
                name: name.trim(),
                description: description?.trim() || null,
                price: price?.trim() || null,
                priority: priority || 0,
                links: {
                    create: (links || []).map(
                        (link: { url: string; storeName?: string }) => ({
                            url: link.url.trim(),
                            storeName: link.storeName?.trim() || null,
                        }),
                    ),
                },
            },
            include: {
                links: true,
            },
        });

        return NextResponse.json(wishlistItem, { status: 201 });
    } catch (error) {
        console.error("Error creating wishlist item:", error);
        return NextResponse.json(
            { error: "Failed to create wishlist item" },
            { status: 500 },
        );
    }
}
