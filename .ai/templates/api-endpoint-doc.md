# API: [METHOD] /api/endpoint

**Version:** 1.0.0
**Status:** Active
**Authentication:** Required
**Rate Limit:** 100 requests/minute

---

## Overview

Brief description of what this endpoint does and when to use it.

## Endpoint Details

- **Method:** `GET` / `POST` / `PUT` / `DELETE` / `PATCH`
- **Path:** `/api/endpoint/:param`
- **Authentication:** Required / Optional
- **Required Roles:** `ADMIN`, `EMPLOYEE`
- **Rate Limit:** 100 requests/minute per user

## Request

### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| id | string | Yes | Resource identifier | `"123"` |
| userId | number | No | User filter | `42` |

### Query Parameters

| Parameter | Type | Required | Default | Description | Example |
|-----------|------|----------|---------|-------------|---------|
| limit | number | No | 10 | Results per page (max 100) | `20` |
| offset | number | No | 0 | Pagination offset | `40` |
| sort | string | No | `createdAt` | Sort field | `"name"` |
| order | string | No | `desc` | Sort order (`asc`, `desc`) | `"asc"` |
| filter | string | No | - | Filter by field | `"active"` |

### Request Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
```

### Request Body

```typescript
interface CreateResourceRequest {
  name: string;              // Required: Resource name
  email: string;             // Required: Valid email
  role: 'ADMIN' | 'EMPLOYEE'; // Required: User role
  skills?: string[];         // Optional: Array of skills
  metadata?: {               // Optional: Additional data
    [key: string]: any;
  };
}
```

**Example:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "EMPLOYEE",
  "skills": ["TypeScript", "React"],
  "metadata": {
    "department": "Engineering"
  }
}
```

### Validation Rules

| Field | Rules |
|-------|-------|
| name | Required, 1-100 characters, alphanumeric + spaces |
| email | Required, valid email format, unique |
| role | Required, must be 'ADMIN' or 'EMPLOYEE' |
| skills | Optional, array of strings, max 20 items, no duplicates |

## Response

### Success Response (200 OK / 201 Created)

```typescript
interface SuccessResponse {
  success: true;
  data: {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'EMPLOYEE';
    skills: string[];
    createdAt: string; // ISO 8601
    updatedAt: string; // ISO 8601
  };
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
```

**Example:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "EMPLOYEE",
    "skills": ["TypeScript", "React"],
    "createdAt": "2026-02-15T10:00:00Z",
    "updatedAt": "2026-02-15T10:00:00Z"
  }
}
```

### Error Responses

#### 400 Bad Request

**Cause:** Invalid request data, validation errors

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email",
      "constraint": "Must be valid email"
    }
  }
}
```

#### 401 Unauthorized

**Cause:** Missing or invalid authentication token

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": null
  }
}
```

#### 403 Forbidden

**Cause:** Insufficient permissions

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Admin role required",
    "details": {
      "required_role": "ADMIN",
      "current_role": "EMPLOYEE"
    }
  }
}
```

#### 404 Not Found

**Cause:** Resource doesn't exist

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": {
      "resource": "Employee",
      "id": "999"
    }
  }
}
```

#### 409 Conflict

**Cause:** Resource already exists (e.g., duplicate email)

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Email already exists",
    "details": {
      "field": "email",
      "value": "john@example.com"
    }
  }
}
```

#### 429 Too Many Requests

**Cause:** Rate limit exceeded

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": {
      "limit": 100,
      "reset_at": "2026-02-15T10:05:00Z"
    }
  }
}
```

#### 500 Internal Server Error

**Cause:** Unexpected server error

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "details": null
  }
}
```

## Examples

### cURL

```bash
# Create resource
curl -X POST https://api.shiftsync.com/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "role": "EMPLOYEE",
    "skills": ["TypeScript", "React"]
  }'

# Get resource by ID
curl -X GET https://api.shiftsync.com/api/employees/123 \
  -H "Authorization: Bearer YOUR_TOKEN"

# List resources with pagination
curl -X GET "https://api.shiftsync.com/api/employees?limit=20&offset=0&sort=name&order=asc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### JavaScript/TypeScript

```typescript
// Using fetch
async function createEmployee(data) {
  const response = await fetch('/api/employees', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error.message);
  }

  return result.data;
}

// Usage
try {
  const employee = await createEmployee({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'EMPLOYEE',
    skills: ['TypeScript', 'React']
  });

  console.log('Created employee:', employee);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Python

```python
import requests

# Create resource
response = requests.post(
    'https://api.shiftsync.com/api/employees',
    json={
        'name': 'John Doe',
        'email': 'john@example.com',
        'role': 'EMPLOYEE',
        'skills': ['TypeScript', 'React']
    },
    headers={
        'Authorization': f'Bearer {token}'
    }
)

data = response.json()

if data['success']:
    print('Created employee:', data['data'])
else:
    print('Error:', data['error']['message'])
```

## Implementation

### Location
- **File:** `web-app/app/api/employees/route.ts`
- **Handler:** `POST`, `GET`
- **Lines:** 1-150

### Dependencies
- `@prisma/client` - Database ORM
- `next-auth` - Authentication
- `zod` - Request validation
- `@/lib/result` - Result type for error handling

### Related Functions
- `validateEmployee()` - Input validation (app/lib/employee-validation.ts)
- `createEmployee()` - Business logic (app/lib/employee-actions.ts)
- `getEmployeeById()` - Fetch logic (app/lib/employee-actions.ts)

### Code Reference

```typescript
// web-app/app/api/employees/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createEmployee } from '@/lib/employee-actions';
import { validateEmployee } from '@/lib/employee-validation';

export async function POST(request: NextRequest) {
  // 1. Check authentication
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    );
  }

  // 2. Check authorization
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: { code: 'FORBIDDEN', message: 'Admin role required' } },
      { status: 403 }
    );
  }

  // 3. Parse request body
  const body = await request.json();

  // 4. Validate input
  const validation = validateEmployee(body);
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 }
    );
  }

  // 5. Create resource
  const result = await createEmployee(validation.data);
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 }
    );
  }

  // 6. Return success
  return NextResponse.json(
    { success: true, data: result.data },
    { status: 201 }
  );
}
```

## Testing

### Test File
- **Location:** `web-app/app/api/employees/__tests__/route.test.ts`
- **Tests:** 15 test cases
- **Coverage:** 100%

### Test Cases
- ✅ Happy path: Create employee with valid data
- ✅ Validation: Reject invalid email
- ✅ Validation: Reject missing required fields
- ✅ Validation: Reject duplicate skills
- ✅ Auth: Reject unauthenticated requests
- ✅ Auth: Reject non-admin users
- ✅ Edge case: Handle database errors
- ✅ Edge case: Handle duplicate email
- ✅ Performance: Response time < 200ms

## Rate Limiting

### Limits
- **Per User:** 100 requests/minute
- **Per IP:** 500 requests/minute
- **Burst:** 10 requests/second

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1676469600
```

### Handling Rate Limits

```typescript
async function makeRequestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const waitTime = (parseInt(resetTime) * 1000) - Date.now();

      console.log(`Rate limited. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      continue;
    }

    return response;
  }

  throw new Error('Max retries exceeded');
}
```

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-02-15 | Initial implementation | Agent ID |
| 1.1.0 | 2026-02-16 | Added pagination support | Agent ID |

## Related Documentation

- **Feature:** [FEATURE-001-employee-management.md](../features/FEATURE-001-employee-management.md)
- **ADR:** [ADR-005-api-error-handling.md](../decisions/adr-005-api-error-handling.md)
- **OpenAPI Spec:** [/docs/api/openapi.yaml](/docs/api/openapi.yaml)

---

**Last Updated:** YYYY-MM-DD
**Maintained By:** [Agent ID or Team Name]
