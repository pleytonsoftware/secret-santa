import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> },
) {
    try {
        const { token } = await params;

        const assignment = await prisma.assignment.findUnique({
            where: { viewToken: token },
            include: {
                giver: {
                    include: {
                        wishlistItems: {
                            orderBy: [
                                { priority: "desc" },
                                { createdAt: "desc" },
                            ],
                        },
                    },
                },
                receiver: {
                    include: {
                        wishlistItems: {
                            orderBy: [
                                { priority: "desc" },
                                { createdAt: "desc" },
                            ],
                        },
                    },
                },
                group: true,
            },
        });

        if (!assignment) {
            return NextResponse.json(
                { error: "Assignment not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            giverName: assignment.giver.name,
            giverId: assignment.giver.id,
            receiverName: assignment.receiver.name,
            receiverId: assignment.receiver.id,
            groupName: assignment.group.name,
            groupDescription: assignment.group.description,
            spendingLimit: assignment.group.spendingLimit,
            theme: assignment.group.theme,
            exchangeDate: assignment.group.exchangeDate,
            location: assignment.group.location,
            additionalRules: assignment.group.additionalRules,
            giverWishlist: assignment.giver.wishlistItems,
            receiverWishlist: assignment.receiver.wishlistItems,
        });
    } catch (error) {
        console.error("Error fetching assignment:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
