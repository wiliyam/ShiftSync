import {
  validateShiftTimes,
  detectConflicts,
  MIN_SHIFT_DURATION_MINUTES,
  MAX_SHIFT_DURATION_HOURS,
} from '../shift-validation';

describe('Shift Validation', () => {
  describe('constants', () => {
    it('has correct minimum shift duration', () => {
      expect(MIN_SHIFT_DURATION_MINUTES).toBe(30);
    });

    it('has correct maximum shift duration', () => {
      expect(MAX_SHIFT_DURATION_HOURS).toBe(24);
    });
  });

  describe('validateShiftTimes', () => {
    it('accepts a valid 8-hour shift', () => {
      const start = new Date('2026-03-01T09:00:00');
      const end = new Date('2026-03-01T17:00:00');
      const result = validateShiftTimes(start, end);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('accepts a shift exactly 30 minutes long', () => {
      const start = new Date('2026-03-01T09:00:00');
      const end = new Date('2026-03-01T09:30:00');
      const result = validateShiftTimes(start, end);
      expect(result.valid).toBe(true);
    });

    it('accepts a shift exactly 24 hours long', () => {
      const start = new Date('2026-03-01T00:00:00');
      const end = new Date('2026-03-02T00:00:00');
      const result = validateShiftTimes(start, end);
      expect(result.valid).toBe(true);
    });

    it('rejects a shift shorter than 30 minutes', () => {
      const start = new Date('2026-03-01T09:00:00');
      const end = new Date('2026-03-01T09:29:00');
      const result = validateShiftTimes(start, end);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('30 minutes'))).toBe(true);
    });

    it('rejects a shift longer than 24 hours', () => {
      const start = new Date('2026-03-01T00:00:00');
      const end = new Date('2026-03-02T00:01:00');
      const result = validateShiftTimes(start, end);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('24 hours'))).toBe(true);
    });

    it('rejects when start equals end', () => {
      const time = new Date('2026-03-01T09:00:00');
      const result = validateShiftTimes(time, time);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.toLowerCase().includes('before'))).toBe(true);
    });

    it('rejects when start is after end', () => {
      const start = new Date('2026-03-01T17:00:00');
      const end = new Date('2026-03-01T09:00:00');
      const result = validateShiftTimes(start, end);
      expect(result.valid).toBe(false);
    });
  });

  describe('detectConflicts', () => {
    const baseShift = {
      start: new Date('2026-03-01T09:00:00'),
      end: new Date('2026-03-01T17:00:00'),
      employeeId: 'emp-1',
    };

    it('returns empty array when no existing shifts', () => {
      const conflicts = detectConflicts(baseShift, []);
      expect(conflicts).toEqual([]);
    });

    it('detects complete overlap (new contains existing)', () => {
      const existing = [{
        start: new Date('2026-03-01T10:00:00'),
        end: new Date('2026-03-01T12:00:00'),
        employeeId: 'emp-1',
      }];
      const conflicts = detectConflicts(baseShift, existing);
      expect(conflicts).toHaveLength(1);
    });

    it('detects complete overlap (existing contains new)', () => {
      const newShift = {
        start: new Date('2026-03-01T10:00:00'),
        end: new Date('2026-03-01T12:00:00'),
        employeeId: 'emp-1',
      };
      const existing = [baseShift];
      const conflicts = detectConflicts(newShift, existing);
      expect(conflicts).toHaveLength(1);
    });

    it('detects partial overlap at start', () => {
      const newShift = {
        start: new Date('2026-03-01T08:00:00'),
        end: new Date('2026-03-01T10:00:00'),
        employeeId: 'emp-1',
      };
      const existing = [baseShift];
      const conflicts = detectConflicts(newShift, existing);
      expect(conflicts).toHaveLength(1);
    });

    it('detects partial overlap at end', () => {
      const newShift = {
        start: new Date('2026-03-01T16:00:00'),
        end: new Date('2026-03-01T20:00:00'),
        employeeId: 'emp-1',
      };
      const existing = [baseShift];
      const conflicts = detectConflicts(newShift, existing);
      expect(conflicts).toHaveLength(1);
    });

    it('detects exact match', () => {
      const existing = [{ ...baseShift }];
      const conflicts = detectConflicts(baseShift, existing);
      expect(conflicts).toHaveLength(1);
    });

    it('does NOT conflict when new shift ends exactly when existing starts', () => {
      const newShift = {
        start: new Date('2026-03-01T07:00:00'),
        end: new Date('2026-03-01T09:00:00'),
        employeeId: 'emp-1',
      };
      const existing = [baseShift];
      const conflicts = detectConflicts(newShift, existing);
      expect(conflicts).toHaveLength(0);
    });

    it('does NOT conflict when new shift starts exactly when existing ends', () => {
      const newShift = {
        start: new Date('2026-03-01T17:00:00'),
        end: new Date('2026-03-01T20:00:00'),
        employeeId: 'emp-1',
      };
      const existing = [baseShift];
      const conflicts = detectConflicts(newShift, existing);
      expect(conflicts).toHaveLength(0);
    });

    it('does NOT conflict when shifts are entirely separate', () => {
      const newShift = {
        start: new Date('2026-03-01T20:00:00'),
        end: new Date('2026-03-01T23:00:00'),
        employeeId: 'emp-1',
      };
      const existing = [baseShift];
      const conflicts = detectConflicts(newShift, existing);
      expect(conflicts).toHaveLength(0);
    });

    it('does NOT conflict with different employees', () => {
      const newShift = {
        start: new Date('2026-03-01T09:00:00'),
        end: new Date('2026-03-01T17:00:00'),
        employeeId: 'emp-2',
      };
      const existing = [baseShift];
      const conflicts = detectConflicts(newShift, existing);
      expect(conflicts).toHaveLength(0);
    });

    it('does NOT conflict when employeeId is null (unassigned)', () => {
      const newShift = {
        start: new Date('2026-03-01T09:00:00'),
        end: new Date('2026-03-01T17:00:00'),
        employeeId: null,
      };
      const existing = [baseShift];
      const conflicts = detectConflicts(newShift, existing);
      expect(conflicts).toHaveLength(0);
    });

    it('detects multiple conflicting shifts', () => {
      const newShift = {
        start: new Date('2026-03-01T08:00:00'),
        end: new Date('2026-03-01T20:00:00'),
        employeeId: 'emp-1',
      };
      const existing = [
        baseShift,
        {
          start: new Date('2026-03-01T18:00:00'),
          end: new Date('2026-03-01T22:00:00'),
          employeeId: 'emp-1',
        },
      ];
      const conflicts = detectConflicts(newShift, existing);
      expect(conflicts).toHaveLength(2);
    });
  });
});
