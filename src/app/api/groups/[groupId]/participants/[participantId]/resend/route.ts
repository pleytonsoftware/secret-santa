import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendSecretSantaEmail } from "@/lib/email";
import { cookies } from "next/headers";
import { locales, type Locale, defaultLocale, COOKIE_NAME } from "@/i18n";

// Environment variable to bypass rate limit (for testing)
const BYPASS_RESEND_LIMIT = process.env.BYPASS_RESEND_LIMIT === "true";

interface RouteParams {
    params: Promise<{ groupId: string; participantId: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { groupId, participantId } = await params;

        // Get the group
        const group = await prisma.secretSantaGroup.findUnique({
            where: { id: groupId },
        });

        if (!group) {
            return NextResponse.json(
                { error: "Group not found" },
                { status: 404 },
            );
        }

        // Check ownership
        if (group.ownerId !== session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 },
            );
        }

        // Check if group is finalized
        if (!group.isFinalized) {
            return NextResponse.json(
                { error: "Group is not finalized yet" },
                { status: 400 },
            );
        }

        // Get the assignment for this participant (as giver)
        const assignment = await prisma.assignment.findFirst({
            where: {
                groupId,
                giverId: participantId,
            },
            include: {
                giver: true,
                receiver: true,
            },
        });

        if (!assignment) {
            return NextResponse.json(
                { error: "Assignment not found for this participant" },
                { status: 404 },
            );
        }

        // Check rate limit (24 hours) for individual participant unless bypassed
        if (!BYPASS_RESEND_LIMIT && assignment.lastEmailSentAt) {
            const hoursSinceLastSend =
                (new Date().getTime() -
                    new Date(assignment.lastEmailSentAt).getTime()) /
                (1000 * 60 * 60);

            if (hoursSinceLastSend < 24) {
                const hoursRemaining = Math.ceil(24 - hoursSinceLastSend);
                return NextResponse.json(
                    {
                        error: `Please wait ${hoursRemaining} hour(s) before resending email to this participant`,
                    },
                    { status: 429 },
                );
            }
        }

        // Get locale from cookies
        const cookieStore = await cookies();
        const localeCookie = cookieStore.get(COOKIE_NAME)?.value;
        const locale: Locale = locales.includes(localeCookie as Locale)
            ? (localeCookie as Locale)
            : defaultLocale;

        // Send email to the participant
        const result = await sendSecretSantaEmail({
            giverName: assignment.giver.name,
            giverEmail: assignment.giver.email,
            receiverName: assignment.receiver.name,
            groupName: group.name,
            locale,
            viewToken: assignment.viewToken || undefined,
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || "Failed to send email" },
                { status: 500 },
            );
        }

        // Update lastEmailSentAt for this assignment
        await prisma.assignment.update({
            where: { id: assignment.id },
            data: { lastEmailSentAt: new Date() },
        });

        return NextResponse.json({
            success: true,
            participant: assignment.giver.name,
        });
    } catch (error) {
        console.error("Error resending email to participant:", error);
        return NextResponse.json(
            { error: "Failed to resend email" },
            { status: 500 },
        );
    }
}
