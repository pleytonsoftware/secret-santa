import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const updateGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").optional(),
  description: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ groupId: string }>;
}

// GET /api/groups/[groupId] - Get group details with participants
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = await params;

    const group = await prisma.secretSantaGroup.findFirst({
      where: {
        id: groupId,
        ownerId: session.user.id,
      },
      include: {
        participants: {
          orderBy: {
            createdAt: "asc",
          },
        },
        assignments: true,
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json(
      { error: "Failed to fetch group" },
      { status: 500 }
    );
  }
}

// PATCH /api/groups/[groupId] - Update group name/description
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = await params;

    // Check if group exists and belongs to user
    const existingGroup = await prisma.secretSantaGroup.findFirst({
      where: {
        id: groupId,
        ownerId: session.user.id,
      },
    });

    if (!existingGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (existingGroup.isFinalized) {
      return NextResponse.json(
        { error: "Cannot edit a finalized group" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = updateGroupSchema.safeParse(body);

    if (!validationResult.success) {
      const issues = validationResult.error.issues;
      return NextResponse.json(
        { error: issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, description } = validationResult.data;

    const updatedGroup = await prisma.secretSantaGroup.update({
      where: {
        id: groupId,
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[groupId] - Delete group and all related data
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = await params;

    // Check if group exists and belongs to user
    const existingGroup = await prisma.secretSantaGroup.findFirst({
      where: {
        id: groupId,
        ownerId: session.user.id,
      },
    });

    if (!existingGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Delete the group (cascade will handle participants and assignments)
    await prisma.secretSantaGroup.delete({
      where: {
        id: groupId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
