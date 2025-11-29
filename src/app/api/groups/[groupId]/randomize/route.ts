import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateAssignments, validateAssignments } from "@/lib/secret-santa";
import { sendSecretSantaEmail } from "@/lib/email";
import { cookies } from "next/headers";

interface RouteParams {
  params: Promise<{ groupId: string }>;
}

// POST /api/groups/[groupId]/randomize - Generate assignments and send emails
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = await params;

    // Check if group exists and belongs to user
    const group = await prisma.secretSantaGroup.findFirst({
      where: {
        id: groupId,
        ownerId: session.user.id,
      },
      include: {
        participants: true,
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (group.isFinalized) {
      return NextResponse.json(
        { error: "Group is already finalized" },
        { status: 400 }
      );
    }

    if (group.participants.length < 2) {
      return NextResponse.json(
        { error: "At least 2 participants are required" },
        { status: 400 }
      );
    }

    // Generate assignments
    const assignmentData = generateAssignments(group.participants);

    // Validate assignments
    if (!validateAssignments(assignmentData, group.participants)) {
      return NextResponse.json(
        { error: "Failed to generate valid assignments" },
        { status: 500 }
      );
    }

    // Get locale from cookies
    const cookieStore = await cookies();
    const locale = cookieStore.get("locale")?.value || "en";

    // Create a map of participant IDs to names for email
    const participantMap = new Map(
      group.participants.map((p) => [p.id, { name: p.name, email: p.email }])
    );

    // Create assignments in database and send emails
    const createdAssignments = [];
    const emailErrors = [];

    for (const assignment of assignmentData) {
      // Create assignment in database
      const created = await prisma.assignment.create({
        data: {
          groupId: assignment.groupId,
          giverId: assignment.giverId,
          receiverId: assignment.receiverId,
          emailSent: false,
        },
      });

      const giver = participantMap.get(assignment.giverId)!;
      const receiver = participantMap.get(assignment.receiverId)!;

      // Send email
      const emailResult = await sendSecretSantaEmail({
        giverName: giver.name,
        giverEmail: giver.email,
        receiverName: receiver.name,
        groupName: group.name,
        locale,
      });

      if (emailResult.success) {
        // Update assignment to mark email as sent
        await prisma.assignment.update({
          where: { id: created.id },
          data: { emailSent: true },
        });
      } else {
        emailErrors.push({
          participant: giver.name,
          error: emailResult.error,
        });
      }

      createdAssignments.push(created);
    }

    // Mark group as finalized
    await prisma.secretSantaGroup.update({
      where: { id: groupId },
      data: { isFinalized: true },
    });

    return NextResponse.json({
      success: true,
      assignmentsCreated: createdAssignments.length,
      emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
    });
  } catch (error) {
    console.error("Error randomizing assignments:", error);
    return NextResponse.json(
      { error: "Failed to create assignments" },
      { status: 500 }
    );
  }
}
