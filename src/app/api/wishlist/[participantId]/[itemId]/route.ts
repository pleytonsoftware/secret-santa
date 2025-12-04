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

        const updatedItem = await prisma.wishlistItem.update({
            where: { id: itemId },
            data: {
                name: body.name?.trim() || existingItem.name,
                description:
                    body.description !== undefined
                        ? body.description?.trim() || null
                        : existingItem.description,
                link:
                    body.link !== undefined
                        ? body.link?.trim() || null
                        : existingItem.link,
                price:
                    body.price !== undefined
                        ? body.price?.trim() || null
                        : existingItem.price,
                priority:
                    body.priority !== undefined
                        ? body.priority
                        : existingItem.priority,
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
