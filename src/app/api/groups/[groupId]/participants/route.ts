import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const addParticipantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

interface RouteParams {
  params: Promise<{ groupId: string }>;
}

// POST /api/groups/[groupId]/participants - Add participant to group
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
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (group.isFinalized) {
      return NextResponse.json(
        { error: "Cannot add participants to a finalized group" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = addParticipantSchema.safeParse(body);

    if (!validationResult.success) {
      const issues = validationResult.error.issues;
      return NextResponse.json(
        { error: issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email } = validationResult.data;

    // Check for duplicate email in this group
    const existingParticipant = await prisma.participant.findFirst({
      where: {
        groupId,
        email: email.toLowerCase(),
      },
    });

    if (existingParticipant) {
      return NextResponse.json(
        { error: "A participant with this email already exists in this group" },
        { status: 400 }
      );
    }

    const participant = await prisma.participant.create({
      data: {
        name,
        email: email.toLowerCase(),
        groupId,
      },
    });

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error("Error adding participant:", error);
    return NextResponse.json(
      { error: "Failed to add participant" },
      { status: 500 }
    );
  }
}
