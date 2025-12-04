import { generateAssignments, validateAssignments } from '@/lib/secret-santa';

describe('Secret Santa Algorithm', () => {
  const createParticipants = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `participant-${i + 1}`,
      groupId: 'test-group',
    }));
  };

  describe('generateAssignments', () => {
    it('should throw error with less than 2 participants', () => {
      const participants = createParticipants(1);
      expect(() => generateAssignments(participants)).toThrow(
        'At least 2 participants are required'
      );
    });

    it('should throw error with 0 participants', () => {
      expect(() => generateAssignments([])).toThrow(
        'At least 2 participants are required'
      );
    });

    it('should work with 2 participants', () => {
      const participants = createParticipants(2);
      const assignments = generateAssignments(participants);

      expect(assignments.length).toBe(2);
      expect(validateAssignments(assignments, participants)).toBe(true);
    });

    it('should work with 3 participants', () => {
      const participants = createParticipants(3);
      const assignments = generateAssignments(participants);

      expect(assignments.length).toBe(3);
      expect(validateAssignments(assignments, participants)).toBe(true);
    });

    it('should work with 5 participants', () => {
      const participants = createParticipants(5);
      const assignments = generateAssignments(participants);

      expect(assignments.length).toBe(5);
      expect(validateAssignments(assignments, participants)).toBe(true);
    });

    it('should work with 10 participants', () => {
      const participants = createParticipants(10);
      const assignments = generateAssignments(participants);

      expect(assignments.length).toBe(10);
      expect(validateAssignments(assignments, participants)).toBe(true);
    });

    it('should ensure no self-assignments', () => {
      const participants = createParticipants(10);
      const assignments = generateAssignments(participants);

      for (const assignment of assignments) {
        expect(assignment.giverId).not.toBe(assignment.receiverId);
      }
    });

    it('should ensure everyone gives exactly once', () => {
      const participants = createParticipants(10);
      const assignments = generateAssignments(participants);

      const giverIds = assignments.map((a) => a.giverId);
      const uniqueGiverIds = new Set(giverIds);

      expect(uniqueGiverIds.size).toBe(participants.length);
    });

    it('should ensure everyone receives exactly once', () => {
      const participants = createParticipants(10);
      const assignments = generateAssignments(participants);

      const receiverIds = assignments.map((a) => a.receiverId);
      const uniqueReceiverIds = new Set(receiverIds);

      expect(uniqueReceiverIds.size).toBe(participants.length);
    });

    it('should include correct groupId in assignments', () => {
      const participants = createParticipants(5);
      const assignments = generateAssignments(participants);

      for (const assignment of assignments) {
        expect(assignment.groupId).toBe('test-group');
      }
    });
  });

  describe('validateAssignments', () => {
    it('should return false for self-assignments', () => {
      const participants = createParticipants(3);
      const invalidAssignments = [
        { giverId: 'participant-1', receiverId: 'participant-1', groupId: 'test-group' },
        { giverId: 'participant-2', receiverId: 'participant-3', groupId: 'test-group' },
        { giverId: 'participant-3', receiverId: 'participant-2', groupId: 'test-group' },
      ];

      expect(validateAssignments(invalidAssignments, participants)).toBe(false);
    });

    it('should return false for duplicate givers', () => {
      const participants = createParticipants(3);
      const invalidAssignments = [
        { giverId: 'participant-1', receiverId: 'participant-2', groupId: 'test-group' },
        { giverId: 'participant-1', receiverId: 'participant-3', groupId: 'test-group' },
        { giverId: 'participant-3', receiverId: 'participant-1', groupId: 'test-group' },
      ];

      expect(validateAssignments(invalidAssignments, participants)).toBe(false);
    });

    it('should return false for duplicate receivers', () => {
      const participants = createParticipants(3);
      const invalidAssignments = [
        { giverId: 'participant-1', receiverId: 'participant-2', groupId: 'test-group' },
        { giverId: 'participant-2', receiverId: 'participant-2', groupId: 'test-group' },
        { giverId: 'participant-3', receiverId: 'participant-1', groupId: 'test-group' },
      ];

      expect(validateAssignments(invalidAssignments, participants)).toBe(false);
    });

    it('should return false if participant not in list', () => {
      const participants = createParticipants(2);
      const invalidAssignments = [
        { giverId: 'participant-1', receiverId: 'participant-unknown', groupId: 'test-group' },
        { giverId: 'participant-2', receiverId: 'participant-1', groupId: 'test-group' },
      ];

      expect(validateAssignments(invalidAssignments, participants)).toBe(false);
    });

    it('should return true for valid circular assignments', () => {
      const participants = createParticipants(3);
      const validAssignments = [
        { giverId: 'participant-1', receiverId: 'participant-2', groupId: 'test-group' },
        { giverId: 'participant-2', receiverId: 'participant-3', groupId: 'test-group' },
        { giverId: 'participant-3', receiverId: 'participant-1', groupId: 'test-group' },
      ];

      expect(validateAssignments(validAssignments, participants)).toBe(true);
    });
  });

  describe('Random consistency', () => {
    it('should produce valid assignments over multiple runs', () => {
      const participants = createParticipants(20);

      // Run the algorithm 100 times to ensure consistency
      for (let i = 0; i < 100; i++) {
        const assignments = generateAssignments(participants);
        expect(validateAssignments(assignments, participants)).toBe(true);
      }
    });
  });
});
