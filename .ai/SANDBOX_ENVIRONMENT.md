# Sandbox Environment Guide for AI Agents

**Version:** 1.0.0
**Last Updated:** 2026-02-15
**Purpose:** Run, test, and iterate on code changes in isolated environment

---

## 🎯 Overview

This guide explains how AI agents should:
1. **Set up** a sandbox development environment
2. **Run** the application
3. **Make changes** based on output/errors
4. **Iterate** using TDD feedback loop
5. **Validate** changes work correctly

---

## 🚀 Environment Setup

### Prerequisites Check

```bash
# Check if environment is ready
echo "🔍 Checking prerequisites..."

# Node.js version
node_version=$(node --version | cut -d'v' -f2)
echo "Node.js: $node_version (need ≥18.0.0)"

# npm version
npm_version=$(npm --version)
echo "npm: $npm_version"

# Docker version (for database)
docker_version=$(docker --version | cut -d' ' -f3 | sed 's/,//')
echo "Docker: $docker_version"

# Check if ports are available
lsof -i:3000 >/dev/null 2>&1 && echo "⚠️  Port 3000 in use" || echo "✅ Port 3000 available"
lsof -i:5432 >/dev/null 2>&1 && echo "⚠️  Port 5432 in use" || echo "✅ Port 5432 available"
```

### Initial Setup

```bash
# 1. Install dependencies
cd web-app
npm install --legacy-peer-deps

# 2. Start database
cd ..
docker-compose up db -d

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 5

# 3. Run migrations
cd web-app
npx prisma migrate dev

# 4. Seed database with test data
npx prisma db seed

# 5. Verify setup
npm test
```

---

## 🏃 Running the Application

### Development Mode (Primary)

```bash
# Start development server
cd web-app
npm run dev

# Server will start on http://localhost:3000
# Watch for this output:
# ✓ Ready in 2.3s
# ○ Local:        http://localhost:3000
```

### Production Mode (Testing)

```bash
# Build production bundle
npm run build

# Start production server
npm run start
```

### Docker Mode (Isolated)

```bash
# Run entire stack in Docker
cd ..
docker-compose up --build

# Access app at http://localhost:3000
```

---

## 🔄 The Feedback Loop Workflow

### Step 1: Identify What to Build/Fix

**Sources of requirements:**
1. Check current sprint: `cat .ai/artifacts/wip/current-sprint.md`
2. Check user request in conversation
3. Check failing tests
4. Check runtime errors

### Step 2: Write Failing Test (RED)

```bash
# 1. Create test file
vim web-app/app/lib/__tests__/feature.test.ts

# 2. Write test that defines expected behavior
# (See TDD_WORKFLOW.md for examples)

# 3. Run test to verify it fails
npm test -- feature.test.ts

# Expected output:
# FAIL  app/lib/__tests__/feature.test.ts
# ● Test suite failed to run
#   Cannot find module '../feature'

# 4. Commit failing test
git add web-app/app/lib/__tests__/feature.test.ts
git commit -m "test(scope): add failing test for feature"
```

### Step 3: Implement Feature (GREEN)

```bash
# 1. Create implementation file
vim web-app/app/lib/feature.ts

# 2. Write minimum code to pass test

# 3. Run test again
npm test -- feature.test.ts

# Expected output:
# PASS  app/lib/__tests__/feature.test.ts
# ✓ should do expected behavior (5 ms)

# 4. Commit implementation
git add web-app/app/lib/feature.ts
git commit -m "feat(scope): implement feature"
```

### Step 4: Run Application & Observe

```bash
# 1. Start dev server (if not already running)
npm run dev

# 2. Open browser to http://localhost:3000

# 3. Navigate to relevant page

# 4. Observe behavior
```

### Step 5: Analyze Output

**Look for:**

#### ✅ Success Indicators
- Page loads without errors
- Console shows no errors
- Feature works as expected
- UI renders correctly
- Data persists correctly

#### ❌ Error Indicators
- Console errors (check browser DevTools)
- Network errors (check Network tab)
- Runtime errors (check terminal)
- Type errors (check TypeScript output)
- Test failures

### Step 6: Make Corrections Based on Output

#### If You See Console Errors

**Example Error:**
```
Uncaught TypeError: Cannot read property 'name' of undefined
  at EmployeeTable.tsx:42
```

**Feedback Loop:**
```bash
# 1. Write test that reproduces the error
vim web-app/app/ui/employees/__tests__/employee-table.test.tsx

# Add test:
it('should handle undefined employee data', () => {
  render(<EmployeeTable employees={undefined} />);
  expect(screen.getByText(/no employees/i)).toBeInTheDocument();
});

# 2. Run test (should fail)
npm test -- employee-table.test.tsx

# 3. Fix the code
vim web-app/app/ui/employees/employee-table.tsx

# Add null check:
if (!employees) {
  return <EmptyState />;
}

# 4. Run test (should pass)
npm test -- employee-table.test.tsx

# 5. Run dev server and verify fix
npm run dev
# Open browser, check if error is gone

# 6. Commit fix
git add .
git commit -m "fix(employee): handle undefined employee data"
```

#### If You See Network Errors

**Example Error:**
```
POST /api/employees 500 Internal Server Error
```

**Feedback Loop:**
```bash
# 1. Check server logs in terminal
# Look for error stack trace

# 2. Write test for API endpoint
vim web-app/app/api/employees/__tests__/route.test.ts

# 3. Reproduce error in test
it('should handle invalid employee data', async () => {
  const response = await POST(
    new Request('http://localhost:3000/api/employees', {
      method: 'POST',
      body: JSON.stringify({ /* invalid data */ })
    })
  );

  expect(response.status).toBe(400);
});

# 4. Fix API handler
vim web-app/app/api/employees/route.ts

# 5. Run test
npm test -- route.test.ts

# 6. Test in browser
# Use browser DevTools > Network tab
# Verify API returns correct status code

# 7. Commit fix
git commit -m "fix(api): validate employee data before database operation"
```

#### If You See Type Errors

**Example Error:**
```
Type 'string | undefined' is not assignable to type 'string'
```

**Feedback Loop:**
```bash
# 1. Check TypeScript errors
npm run build
# Or: npx tsc --noEmit

# 2. Identify the type issue

# 3. Write test that expects proper types
vim web-app/app/lib/__tests__/types.test.ts

# 4. Fix the type issue
# Option A: Add type guard
if (typeof value === 'string') {
  // use value
}

# Option B: Add non-null assertion (only if sure)
const name: string = employee.name!;

# Option C: Make function accept undefined
function process(name: string | undefined) { }

# 5. Verify types are correct
npm run build

# 6. Commit fix
git commit -m "fix(types): handle optional employee name"
```

---

## 🧪 Testing in Sandbox

### Unit Testing in Sandbox

```bash
# Run single test file
npm test -- path/to/test.test.ts

# Run in watch mode (auto-rerun on changes)
npm test:watch

# Run with coverage
npm test -- --coverage

# Run specific test by name
npm test -- --testNamePattern="should validate email"
```

### Integration Testing with Database

```bash
# 1. Ensure test database is running
docker-compose up db -d

# 2. Set test environment variable
export DATABASE_URL="postgresql://test:test@localhost:5432/shiftsync_test"

# 3. Run integration tests
npm test -- --testPathPattern="integration"

# 4. Clean up test data
npx prisma migrate reset --force

# 5. Re-seed if needed
npx prisma db seed
```

### End-to-End Testing

```bash
# 1. Build and start app
npm run build
npm run start &

# 2. Run E2E tests
npm run test:e2e

# 3. Run in UI mode (interactive)
npm run test:e2e -- --ui

# 4. Run specific test
npm run test:e2e -- employee-management.spec.ts

# 5. Kill server when done
kill $(lsof -ti:3000)
```

---

## 🔍 Debugging Techniques

### Browser DevTools

```bash
# 1. Open browser to http://localhost:3000

# 2. Open DevTools (F12 or Cmd+Option+I)

# 3. Check Console tab for errors

# 4. Check Network tab for API calls
# - Status codes
# - Request/response data
# - Timing

# 5. Check React DevTools (if installed)
# - Component tree
# - Props and state
# - Hooks

# 6. Use debugger statements
// In code:
debugger; // Execution will pause here in DevTools
```

### Server-Side Debugging

```bash
# 1. Add console.log in API routes
console.log('Request body:', await request.json());

# 2. Watch terminal output while using app

# 3. Use Node debugger
node --inspect-brk node_modules/.bin/next dev

# 4. Connect Chrome to debugger
# Open chrome://inspect
# Click "inspect" on the Node process

# 5. Set breakpoints in VSCode
# F5 to start debugging
```

### Database Debugging

```bash
# 1. Open Prisma Studio (GUI)
npx prisma studio

# 2. Browse tables and data visually

# 3. Or use psql
docker exec -it workplace-app-db-1 psql -U user -d shiftsync

# 4. Run SQL queries
SELECT * FROM "Employee";

# 5. Check migrations
npx prisma migrate status
```

---

## 📊 Monitoring Application Health

### Check Application Status

```bash
#!/bin/bash
# .ai/scripts/check-health.sh

echo "🏥 Checking application health..."

# 1. Check if dev server is running
if lsof -i:3000 >/dev/null 2>&1; then
    echo "✅ Dev server running on port 3000"
else
    echo "❌ Dev server not running"
fi

# 2. Check if database is running
if docker ps | grep -q "workplace-app-db"; then
    echo "✅ Database container running"
else
    echo "❌ Database container not running"
fi

# 3. Check if app is responding
if curl -s http://localhost:3000 >/dev/null; then
    echo "✅ Application responding"
else
    echo "❌ Application not responding"
fi

# 4. Check TypeScript compilation
cd web-app
if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
    echo "❌ TypeScript errors detected"
    npx tsc --noEmit | head -20
else
    echo "✅ No TypeScript errors"
fi

# 5. Check test status
if npm test -- --passWithNoTests --silent 2>&1 | grep -q "PASS"; then
    echo "✅ Tests passing"
else
    echo "❌ Tests failing"
fi

echo ""
echo "💡 Run 'npm run dev' if server not running"
echo "💡 Run 'docker-compose up db -d' if database not running"
```

### Watch Logs in Real-Time

```bash
# Watch development server logs
npm run dev | tee logs/dev-server.log

# Watch database logs
docker-compose logs -f db

# Watch both simultaneously
npm run dev &
docker-compose logs -f db
```

---

## 🔄 Complete Development Cycle Example

### Scenario: Add Employee Skill Validation

**Step 1: Understand the Requirement**
```bash
# Check current work
cat .ai/artifacts/wip/current-sprint.md
# Task: "Add employee skill validation"
```

**Step 2: Write Failing Test**
```bash
# Create test
vim web-app/app/lib/__tests__/employee-validation.test.ts
```

```typescript
describe('validateEmployeeSkills', () => {
  it('should reject duplicate skills', () => {
    const result = validateEmployeeSkills(['React', 'React', 'Node']);
    expect(result.success).toBe(false);
    expect(result.error).toContain('duplicate');
  });
});
```

```bash
# Run test (will fail - function doesn't exist)
npm test -- employee-validation.test.ts
# ❌ FAIL - Cannot find module

# Commit test
git add web-app/app/lib/__tests__/employee-validation.test.ts
git commit -m "test(employee): add failing test for skill validation"
```

**Step 3: Implement Minimum Code**
```bash
# Create implementation
vim web-app/app/lib/employee-validation.ts
```

```typescript
export function validateEmployeeSkills(skills: string[]) {
  const unique = new Set(skills);
  if (unique.size !== skills.length) {
    return { success: false, error: 'Duplicate skills not allowed' };
  }
  return { success: true };
}
```

```bash
# Run test (should pass)
npm test -- employee-validation.test.ts
# ✅ PASS

# Commit implementation
git add web-app/app/lib/employee-validation.ts
git commit -m "feat(employee): implement skill validation"
```

**Step 4: Test in Browser**
```bash
# Start dev server
npm run dev

# Open http://localhost:3000/employees/create

# Try to add duplicate skills
# Fill form:
# Name: Test Employee
# Skills: React, React, Node

# Submit form

# Observe in browser console:
# ✅ Validation error shown: "Duplicate skills not allowed"

# Check Network tab:
# POST /api/employees
# Status: 400 Bad Request
# Response: { "error": "Duplicate skills not allowed" }
```

**Step 5: Iterate if Issues Found**

If error in browser:
```bash
# Example: Error - "skills.map is not a function"

# Write test to catch this
it('should handle non-array skills', () => {
  const result = validateEmployeeSkills('React'); // not an array
  expect(result.success).toBe(false);
});

# Fix implementation
export function validateEmployeeSkills(skills: unknown) {
  if (!Array.isArray(skills)) {
    return { success: false, error: 'Skills must be an array' };
  }
  // ... rest of validation
}

# Test again in browser
# ✅ Now works correctly

# Commit fix
git commit -m "fix(employee): validate skills is array"
```

**Step 6: Document**
```bash
# Create feature documentation
cp .ai/templates/feature-doc.md .ai/artifacts/docs/features/FEATURE-003-skill-validation.md

# Update CHANGELOG
vim CHANGELOG.md
# Add: "- Added skill validation for employees"

# Commit documentation
git add .ai/artifacts/docs/features/FEATURE-003-skill-validation.md CHANGELOG.md
git commit -m "docs(employee): add skill validation documentation"
```

**Step 7: Verify Everything Works**
```bash
# Run all tests
npm test
# ✅ All tests passing

# Check coverage
npm test -- --coverage
# ✅ Coverage: 85% (above 80% threshold)

# Run E2E test
npm run test:e2e -- employee-management.spec.ts
# ✅ E2E tests passing

# Check app in browser one more time
# ✅ Feature works as expected

# Update current sprint
vim .ai/artifacts/wip/current-sprint.md
# Mark task as complete: [x] Add employee skill validation

# Log to development log
echo '{"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","agent":"claude-sonnet-4.5","action":"feature_completed","details":"Employee skill validation with duplicate detection","tests":"6 passing","coverage":"100%"}' >> .ai/artifacts/logs/development.jsonl
```

---

## 🎯 Best Practices for Sandbox Development

### DO:
✅ Run tests before starting dev server
✅ Keep dev server running in a separate terminal
✅ Use browser DevTools to inspect behavior
✅ Check both console and network tabs
✅ Test edge cases manually in browser
✅ Verify database changes with Prisma Studio
✅ Run full test suite before committing
✅ Document observed behavior in commit messages

### DON'T:
❌ Make changes without running tests first
❌ Ignore console warnings and errors
❌ Skip manual testing in browser
❌ Commit without verifying app still works
❌ Forget to check database state
❌ Leave dev server running when done
❌ Ignore TypeScript errors
❌ Skip documentation

---

## 🆘 Troubleshooting

### Dev Server Won't Start

```bash
# Check if port is in use
lsof -i:3000

# Kill process if found
kill -9 $(lsof -ti:3000)

# Clear Next.js cache
rm -rf web-app/.next

# Reinstall dependencies
rm -rf web-app/node_modules
cd web-app && npm install --legacy-peer-deps

# Try again
npm run dev
```

### Database Connection Issues

```bash
# Check if database container is running
docker ps | grep db

# Restart database
docker-compose restart db

# Check logs
docker-compose logs db

# Reset database
cd web-app
npx prisma migrate reset --force
npx prisma db seed
```

### Tests Failing Unexpectedly

```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests with verbose output
npm test -- --verbose

# Run single test to isolate issue
npm test -- problem-test.test.ts

# Check test database
docker exec -it workplace-app-db-1 psql -U user -d shiftsync_test
```

---

## 📈 Success Metrics

Your sandbox workflow is effective if:
✅ Tests guide your implementation
✅ You catch errors before committing
✅ Browser testing reveals edge cases
✅ Database state is correct
✅ No regressions introduced
✅ Documentation reflects reality
✅ All changes are logged

---

## 🔗 Related Documentation

- [TDD_WORKFLOW.md](.ai/TDD_WORKFLOW.md) - Test-driven development process
- [TEST_CONFIGURATION.md](.ai/TEST_CONFIGURATION.md) - Testing setup
- [AGENT_GUIDELINES.md](.ai/AGENT_GUIDELINES.md) - Agent collaboration rules

---

**Remember:** The sandbox is your safe space to experiment, break things, and learn. Use it!
