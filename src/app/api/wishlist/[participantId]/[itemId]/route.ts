import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ participantId: string; itemId: string }>;
}

// PATCH update a wishlist item
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const { participantId, itemId } = await params;
        const body = await request.json();

        // Verify the item belongs to this participant
        const existingItem = await prisma.wishlistItem.findUnique({
            where: { id: itemId },
        });

        if (!existingItem || existingItem.participantId !== participantId) {
            return NextResponse.json(
                { error: "Wishlist item not found" },
                { status: 404 },
            );
        }

        // Validate links array if provided
        if (
            body.links &&
            (!Array.isArray(body.links) || body.links.length > 5)
        ) {
            return NextResponse.json(
                { error: "Links must be an array with maximum 5 items" },
                { status: 400 },
            );
        }

        // If links are provided, delete existing links and create new ones
        const linksUpdate =
            body.links !== undefined
                ? {
                      deleteMany: {},
                      create: body.links.map(
                          (link: { url: string; storeName?: string }) => ({
                              url: link.url.trim(),
                              storeName: link.storeName?.trim() || null,
                          }),
                      ),
                  }
                : undefined;

        const updatedItem = await prisma.wishlistItem.update({
            where: { id: itemId },
            data: {
                name: body.name?.trim() || existingItem.name,
                description:
                    body.description !== undefined
                        ? body.description?.trim() || null
                        : existingItem.description,
                price:
                    body.price !== undefined
                        ? body.price?.trim() || null
                        : existingItem.price,
                priority:
                    body.priority !== undefined
                        ? body.priority
                        : existingItem.priority,
                ...(linksUpdate && { links: linksUpdate }),
            },
            include: {
                links: true,
            },
        });

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error("Error updating wishlist item:", error);
        return NextResponse.json(
            { error: "Failed to update wishlist item" },
            { status: 500 },
        );
    }
}

// DELETE a wishlist item
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { participantId, itemId } = await params;

        // Verify the item belongs to this participant
        const existingItem = await prisma.wishlistItem.findUnique({
            where: { id: itemId },
        });

        if (!existingItem || existingItem.participantId !== participantId) {
            return NextResponse.json(
                { error: "Wishlist item not found" },
                { status: 404 },
            );
        }

        await prisma.wishlistItem.delete({
            where: { id: itemId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting wishlist item:", error);
        return NextResponse.json(
            { error: "Failed to delete wishlist item" },
            { status: 500 },
        );
    }
}
