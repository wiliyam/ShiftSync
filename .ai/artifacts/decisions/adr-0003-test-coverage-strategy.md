# ADR-0003: Test Coverage Strategy for Server Actions

**Status:** Accepted
**Date:** 2026-02-15
**Decided By:** claude-sonnet-4.5 (Sprint Planning Agent)
**Related Task:** Sprint 2 - Tasks 4.1, 4.2 (Testing Infrastructure)

---

## Context

The ShiftSync application uses Next.js Server Actions for all data mutations (employee CRUD, shift CRUD). Current test coverage is minimal (~5%), which poses risks for regression and makes refactoring difficult.

**Current State:**
- Only 1 test for employee-actions.ts (validation error path)
- No tests for shift-actions.ts
- No integration tests with Prisma
- No E2E tests for forms
- Prisma mocks are minimal (basic setup only)
- No test helpers or utilities

**Challenges:**
1. **Server Actions are async functions** - require async test patterns
2. **FormData API** - need to construct FormData objects in tests
3. **Prisma transactions** - complex to mock with jest-mock-extended
4. **Next.js modules** - need to mock `next/cache`, `next/navigation`
5. **Type safety** - mocks must be type-safe with TypeScript
6. **Test isolation** - tests must not affect each other
7. **Coverage targets** - TDD requires 80% minimum, aiming for 90%+

**Requirements:**
- Unit tests for all validation logic (fast, no I/O)
- Integration tests for database operations (Prisma mocked)
- E2E tests for critical user workflows (real browser)
- 90%+ coverage target for business logic
- Tests must be maintainable and understandable
- Tests must run fast (<30s for unit, <5min for E2E)

---

## Decision

We will implement a **three-tier testing strategy** with dedicated infrastructure for each layer:

### 1. Unit Tests (Pure Functions)

**Scope:** Validation logic, utility functions, business rules

**Strategy:**
- Test pure functions in isolation (no database, no Next.js APIs)
- Focus on validation, transformation, calculation logic
- Use Jest with TypeScript
- AAA pattern (Arrange, Act, Assert)
- Comprehensive edge case coverage

**Structure:**
```typescript
// app/lib/validations/__tests__/employee-validation.test.ts
import { validateSkills, normalizeSkill } from '../employee-validation';

describe('validateSkills', () => {
  describe('normalization', () => {
    it('should trim whitespace', () => {
      const result = normalizeSkill('  TypeScript  ');
      expect(result).toBe('TYPESCRIPT');
    });

    it('should convert to uppercase', () => {
      const result = normalizeSkill('react');
      expect(result).toBe('REACT');
    });
  });

  describe('duplicate detection', () => {
    it('should reject duplicate skills (case-insensitive)', () => {
      const skills = ['TypeScript', 'typescript', 'React'];
      const result = validateSkills(skills);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Duplicate');
    });

    it('should allow unique skills', () => {
      const skills = ['TypeScript', 'React', 'Node.js'];
      const result = validateSkills(skills);

      expect(result.success).toBe(true);
    });
  });

  // ... more test cases
});
```

**Coverage Target:** 100% for pure utility functions

---

### 2. Integration Tests (Server Actions + Mocked Database)

**Scope:** Server Actions interacting with Prisma (database mocked)

**Strategy:**
- Mock Prisma with jest-mock-extended for type safety
- Mock Next.js modules (`next/cache`, `next/navigation`)
- Test validation error paths
- Test successful database operations
- Test transaction rollback scenarios
- Test unique constraint violations

**Mock Setup:**
```typescript
// app/__mocks__/prisma.ts (Enhanced)
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

jest.mock('@/app/lib/prisma', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>()
}));

// Export typed mock for test files
import { prisma } from '@/app/lib/prisma';
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
```

**Transaction Mock Pattern:**
```typescript
// app/__mocks__/prisma-helpers.ts (NEW)

/**
 * Mock Prisma transaction - executes callback with transaction client
 */
export function mockTransaction<T>(
  prismaMock: DeepMockProxy<PrismaClient>,
  callback: (tx: any) => Promise<T>
): Promise<T> {
  // Create transaction mock that delegates to main mock
  const txMock = { ...prismaMock };

  prismaMock.$transaction.mockImplementation(async (fn: any) => {
    return await fn(txMock);
  });

  return callback(txMock);
}

/**
 * Create test employee data
 */
export function createTestEmployee(overrides = {}) {
  return {
    id: 'test-employee-id',
    userId: 'test-user-id',
    skills: ['TYPESCRIPT', 'REACT'],
    maxHoursPerWeek: 40,
    ...overrides
  };
}

/**
 * Create test user data
 */
export function createTestUser(overrides = {}) {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'EMPLOYEE',
    password: 'hashed_password',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}
```

**Integration Test Example:**
```typescript
// app/lib/__tests__/employee-actions.integration.test.ts (NEW)
import { createEmployee } from '../employee-actions';
import { prismaMock } from '../../__mocks__/prisma';
import { createTestUser, createTestEmployee, mockTransaction } from '../../__mocks__/prisma-helpers';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('createEmployee (integration)', () => {
  it('should create user and employee in transaction', async () => {
    const testUser = createTestUser();
    const testEmployee = createTestEmployee({ userId: testUser.id });

    // Mock transaction behavior
    prismaMock.$transaction.mockImplementation(async (callback) => {
      const txMock = {
        user: {
          create: jest.fn().mockResolvedValue(testUser)
        },
        employee: {
          create: jest.fn().mockResolvedValue(testEmployee)
        }
      };
      return callback(txMock as any);
    });

    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'john@example.com');
    formData.append('maxHours', '40');
    formData.append('skills', 'TypeScript, React');

    await createEmployee({}, formData);

    expect(prismaMock.$transaction).toHaveBeenCalled();
  });

  it('should handle duplicate email error', async () => {
    prismaMock.$transaction.mockRejectedValue(
      new Error('Unique constraint violation')
    );

    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'existing@example.com');
    formData.append('maxHours', '40');
    formData.append('skills', 'TypeScript');

    const result = await createEmployee({}, formData);

    expect(result.message).toContain('Email might be in use');
  });

  // ... more integration tests
});
```

**Coverage Target:** 90%+ for server actions

---

### 3. E2E Tests (Real Browser + Real Database)

**Scope:** Full user workflows from UI to database

**Strategy:**
- Use Playwright for browser automation
- Use test database (separate from development)
- Seed database before each test
- Clean up after each test (isolated tests)
- Use Page Object Model for maintainability
- Test critical user paths only (not exhaustive)

**Infrastructure Setup:**
```typescript
// tests/e2e/helpers/database.ts (NEW)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL_TEST
});

export async function seedTestData() {
  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: 'hashed_password', // bcrypt hash
      name: 'Test Admin',
      role: 'ADMIN'
    }
  });

  // Create test location
  await prisma.location.create({
    data: {
      id: 'test-location-1',
      name: 'Test Location',
      address: '123 Test St'
    }
  });
}

export async function cleanupTestData() {
  await prisma.shift.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();
}
```

```typescript
// tests/e2e/helpers/auth.ts (NEW)
import { Page } from '@playwright/test';

export async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@test.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}
```

```typescript
// tests/e2e/page-objects/employee-page.ts (NEW)
import { Page, Locator } from '@playwright/test';

export class EmployeePage {
  readonly page: Page;
  readonly createButton: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly maxHoursInput: Locator;
  readonly skillsInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = page.locator('[data-testid="create-employee"]');
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.maxHoursInput = page.locator('input[name="maxHours"]');
    this.skillsInput = page.locator('input[name="skills"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/dashboard/employees');
  }

  async createEmployee(data: {
    name: string;
    email: string;
    maxHours: number;
    skills: string;
  }) {
    await this.createButton.click();
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.maxHoursInput.fill(data.maxHours.toString());
    await this.skillsInput.fill(data.skills);
    await this.submitButton.click();
  }

  async getEmployeeByEmail(email: string) {
    return this.page.locator(`[data-email="${email}"]`);
  }
}
```

**E2E Test Example:**
```typescript
// tests/e2e/employee-management.spec.ts (NEW)
import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';
import { seedTestData, cleanupTestData } from './helpers/database';
import { EmployeePage } from './page-objects/employee-page';

test.describe('Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    await cleanupTestData();
    await seedTestData();
    await loginAsAdmin(page);
  });

  test.afterEach(async () => {
    await cleanupTestData();
  });

  test('should create employee successfully', async ({ page }) => {
    const employeePage = new EmployeePage(page);
    await employeePage.goto();

    await employeePage.createEmployee({
      name: 'Jane Smith',
      email: 'jane@example.com',
      maxHours: 40,
      skills: 'JavaScript, React, Node.js'
    });

    // Verify employee appears in list
    const employee = await employeePage.getEmployeeByEmail('jane@example.com');
    await expect(employee).toBeVisible();
    await expect(employee).toContainText('Jane Smith');
  });

  test('should show error for duplicate email', async ({ page }) => {
    const employeePage = new EmployeePage(page);
    await employeePage.goto();

    // Create first employee
    await employeePage.createEmployee({
      name: 'John Doe',
      email: 'duplicate@example.com',
      maxHours: 40,
      skills: 'TypeScript'
    });

    // Attempt to create duplicate
    await employeePage.createEmployee({
      name: 'Jane Doe',
      email: 'duplicate@example.com',
      maxHours: 30,
      skills: 'React'
    });

    // Verify error message
    await expect(page.locator('[role="alert"]')).toContainText('Email might be in use');
  });

  // ... more E2E tests
});
```

**Coverage Target:** Critical user paths (not aiming for % coverage)

---

### 4. Test Organization

**File Structure:**
```
web-app/
├── app/
│   ├── lib/
│   │   ├── employee-actions.ts
│   │   ├── shift-actions.ts
│   │   ├── validations/
│   │   │   ├── employee-validation.ts
│   │   │   ├── shift-validation.ts
│   │   │   ├── skill-matching.ts
│   │   │   └── __tests__/
│   │   │       ├── employee-validation.test.ts (UNIT)
│   │   │       ├── shift-validation.test.ts (UNIT)
│   │   │       └── skill-matching.test.ts (UNIT)
│   │   ├── utils/
│   │   │   ├── shift-conflict.ts
│   │   │   └── __tests__/
│   │   │       └── shift-conflict.test.ts (UNIT)
│   │   └── __tests__/
│   │       ├── employee-actions.test.ts (UNIT - validation paths)
│   │       ├── employee-actions.integration.test.ts (INTEGRATION)
│   │       ├── shift-actions.test.ts (UNIT - validation paths)
│   │       └── shift-actions.integration.test.ts (INTEGRATION)
│   └── __mocks__/
│       ├── prisma.ts
│       └── prisma-helpers.ts
├── tests/
│   ├── e2e/
│   │   ├── employee-management.spec.ts (E2E)
│   │   ├── shift-management.spec.ts (E2E)
│   │   ├── shift-assignment.spec.ts (E2E)
│   │   ├── helpers/
│   │   │   ├── auth.ts
│   │   │   └── database.ts
│   │   └── page-objects/
│   │       ├── employee-page.ts
│   │       └── shift-page.ts
│   └── setup/
│       ├── global-setup.ts
│       └── global-teardown.ts
├── jest.config.ts
└── playwright.config.ts
```

---

## Consequences

### Positive
- **Comprehensive Coverage:** Three-tier approach ensures all layers tested
- **Fast Feedback:** Unit tests run in <5s, provide immediate feedback
- **Confidence:** Integration tests verify database operations work correctly
- **User-Centric:** E2E tests verify real user workflows
- **Maintainability:** Page objects and helpers reduce duplication
- **Type Safety:** jest-mock-extended provides TypeScript support
- **Isolation:** Tests don't interfere with each other
- **Documentation:** Tests serve as living documentation
- **Refactoring Safety:** High coverage allows confident refactoring

### Negative
- **Complexity:** Three test layers require different patterns/tools
- **Setup Time:** Initial infrastructure setup is time-consuming
- **Maintenance:** More tests = more maintenance burden
- **Learning Curve:** Team must understand unit/integration/E2E differences
- **CI Time:** Full test suite may take 10-15 minutes in CI

### Mitigation
- **Complexity:** Clear documentation and consistent patterns
- **Setup Time:** One-time investment, pays off long-term
- **Maintenance:** Well-written tests are easy to maintain
- **Learning Curve:** Document patterns in TEST_CONFIGURATION.md
- **CI Time:** Parallelize tests, run E2E only on main branch

---

## Alternatives Considered

### Alternative 1: Unit Tests Only
**Pros:**
- Simplest approach
- Fastest test execution
- No database dependencies

**Cons:**
- No verification of database operations
- Mock explosion (everything mocked)
- False confidence (tests pass, production fails)

**Why not chosen:** Need integration tests to verify Prisma queries work correctly

### Alternative 2: E2E Tests Only
**Pros:**
- Tests real user experience
- No mocking required
- Highest confidence

**Cons:**
- Very slow (minutes per test)
- Flaky (browser, network, timing issues)
- Hard to test edge cases
- Expensive to maintain

**Why not chosen:** Need fast unit tests for TDD red-green-refactor cycle

### Alternative 3: Real Database for All Tests
**Pros:**
- No mocking complexity
- Tests real database behavior

**Cons:**
- Slow (database setup/teardown)
- Requires test database
- Tests not isolated
- CI/CD complexity

**Why not chosen:** Too slow for TDD workflow; integration tests with mocks are sufficient

### Alternative 4: Snapshot Testing
**Pros:**
- Easy to write (auto-generate snapshots)
- Catches unintended changes

**Cons:**
- Brittle (break on any change)
- Low signal-to-noise ratio
- Hard to review diffs
- Not suitable for business logic

**Why not chosen:** Better to write explicit assertions for business logic

---

## Implementation Checklist

### Phase 1: Mock Infrastructure (Task 4.1)
- [ ] Enhance `__mocks__/prisma.ts` with jest-mock-extended
- [ ] Create `__mocks__/prisma-helpers.ts` with factory functions
- [ ] Implement `mockTransaction` helper
- [ ] Implement `createTestEmployee`, `createTestUser` factories
- [ ] Document mock patterns in TEST_CONFIGURATION.md

### Phase 2: E2E Infrastructure (Task 4.2)
- [ ] Create `tests/e2e/helpers/auth.ts` (login helpers)
- [ ] Create `tests/e2e/helpers/database.ts` (seed/cleanup)
- [ ] Create `tests/e2e/page-objects/employee-page.ts`
- [ ] Create `tests/e2e/page-objects/shift-page.ts`
- [ ] Create `tests/setup/global-setup.ts` (Playwright)
- [ ] Create `tests/setup/global-teardown.ts` (Playwright)
- [ ] Update `playwright.config.ts` with setup/teardown
- [ ] Document E2E patterns in TEST_CONFIGURATION.md

### Phase 3: Write Tests (Tasks 1.1, 1.2, 2.1, 2.2, etc.)
- [ ] Unit tests for validation utilities
- [ ] Unit tests for conflict detection
- [ ] Integration tests for employee actions
- [ ] Integration tests for shift actions
- [ ] E2E tests for employee management
- [ ] E2E tests for shift management
- [ ] E2E tests for skill assignment

### Phase 4: CI/CD Integration
- [ ] Configure Jest coverage thresholds (80% minimum)
- [ ] Add GitHub Actions workflow for tests
- [ ] Parallelize test execution
- [ ] Add coverage reporting
- [ ] Add E2E test artifacts (screenshots on failure)

---

## Rollback Plan

If testing strategy proves too complex:

1. **Immediate:** Focus on unit tests only (defer integration/E2E)
   - Still provides value for TDD workflow
   - Reduce scope, increase velocity

2. **Short-term:** Simplify mocks (use simple jest.fn() instead of jest-mock-extended)
   - Trade type safety for simplicity

3. **Long-term:** Use real database for integration tests (Docker + test containers)
   - Slower but more accurate

---

## References

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [jest-mock-extended](https://github.com/marchaos/jest-mock-extended)
- [Testing Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/testing)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [AAA Test Pattern](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/)

---

## Review Notes

**Review Date:** (To be filled)
**Reviewed By:** (To be filled)
**Status:** Accepted - Ready for implementation
**Comments:**
- Three-tier strategy provides comprehensive coverage
- Mock helpers reduce boilerplate
- Page objects improve E2E maintainability
- Consider adding visual regression tests in future (Percy, Chromatic)
- Document test patterns clearly for team onboarding
