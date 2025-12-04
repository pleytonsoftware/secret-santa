import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ groupId: string; participantId: string }>;
}

// DELETE /api/groups/[groupId]/participants/[participantId] - Remove participant from group
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId, participantId } = await params;

    // Check if group exists and belongs to user
    const group = await prisma.secretSantaGroup.findFirst({
      where: {
        id: groupId,
        ownerId: session.user.id,
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (group.isFinalized) {
      return NextResponse.json(
        { error: "Cannot remove participants from a finalized group" },
        { status: 400 }
      );
    }

    // Check if participant exists in this group
    const participant = await prisma.participant.findFirst({
      where: {
        id: participantId,
        groupId,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    // Delete the participant (assignments will be deleted by cascade)
    await prisma.participant.delete({
      where: {
        id: participantId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing participant:", error);
    return NextResponse.json(
      { error: "Failed to remove participant" },
      { status: 500 }
    );
  }
}
