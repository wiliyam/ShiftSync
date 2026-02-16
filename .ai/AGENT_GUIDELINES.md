# AI Agent Guidelines for ShiftSync Development

**Version:** 2.0.0
**Last Updated:** 2026-02-16
**Purpose:** Define rules, protocols, and best practices for AI agents working on this codebase

---

## Table of Contents
1. [Core Principles](#core-principles)
2. [Before Starting Any Work](#before-starting-any-work)
3. [Test-Driven Development (TDD) Requirements](#test-driven-development-tdd-requirements)
4. [Artifact Management](#artifact-management)
5. [Multi-Agent Collaboration](#multi-agent-collaboration)
6. [Code Standards](#code-standards)
7. [Communication Protocols](#communication-protocols)
8. [Error Handling](#error-handling)

---

## Core Principles

### 1. Test-First Philosophy
**MANDATORY:** Every code change MUST be preceded by a failing test. No exceptions.

### 2. Documentation as Code
All decisions, changes, and progress MUST be saved to disk in structured formats that other agents can read and understand.

### 3. Context Preservation
Assume any agent can be interrupted and another agent will continue the work. Save state frequently.

### 4. Explicit Communication
Write clear, structured logs and artifacts. Future agents should understand context without asking questions.

---

## Before Starting Any Work

### Step 1: Read Project Context
**REQUIRED FILES** (in order):
1. `/README.md` - Project overview and quick start
2. `/docs/product_requirements.md` - Business requirements
3. `/docs/architecture_design.md` - Technical architecture
4. `/CONTRIBUTING.md` - Development workflow
5. `/.ai/TDD_WORKFLOW.md` - Test-driven development process
6. `/.ai/artifacts/wip/current-sprint.md` - Current work items
7. `/.ai/artifacts/decisions/adr-*.md` - Architecture Decision Records

### Step 2: Check Work-in-Progress (WIP)
```bash
# Check what's currently being worked on
ls -la .ai/artifacts/wip/

# Read the current sprint/task
cat .ai/artifacts/wip/current-sprint.md

# Check development log
tail -50 .ai/artifacts/logs/development.jsonl
```

### Step 3: Announce Your Presence
Create a work session log:
```bash
# Template provided in .ai/templates/work-session.md
cp .ai/templates/work-session.md .ai/artifacts/wip/session-$(date +%Y%m%d-%H%M%S).md
```

### Step 4: Verify Testing Setup
```bash
cd web-app
npm test -- --listTests
npm run test:e2e -- --list
```

---

## Test-Driven Development (TDD) Requirements

### The Red-Green-Refactor Cycle

**THIS IS MANDATORY. FOLLOW THIS SEQUENCE FOR EVERY CHANGE.**

#### 1. RED - Write Failing Test First
```typescript
// Example: .ai/artifacts/wip/current-test.md
## Current Test Being Written
- **Feature:** Add employee skill validation
- **Test File:** web-app/app/lib/__tests__/employee-validation.test.ts
- **Status:** RED (failing as expected)
- **Started:** 2026-02-15 10:30:00
```

**Actions:**
1. Create test file or add test case
2. Run test and verify it fails: `npm test -- path/to/test.test.ts`
3. Document the failing test in `.ai/artifacts/wip/current-test.md`
4. Commit test with message: `test: add failing test for [feature]`

#### 2. GREEN - Write Minimum Code to Pass
```typescript
// Implement just enough to make the test pass
// No extra features, no refactoring yet
```

**Actions:**
1. Write minimal implementation
2. Run test and verify it passes: `npm test -- path/to/test.test.ts`
3. Update `.ai/artifacts/wip/current-test.md` status to GREEN
4. Commit with message: `feat: implement [feature] (test passing)`

#### 3. REFACTOR - Improve Code Quality
```typescript
// Now you can refactor, improve, optimize
// Tests must still pass after refactoring
```

**Actions:**
1. Refactor code (if needed)
2. Run ALL tests: `npm test`
3. Update `.ai/artifacts/wip/current-test.md` status to REFACTORED
4. Commit with message: `refactor: improve [component] implementation`
5. Move test record to `.ai/artifacts/completed/test-[date]-[feature].md`

### Test Coverage Requirements
- **Unit Tests:** REQUIRED for all business logic, utilities, and API routes
- **Integration Tests:** REQUIRED for database operations
- **E2E Tests:** REQUIRED for critical user flows
- **Minimum Coverage:** 80% (tracked in `.ai/artifacts/test-coverage.md`)

### Test File Naming Convention
```
web-app/
├── app/
│   ├── lib/
│   │   ├── employee-actions.ts
│   │   └── __tests__/
│   │       └── employee-actions.test.ts
│   ├── ui/
│   │   ├── employees/
│   │   │   ├── employee-table.tsx
│   │   │   └── __tests__/
│   │   │       └── employee-table.test.tsx
└── tests/
    └── e2e/
        └── employee-management.spec.ts
```

---

## Artifact Management

### Required Artifacts

#### 1. Development Log (JSONL format)
**Path:** `.ai/artifacts/logs/development.jsonl`

Each line is a JSON object:
```jsonl
{"timestamp":"2026-02-15T10:30:00Z","agent":"claude-sonnet-4.5","action":"test_created","details":"Created failing test for employee skill validation","file":"web-app/app/lib/__tests__/employee-validation.test.ts","status":"red"}
{"timestamp":"2026-02-15T10:45:00Z","agent":"claude-sonnet-4.5","action":"test_passed","details":"Implemented employee skill validation","file":"web-app/app/lib/employee-validation.ts","status":"green"}
{"timestamp":"2026-02-15T11:00:00Z","agent":"claude-sonnet-4.5","action":"refactored","details":"Extracted validation logic to utility function","status":"refactored"}
```

**Required Fields:**
- `timestamp`: ISO 8601 format
- `agent`: Agent identifier (format: `antigravity-[model-name]`, e.g. `antigravity-gemini-2.0-pro`)
- `action`: One of [test_created, test_passed, refactored, decision_made, blocked, completed]
- `details`: Human-readable description
- `file`: Affected file path (if applicable)
- `status`: Current TDD phase or workflow status

#### 2. Architecture Decision Records (ADR)
**Path:** `.ai/artifacts/decisions/adr-NNNN-title.md`

**Template:**
```markdown
# ADR-0001: Use Zustand for State Management

**Status:** Accepted
**Date:** 2026-02-15
**Decided By:** Agent claude-sonnet-4.5
**Related Task:** Feature/employee-state-management

## Context
We need client-side state management for employee data caching.

## Decision
Use Zustand instead of Redux for lighter weight and better TypeScript support.

## Consequences
- Positive: Less boilerplate, better DX
- Negative: Less ecosystem tooling than Redux
- Mitigation: Create custom devtools integration

## Alternatives Considered
- Redux Toolkit
- React Context
- Jotai

## Implementation Checklist
- [ ] Install Zustand
- [ ] Create employee store
- [ ] Write tests for store
- [ ] Migrate existing Context usage

## Rollback Plan
If issues arise, can revert to React Context as fallback.
```

#### 3. Work-in-Progress (WIP) Tracking
**Path:** `.ai/artifacts/wip/current-sprint.md`

```markdown
# Current Sprint: Employee Management MVP

**Sprint Start:** 2026-02-15
**Sprint End:** 2026-02-22
**Current Agent:** claude-sonnet-4.5
**Session ID:** session-20260215-103000

## Active Tasks
- [x] Set up employee CRUD operations
- [IN PROGRESS] Add employee skill validation
  - Test Status: GREEN
  - Files Modified:
    - web-app/app/lib/employee-validation.ts
    - web-app/app/lib/__tests__/employee-validation.test.ts
  - Next: Add E2E test for employee creation flow
- [ ] Implement employee search functionality
- [ ] Add employee availability calendar

## Blocked Tasks
None currently

## Completed Today
- Employee table component with tests (3 tests, all passing)
- Employee creation API endpoint (5 tests, all passing)

## Notes for Next Agent
The employee validation logic is complete but needs E2E coverage.
Database schema for skills is in prisma/schema.prisma.
Use existing test patterns from employee-actions.test.ts.
```

#### 4. Test Coverage Report
**Path:** `.ai/artifacts/test-coverage.md`

**Auto-generated after each test run:**
```bash
npm test -- --coverage --coverageReporters=json-summary
```

```markdown
# Test Coverage Report

**Last Updated:** 2026-02-15 11:00:00
**Overall Coverage:** 82%

## Coverage by Module
| Module | Statements | Branches | Functions | Lines |
|--------|-----------|----------|-----------|-------|
| app/lib/employee-actions.ts | 95% | 90% | 100% | 94% |
| app/lib/shift-actions.ts | 78% | 70% | 85% | 77% |
| app/ui/employees/employee-table.tsx | 88% | 85% | 90% | 87% |

## Below Threshold (<80%)
- app/lib/shift-actions.ts - **ACTION REQUIRED**
  - Missing: Error handling for database failures
  - Missing: Edge case for overlapping shifts

## Recent Changes
- 2026-02-15: Added employee-validation.ts (100% coverage)
```

#### 5. Work Session Log
**Path:** `.ai/artifacts/wip/session-YYYYMMDD-HHMMSS.md`

```markdown
# Work Session: 2026-02-15-103000

**Agent:** claude-sonnet-4.5
**Task:** Implement employee skill validation
**Started:** 10:30:00
**Ended:** 11:15:00
**Duration:** 45 minutes

## Objectives
- [x] Create failing test for skill validation
- [x] Implement validation logic
- [x] Refactor to use Zod schema
- [ ] Add E2E test (carried over to next session)

## TDD Cycles Completed
1. **Cycle 1:** Basic skill validation
   - RED: 10:30 - Test created, expecting validation function
   - GREEN: 10:40 - Basic validation implemented
   - REFACTOR: 10:50 - Extracted to utility module

2. **Cycle 2:** Skill uniqueness check
   - RED: 10:55 - Test for duplicate skill rejection
   - GREEN: 11:05 - Duplicate detection added
   - REFACTOR: 11:10 - Used Zod schema for cleaner validation

## Files Modified
- `web-app/app/lib/employee-validation.ts` (new)
- `web-app/app/lib/__tests__/employee-validation.test.ts` (new)
- `web-app/app/lib/schemas/employee.ts` (updated)

## Tests Added
- Unit: 6 tests (all passing)
- Integration: 0
- E2E: 0 (planned for next session)

## Commits Made
1. `test: add failing test for employee skill validation`
2. `feat: implement employee skill validation (test passing)`
3. `refactor: use Zod schema for skill validation`

## Decisions Made
See ADR-0012: Use Zod for all validation schemas

## Blockers
None

## Next Steps for Following Agent
1. Add E2E test for employee creation with skills
2. Integrate validation into employee-actions.ts
3. Update UI to display validation errors
4. Test database constraints align with validation rules

## Knowledge Transfer
- Zod schema is in `app/lib/schemas/employee.ts`
- Validation utilities pattern established - follow for other entities
- All validation functions return Result<T, Error> type
```

---

## Multi-Agent Collaboration

### Locking Mechanism
Before modifying a file, check for locks:

**Path:** `.ai/artifacts/wip/locks.json`
```json
{
  "web-app/app/lib/employee-actions.ts": {
    "agent": "claude-sonnet-4.5",
    "session": "session-20260215-103000",
    "locked_at": "2026-02-15T10:30:00Z",
    "reason": "Implementing skill validation"
  }
}
```

**Acquire Lock:**
```bash
# Before modifying a file
echo '{"file":"path/to/file.ts","agent":"your-id","session":"session-id","locked_at":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","reason":"your reason"}' >> .ai/artifacts/wip/locks.json
```

**Release Lock:**
```bash
# After committing changes
# Remove your lock entry from locks.json
```

### Conflict Resolution
If you find a file locked:
1. Check the timestamp (locks > 2 hours are stale)
2. Read the session log to understand context
3. If stale, take over and note in your session log
4. If active, work on a different task or coordinate via logs

### Parallel Work Guidelines
**Safe to work in parallel:**
- Different feature modules
- Different test files
- Different UI components
- Independent API routes

**Requires coordination:**
- Shared utilities
- Database schema changes
- Shared types/interfaces
- CI/CD configuration

---

## Code Standards

### TypeScript Requirements
- **Strict Mode:** Enabled (no `any`, no `@ts-ignore`)
- **Type Exports:** All public interfaces must be exported
- **Zod Schemas:** Use for all runtime validation
- **Error Handling:** Use Result<T, E> pattern (see `app/lib/types/result.ts`)

### Testing Standards
```typescript
// ✅ GOOD: Descriptive, follows AAA pattern
describe('EmployeeValidation', () => {
  describe('validateSkills', () => {
    it('should reject duplicate skill names', () => {
      // Arrange
      const skills = ['TypeScript', 'TypeScript', 'React'];

      // Act
      const result = validateSkills(skills);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('duplicate');
    });
  });
});

// ❌ BAD: Vague, no structure
test('skills work', () => {
  expect(validateSkills(['React'])).toBeTruthy();
});
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `EmployeeTable.tsx`)
- Utilities: `kebab-case.ts` (e.g., `employee-validation.ts`)
- Tests: `*.test.ts` or `*.spec.ts`
- Types: `*.types.ts`
- Constants: `*.constants.ts`

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `test`: Adding or modifying tests (RED phase)
- `feat`: New feature implementation (GREEN phase)
- `refactor`: Code improvements (REFACTOR phase)
- `fix`: Bug fixes
- `docs`: Documentation updates
- `chore`: Build, configs, dependencies

**Examples:**
```
test(employee): add failing test for skill validation

Creating test case for duplicate skill detection.
Part of TDD cycle for employee validation feature.

Refs: #123

---

feat(employee): implement skill validation

Minimum code to pass skill validation tests.
Uses Zod schema for type-safe validation.

Tests: 6 passing
Coverage: 100%

---

refactor(employee): extract validation to utility module

Improved code organization and reusability.
All tests still passing.
```

---

## Communication Protocols

### Log Entry Types

#### 1. Action Log
```jsonl
{"timestamp":"2026-02-15T10:30:00Z","type":"action","agent":"claude-sonnet-4.5","action":"test_created","details":"Created test for employee skill validation","files":["web-app/app/lib/__tests__/employee-validation.test.ts"],"status":"red"}
```

#### 2. Decision Log
```jsonl
{"timestamp":"2026-02-15T10:35:00Z","type":"decision","agent":"claude-sonnet-4.5","decision":"Use Zod for validation schemas","rationale":"Type safety and runtime validation in one","adr":"adr-0012-zod-validation.md"}
```

#### 3. Blocker Log
```jsonl
{"timestamp":"2026-02-15T10:40:00Z","type":"blocker","agent":"claude-sonnet-4.5","issue":"Database schema missing skills table","impact":"Cannot complete employee skill integration","suggested_action":"Add skills table migration","severity":"high"}
```

#### 4. Completion Log
```jsonl
{"timestamp":"2026-02-15T11:00:00Z","type":"completion","agent":"claude-sonnet-4.5","task":"Employee skill validation","tests_added":6,"tests_passing":6,"coverage":"100%","files_modified":["employee-validation.ts","employee-validation.test.ts"],"commits":["abc123","def456","ghi789"]}
```

### Status Updates
Update `.ai/artifacts/wip/current-sprint.md` after each TDD cycle completion.

---

## Error Handling

### When Tests Fail
1. **DO NOT** skip or comment out failing tests
2. **DO** investigate root cause
3. **DO** log the failure in development.jsonl
4. **DO** create a blocker entry if you cannot fix immediately
5. **DO** document the error state in session log

### When Blocked
```markdown
## BLOCKER

**Date:** 2026-02-15 11:00:00
**Agent:** claude-sonnet-4.5
**Issue:** Cannot proceed with employee skill validation

**Details:**
The database schema is missing the `skills` table referenced in the PRD.
Tests are written and failing (as expected), but implementation blocked.

**Investigation:**
- Checked prisma/schema.prisma - no skills model
- Checked migrations - no skills table
- Checked docs - skills are mentioned in architecture_design.md

**Suggested Actions:**
1. Create Prisma migration for skills table
2. Update schema.prisma with Skills model
3. Run migration: `npx prisma migrate dev`
4. Resume implementation

**Priority:** High
**Impact:** Blocks employee management MVP
**Assigned To:** Next agent or human developer
```

### Recovery Protocol
If you encounter an agent's incomplete work:
1. Read their session log
2. Check test status: `npm test`
3. Review their WIP files
4. Continue from their last GREEN state
5. Document transition in your session log

---

## Quick Reference

### Daily Workflow Checklist
```markdown
## Starting Work
- [ ] Read .ai/AGENT_GUIDELINES.md (this file)
- [ ] Read .ai/artifacts/wip/current-sprint.md
- [ ] Check .ai/artifacts/wip/locks.json
- [ ] Create session log: .ai/artifacts/wip/session-[timestamp].md
- [ ] Verify tests pass: npm test

## For Each Feature
- [ ] RED: Write failing test first
- [ ] Document test in current-test.md
- [ ] Commit test: "test: add failing test for [feature]"
- [ ] GREEN: Write minimum code to pass
- [ ] Verify test passes
- [ ] Commit code: "feat: implement [feature]"
- [ ] REFACTOR: Improve code quality (if needed)
- [ ] Verify all tests still pass
- [ ] Commit refactor: "refactor: improve [component]"
- [ ] Update development.jsonl
- [ ] Update test-coverage.md

## Ending Work
- [ ] Verify all tests pass: npm test
- [ ] Update current-sprint.md with progress
- [ ] Complete session log with next steps
- [ ] Release any locks in locks.json
- [ ] Commit and push changes
```

### Essential Commands
```bash
# Run unit tests
npm test

# Run specific test file
npm test -- path/to/test.test.ts

# Run tests in watch mode
npm test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm test -- --coverage

# Update development log (example)
echo '{"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","agent":"'$AGENT_ID'","action":"test_created","details":"Created test for X","status":"red"}' >> .ai/artifacts/logs/development.jsonl
```

---

## UI Development Guidelines

### Design System: shadcn/ui
The project uses [shadcn/ui](https://ui.shadcn.com) for all UI components. **Do NOT use raw HTML elements** for buttons, inputs, labels, cards, tables, etc. Always use shadcn/ui components.

#### MCP Server
A shadcn/ui MCP server is configured in `.mcp.json`. Use it to:
- **Browse** available components: ask about what components exist
- **Search** for specific components: find the right component for a use case
- **Install** new components: `npx shadcn@latest add <component>`

#### Key Components & When to Use Them
| Instead of... | Use... | Import |
|---------------|--------|--------|
| `<button>` | `<Button>` | `@/components/ui/button` |
| `<input>` | `<Input>` | `@/components/ui/input` |
| `<label>` | `<Label>` | `@/components/ui/label` |
| `<select>` | `<Select>` | `@/components/ui/select` |
| `<table>` | `<Table>` | `@/components/ui/table` |
| `<textarea>` | `<Textarea>` | `@/components/ui/textarea` |
| Custom card div | `<Card>` | `@/components/ui/card` |
| Custom modal | `<Sheet>` or `<Dialog>` | `@/components/ui/sheet` |

#### Icons
Use **Lucide React** icons (NOT Heroicons):
```typescript
import { Home, Users, Calendar, MapPin } from 'lucide-react';
```

#### Styling Utility
Use the `cn()` helper for conditional classes:
```typescript
import { cn } from '@/lib/utils';
<div className={cn('base-class', isActive && 'active-class')} />
```

### Responsive Design Rules
- **Mobile-first**: Start with mobile layout, add `md:` / `lg:` breakpoints
- **Navigation**: Use `Sheet` (slide-out) on mobile, fixed sidebar on desktop
- **Tables**: Use card layout on mobile (`md:hidden`), table on desktop (`hidden md:table`)
- **Forms**: Full-width on mobile, `max-w-lg mx-auto` on desktop

### React 19 / Next.js 16 Patterns
- **Forms**: Use `useActionState()` from `'react'` (NOT `useFormState` from `'react-dom'`)
- **Server Actions**: Must have `'use server'` directive at top of file
- **Form Status**: Use `useFormStatus()` from `'react-dom'` for pending states
- **Server Components**: Default for pages; add `'use client'` only when needed

## E2E Testing Guidelines

### Playwright Configuration
- **Browsers**: Chromium, Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12), Firefox
- **Base URL**: `http://localhost:3000`
- **Test Dir**: `web-app/e2e/`

### User Roles for E2E Tests
| Role | Email | Password | Redirect |
|------|-------|----------|----------|
| ADMIN | admin@shiftsync.com | password | /admin |
| EMPLOYEE | (seed data) | password | /dashboard |

### E2E Test Structure
```typescript
// Use auth fixtures for role-based tests
import { test, expect } from '@playwright/test';

// Admin tests
test.describe('Admin: Employee Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email').fill('admin@shiftsync.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Log in' }).click();
        await expect(page).toHaveURL(/\/admin/);
    });

    test('can create employee', async ({ page }) => {
        // test implementation
    });
});
```

### E2E Test Files
| File | Coverage |
|------|----------|
| `e2e/auth.spec.ts` | Login, logout, role-based redirects |
| `e2e/admin-dashboard.spec.ts` | Dashboard stats, quick actions, sidebar |
| `e2e/admin-employees.spec.ts` | CRUD operations, mobile responsiveness |
| `e2e/admin-locations.spec.ts` | Location CRUD, empty state |
| `e2e/admin-shifts.spec.ts` | Week view, shift creation |
| `e2e/employee-dashboard.spec.ts` | Employee view, access control |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2026-02-16 | Added UI guidelines (shadcn/ui, MCP server, responsive design), E2E testing guidelines, React 19 patterns |
| 1.0.0 | 2026-02-15 | Initial guidelines established |

---

## Questions or Issues?

If you (as an agent) encounter ambiguity or need clarification:
1. Check existing ADRs in `.ai/artifacts/decisions/`
2. Review similar implementations in the codebase
3. Document your decision and create a new ADR
4. Proceed with the most reasonable interpretation
5. Flag for human review in session log if uncertain

**Remember:** When in doubt, write a test first. The test will clarify the requirements.
