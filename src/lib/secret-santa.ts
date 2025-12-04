interface Participant {
  id: string;
  groupId: string;
}

interface AssignmentData {
  giverId: string;
  receiverId: string;
  groupId: string;
}

/**
 * Generates Secret Santa assignments using a circular pairing algorithm.
 * This guarantees:
 * - Nobody gifts to themselves
 * - Everybody receives exactly one gift
 * - Works for any number of participants >= 2
 *
 * @param participants - Array of participants to generate assignments for
 * @returns Array of assignment data objects
 */
export function generateAssignments(participants: Participant[]): AssignmentData[] {
  if (participants.length < 2) {
    throw new Error("At least 2 participants are required for Secret Santa");
  }

  // 1. Shuffle participants randomly using Fisher-Yates (Durstenfeld) algorithm
  // This creates an unbiased permutation with O(n) complexity
  const shuffled = [...participants];
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate random index j where 0 <= j <= i
    // We use (i + 1) to include the current index i in the selection range,
    // ensuring each element has an equal probability of being selected
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 2. Create circular assignments: each person gives to the next
  // Last person gives to first (creates a circle)
  const assignments: AssignmentData[] = shuffled.map((giver, index) => {
    const receiverIndex = (index + 1) % shuffled.length;
    const receiver = shuffled[receiverIndex];

    return {
      giverId: giver.id,
      receiverId: receiver.id,
      groupId: giver.groupId,
    };
  });

  return assignments;
}

/**
 * Validates that all assignments are valid:
 * - No self-assignments
 * - Each participant gives exactly once
 * - Each participant receives exactly once
 */
export function validateAssignments(
  assignments: AssignmentData[],
  participants: Participant[]
): boolean {
  const participantIds = new Set(participants.map((p) => p.id));
  const giverIds = new Set<string>();
  const receiverIds = new Set<string>();

  for (const assignment of assignments) {
    // Check no self-assignment
    if (assignment.giverId === assignment.receiverId) {
      return false;
    }

    // Check participant exists
    if (!participantIds.has(assignment.giverId) || !participantIds.has(assignment.receiverId)) {
      return false;
    }

    // Check for duplicate givers or receivers
    if (giverIds.has(assignment.giverId) || receiverIds.has(assignment.receiverId)) {
      return false;
    }

    giverIds.add(assignment.giverId);
    receiverIds.add(assignment.receiverId);
  }

  // Check all participants are assigned
  return giverIds.size === participants.length && receiverIds.size === participants.length;
}
