export const MIN_SHIFT_DURATION_MINUTES = 30;
export const MAX_SHIFT_DURATION_HOURS = 24;

type ShiftTimeSlot = {
  start: Date;
  end: Date;
  employeeId: string | null;
};

/**
 * Validate that shift start/end times are valid:
 * - Start must be before end
 * - Duration must be at least 30 minutes
 * - Duration must not exceed 24 hours
 */
export function validateShiftTimes(
  start: Date,
  end: Date,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (start >= end) {
    errors.push('Start time must be before end time');
  } else {
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = durationMs / (1000 * 60);
    const durationHours = durationMs / (1000 * 60 * 60);

    if (durationMinutes < MIN_SHIFT_DURATION_MINUTES) {
      errors.push(
        `Shift must be at least ${MIN_SHIFT_DURATION_MINUTES} minutes long`,
      );
    }

    if (durationHours > MAX_SHIFT_DURATION_HOURS) {
      errors.push(
        `Shift must not exceed ${MAX_SHIFT_DURATION_HOURS} hours`,
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Detect conflicts between a new shift and existing shifts.
 * Two shifts conflict if they overlap in time AND belong to the same employee.
 * Touching boundaries (one ends exactly when another starts) do NOT conflict.
 * Unassigned shifts (employeeId = null) never conflict.
 */
export function detectConflicts(
  newShift: ShiftTimeSlot,
  existingShifts: ShiftTimeSlot[],
): ShiftTimeSlot[] {
  // Unassigned shifts don't conflict
  if (newShift.employeeId === null) return [];

  return existingShifts.filter((existing) => {
    // Different employee or unassigned = no conflict
    if (existing.employeeId !== newShift.employeeId) return false;

    // Check time overlap: two intervals overlap if one starts before the other ends
    // Touching boundaries (equal) are NOT considered overlap
    return newShift.start < existing.end && newShift.end > existing.start;
  });
}
