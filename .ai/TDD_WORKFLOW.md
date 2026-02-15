# Test-Driven Development (TDD) Workflow for ShiftSync

**Version:** 1.0.0
**Last Updated:** 2026-02-15
**Enforcement:** MANDATORY for all code changes

---

## Table of Contents
1. [TDD Philosophy](#tdd-philosophy)
2. [The Red-Green-Refactor Cycle](#the-red-green-refactor-cycle)
3. [Test Categories](#test-categories)
4. [Testing Stack](#testing-stack)
5. [Workflow Examples](#workflow-examples)
6. [Test Patterns](#test-patterns)
7. [Coverage Requirements](#coverage-requirements)
8. [Troubleshooting](#troubleshooting)

---

## TDD Philosophy

### Why TDD is Mandatory

**Test-Driven Development** ensures:
1. **Code Quality:** Tests define expected behavior before implementation
2. **Design Quality:** Writing tests first leads to better API design
3. **Regression Prevention:** Every feature has tests from day one
4. **Living Documentation:** Tests serve as executable specifications
5. **Confidence:** Safe refactoring without breaking functionality
6. **AI Agent Continuity:** Tests provide clear success criteria for agents

### The TDD Mantra

```
🔴 RED → 🟢 GREEN → 🔵 REFACTOR
```

**Never write production code without a failing test first.**

---

## The Red-Green-Refactor Cycle

### Phase 1: 🔴 RED - Write a Failing Test

**Goal:** Define the expected behavior through a test that fails

#### Steps:
1. **Identify the requirement**
   ```markdown
   Feature: Validate employee skills to prevent duplicates
   Acceptance Criteria: Reject skill arrays with duplicate names
   ```

2. **Write the test FIRST**
   ```typescript
   // web-app/app/lib/__tests__/employee-validation.test.ts
   import { validateSkills } from '../employee-validation';

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
   ```

3. **Run the test and verify it FAILS**
   ```bash
   npm test -- employee-validation.test.ts
   ```

   Expected output:
   ```
   FAIL  app/lib/__tests__/employee-validation.test.ts
   ● validateSkills › should reject duplicate skill names

   Cannot find module '../employee-validation'
   ```

4. **Document the RED phase**
   ```bash
   echo '{"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","agent":"'$AGENT_ID'","action":"test_created","details":"Created failing test for skill validation","file":"web-app/app/lib/__tests__/employee-validation.test.ts","status":"red"}' >> .ai/artifacts/logs/development.jsonl
   ```

5. **Commit the test**
   ```bash
   git add web-app/app/lib/__tests__/employee-validation.test.ts
   git commit -m "test(employee): add failing test for skill validation

   Creating test to validate employee skills array.
   Should reject duplicate skill names.

   Status: RED (failing as expected)
   "
   ```

**✅ RED Phase Complete when:**
- Test is written
- Test fails for the right reason (not syntax errors)
- Test is committed
- Logged in development.jsonl

---

### Phase 2: 🟢 GREEN - Make the Test Pass

**Goal:** Write the MINIMUM code to make the test pass

#### Steps:

1. **Implement the minimal solution**
   ```typescript
   // web-app/app/lib/employee-validation.ts
   export function validateSkills(skills: string[]) {
     const uniqueSkills = new Set(skills);

     if (uniqueSkills.size !== skills.length) {
       return {
         success: false,
         error: 'Duplicate skill names are not allowed'
       };
     }

     return { success: true };
   }
   ```

2. **Run the test and verify it PASSES**
   ```bash
   npm test -- employee-validation.test.ts
   ```

   Expected output:
   ```
   PASS  app/lib/__tests__/employee-validation.test.ts
   ✓ validateSkills › should reject duplicate skill names (3 ms)

   Test Suites: 1 passed, 1 total
   Tests:       1 passed, 1 total
   ```

3. **Do NOT add extra features or refactor yet**
   - ❌ Don't add features not required by tests
   - ❌ Don't optimize prematurely
   - ❌ Don't refactor - that's the next phase

4. **Document the GREEN phase**
   ```bash
   echo '{"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","agent":"'$AGENT_ID'","action":"test_passed","details":"Implemented skill validation","file":"web-app/app/lib/employee-validation.ts","status":"green"}' >> .ai/artifacts/logs/development.jsonl
   ```

5. **Commit the implementation**
   ```bash
   git add web-app/app/lib/employee-validation.ts
   git commit -m "feat(employee): implement skill validation

   Minimum implementation to pass skill validation test.
   Detects duplicate skill names using Set comparison.

   Tests: 1 passing
   Coverage: 100% for this function
   "
   ```

**✅ GREEN Phase Complete when:**
- Test passes
- Only minimal code written
- No extra features added
- Committed
- Logged in development.jsonl

---

### Phase 3: 🔵 REFACTOR - Improve the Code

**Goal:** Improve code quality while keeping tests green

#### Steps:

1. **Identify refactoring opportunities**
   ```typescript
   // Current implementation is simple, but let's make it more robust
   // and align with project standards (Zod validation)
   ```

2. **Refactor the code**
   ```typescript
   // web-app/app/lib/employee-validation.ts
   import { z } from 'zod';

   const SkillsSchema = z.array(z.string().min(1)).refine(
     (skills) => new Set(skills).size === skills.length,
     { message: 'Duplicate skill names are not allowed' }
   );

   export function validateSkills(skills: string[]) {
     const result = SkillsSchema.safeParse(skills);

     if (!result.success) {
       return {
         success: false,
         error: result.error.errors[0].message
       };
     }

     return { success: true };
   }
   ```

3. **Run ALL tests to ensure nothing broke**
   ```bash
   npm test
   ```

   All tests must still pass:
   ```
   PASS  app/lib/__tests__/employee-validation.test.ts
   PASS  app/lib/__tests__/employee-actions.test.ts
   PASS  app/ui/employees/__tests__/employee-table.test.tsx
   ...

   Test Suites: 15 passed, 15 total
   Tests:       87 passed, 87 total
   ```

4. **Document the REFACTOR phase**
   ```bash
   echo '{"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","agent":"'$AGENT_ID'","action":"refactored","details":"Refactored skill validation to use Zod schema","status":"refactored"}' >> .ai/artifacts/logs/development.jsonl
   ```

5. **Commit the refactoring**
   ```bash
   git add web-app/app/lib/employee-validation.ts
   git commit -m "refactor(employee): use Zod schema for skill validation

   Improved implementation using Zod for type-safe validation.
   More maintainable and consistent with project standards.

   Tests: All passing (87/87)
   No behavioral changes.
   "
   ```

**✅ REFACTOR Phase Complete when:**
- Code is improved
- All tests still pass
- Committed
- Logged in development.jsonl

---

## Test Categories

### 1. Unit Tests

**Purpose:** Test individual functions/modules in isolation

**Location:** `web-app/app/**/__tests__/*.test.ts`

**When to write:**
- Every utility function
- Every business logic function
- Every validation function
- Every data transformation

**Example:**
```typescript
// web-app/app/lib/__tests__/date-utils.test.ts
import { formatShiftTime, isOverlapping } from '../date-utils';

describe('formatShiftTime', () => {
  it('should format time in 12-hour format', () => {
    expect(formatShiftTime('14:30')).toBe('2:30 PM');
  });
});

describe('isOverlapping', () => {
  it('should detect overlapping time ranges', () => {
    const shift1 = { start: '09:00', end: '17:00' };
    const shift2 = { start: '16:00', end: '22:00' };

    expect(isOverlapping(shift1, shift2)).toBe(true);
  });

  it('should not detect non-overlapping time ranges', () => {
    const shift1 = { start: '09:00', end: '17:00' };
    const shift2 = { start: '18:00', end: '22:00' };

    expect(isOverlapping(shift1, shift2)).toBe(false);
  });
});
```

---

### 2. Integration Tests

**Purpose:** Test multiple components working together

**Location:** `web-app/app/**/__tests__/*.test.ts`

**When to write:**
- API routes that interact with database
- Server actions that orchestrate multiple operations
- Form submissions with validation and persistence

**Example:**
```typescript
// web-app/app/lib/__tests__/employee-actions.test.ts
import { createEmployee, getEmployees } from '../employee-actions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Employee Actions Integration', () => {
  beforeEach(async () => {
    // Clean up test database
    await prisma.employee.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create and retrieve employee', async () => {
    // Arrange
    const employeeData = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'EMPLOYEE',
      skills: ['TypeScript', 'React']
    };

    // Act
    const created = await createEmployee(employeeData);
    const employees = await getEmployees();

    // Assert
    expect(created.success).toBe(true);
    expect(employees).toHaveLength(1);
    expect(employees[0].name).toBe('John Doe');
  });

  it('should prevent duplicate emails', async () => {
    // Arrange
    const employeeData = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'EMPLOYEE'
    };

    // Act
    await createEmployee(employeeData);
    const duplicate = await createEmployee(employeeData);

    // Assert
    expect(duplicate.success).toBe(false);
    expect(duplicate.error).toContain('already exists');
  });
});
```

---

### 3. Component Tests

**Purpose:** Test React components in isolation

**Location:** `web-app/app/ui/**/__tests__/*.test.tsx`

**When to write:**
- Every UI component
- Every form component
- Every interactive element

**Example:**
```typescript
// web-app/app/ui/employees/__tests__/employee-table.test.tsx
import { render, screen } from '@testing-library/react';
import { EmployeeTable } from '../employee-table';

describe('EmployeeTable', () => {
  it('should render employee data', () => {
    // Arrange
    const employees = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'EMPLOYEE' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'ADMIN' }
    ];

    // Act
    render(<EmployeeTable employees={employees} />);

    // Assert
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should show empty state when no employees', () => {
    // Arrange & Act
    render(<EmployeeTable employees={[]} />);

    // Assert
    expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
  });
});
```

---

### 4. End-to-End (E2E) Tests

**Purpose:** Test complete user workflows

**Location:** `web-app/tests/e2e/*.spec.ts`

**When to write:**
- Critical user flows (login, create employee, schedule shift)
- Multi-page workflows
- Important business processes

**Example:**
```typescript
// web-app/tests/e2e/employee-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@shiftsync.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create new employee', async ({ page }) => {
    // Navigate to employees page
    await page.click('text=Employees');
    await expect(page).toHaveURL('/employees');

    // Click create button
    await page.click('button:has-text("Create Employee")');

    // Fill form
    await page.fill('input[name="name"]', 'Test Employee');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.selectOption('select[name="role"]', 'EMPLOYEE');

    // Submit
    await page.click('button[type="submit"]');

    // Verify success
    await expect(page.locator('text=Test Employee')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('text=Employees');
    await page.click('button:has-text("Create Employee")');

    // Submit without filling
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });
});
```

---

## Testing Stack

### Technology Overview

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **Jest** | Unit & Integration Testing | `web-app/jest.config.js` |
| **React Testing Library** | Component Testing | Built into Jest |
| **Playwright** | E2E Testing | `web-app/playwright.config.ts` |
| **Zod** | Schema Validation (also used in tests) | N/A |

### Jest Configuration

```javascript
// web-app/jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/__tests__/**',
  ],
  coverageThresholds: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
```

### Playwright Configuration

```typescript
// web-app/playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Workflow Examples

### Example 1: Adding a New Feature

**Feature:** Add employee availability calendar

#### Workflow:

```bash
# 1. Start with a failing unit test
# File: web-app/app/lib/__tests__/availability.test.ts
```

```typescript
describe('AvailabilityCalendar', () => {
  it('should mark employee as available for given date', () => {
    // 🔴 RED - This will fail (function doesn't exist)
    const calendar = new AvailabilityCalendar();
    calendar.setAvailable('2026-02-20');

    expect(calendar.isAvailable('2026-02-20')).toBe(true);
  });
});
```

```bash
npm test -- availability.test.ts
# ❌ FAIL - Cannot find module

git add web-app/app/lib/__tests__/availability.test.ts
git commit -m "test(availability): add failing test for availability calendar"

# 2. Implement minimal code
# File: web-app/app/lib/availability.ts
```

```typescript
export class AvailabilityCalendar {
  private available = new Set<string>();

  setAvailable(date: string) {
    this.available.add(date);
  }

  isAvailable(date: string) {
    return this.available.has(date);
  }
}
```

```bash
npm test -- availability.test.ts
# ✅ PASS

git add web-app/app/lib/availability.ts
git commit -m "feat(availability): implement availability calendar"

# 3. Add more test cases (back to RED)
```

```typescript
it('should mark employee as unavailable', () => {
  // 🔴 RED
  const calendar = new AvailabilityCalendar();
  calendar.setAvailable('2026-02-20');
  calendar.setUnavailable('2026-02-20');

  expect(calendar.isAvailable('2026-02-20')).toBe(false);
});
```

```bash
npm test -- availability.test.ts
# ❌ FAIL - setUnavailable is not a function

# Implement setUnavailable (GREEN)
# Refactor if needed (REFACTOR)
# Continue until feature is complete...
```

---

### Example 2: Fixing a Bug

**Bug:** Employee shift times are not validated for conflicts

#### Workflow:

```bash
# 1. Write a test that reproduces the bug
# File: web-app/app/lib/__tests__/shift-validation.test.ts
```

```typescript
describe('validateShiftConflicts', () => {
  it('should detect overlapping shifts for same employee', () => {
    // 🔴 RED - This test will fail, exposing the bug
    const existingShifts = [
      { employeeId: 1, start: '2026-02-20T09:00', end: '2026-02-20T17:00' }
    ];

    const newShift = {
      employeeId: 1,
      start: '2026-02-20T16:00',
      end: '2026-02-20T22:00'
    };

    const result = validateShiftConflicts(newShift, existingShifts);

    expect(result.hasConflict).toBe(true);
    expect(result.message).toContain('overlapping');
  });
});
```

```bash
npm test -- shift-validation.test.ts
# ❌ FAIL - hasConflict is false (bug confirmed!)

git add web-app/app/lib/__tests__/shift-validation.test.ts
git commit -m "test(shift): add failing test exposing overlap bug"

# 2. Fix the bug (GREEN)
# File: web-app/app/lib/shift-validation.ts
```

```typescript
export function validateShiftConflicts(newShift, existingShifts) {
  const conflicts = existingShifts.filter(existing => {
    if (existing.employeeId !== newShift.employeeId) return false;

    const newStart = new Date(newShift.start);
    const newEnd = new Date(newShift.end);
    const existingStart = new Date(existing.start);
    const existingEnd = new Date(existing.end);

    // Check for overlap
    return newStart < existingEnd && newEnd > existingStart;
  });

  return {
    hasConflict: conflicts.length > 0,
    message: conflicts.length > 0 ? 'Shift overlaps with existing shift' : ''
  };
}
```

```bash
npm test -- shift-validation.test.ts
# ✅ PASS

git commit -m "fix(shift): detect overlapping shifts correctly"

# 3. Refactor if needed
# 4. Run ALL tests to ensure no regressions
npm test
```

---

## Test Patterns

### AAA Pattern (Arrange-Act-Assert)

**Always structure tests with:**

```typescript
it('should do something', () => {
  // Arrange - Set up test data and conditions
  const input = { name: 'John Doe' };
  const expectedOutput = { id: 1, name: 'John Doe' };

  // Act - Execute the code being tested
  const result = someFunction(input);

  // Assert - Verify the outcome
  expect(result).toEqual(expectedOutput);
});
```

---

### Test Data Builders

**For complex test data:**

```typescript
// web-app/app/lib/__tests__/helpers/builders.ts
export class EmployeeBuilder {
  private employee = {
    name: 'Test Employee',
    email: 'test@example.com',
    role: 'EMPLOYEE',
    skills: []
  };

  withName(name: string) {
    this.employee.name = name;
    return this;
  }

  withSkills(skills: string[]) {
    this.employee.skills = skills;
    return this;
  }

  build() {
    return this.employee;
  }
}

// Usage in tests
const employee = new EmployeeBuilder()
  .withName('John Doe')
  .withSkills(['TypeScript', 'React'])
  .build();
```

---

### Mocking External Dependencies

```typescript
// web-app/app/lib/__tests__/email-service.test.ts
import { sendWelcomeEmail } from '../email-service';

// Mock the external email API
jest.mock('../external/sendgrid', () => ({
  send: jest.fn().mockResolvedValue({ success: true })
}));

describe('sendWelcomeEmail', () => {
  it('should send email with correct template', async () => {
    await sendWelcomeEmail('john@example.com', 'John Doe');

    const sendgrid = require('../external/sendgrid');
    expect(sendgrid.send).toHaveBeenCalledWith({
      to: 'john@example.com',
      template: 'welcome',
      data: { name: 'John Doe' }
    });
  });
});
```

---

## Coverage Requirements

### Minimum Thresholds

| Type | Minimum Coverage |
|------|------------------|
| Statements | 80% |
| Branches | 80% |
| Functions | 80% |
| Lines | 80% |

### Tracking Coverage

```bash
# Generate coverage report
npm test -- --coverage

# View HTML report
open coverage/lcov-report/index.html
```

### Update Coverage Artifact

```bash
# After running tests with coverage
npm test -- --coverage --coverageReporters=json-summary

# Update the artifact
node .ai/scripts/update-coverage.js
```

---

## Troubleshooting

### Common Issues

#### Issue: "Test passes but coverage is low"
**Solution:** Add tests for edge cases and error paths

```typescript
// ❌ Only tests happy path
it('should create employee', () => {
  expect(createEmployee(validData)).toBeTruthy();
});

// ✅ Tests happy path AND error cases
describe('createEmployee', () => {
  it('should create employee with valid data', () => {
    expect(createEmployee(validData)).toBeTruthy();
  });

  it('should reject invalid email', () => {
    expect(createEmployee({ ...validData, email: 'invalid' }))
      .toThrow('Invalid email');
  });

  it('should reject duplicate email', async () => {
    await createEmployee(validData);
    await expect(createEmployee(validData))
      .rejects.toThrow('Email already exists');
  });
});
```

---

#### Issue: "Tests are slow"
**Solution:** Use unit tests instead of integration tests where possible

```typescript
// ❌ Slow - hits database for unit test
it('should format employee name', async () => {
  const employee = await prisma.employee.create({ data: testData });
  expect(formatName(employee.name)).toBe('DOE, JOHN');
});

// ✅ Fast - pure unit test
it('should format employee name', () => {
  expect(formatName('John Doe')).toBe('DOE, JOHN');
});
```

---

#### Issue: "Test fails intermittently"
**Solution:** Avoid time-dependent or order-dependent tests

```typescript
// ❌ Flaky - depends on current time
it('should detect shift is today', () => {
  const shift = createShift(new Date());
  expect(isToday(shift)).toBe(true);
});

// ✅ Stable - uses fixed date
it('should detect shift is on specific date', () => {
  const testDate = new Date('2026-02-20');
  const shift = createShift(testDate);
  expect(isOnDate(shift, testDate)).toBe(true);
});
```

---

## Quick Reference Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run specific test file
npm test -- employee-validation.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should validate"

# Run with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e -- --ui

# Run specific E2E test
npm run test:e2e -- employee-management.spec.ts

# Update snapshots
npm test -- -u

# Clear test cache
npm test -- --clearCache
```

---

## Checklist for AI Agents

Before committing any code:

- [ ] 🔴 Wrote failing test first
- [ ] 🟢 Wrote minimum code to pass
- [ ] 🔵 Refactored (if needed)
- [ ] ✅ All tests passing (`npm test`)
- [ ] 📊 Coverage at or above 80%
- [ ] 📝 Logged in development.jsonl
- [ ] 💾 Committed with proper message format
- [ ] 🎯 Updated .ai/artifacts/wip/current-sprint.md

---

## Summary

**Remember the Golden Rule of TDD:**

> "Never write production code without a failing test first."

If you find yourself writing code without a test, STOP and write the test first.

TDD is not just about testing—it's about **design, documentation, and confidence**.

---

**Questions?** Refer to [AGENT_GUIDELINES.md](.ai/AGENT_GUIDELINES.md) for more details.
