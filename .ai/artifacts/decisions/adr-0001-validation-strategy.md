# ADR-0001: Employee and Shift Validation Strategy

**Status:** Accepted
**Date:** 2026-02-15
**Decided By:** claude-sonnet-4.5 (Sprint Planning Agent)
**Related Task:** Sprint 2 - Tasks 1.1, 2.1, 3.1

---

## Context

The ShiftSync application requires robust validation for employee and shift data to ensure data integrity and provide clear user feedback. Current implementation has minimal validation:

**Current State:**
- Employee skills: simple string splitting, no format validation
- Employee maxHours: only validates > 0
- Shift times: basic start < end check, no duration or future date validation
- No skill matching between employees and shifts

**Problems:**
1. Users can enter invalid skill names (special characters, too long, empty)
2. Duplicate skills can be saved
3. Employees can be assigned unrealistic max hours (e.g., 1000 hours/week)
4. Shifts can be created in the past or with 1-minute duration
5. Employees can be assigned to shifts they're not qualified for
6. Error messages are generic and unhelpful

**Requirements:**
- Validation must run on both client and server (security)
- Error messages must be specific and actionable
- Validation logic should be reusable across CRUD operations
- Type safety with TypeScript
- Runtime validation for FormData from Next.js Server Actions

---

## Decision

We will implement a **layered validation strategy** using Zod schemas with dedicated validation utilities:

### 1. Schema-Based Validation (Zod)
Use Zod for all runtime validation with custom refinements:

```typescript
// Employee skill validation
const SkillSchema = z.string()
  .trim()
  .min(2, 'Skill name must be at least 2 characters')
  .max(50, 'Skill name must not exceed 50 characters')
  .regex(/^[a-zA-Z0-9\s-]+$/, 'Skill can only contain letters, numbers, spaces, and hyphens')
  .transform(s => s.toUpperCase()); // Normalize to uppercase

const SkillsArraySchema = z.array(SkillSchema)
  .min(1, 'At least one skill is required')
  .refine(skills => new Set(skills).size === skills.length, {
    message: 'Duplicate skills are not allowed'
  });

// Employee max hours validation
const MaxHoursSchema = z.coerce.number()
  .min(1, 'Max hours must be at least 1 hour per week')
  .max(168, 'Max hours cannot exceed 168 hours per week (24 hours × 7 days)');

// Shift duration validation
const ShiftDurationSchema = z.object({
  start: z.date(),
  end: z.date()
}).refine(data => data.end > data.start, {
  message: 'End time must be after start time'
}).refine(data => {
  const durationMs = data.end.getTime() - data.start.getTime();
  const durationMinutes = durationMs / (1000 * 60);
  return durationMinutes >= 30;
}, {
  message: 'Shift must be at least 30 minutes'
}).refine(data => {
  const durationMs = data.end.getTime() - data.start.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  return durationHours <= 24;
}, {
  message: 'Shift cannot exceed 24 hours'
});
```

### 2. Dedicated Validation Modules
Extract validation logic into reusable utility modules:

**Structure:**
```
app/lib/validations/
├── employee-validation.ts       (skill validation, normalization)
├── shift-validation.ts          (duration, future date validation)
├── skill-matching.ts            (employee-shift skill compatibility)
└── __tests__/
    ├── employee-validation.test.ts
    ├── shift-validation.test.ts
    └── skill-matching.test.ts
```

**Benefits:**
- Testable in isolation (unit tests without Prisma mocks)
- Reusable across create/update operations
- Single source of truth for validation rules
- Easy to modify business rules

### 3. Integration with Server Actions
Integrate validation into existing Server Actions:

```typescript
// Example: employee-actions.ts
import { validateSkills } from '@/app/lib/validations/employee-validation';

export async function createEmployee(prevState: State, formData: FormData) {
  // Parse raw input
  const rawSkills = formData.get('skills') as string;
  const skillsArray = rawSkills.split(',').map(s => s.trim()).filter(Boolean);

  // Validate with Zod
  const validatedSkills = SkillsArraySchema.safeParse(skillsArray);

  if (!validatedSkills.success) {
    return {
      errors: { skills: validatedSkills.error.flatten().fieldErrors },
      message: 'Invalid skills provided'
    };
  }

  // Use validated, normalized data
  const normalizedSkills = validatedSkills.data; // Already uppercase, trimmed, no duplicates

  // Proceed with database operation
  await prisma.employee.create({
    data: { skills: normalizedSkills, ... }
  });
}
```

### 4. Validation Rules

**Employee Skills:**
- Minimum 2 characters, maximum 50 characters
- Only alphanumeric, spaces, and hyphens
- Auto-normalized to UPPERCASE for consistency
- Duplicates rejected (case-insensitive)
- Empty/whitespace-only skills filtered out

**Employee Max Hours:**
- Range: 1-168 hours per week (168 = 24 hours × 7 days)
- Coerced to number (handles string input from forms)

**Shift Timing:**
- Start must be before end (existing)
- Minimum duration: 30 minutes (prevents accidental 1-minute shifts)
- Maximum duration: 24 hours (prevents multi-day shifts)
- Future date: shifts should start in the future (configurable tolerance for editing)

**Skill Matching:**
- Employee must have ALL required skills for a shift
- Case-insensitive matching (normalized to uppercase)
- Empty requiredSkills array = no skill requirement (always valid)
- Unassigned shifts (employeeId = null) skip skill validation

---

## Consequences

### Positive
- **Data Integrity:** Invalid data cannot enter the database
- **Better UX:** Specific, actionable error messages guide users
- **Type Safety:** Zod schemas provide runtime + compile-time validation
- **Maintainability:** Validation rules centralized in dedicated modules
- **Testability:** Pure functions can be unit tested without mocking Prisma
- **Consistency:** Same validation logic for create and update operations
- **Normalization:** Skills stored consistently (uppercase, trimmed)
- **Security:** Server-side validation prevents malicious input

### Negative
- **Complexity:** Additional abstraction layer (validation modules)
- **Performance:** Multiple validation passes (Zod + custom refinements)
- **Learning Curve:** Team must understand Zod API and custom schemas
- **Migration:** Existing data may not meet new validation rules

### Mitigation
- **Complexity:** Offset by improved testability and maintainability
- **Performance:** Validation is fast (<1ms per operation), not a bottleneck
- **Learning Curve:** Document patterns in TEST_CONFIGURATION.md
- **Migration:** Create database migration to clean up existing data:
  ```sql
  -- Normalize existing skills to uppercase
  UPDATE "Employee" SET skills = ARRAY(
    SELECT UPPER(TRIM(skill)) FROM UNNEST(skills) AS skill
  );
  ```

---

## Alternatives Considered

### Alternative 1: Manual Validation Functions
**Pros:**
- No external dependency (Zod)
- Full control over error messages
- Simpler for basic validations

**Cons:**
- No type inference
- More boilerplate code
- Error handling inconsistent
- No schema composition/reuse

**Why not chosen:** Zod provides type inference, schema composition, and better DX with minimal overhead

### Alternative 2: Class-based Validators (class-validator)
**Pros:**
- Decorator-based validation (clean syntax)
- Works well with TypeScript classes
- Popular in NestJS ecosystem

**Cons:**
- Requires classes (not compatible with plain objects from FormData)
- Runtime overhead (reflection metadata)
- Less functional, harder to test pure functions
- Not as well-suited for Next.js Server Actions

**Why not chosen:** Zod is more functional, lighter weight, and better suited for Next.js form handling

### Alternative 3: Client-Side Only Validation
**Pros:**
- Immediate feedback (no server round-trip)
- Better perceived performance

**Cons:**
- Security risk (can be bypassed)
- Must duplicate validation on server anyway
- No protection against API abuse

**Why not chosen:** We will do BOTH client and server validation, but server is mandatory for security

### Alternative 4: Database Constraints Only
**Pros:**
- Single source of truth (database)
- Cannot be bypassed

**Cons:**
- Generic error messages (not user-friendly)
- Cannot validate complex business rules (e.g., skill matching)
- Errors discovered late (after network round-trip)

**Why not chosen:** Database constraints are complementary, not a replacement for application-level validation

---

## Implementation Checklist

### Phase 1: Employee Skill Validation (Task 1.1)
- [x] Create SkillSchema with Zod
- [ ] Create validateSkills utility function
- [ ] Add unit tests (normalization, duplicates, character validation)
- [ ] Integrate into createEmployee action
- [ ] Integrate into updateEmployee action
- [ ] Add integration tests with employee actions
- [ ] Document validation rules in API docs

### Phase 2: Employee Max Hours Validation (Task 1.3)
- [ ] Update MaxHoursSchema with .min(1).max(168)
- [ ] Add custom error messages
- [ ] Add unit tests for boundary values
- [ ] Update existing tests

### Phase 3: Shift Validation (Task 2.1)
- [ ] Create ShiftDurationSchema with Zod refinements
- [ ] Create validateShiftTiming utility function
- [ ] Add future date validation (configurable tolerance)
- [ ] Add unit tests (duration, future date, edge cases)
- [ ] Integrate into createShift action
- [ ] Add integration tests

### Phase 4: Skill Matching Validation (Task 3.1)
- [ ] Create validateSkillMatch utility function
- [ ] Handle case-insensitive matching (normalize to uppercase)
- [ ] Handle empty requiredSkills (always valid)
- [ ] Handle unassigned shifts (null employeeId)
- [ ] Add unit tests (matching, missing skills, edge cases)
- [ ] Integrate into createShift action (fetch employee data)
- [ ] Add E2E tests

### Phase 5: Documentation
- [ ] Document validation patterns in TEST_CONFIGURATION.md
- [ ] Create API documentation for all validated actions
- [ ] Update CHANGELOG with validation improvements
- [ ] Create migration script for existing data normalization

---

## Rollback Plan

If validation causes issues in production:

1. **Immediate:** Feature flag validation (allow bypass for admins)
   ```typescript
   const ENABLE_STRICT_VALIDATION = process.env.ENABLE_STRICT_VALIDATION === 'true';

   if (ENABLE_STRICT_VALIDATION) {
     // Run validation
   }
   ```

2. **Short-term:** Relax specific rules (e.g., allow longer skill names)
   ```typescript
   .max(100) // Increased from 50
   ```

3. **Long-term:** Remove Zod dependency, revert to basic checks
   ```typescript
   // Fallback to simple validation
   if (!skills || skills.length === 0) {
     return { error: 'Skills required' };
   }
   ```

---

## References

- [Zod Documentation](https://zod.dev/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Form Validation Best Practices](https://web.dev/sign-in-form-best-practices/)
- ShiftSync Product Requirements: `/docs/product_requirements.md`
- ShiftSync Architecture: `/docs/architecture_design.md`

---

## Review Notes

**Review Date:** (To be filled)
**Reviewed By:** (To be filled)
**Status:** Accepted - Ready for implementation
**Comments:**
- Validation strategy aligns with TDD workflow
- Clear separation of concerns (validation utilities)
- Comprehensive test coverage requirements defined
- Consider adding validation for additional fields (phone numbers, addresses) in future sprints
