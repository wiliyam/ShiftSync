# Current Sprint: Sprint 2 - Core Features Development

**Sprint Start:** 2026-02-15
**Sprint End:** 2026-02-29
**Current Agent:** claude-sonnet-4.5
**Session ID:** sprint-planning-20260215
**Status:** 🚧 IN PROGRESS

---

## Sprint Goals
- ✅ Enhance employee skill validation with business rules
- ✅ Achieve 90%+ test coverage for employee CRUD operations
- ✅ Implement comprehensive shift conflict detection
- ✅ Create full test suite (unit, integration, E2E)
- ✅ Refactor for consistency and maintainability
- ✅ Document all architectural decisions

---

## Task Breakdown

### Epic 1: Employee Skill Validation & Management

#### Task 1.1: Enhanced Employee Skill Validation
**Status:** PENDING
**Complexity:** MEDIUM
**Priority:** HIGH

**Description:**
Implement robust skill validation with business rules beyond simple string splitting. Validate skill format, check against predefined skill taxonomy, prevent duplicates, and ensure proper normalization.

**Acceptance Criteria:**
- [ ] Skills must be non-empty strings
- [ ] Skills must be trimmed and normalized (uppercase)
- [ ] Duplicate skills are rejected
- [ ] Empty or whitespace-only skills are filtered
- [ ] Skill names must be 2-50 characters
- [ ] Skill names must match pattern: alphanumeric, spaces, hyphens only
- [ ] Validation returns clear, actionable error messages

**Test Requirements:**
- **Unit Tests:** (8-10 tests)
  - Test skill normalization (trim, uppercase)
  - Test duplicate detection
  - Test empty skill filtering
  - Test invalid character rejection
  - Test length validation (too short, too long)
  - Test edge cases (null, undefined, special chars)
- **Integration Tests:** (2-3 tests)
  - Test validation integration with createEmployee
  - Test validation integration with updateEmployee
- **E2E Tests:** (1 test)
  - Test employee creation form with invalid skills shows errors

**Files to Create/Modify:**
```
web-app/app/lib/validations/employee-validation.ts (NEW)
web-app/app/lib/validations/__tests__/employee-validation.test.ts (NEW)
web-app/app/lib/employee-actions.ts (MODIFY - integrate validation)
web-app/app/lib/__tests__/employee-actions.test.ts (MODIFY - add tests)
tests/e2e/employee-management.spec.ts (NEW)
```

**Dependencies:**
- None (can start immediately)

**TDD Workflow:**
1. RED: Create failing test for skill normalization
2. GREEN: Implement basic skill validation utility
3. REFACTOR: Extract to dedicated validation module
4. RED: Add test for duplicate detection
5. GREEN: Implement duplicate check
6. REFACTOR: Use Set for efficient duplicate detection
7. RED: Add tests for character validation
8. GREEN: Implement regex pattern matching
9. REFACTOR: Create comprehensive SkillSchema using Zod
10. RED: Add integration tests with employee actions
11. GREEN: Integrate validation into createEmployee/updateEmployee
12. REFACTOR: Extract common validation patterns

**ADR:** See ADR-0001

---

#### Task 1.2: Employee CRUD Test Coverage Enhancement
**Status:** PENDING
**Complexity:** MEDIUM
**Priority:** HIGH

**Description:**
Add comprehensive test coverage for all employee CRUD operations. Current coverage is minimal (1 test). Need unit tests for all validation paths, integration tests for database operations, and E2E tests for user workflows.

**Acceptance Criteria:**
- [ ] 90%+ code coverage for employee-actions.ts
- [ ] All validation error paths tested
- [ ] All success paths tested
- [ ] Transaction rollback scenarios tested
- [ ] Database constraint violations tested (unique email)
- [ ] Cascade deletion tested
- [ ] E2E tests cover full CRUD workflow

**Test Requirements:**
- **Unit Tests:** (15-20 tests)
  - createEmployee: validation errors (name, email, maxHours, skills)
  - createEmployee: successful creation
  - updateEmployee: validation errors
  - updateEmployee: successful update
  - updateEmployee: non-existent employee
  - deleteEmployee: successful deletion
  - deleteEmployee: cascade behavior
  - deleteEmployee: non-existent employee
- **Integration Tests:** (8-10 tests)
  - createEmployee with database (mocked Prisma)
  - Transaction rollback on user creation failure
  - Transaction rollback on employee creation failure
  - Unique email constraint violation
  - Update existing employee in database
  - Delete with cascade to employee profile
- **E2E Tests:** (4-5 tests)
  - Create employee via form
  - Update employee via form
  - Delete employee and verify removal
  - Create employee with duplicate email shows error
  - Create employee with invalid data shows field errors

**Files to Create/Modify:**
```
web-app/app/lib/__tests__/employee-actions.test.ts (MODIFY - expand significantly)
web-app/app/lib/__tests__/employee-actions.integration.test.ts (NEW)
tests/e2e/employee-management.spec.ts (MODIFY - add CRUD tests)
web-app/__mocks__/prisma.ts (MODIFY - enhance mocks)
```

**Dependencies:**
- Task 1.1 (skill validation must be complete)

**TDD Workflow:**
1. RED: Add tests for all createEmployee validation error paths
2. GREEN: Ensure validation logic handles all cases
3. REFACTOR: Extract validation to reusable schemas
4. RED: Add tests for createEmployee success path with mocked Prisma
5. GREEN: Verify transaction logic works correctly
6. REFACTOR: Simplify transaction error handling
7. RED: Add tests for updateEmployee validation
8. GREEN: Ensure update validation is consistent
9. RED: Add tests for deleteEmployee scenarios
10. GREEN: Verify cascade deletion
11. RED: Add integration tests with real database mocks
12. GREEN: Implement proper mock setups
13. RED: Add E2E tests for form interactions
14. GREEN: Ensure E2E tests pass with real UI

**ADR:** See ADR-0003

---

#### Task 1.3: Employee Max Hours Validation
**Status:** PENDING
**Complexity:** SIMPLE
**Priority:** MEDIUM

**Description:**
Add validation to ensure employee max hours per week is within reasonable bounds (e.g., 1-168 hours). Currently only validates > 0.

**Acceptance Criteria:**
- [ ] Max hours must be between 1 and 168 (hours in a week)
- [ ] Validation provides clear error message for out-of-range values
- [ ] Existing tests updated to cover new validation

**Test Requirements:**
- **Unit Tests:** (4 tests)
  - Test maxHours = 0 (invalid)
  - Test maxHours = 169 (invalid, over 168)
  - Test maxHours = 1 (valid, minimum)
  - Test maxHours = 168 (valid, maximum)
  - Test maxHours = 40 (valid, typical)

**Files to Create/Modify:**
```
web-app/app/lib/employee-actions.ts (MODIFY - update FormSchema)
web-app/app/lib/__tests__/employee-actions.test.ts (MODIFY - add tests)
```

**Dependencies:**
- None (independent task)

**TDD Workflow:**
1. RED: Add test for maxHours = 0
2. RED: Add test for maxHours = 169
3. GREEN: Update Zod schema with .min(1).max(168)
4. REFACTOR: Add custom error messages

**ADR:** None needed (simple validation change)

---

### Epic 2: Shift Management & Conflict Detection

#### Task 2.1: Shift Validation Enhancement
**Status:** PENDING
**Complexity:** MEDIUM
**Priority:** HIGH

**Description:**
Enhance shift validation beyond basic date comparison. Add validation for minimum shift duration, maximum shift duration, break requirements, and future date constraints.

**Acceptance Criteria:**
- [ ] Shift start must be in the future (or configurable tolerance)
- [ ] Shift duration must be at least 30 minutes
- [ ] Shift duration must not exceed 24 hours
- [ ] Start time must be before end time (already implemented)
- [ ] Validation returns structured error messages

**Test Requirements:**
- **Unit Tests:** (10-12 tests)
  - Test shift in the past (invalid)
  - Test shift duration < 30 minutes (invalid)
  - Test shift duration > 24 hours (invalid)
  - Test start >= end (invalid)
  - Test valid shift (30 min duration)
  - Test valid shift (8 hour duration)
  - Test valid shift (24 hour duration)
  - Test shift starting now (edge case)
  - Test shift with null/undefined dates
- **Integration Tests:** (3-4 tests)
  - Test createShift with invalid duration rejects
  - Test createShift with past date rejects
  - Test createShift with valid data succeeds

**Files to Create/Modify:**
```
web-app/app/lib/validations/shift-validation.ts (NEW)
web-app/app/lib/validations/__tests__/shift-validation.test.ts (NEW)
web-app/app/lib/shift-actions.ts (MODIFY - integrate validation)
web-app/app/lib/__tests__/shift-actions.test.ts (NEW)
```

**Dependencies:**
- None (can start immediately)

**TDD Workflow:**
1. RED: Create test for minimum duration validation
2. GREEN: Implement duration calculation and validation
3. REFACTOR: Extract to validation utility
4. RED: Add test for maximum duration
5. GREEN: Add max duration check
6. RED: Add test for future date requirement
7. GREEN: Implement future date validation
8. REFACTOR: Create ShiftValidationSchema with Zod
9. RED: Add integration tests
10. GREEN: Integrate into createShift action

**ADR:** See ADR-0001

---

#### Task 2.2: Shift Conflict Detection Test Coverage
**Status:** PENDING
**Complexity:** COMPLEX
**Priority:** HIGH

**Description:**
Add comprehensive test coverage for shift conflict detection algorithm. Current implementation has basic overlap detection but no tests. Need to cover all edge cases.

**Acceptance Criteria:**
- [ ] Test all overlap scenarios (complete overlap, partial overlap, touching boundaries)
- [ ] Test no-conflict scenarios (before, after, different employees)
- [ ] Test multiple conflicting shifts
- [ ] Test conflict detection performance with many shifts
- [ ] 95%+ coverage of conflict detection logic

**Test Requirements:**
- **Unit Tests:** (15-18 tests)
  - **Overlap Scenarios:**
    - New shift completely contains existing shift
    - Existing shift completely contains new shift
    - New shift overlaps start of existing shift
    - New shift overlaps end of existing shift
    - New shift exactly matches existing shift
  - **Boundary Cases:**
    - New shift ends exactly when existing starts (no conflict)
    - New shift starts exactly when existing ends (no conflict)
  - **No Conflict Scenarios:**
    - New shift entirely before existing shift
    - New shift entirely after existing shift
    - Same time, different employee (no conflict)
  - **Multiple Conflicts:**
    - New shift conflicts with multiple existing shifts
  - **Edge Cases:**
    - Employee has no existing shifts
    - Null employeeId (unassigned shift)
- **Integration Tests:** (5-6 tests)
  - Test conflict detection with real database queries (mocked)
  - Test transaction rollback on conflict
  - Test successful creation when no conflict
  - Test conflict across different locations (should not conflict)
  - Test conflict with same employee different locations (should conflict)
- **E2E Tests:** (2-3 tests)
  - Create shift via form, verify success
  - Create conflicting shift via form, verify error message
  - Update shift to create conflict, verify rejection

**Files to Create/Modify:**
```
web-app/app/lib/shift-actions.ts (MODIFY - refactor conflict detection)
web-app/app/lib/__tests__/shift-actions.test.ts (NEW - comprehensive tests)
web-app/app/lib/__tests__/shift-actions.integration.test.ts (NEW)
tests/e2e/shift-management.spec.ts (NEW)
web-app/app/lib/utils/shift-conflict.ts (NEW - extract algorithm)
web-app/app/lib/utils/__tests__/shift-conflict.test.ts (NEW)
```

**Dependencies:**
- Task 2.1 (shift validation must be complete)

**TDD Workflow:**
1. RED: Extract conflict detection to utility function
2. RED: Write test for complete overlap scenario
3. GREEN: Ensure existing logic handles it
4. RED: Add test for partial overlap (start)
5. GREEN: Verify logic covers it
6. RED: Add test for partial overlap (end)
7. GREEN: Verify coverage
8. RED: Add test for boundary cases (touching)
9. GREEN: Adjust logic if needed (should not conflict)
10. RED: Add test for no conflict scenarios
11. GREEN: Verify algorithm correctness
12. REFACTOR: Extract to dedicated shift-conflict.ts utility
13. RED: Add integration tests with Prisma mocks
14. GREEN: Ensure database query logic is correct
15. RED: Add E2E tests for UI workflow
16. GREEN: Implement and verify

**ADR:** See ADR-0002

---

#### Task 2.3: Refactor Shift Actions for Consistency
**Status:** PENDING
**Complexity:** SIMPLE
**Priority:** MEDIUM

**Description:**
Refactor shift-actions.ts to use the shared Prisma client singleton pattern instead of direct instantiation. This ensures consistency with employee-actions.ts and follows best practices.

**Acceptance Criteria:**
- [ ] Remove direct PrismaClient instantiation
- [ ] Import and use @/app/lib/prisma singleton
- [ ] All tests pass after refactoring
- [ ] No functional changes, only structural

**Test Requirements:**
- **Unit Tests:** (0 new tests, verify existing tests still pass)
- **Integration Tests:** (0 new tests, verify existing tests still pass)

**Files to Create/Modify:**
```
web-app/app/lib/shift-actions.ts (MODIFY - change import)
```

**Dependencies:**
- Should be done early to avoid conflicts with other tasks

**TDD Workflow:**
1. REFACTOR: Change import statement
2. REFACTOR: Remove local PrismaClient instantiation
3. VERIFY: Run all tests to ensure no breakage

**ADR:** None needed (follows existing pattern)

---

### Epic 3: Employee-Shift Skill Matching

#### Task 3.1: Skill Matching Validation
**Status:** PENDING
**Complexity:** MEDIUM
**Priority:** MEDIUM

**Description:**
Implement validation to ensure assigned employee has all required skills for a shift. Currently, requiredSkills is an empty array. Need to validate skill matching when assigning employees to shifts.

**Acceptance Criteria:**
- [ ] When creating shift with employeeId, validate employee has required skills
- [ ] When updating shift to assign employee, validate skills
- [ ] Provide clear error message listing missing skills
- [ ] Allow unassigned shifts (employeeId = null) regardless of requiredSkills
- [ ] Validation is case-insensitive (skills normalized)

**Test Requirements:**
- **Unit Tests:** (10-12 tests)
  - Test employee with all required skills (valid)
  - Test employee missing one skill (invalid)
  - Test employee missing multiple skills (invalid)
  - Test employee with extra skills (valid)
  - Test unassigned shift (null employeeId) with required skills (valid)
  - Test case-insensitive skill matching
  - Test empty requiredSkills array (always valid)
  - Test employee with no skills, shift requires skills (invalid)
- **Integration Tests:** (4-5 tests)
  - Test createShift with skill validation (mocked employee data)
  - Test updateShift to assign employee with skills
  - Test updateShift to assign employee without skills (rejected)
- **E2E Tests:** (2 tests)
  - Assign employee to shift with matching skills (success)
  - Assign employee to shift without required skills (error)

**Files to Create/Modify:**
```
web-app/app/lib/validations/skill-matching.ts (NEW)
web-app/app/lib/validations/__tests__/skill-matching.test.ts (NEW)
web-app/app/lib/shift-actions.ts (MODIFY - add skill validation)
web-app/app/lib/__tests__/shift-actions.test.ts (MODIFY - add tests)
tests/e2e/shift-assignment.spec.ts (NEW)
```

**Dependencies:**
- Task 1.1 (employee skill validation normalized)
- Task 2.2 (shift actions test coverage)

**TDD Workflow:**
1. RED: Create test for employee with matching skills
2. GREEN: Implement basic skill matching utility
3. RED: Add test for missing skills scenario
4. GREEN: Implement skill difference detection
5. REFACTOR: Create reusable skill matching function
6. RED: Add test for case-insensitive matching
7. GREEN: Normalize skills before comparison
8. RED: Add integration tests fetching employee data
9. GREEN: Integrate validation into createShift
10. RED: Add E2E tests
11. GREEN: Ensure UI shows skill errors

**ADR:** See ADR-0001

---

#### Task 3.2: Required Skills Management
**Status:** PENDING
**Complexity:** SIMPLE
**Priority:** LOW

**Description:**
Update shift creation form and action to accept required skills as input. Currently hardcoded to empty array.

**Acceptance Criteria:**
- [ ] Shift creation form accepts requiredSkills (comma-separated or multi-select)
- [ ] Skills are validated using same validation as employee skills
- [ ] Empty requiredSkills is allowed (some shifts may not require specific skills)
- [ ] Skills are normalized (trimmed, uppercase) before saving

**Test Requirements:**
- **Unit Tests:** (4-5 tests)
  - Test parsing comma-separated skills
  - Test normalizing skills
  - Test empty skills input
  - Test invalid skill characters rejected
- **E2E Tests:** (1 test)
  - Create shift with required skills via form

**Files to Create/Modify:**
```
web-app/app/lib/shift-actions.ts (MODIFY - accept requiredSkills from formData)
web-app/app/lib/__tests__/shift-actions.test.ts (MODIFY - add tests)
web-app/app/ui/shifts/create-form.tsx (MODIFY - add requiredSkills field)
tests/e2e/shift-management.spec.ts (MODIFY - test required skills)
```

**Dependencies:**
- Task 1.1 (skill validation pattern established)

**TDD Workflow:**
1. RED: Add test for parsing requiredSkills from formData
2. GREEN: Parse and normalize requiredSkills
3. RED: Add test for skill validation
4. GREEN: Reuse employee skill validation
5. RED: Add E2E test for form field
6. GREEN: Add UI field and verify

**ADR:** None needed (follows existing patterns)

---

### Epic 4: Testing Infrastructure & Documentation

#### Task 4.1: Prisma Mock Enhancement
**Status:** PENDING
**Complexity:** MEDIUM
**Priority:** HIGH

**Description:**
Enhance Prisma mocks to support comprehensive testing of transactions, cascade operations, and complex queries. Current mocks are minimal.

**Acceptance Criteria:**
- [ ] Mock supports transaction operations ($transaction)
- [ ] Mock supports cascade delete behavior
- [ ] Mock supports unique constraint violations
- [ ] Mock provides realistic error scenarios
- [ ] Mock helpers for common test setups (createTestEmployee, etc.)

**Test Requirements:**
- **Unit Tests:** (N/A - this is test infrastructure)

**Files to Create/Modify:**
```
web-app/__mocks__/prisma.ts (MODIFY - enhance significantly)
web-app/__mocks__/prisma-helpers.ts (NEW - test data factories)
```

**Dependencies:**
- Should be done early to support other testing tasks

**TDD Workflow:**
1. Identify all Prisma operations used in actions (CRUD, transactions, queries)
2. Implement mock support for each operation
3. Create helper functions for test data creation
4. Verify all existing tests still pass
5. Document mock usage in TEST_CONFIGURATION.md

**ADR:** See ADR-0003

---

#### Task 4.2: E2E Test Infrastructure
**Status:** PENDING
**Complexity:** MEDIUM
**Priority:** HIGH

**Description:**
Set up comprehensive E2E test infrastructure with Playwright, including database seeding, authentication helpers, and page object models.

**Acceptance Criteria:**
- [ ] E2E tests can seed database with test data
- [ ] E2E tests can authenticate as admin/employee
- [ ] Page object models for employee and shift pages
- [ ] Helper functions for common workflows
- [ ] Tests clean up after themselves (isolated)

**Test Requirements:**
- **E2E Tests:** (Setup only, no new tests yet)

**Files to Create/Modify:**
```
tests/e2e/helpers/auth.ts (NEW)
tests/e2e/helpers/database.ts (NEW)
tests/e2e/page-objects/employee-page.ts (NEW)
tests/e2e/page-objects/shift-page.ts (NEW)
tests/setup/global-setup.ts (NEW)
tests/setup/global-teardown.ts (NEW)
playwright.config.ts (MODIFY - add global setup/teardown)
```

**Dependencies:**
- None (infrastructure task)

**TDD Workflow:**
1. Create authentication helper (login as admin/employee)
2. Create database seeding helper
3. Create page object models
4. Verify with one simple E2E test
5. Document E2E patterns in TEST_CONFIGURATION.md

**ADR:** See ADR-0003

---

#### Task 4.3: Architecture Decision Records
**Status:** PENDING
**Complexity:** SIMPLE
**Priority:** MEDIUM

**Description:**
Create ADRs for all major technical decisions made during Sprint 2.

**Acceptance Criteria:**
- [ ] ADR-0001: Employee and Shift Validation Strategy
- [ ] ADR-0002: Shift Conflict Detection Algorithm
- [ ] ADR-0003: Test Coverage Strategy for Server Actions

**Files to Create/Modify:**
```
.ai/artifacts/decisions/adr-0001-validation-strategy.md (NEW)
.ai/artifacts/decisions/adr-0002-conflict-detection.md (NEW)
.ai/artifacts/decisions/adr-0003-test-coverage-strategy.md (NEW)
```

**Dependencies:**
- Can be created as decisions are made during implementation

**TDD Workflow:**
- N/A (documentation task)

**ADR:** Meta-ADR: This task defines how we document decisions

---

#### Task 4.4: Feature Documentation
**Status:** PENDING
**Complexity:** SIMPLE
**Priority:** LOW

**Description:**
Create comprehensive feature documentation for employee and shift management using templates.

**Acceptance Criteria:**
- [ ] Feature doc for employee management
- [ ] Feature doc for shift management
- [ ] API endpoint documentation for all actions
- [ ] Update CHANGELOG.md with Sprint 2 additions

**Files to Create/Modify:**
```
.ai/artifacts/docs/features/FEATURE-001-employee-management.md (NEW)
.ai/artifacts/docs/features/FEATURE-002-shift-management.md (NEW)
.ai/artifacts/docs/api/employee-actions.md (NEW)
.ai/artifacts/docs/api/shift-actions.md (NEW)
CHANGELOG.md (MODIFY)
```

**Dependencies:**
- All feature tasks must be complete

**TDD Workflow:**
- N/A (documentation task)

**ADR:** None needed

---

## Task Execution Order

### Phase 1: Foundation (Days 1-3)
**Goal:** Set up testing infrastructure and refactor for consistency

1. Task 2.3: Refactor Shift Actions for Consistency (SIMPLE, 1 hour)
2. Task 4.1: Prisma Mock Enhancement (MEDIUM, 4 hours)
3. Task 4.2: E2E Test Infrastructure (MEDIUM, 4 hours)

**Why this order:**
- Refactor first to avoid conflicts
- Testing infrastructure needed before writing tests
- Sets foundation for all other tasks

### Phase 2: Employee Management (Days 4-7)
**Goal:** Harden employee features with validation and tests

4. Task 1.1: Enhanced Employee Skill Validation (MEDIUM, 6 hours)
5. Task 1.3: Employee Max Hours Validation (SIMPLE, 2 hours)
6. Task 1.2: Employee CRUD Test Coverage Enhancement (MEDIUM, 8 hours)
7. Task 4.3: Create ADR-0001 (SIMPLE, 1 hour)

**Why this order:**
- Validation first (Task 1.1) as it's a dependency for tests
- Simple max hours validation alongside
- Comprehensive test coverage once validation is solid
- Document decisions immediately

### Phase 3: Shift Management (Days 8-11)
**Goal:** Harden shift features with validation and conflict detection

8. Task 2.1: Shift Validation Enhancement (MEDIUM, 5 hours)
9. Task 2.2: Shift Conflict Detection Test Coverage (COMPLEX, 10 hours)
10. Task 4.3: Create ADR-0002 (SIMPLE, 1 hour)

**Why this order:**
- Validation before conflict detection tests
- Conflict detection is most complex, allocate sufficient time
- Document algorithm decisions

### Phase 4: Integration (Days 12-13)
**Goal:** Connect employee and shift features with skill matching

11. Task 3.2: Required Skills Management (SIMPLE, 3 hours)
12. Task 3.1: Skill Matching Validation (MEDIUM, 6 hours)

**Why this order:**
- Required skills input needed before skill matching validation
- Integrates employee and shift epics

### Phase 5: Documentation (Day 14)
**Goal:** Complete all documentation and finalize sprint

13. Task 4.3: Create ADR-0003 (SIMPLE, 1 hour)
14. Task 4.4: Feature Documentation (SIMPLE, 4 hours)

**Why this order:**
- Final ADR after all testing is complete
- Feature docs at the end when all features are done

---

## Sprint Metrics Targets

### Test Coverage
- **Overall Target:** 90%+
- **Employee Actions:** 95%+
- **Shift Actions:** 95%+
- **Validation Utilities:** 100%

### Tests to Add
- **Unit Tests:** ~90-100 tests
- **Integration Tests:** ~25-30 tests
- **E2E Tests:** ~10-15 tests
- **Total New Tests:** ~125-145 tests

### Documentation
- **ADRs:** 3 (minimum)
- **Feature Docs:** 2
- **API Docs:** 2
- **Updated Files:** CHANGELOG.md, TEST_CONFIGURATION.md

### Code Quality
- **No linting errors**
- **All tests passing**
- **No TypeScript errors**
- **80%+ minimum coverage enforced by hooks**

---

## Success Criteria

### Must Have (Mandatory)
- ✅ All tasks in Phase 1-4 complete
- ✅ 90%+ test coverage achieved
- ✅ All tests passing (unit, integration, E2E)
- ✅ All ADRs created (ADR-0001, 0002, 0003)
- ✅ Employee CRUD fully tested and validated
- ✅ Shift conflict detection fully tested
- ✅ Skill matching validation implemented and tested
- ✅ Git hooks passing (pre-commit, commit-msg)

### Should Have (High Priority)
- ✅ Feature documentation complete
- ✅ API documentation complete
- ✅ CHANGELOG updated
- ✅ E2E test infrastructure robust
- ✅ Prisma mocks comprehensive

### Nice to Have (If Time Permits)
- Additional edge case tests
- Performance tests for conflict detection
- Accessibility tests for forms
- Visual regression tests

---

## Risk Mitigation

### Risk 1: Prisma Mock Complexity
**Impact:** HIGH
**Likelihood:** MEDIUM
**Mitigation:**
- Start with Prisma mock enhancement early (Phase 1)
- Use jest-mock-extended library for type-safe mocks
- Create incremental mocks (start simple, add complexity)
- Fallback: Use in-memory SQLite for integration tests if mocking too complex

### Risk 2: E2E Test Flakiness
**Impact:** MEDIUM
**Likelihood:** HIGH
**Mitigation:**
- Use Playwright's built-in retry and wait mechanisms
- Implement proper database seeding and cleanup
- Use data-testid attributes for stable selectors
- Run E2E tests in CI with multiple retries
- Fallback: Focus on unit/integration tests, minimal E2E

### Risk 3: Time Constraint
**Impact:** MEDIUM
**Likelihood:** MEDIUM
**Mitigation:**
- Prioritize Phase 1-3 (foundation + core features)
- Phase 4-5 can spill into next sprint if needed
- Focus on must-have criteria first
- Defer nice-to-have items
- Ensure 80% minimum coverage even if 90% target not met

### Risk 4: Conflict Detection Algorithm Complexity
**Impact:** HIGH
**Likelihood:** MEDIUM
**Mitigation:**
- Start with comprehensive test cases defining expected behavior
- Extract algorithm to separate utility for easier testing
- Reference existing implementation as baseline
- Use visual diagrams to understand overlap scenarios
- Fallback: Keep existing algorithm if tests validate it works

---

## Notes for Next Agent

### Context
Sprint 1 successfully established TDD infrastructure. Sprint 2 focuses on implementing robust business features with comprehensive test coverage. The codebase already has basic employee and shift CRUD operations, but they lack validation, error handling, and test coverage.

### Getting Started
1. Read this sprint plan thoroughly
2. Start with Phase 1, Task 2.3 (simple refactor)
3. Follow the task execution order strictly
4. Create a work session log for each phase/task
5. Update this file with progress after each task completion
6. Log all decisions and blockers

### Key Patterns to Follow
- **TDD Cycle:** RED (test) → GREEN (implement) → REFACTOR (improve)
- **Validation:** Use Zod schemas for all runtime validation
- **Error Handling:** Return structured State type with field-level errors
- **Database:** Use Prisma singleton from @/app/lib/prisma
- **Transactions:** Use prisma.$transaction for multi-model operations
- **Testing:** AAA pattern (Arrange, Act, Assert)
- **Mocking:** Use jest.mock for Next.js modules, Prisma mocks for database

### Important Files
- **Actions:** `app/lib/employee-actions.ts`, `app/lib/shift-actions.ts`
- **Schema:** `prisma/schema.prisma`
- **Tests:** `app/lib/__tests__/*.test.ts`, `tests/e2e/*.spec.ts`
- **Mocks:** `__mocks__/prisma.ts`
- **Configs:** `jest.config.ts`, `playwright.config.ts`

### TDD Reminders
- Write test FIRST (it should fail)
- Commit failing test: `test(scope): add failing test for [feature]`
- Implement MINIMUM code to pass
- Commit passing code: `feat(scope): implement [feature]`
- Refactor ONLY if needed
- Commit refactor: `refactor(scope): improve [component]`
- Update test coverage: `./.ai/scripts/update-coverage.sh`

### Testing Commands
```bash
# Unit tests
npm test

# Specific test file
npm test -- employee-actions.test.ts

# Watch mode
npm test:watch

# Coverage
npm test -- --coverage

# E2E tests
npm run test:e2e

# E2E specific test
npm run test:e2e -- employee-management
```

### Before Each Commit
1. Run tests: `npm test`
2. Check coverage: `npm test -- --coverage`
3. Verify no TypeScript errors: `npm run type-check`
4. Use conventional commit format
5. Git hooks will enforce testing and coverage

---

## Active Tasks

### Current Task
**None - Sprint planning complete, ready for implementation**

### In Progress
None

### Blocked
None

---

## Completed Tasks
(Will be updated as tasks are completed)

---

## Sprint Retrospective (To be filled at end of sprint)

### What Went Well
(To be filled)

### What Could Be Improved
(To be filled)

### Action Items for Next Sprint
(To be filled)

---

**Sprint Status:** 🚧 READY TO START
**Infrastructure Ready:** ✅ YES
**Next Agent:** Start with Phase 1, Task 2.3
**Last Updated:** 2026-02-15
