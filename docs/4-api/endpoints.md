# API Documentation

Base URL: `http://localhost:3000/api`

## Response Format

All API endpoints return JSON responses in a standardized format.

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Health Check

### Check API Status

```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Users

### List Users

Retrieve a paginated list of users.

```http
GET /api/users?page=1&limit=10&role=USER
```

**Query Parameters:**
| Parameter | Type   | Required | Default | Description             |
|-----------|--------|----------|---------|-------------------------|
| page      | number | No       | 1       | Page number             |
| limit     | number | No       | 10      | Items per page (max 100)|
| role      | string | No       | -       | Filter by role (USER/ADMIN) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "clxxx...",
        "email": "alice@example.com",
        "name": "Alice Johnson",
        "role": "ADMIN",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400` - Invalid query parameters

---

### Create User

Create a new user.

```http
POST /api/users
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER"
}
```

**Fields:**
| Field | Type   | Required | Description                    |
|-------|--------|----------|--------------------------------|
| email | string | Yes      | Valid email address (unique)   |
| name  | string | Yes      | User name (1-100 characters)   |
| role  | string | No       | USER or ADMIN (default: USER)  |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400` - Validation error (invalid email, missing fields, etc.)
- `409` - Email already exists

**Example Error:**
```json
{
  "success": false,
  "error": {
    "message": "User with this email already exists",
    "code": "CONFLICT"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Get User

Retrieve a specific user by ID.

```http
GET /api/users/:id
```

**Path Parameters:**
| Parameter | Type   | Description |
|-----------|--------|-------------|
| id        | string | User ID     |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "alice@example.com",
      "name": "Alice Johnson",
      "role": "ADMIN",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "posts": [
        {
          "id": "clxxx...",
          "title": "Getting Started with Next.js 15",
          "status": "PUBLISHED",
          "published": true,
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - User not found

---

### Update User

Update an existing user.

```http
PATCH /api/users/:id
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type   | Description |
|-----------|--------|-------------|
| id        | string | User ID     |

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "name": "Updated Name",
  "role": "ADMIN"
}
```

**Fields (all optional):**
| Field | Type   | Description                  |
|-------|--------|------------------------------|
| email | string | Valid email address (unique) |
| name  | string | User name (1-100 characters) |
| role  | string | USER or ADMIN                |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "newemail@example.com",
      "name": "Updated Name",
      "role": "ADMIN",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```

**Error Responses:**
- `400` - Validation error
- `404` - User not found
- `409` - Email already in use by another user

---

### Delete User

Delete a user and all associated posts.

```http
DELETE /api/users/:id
```

**Path Parameters:**
| Parameter | Type   | Description |
|-----------|--------|-------------|
| id        | string | User ID     |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - User not found

**Note:** Deleting a user will cascade delete all associated posts.

---

## Error Codes

| Code              | HTTP Status | Description                      |
|-------------------|-------------|----------------------------------|
| VALIDATION_ERROR  | 400         | Request validation failed        |
| UNAUTHORIZED      | 401         | Authentication required          |
| FORBIDDEN         | 403         | Insufficient permissions         |
| NOT_FOUND         | 404         | Resource not found               |
| CONFLICT          | 409         | Resource conflict (e.g., duplicate email) |
| INTERNAL_ERROR    | 500         | Server error                     |

## Validation Error Format

When validation fails (400), the error includes detailed field-level errors:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "code": "invalid_type",
        "expected": "string",
        "received": "undefined",
        "path": ["email"],
        "message": "Required"
      },
      {
        "validation": "email",
        "code": "invalid_string",
        "message": "Invalid email address",
        "path": ["email"]
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Example cURL Commands

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### List Users
```bash
curl http://localhost:3000/api/users?page=1&limit=10
```

### Get User
```bash
curl http://localhost:3000/api/users/clxxx...
```

### Update User
```bash
curl -X PATCH http://localhost:3000/api/users/clxxx... \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/clxxx...
```

## Rate Limiting

Currently not implemented. In production, consider adding rate limiting to prevent abuse.

## Authentication

Currently not implemented. The scaffold is ready to integrate authentication (e.g., NextAuth.js) when needed.

## Versioning

API versioning is not currently implemented. For production applications, consider:
- Path versioning: `/api/v1/users`
- Header versioning: `Accept: application/vnd.api.v1+json`

## Testing

Use the provided test suite to validate API behavior:

```bash
# Integration tests
bun test tests/integration/api/users.test.ts

# E2E tests
bun run test:e2e
```
