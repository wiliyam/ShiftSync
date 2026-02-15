# Documentation Automation Guide

**Version:** 1.0.0
**Last Updated:** 2026-02-15
**Purpose:** Automatic documentation management for every code change

---

## 📋 Overview

**MANDATORY:** Every code change MUST be accompanied by documentation updates.

### What Gets Documented Automatically
1. **API Endpoints** - OpenAPI/Swagger specs
2. **Features** - Feature documentation with examples
3. **Test Cases** - Test documentation and coverage
4. **Changes** - CHANGELOG.md entries
5. **Architecture** - ADRs for significant decisions

---

## 📚 Documentation Requirements by Change Type

### When You Add a Feature

**Required Documentation:**
1. ✅ Feature doc in `.ai/artifacts/docs/features/FEATURE-XXX.md`
2. ✅ API docs if it has API endpoints
3. ✅ Test documentation in test files
4. ✅ CHANGELOG.md entry
5. ✅ Update relevant guides in `/docs`

### When You Add an API Endpoint

**Required Documentation:**
1. ✅ JSDoc comments in code
2. ✅ OpenAPI spec in `docs/api/openapi.yaml`
3. ✅ API endpoint doc in `.ai/artifacts/docs/api/ENDPOINT-NAME.md`
4. ✅ Request/response examples
5. ✅ Error codes and handling

### When You Fix a Bug

**Required Documentation:**
1. ✅ Update CHANGELOG.md
2. ✅ Add comment in code explaining the fix
3. ✅ Update test documentation if test was added
4. ✅ Update feature doc if behavior changed

### When You Refactor

**Required Documentation:**
1. ✅ Update code comments if logic changed
2. ✅ Update ADR if architecture changed
3. ✅ CHANGELOG.md entry if API changed
4. ✅ Update inline documentation

---

## 🔄 Documentation Workflow

### Step 1: During RED Phase (Write Test)

```typescript
// web-app/app/lib/__tests__/employee-validation.test.ts

/**
 * Test Suite: Employee Validation
 *
 * Purpose: Validates employee data before database operations
 * Coverage: Email validation, skill validation, role validation
 *
 * Related Files:
 * - app/lib/employee-validation.ts (implementation)
 * - app/lib/schemas/employee.ts (Zod schemas)
 *
 * Feature: FEATURE-001-employee-management
 *
 * @see .ai/artifacts/docs/features/FEATURE-001-employee-management.md
 */

describe('Employee Validation', () => {
  /**
   * Test: Email Validation
   *
   * Requirement: Employees must have valid email addresses
   * Expected: Reject invalid email formats
   * Edge Cases:
   * - Missing @ symbol
   * - Missing domain
   * - Special characters
   *
   * @test-id EMP-VAL-001
   */
  it('should reject invalid email formats', () => {
    // Test implementation...
  });
});
```

### Step 2: During GREEN Phase (Implementation)

```typescript
// web-app/app/lib/employee-validation.ts

/**
 * Employee Validation Module
 *
 * Provides validation functions for employee data before persistence.
 * Uses Zod schemas for type-safe runtime validation.
 *
 * @module employee-validation
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const result = validateEmployee({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   role: 'EMPLOYEE'
 * });
 *
 * if (result.success) {
 *   await prisma.employee.create({ data: result.data });
 * }
 * ```
 */

import { z } from 'zod';
import { EmployeeSchema } from './schemas/employee';

/**
 * Validates employee data against business rules
 *
 * @param data - Employee data to validate
 * @returns Result object with success status and data/error
 *
 * @throws {ValidationError} If data fails schema validation
 *
 * @example
 * ```typescript
 * const result = validateEmployee(employeeData);
 * if (!result.success) {
 *   console.error(result.error);
 * }
 * ```
 *
 * @see EmployeeSchema for schema definition
 * @see FEATURE-001-employee-management.md for feature documentation
 */
export function validateEmployee(data: unknown) {
  // Implementation...
}
```

### Step 3: Create Feature Documentation

```bash
# Create feature doc
cp .ai/templates/feature-doc.md .ai/artifacts/docs/features/FEATURE-001-employee-management.md

# Edit with feature details
vim .ai/artifacts/docs/features/FEATURE-001-employee-management.md
```

### Step 4: Update API Documentation (if applicable)

```bash
# If adding API endpoint
cp .ai/templates/api-endpoint-doc.md .ai/artifacts/docs/api/POST-employees.md

# Update OpenAPI spec
vim docs/api/openapi.yaml
```

### Step 5: Update CHANGELOG

```bash
# Add entry to CHANGELOG.md
vim CHANGELOG.md
```

### Step 6: Commit with Documentation

```bash
git add .
git commit -m "feat(employee): implement employee validation

- Add email, skill, and role validation
- Use Zod schemas for type safety
- Return Result<T, E> for error handling

Documentation:
- Added FEATURE-001-employee-management.md
- Updated employee validation JSDoc
- Added test documentation

Tests: 6 passing
Coverage: 100%

Closes #123
"
```

---

## 📄 Documentation Templates

### Feature Documentation Template

**Location:** `.ai/templates/feature-doc.md`

```markdown
# FEATURE-XXX: Feature Name

**Status:** [Planning | In Progress | Complete | Deprecated]
**Created:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
**Implemented By:** [Agent ID or Developer Name]

---

## Overview

Brief description of the feature and its purpose.

## User Stories

- As a [role], I want [feature] so that [benefit]
- As a [role], I want [feature] so that [benefit]

## Requirements

### Functional Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

### Non-Functional Requirements
- [ ] Performance: [metric]
- [ ] Security: [requirement]
- [ ] Accessibility: [requirement]

## Implementation

### Files Created/Modified
- `path/to/file.ts` - Description
- `path/to/test.test.ts` - Test suite

### API Endpoints (if applicable)
- `POST /api/endpoint` - Description
- `GET /api/endpoint/:id` - Description

### Database Changes (if applicable)
- Table: `table_name`
- Migration: `YYYYMMDD_migration_name.sql`

## Testing

### Test Coverage
- Unit Tests: X tests, Y% coverage
- Integration Tests: X tests
- E2E Tests: X tests

### Test Files
- `app/lib/__tests__/feature.test.ts`
- `tests/e2e/feature.spec.ts`

### Manual Testing Steps
1. Step 1
2. Step 2
3. Expected result

## Usage Examples

### Basic Usage
\`\`\`typescript
// Example code
\`\`\`

### Advanced Usage
\`\`\`typescript
// Example code
\`\`\`

## Error Handling

| Error Code | Description | Resolution |
|------------|-------------|------------|
| ERR_001 | Description | How to fix |

## Related Documentation
- [ADR-XXX](../ decisions/adr-xxx.md)
- [API Docs](../api/endpoint-name.md)
- [Architecture Design](/docs/architecture_design.md)

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| YYYY-MM-DD | 1.0.0 | Initial implementation |
```

### API Endpoint Documentation Template

**Location:** `.ai/templates/api-endpoint-doc.md`

```markdown
# API: [METHOD] /api/endpoint

**Version:** 1.0.0
**Authentication:** Required/Optional
**Rate Limit:** X requests/minute

---

## Overview

Brief description of what this endpoint does.

## Endpoint Details

- **Method:** GET/POST/PUT/DELETE
- **Path:** `/api/endpoint/:param`
- **Auth Required:** Yes/No
- **Permissions:** ADMIN, EMPLOYEE

## Request

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Employee ID |

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | number | No | 10 | Results per page |

### Request Body
\`\`\`typescript
{
  "name": "string",
  "email": "string",
  "role": "ADMIN" | "EMPLOYEE"
}
\`\`\`

### Request Schema
\`\`\`typescript
interface CreateEmployeeRequest {
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  skills?: string[];
}
\`\`\`

## Response

### Success Response (200)
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "EMPLOYEE",
    "createdAt": "2026-02-15T10:00:00Z"
  }
}
\`\`\`

### Error Responses

#### 400 Bad Request
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
\`\`\`

#### 401 Unauthorized
\`\`\`json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
\`\`\`

#### 403 Forbidden
\`\`\`json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
\`\`\`

#### 500 Internal Server Error
\`\`\`json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
\`\`\`

## Examples

### cURL
\`\`\`bash
curl -X POST https://api.shiftsync.com/api/employees \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "role": "EMPLOYEE"
  }'
\`\`\`

### JavaScript/TypeScript
\`\`\`typescript
const response = await fetch('/api/employees', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'EMPLOYEE'
  })
});

const data = await response.json();
\`\`\`

### Python
\`\`\`python
import requests

response = requests.post(
    'https://api.shiftsync.com/api/employees',
    json={
        'name': 'John Doe',
        'email': 'john@example.com',
        'role': 'EMPLOYEE'
    },
    headers={
        'Authorization': f'Bearer {token}'
    }
)

data = response.json()
\`\`\`

## Implementation

### Location
- File: `web-app/app/api/employees/route.ts`
- Handler: `POST`

### Dependencies
- `@prisma/client` - Database access
- `next-auth` - Authentication
- `zod` - Validation

### Related Functions
- `validateEmployee()` - Input validation
- `createEmployee()` - Database operation

## Testing

### Test File
- `web-app/app/api/employees/__tests__/route.test.ts`

### Test Coverage
- Happy path: Create valid employee
- Validation errors: Invalid email, missing fields
- Authorization: Unauthorized, insufficient permissions
- Edge cases: Duplicate email, SQL injection attempts

## Rate Limiting

- **Limit:** 100 requests per minute per IP
- **Headers:**
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 95`
  - `X-RateLimit-Reset: 1676469600`

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-15 | Initial implementation |
```

---

## 🤖 Automated Documentation Tools

### Tool 1: Generate API Docs from Code

**Script:** `.ai/scripts/generate-api-docs.sh`

```bash
#!/bin/bash
# Generate API documentation from route files

echo "🔍 Scanning API routes..."

# Find all API route files
find web-app/app/api -name "route.ts" | while read route_file; do
    # Extract endpoint path
    endpoint=$(echo $route_file | sed 's|web-app/app/api/||' | sed 's|/route.ts||')

    echo "📄 Found endpoint: /$endpoint"

    # TODO: Parse JSDoc comments and generate markdown
    # For now, remind to create manual doc
    doc_file=".ai/artifacts/docs/api/${endpoint//\//-}.md"
    if [ ! -f "$doc_file" ]; then
        echo "⚠️  Missing documentation: $doc_file"
        echo "   Create from template: .ai/templates/api-endpoint-doc.md"
    fi
done
```

### Tool 2: Update CHANGELOG Automatically

**Script:** `.ai/scripts/update-changelog.sh`

```bash
#!/bin/bash
# Update CHANGELOG.md from commit messages

VERSION=${1:-"Unreleased"}
DATE=$(date +%Y-%m-%d)

echo "## [$VERSION] - $DATE" >> CHANGELOG.tmp

echo "" >> CHANGELOG.tmp
echo "### Added" >> CHANGELOG.tmp
git log --pretty=format:"- %s" --grep="^feat:" $(git describe --tags --abbrev=0 2>/dev/null || echo "")..HEAD >> CHANGELOG.tmp

echo "" >> CHANGELOG.tmp
echo "### Fixed" >> CHANGELOG.tmp
git log --pretty=format:"- %s" --grep="^fix:" $(git describe --tags --abbrev=0 2>/dev/null || echo "")..HEAD >> CHANGELOG.tmp

echo "" >> CHANGELOG.tmp
echo "### Changed" >> CHANGELOG.tmp
git log --pretty=format:"- %s" --grep="^refactor:" $(git describe --tags --abbrev=0 2>/dev/null || echo "")..HEAD >> CHANGELOG.tmp

# Prepend to CHANGELOG.md
cat CHANGELOG.tmp CHANGELOG.md > CHANGELOG.new
mv CHANGELOG.new CHANGELOG.md
rm CHANGELOG.tmp

echo "✅ CHANGELOG.md updated"
```

### Tool 3: Generate Test Documentation

**Script:** `.ai/scripts/document-tests.sh`

```bash
#!/bin/bash
# Generate test documentation from test files

echo "📊 Generating test documentation..."

# Run tests with JSON output
cd web-app
npm test -- --json --outputFile=../test-results.json

# Parse results and create documentation
node <<'EOF'
const fs = require('fs');
const results = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));

let markdown = '# Test Documentation\n\n';
markdown += `**Generated:** ${new Date().toISOString()}\n\n`;
markdown += `**Total Tests:** ${results.numTotalTests}\n`;
markdown += `**Passing:** ${results.numPassedTests}\n`;
markdown += `**Failing:** ${results.numFailedTests}\n\n`;

markdown += '## Test Suites\n\n';

results.testResults.forEach(suite => {
  markdown += `### ${suite.name}\n\n`;
  suite.assertionResults.forEach(test => {
    const status = test.status === 'passed' ? '✅' : '❌';
    markdown += `${status} ${test.title}\n`;
  });
  markdown += '\n';
});

fs.writeFileSync('.ai/artifacts/docs/tests/test-report.md', markdown);
console.log('✅ Test documentation generated');
EOF

cd ..
```

---

## 📊 Documentation Checklist

### Before Every Commit

- [ ] Code has JSDoc comments
- [ ] Tests have documentation comments
- [ ] Feature doc created/updated (if feature)
- [ ] API doc created/updated (if API change)
- [ ] CHANGELOG.md entry added
- [ ] README.md updated (if user-facing change)
- [ ] Architecture docs updated (if structure changed)

### During Code Review

- [ ] Documentation is accurate
- [ ] Examples are working
- [ ] API docs match implementation
- [ ] Test documentation is clear
- [ ] CHANGELOG entry is meaningful

---

## 🔍 Documentation Quality Standards

### Good Documentation Example

```typescript
/**
 * Calculates shift overlap between two time ranges
 *
 * Determines if two shifts have any overlapping time periods.
 * Uses inclusive start time and exclusive end time comparison.
 *
 * @param shift1 - First shift with start and end times
 * @param shift2 - Second shift with start and end times
 * @returns true if shifts overlap, false otherwise
 *
 * @example
 * ```typescript
 * const morning = { start: '09:00', end: '17:00' };
 * const evening = { start: '16:00', end: '22:00' };
 *
 * isOverlapping(morning, evening); // true (1 hour overlap)
 * ```
 *
 * @example
 * ```typescript
 * const morning = { start: '09:00', end: '17:00' };
 * const night = { start: '18:00', end: '02:00' };
 *
 * isOverlapping(morning, night); // false (no overlap)
 * ```
 *
 * @see calculateOverlapDuration for overlap duration
 * @see FEATURE-002-shift-management.md for business rules
 *
 * @since 1.0.0
 */
export function isOverlapping(
  shift1: { start: string; end: string },
  shift2: { start: string; end: string }
): boolean {
  // Implementation with inline comments explaining complex logic
  const start1 = parseTime(shift1.start);
  const end1 = parseTime(shift1.end);
  const start2 = parseTime(shift2.start);
  const end2 = parseTime(shift2.end);

  // Overlap occurs if:
  // - shift1 starts before shift2 ends AND
  // - shift1 ends after shift2 starts
  return start1 < end2 && end1 > start2;
}
```

---

## 📈 Metrics & Monitoring

### Documentation Coverage

Track documentation coverage alongside test coverage:

```bash
# Count documented functions
TOTAL_FUNCTIONS=$(grep -r "^export function" web-app/app --include="*.ts" | wc -l)
DOCUMENTED_FUNCTIONS=$(grep -r "@param\|@returns" web-app/app --include="*.ts" | wc -l)

COVERAGE=$((DOCUMENTED_FUNCTIONS * 100 / TOTAL_FUNCTIONS))
echo "Documentation Coverage: $COVERAGE%"

# Target: 80% minimum (same as test coverage)
```

### API Documentation Completeness

```bash
# Check all API routes have documentation
find web-app/app/api -name "route.ts" | while read route; do
    endpoint=$(echo $route | sed 's|web-app/app/api/||' | sed 's|/route.ts||')
    doc=".ai/artifacts/docs/api/${endpoint//\//-}.md"

    if [ ! -f "$doc" ]; then
        echo "❌ Missing API doc: $endpoint"
    else
        echo "✅ Documented: $endpoint"
    fi
done
```

---

## 🎯 Summary

**Documentation is code.** Every change requires documentation updates.

**Automation helps,** but humans (and AI agents) must ensure quality.

**The Documentation Cycle:**
1. Write test (with test docs)
2. Write code (with JSDoc)
3. Create/update feature docs
4. Create/update API docs (if applicable)
5. Update CHANGELOG
6. Commit with documentation

**Never skip documentation.** It's as important as tests.

---

For templates, see:
- `.ai/templates/feature-doc.md`
- `.ai/templates/api-endpoint-doc.md`
- `.ai/templates/test-doc.md`

For examples, see existing docs in:
- `.ai/artifacts/docs/features/`
- `.ai/artifacts/docs/api/`
- `.ai/artifacts/docs/tests/`
