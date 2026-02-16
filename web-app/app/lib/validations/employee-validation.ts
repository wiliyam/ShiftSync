import { z } from 'zod';

/**
 * Zod schema for a single skill name.
 * Must be 2-50 chars, uppercase alphanumeric with spaces and hyphens only.
 */
export const SkillSchema = z
  .string()
  .min(2, 'Skill must be at least 2 characters')
  .max(50, 'Skill must be at most 50 characters')
  .regex(
    /^[A-Z0-9][A-Z0-9 -]*$/,
    'Skill must contain only uppercase letters, numbers, spaces, and hyphens',
  );

/**
 * Parse a comma-separated skills input string into an array of trimmed, non-empty strings.
 */
export function parseSkillsInput(input: string): string[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Validate and normalize an array of skill strings.
 * Returns normalized (uppercase, trimmed, deduplicated) skills and any errors.
 */
export function validateSkills(skills: string[]): {
  valid: boolean;
  errors: string[];
  normalized: string[];
} {
  const errors: string[] = [];
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const raw of skills) {
    const trimmed = raw.trim();
    if (trimmed.length === 0) continue;

    const upper = trimmed.toUpperCase();

    // Check for duplicates
    if (seen.has(upper)) {
      errors.push(`Duplicate skill: "${upper}"`);
      continue;
    }

    // Validate against schema
    const result = SkillSchema.safeParse(upper);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`Skill "${upper}": ${issue.message}`);
      }
      continue;
    }

    seen.add(upper);
    normalized.push(upper);
  }

  return {
    valid: errors.length === 0,
    errors,
    normalized,
  };
}
