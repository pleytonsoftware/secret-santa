import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendSecretSantaEmail } from "@/lib/email";
import { cookies } from "next/headers";
import { locales, type Locale, defaultLocale } from "@/i18n";

// Environment variable to bypass rate limit (for testing)
const BYPASS_RESEND_LIMIT = process.env.BYPASS_RESEND_LIMIT === "true";

interface RouteParams {
  params: Promise<{ groupId: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = await params;

    // Get the group with assignments
    const group = await prisma.secretSantaGroup.findUnique({
      where: { id: groupId },
      include: {
        assignments: {
          include: {
            giver: true,
            receiver: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check ownership
    if (group.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if group is finalized
    if (!group.isFinalized) {
      return NextResponse.json(
        { error: "Group is not finalized yet" },
        { status: 400 }
      );
    }

    // Check rate limit (24 hours) unless bypassed
    if (!BYPASS_RESEND_LIMIT && group.lastEmailSentAt) {
      const hoursSinceLastSend =
        (new Date().getTime() - new Date(group.lastEmailSentAt).getTime()) /
        (1000 * 60 * 60);

      if (hoursSinceLastSend < 24) {
        const hoursRemaining = Math.ceil(24 - hoursSinceLastSend);
        return NextResponse.json(
          {
            error: `Please wait ${hoursRemaining} hour(s) before resending emails`,
          },
          { status: 429 }
        );
      }
    }

    // Get locale from cookies
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("locale")?.value;
    const locale: Locale = locales.includes(localeCookie as Locale) 
      ? (localeCookie as Locale) 
      : defaultLocale;

    // Send emails to all participants
    const emailErrors: { participant: string; error: string }[] = [];

    for (const assignment of group.assignments) {
      const result = await sendSecretSantaEmail({
        giverName: assignment.giver.name,
        giverEmail: assignment.giver.email,
        receiverName: assignment.receiver.name,
        groupName: group.name,
        locale,
      });

      if (!result.success) {
        emailErrors.push({
          participant: assignment.giver.name,
          error: result.error || "Unknown error",
        });
      }
    }

    // Update lastEmailSentAt
    await prisma.secretSantaGroup.update({
      where: { id: groupId },
      data: { lastEmailSentAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      emailsSent: group.assignments.length - emailErrors.length,
      emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
    });
  } catch (error) {
    console.error("Error resending emails:", error);
    return NextResponse.json(
      { error: "Failed to resend emails" },
      { status: 500 }
    );
  }
}
