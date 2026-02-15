# Test Configuration Guide

**Version:** 1.0.0
**Last Updated:** 2026-02-15

---

## Table of Contents
1. [Testing Stack](#testing-stack)
2. [Jest Configuration](#jest-configuration)
3. [Playwright Configuration](#playwright-configuration)
4. [Running Tests](#running-tests)
5. [Writing Tests](#writing-tests)
6. [Coverage Configuration](#coverage-configuration)
7. [Troubleshooting](#troubleshooting)

---

## Testing Stack

### Unit & Integration Testing
- **Framework:** Jest 29.7.0
- **Environment:** jsdom (for React components)
- **Testing Library:** React Testing Library 14.2.0
- **Matchers:** jest-dom 6.4.2

### End-to-End Testing
- **Framework:** Playwright 1.41.0
- **Browsers:** Chromium, Firefox, WebKit
- **Base URL:** http://localhost:3000

### Validation & Mocking
- **Schema Validation:** Zod 3.22.4
- **Mocking:** Jest built-in mocks

---

## Jest Configuration

### Location
- **Config File:** `web-app/jest.config.js` (to be created)
- **Setup File:** `web-app/jest.setup.js` (to be created)

### Recommended Configuration

Create `web-app/jest.config.js`:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Test environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Module path aliases (must match tsconfig.json)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
    '^@/ui/(.*)$': '<rootDir>/app/ui/$1',
    '^@/lib/(.*)$': '<rootDir>/app/lib/$1',
  },

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/__tests__/**',
    '!app/**/types/**',
    '!app/**/constants/**',
    '!app/layout.tsx',
    '!app/page.tsx',
  ],

  // Coverage thresholds
  coverageThresholds: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json-summary',
  ],

  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(some-esm-package)/)',
  ],

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Restore mocks between tests
  restoreMocks: true,
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

### Setup File

Create `web-app/jest.setup.js`:
```javascript
// Add custom jest matchers from jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession() {
    return {
      data: {
        user: {
          email: 'test@example.com',
          name: 'Test User',
          role: 'ADMIN',
        },
      },
      status: 'authenticated',
    }
  },
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Set up test environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/shiftsync_test'
process.env.NEXTAUTH_SECRET = 'test-secret-key'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Global test timeout
jest.setTimeout(10000)

// Suppress console errors in tests (optional)
// const originalError = console.error
// beforeAll(() => {
//   console.error = (...args) => {
//     if (
//       typeof args[0] === 'string' &&
//       args[0].includes('Warning: ReactDOM.render')
//     ) {
//       return
//     }
//     originalError.call(console, ...args)
//   }
// })
//
// afterAll(() => {
//   console.error = originalError
// })
```

---

## Playwright Configuration

### Location
- **Config File:** `web-app/playwright.config.ts`

### Recommended Configuration

Create `web-app/playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results.json' }],
  ],

  // Shared settings
  use: {
    // Base URL
    baseURL: 'http://localhost:3000',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Web server
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

---

## Running Tests

### Unit & Integration Tests (Jest)

```bash
# Run all tests
npm test

# Run in watch mode
npm test:watch

# Run specific test file
npm test -- employee-validation.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should validate"

# Run with coverage
npm test -- --coverage

# Run only changed tests
npm test -- --onlyChanged

# Run in silent mode
npm test -- --silent

# Update snapshots
npm test -- -u

# Clear cache
npm test -- --clearCache
```

### End-to-End Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run in UI mode (interactive)
npm run test:e2e -- --ui

# Run specific test file
npm run test:e2e -- employee-management.spec.ts

# Run specific project (browser)
npm run test:e2e -- --project=chromium

# Debug mode
npm run test:e2e -- --debug

# Run headed (see browser)
npm run test:e2e -- --headed

# Generate test code
npx playwright codegen http://localhost:3000
```

---

## Writing Tests

### Unit Test Example

```typescript
// web-app/app/lib/__tests__/employee-validation.test.ts
import { validateEmployee } from '../employee-validation';
import { EmployeeBuilder } from './helpers/builders';

describe('validateEmployee', () => {
  describe('email validation', () => {
    it('should accept valid email', () => {
      // Arrange
      const employee = new EmployeeBuilder()
        .withEmail('john@example.com')
        .build();

      // Act
      const result = validateEmployee(employee);

      // Assert
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      // Arrange
      const employee = new EmployeeBuilder()
        .withEmail('invalid-email')
        .build();

      // Act
      const result = validateEmployee(employee);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid email');
    });
  });

  describe('skill validation', () => {
    it('should reject duplicate skills', () => {
      // Arrange
      const employee = new EmployeeBuilder()
        .withSkills(['TypeScript', 'TypeScript', 'React'])
        .build();

      // Act
      const result = validateEmployee(employee);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('duplicate');
    });

    it('should accept unique skills', () => {
      // Arrange
      const employee = new EmployeeBuilder()
        .withSkills(['TypeScript', 'React', 'Node.js'])
        .build();

      // Act
      const result = validateEmployee(employee);

      // Assert
      expect(result.success).toBe(true);
    });
  });
});
```

### Component Test Example

```typescript
// web-app/app/ui/employees/__tests__/employee-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmployeeForm } from '../employee-form';

describe('EmployeeForm', () => {
  it('should render all form fields', () => {
    // Arrange & Act
    render(<EmployeeForm />);

    // Assert
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
  });

  it('should show validation errors on submit', async () => {
    // Arrange
    render(<EmployeeForm />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('should call onSubmit with form data', async () => {
    // Arrange
    const handleSubmit = jest.fn();
    render(<EmployeeForm onSubmit={handleSubmit} />);

    // Act
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Assert
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'EMPLOYEE',
      });
    });
  });
});
```

### E2E Test Example

```typescript
// web-app/tests/e2e/employee-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@shiftsync.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create new employee', async ({ page }) => {
    // Navigate
    await page.click('text=Employees');
    await expect(page).toHaveURL('/employees');

    // Open form
    await page.click('button:has-text("Create Employee")');

    // Fill form
    await page.fill('input[name="name"]', 'Test Employee');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.selectOption('select[name="role"]', 'EMPLOYEE');

    // Submit
    await page.click('button[type="submit"]');

    // Verify
    await expect(page.locator('text=Test Employee')).toBeVisible();
    await expect(page.locator('text=test@example.com')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Navigate
    await page.click('text=Employees');
    await page.click('button:has-text("Create Employee")');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Check errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });
});
```

---

## Coverage Configuration

### Coverage Thresholds

Set in `jest.config.js`:
```javascript
coverageThresholds: {
  global: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
  // Per-file thresholds (optional)
  './app/lib/critical-module.ts': {
    statements: 95,
    branches: 95,
    functions: 95,
    lines: 95,
  },
}
```

### Generate Coverage Report

```bash
# Generate coverage
npm test -- --coverage

# View HTML report
open web-app/coverage/lcov-report/index.html

# View text summary
npm test -- --coverage --coverageReporters=text-summary
```

### Coverage Output

```
------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------|---------|----------|---------|---------|-------------------
All files         |   85.23 |    82.14 |   87.50 |   85.23 |
 employee-actions |   95.45 |    90.00 |  100.00 |   95.45 | 42,67-69
 shift-actions    |   78.26 |    70.00 |   85.71 |   78.26 | 23,45-48,89
------------------|---------|----------|---------|---------|-------------------
```

### Update Coverage Artifact

```bash
# Generate JSON summary
npm test -- --coverage --coverageReporters=json-summary

# Extract to artifact (manual)
node -e "
const fs = require('fs');
const coverage = JSON.parse(fs.readFileSync('web-app/coverage/coverage-summary.json', 'utf8'));
console.log(JSON.stringify(coverage.total, null, 2));
" >> .ai/artifacts/test-coverage.md
```

---

## Troubleshooting

### Issue: Tests Fail with Module Not Found

**Problem:**
```
Cannot find module '@/lib/utils'
```

**Solution:**
Check `moduleNameMapper` in `jest.config.js` matches `tsconfig.json`:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/app/$1',
}
```

---

### Issue: React Components Not Rendering

**Problem:**
```
TestingLibraryElementError: Unable to find element
```

**Solution:**
1. Ensure `jest.setup.js` imports `@testing-library/jest-dom`
2. Use proper queries: `getByRole`, `getByLabelText`, `getByText`
3. Use `screen.debug()` to see rendered output

---

### Issue: Async Tests Timing Out

**Problem:**
```
Timeout - Async callback was not invoked within 5000ms
```

**Solution:**
```typescript
// Increase timeout for specific test
it('should handle slow operation', async () => {
  // ...
}, 10000); // 10 second timeout

// Or use waitFor
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}, { timeout: 10000 });
```

---

### Issue: Coverage Below Threshold

**Problem:**
```
Jest: Coverage for statements (78%) does not meet threshold (80%)
```

**Solution:**
1. Run coverage: `npm test -- --coverage`
2. View HTML report: `open coverage/lcov-report/index.html`
3. Identify uncovered lines (highlighted in red)
4. Write tests for:
   - Edge cases
   - Error paths
   - Conditional branches
5. Re-run coverage

---

### Issue: E2E Tests Fail in CI

**Problem:**
```
browserType.launch: Executable doesn't exist
```

**Solution:**
Install Playwright browsers in CI:
```bash
npx playwright install --with-deps
```

Add to CI config:
```yaml
- name: Install Playwright
  run: npx playwright install --with-deps
```

---

### Issue: Flaky Tests

**Problem:**
Tests pass sometimes, fail sometimes

**Solution:**
1. **Avoid time-dependent tests:**
   ```typescript
   // ❌ Bad - depends on current time
   expect(isToday(new Date())).toBe(true);

   // ✅ Good - uses fixed date
   const testDate = new Date('2026-02-20');
   expect(isOnDate(shift, testDate)).toBe(true);
   ```

2. **Use waitFor for async operations:**
   ```typescript
   // ❌ Bad - may not be loaded yet
   expect(screen.getByText('Data')).toBeInTheDocument();

   // ✅ Good - waits for element
   await waitFor(() => {
     expect(screen.getByText('Data')).toBeInTheDocument();
   });
   ```

3. **Clean up between tests:**
   ```typescript
   afterEach(async () => {
     await prisma.employee.deleteMany();
   });
   ```

---

## Best Practices

### DO:
✅ Write tests first (TDD)
✅ Use descriptive test names
✅ Follow AAA pattern (Arrange-Act-Assert)
✅ Test edge cases and error paths
✅ Use builders for complex test data
✅ Mock external dependencies
✅ Keep tests focused and simple

### DON'T:
❌ Skip tests to make code work
❌ Test implementation details
❌ Write huge test files (split them up)
❌ Share state between tests
❌ Use real external services
❌ Ignore flaky tests

---

## Scripts Reference

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

## Summary

**Testing Stack:**
- Jest + React Testing Library (Unit/Integration)
- Playwright (E2E)
- 80% minimum coverage

**Configuration Files:**
- `web-app/jest.config.js`
- `web-app/jest.setup.js`
- `web-app/playwright.config.ts`

**TDD Workflow:**
1. 🔴 Write failing test
2. 🟢 Make it pass
3. 🔵 Refactor

**Coverage:** Track in `.ai/artifacts/test-coverage.md`

---

For more details, see:
- [TDD_WORKFLOW.md](TDD_WORKFLOW.md) - TDD process
- [AGENT_GUIDELINES.md](AGENT_GUIDELINES.md) - Agent collaboration rules
