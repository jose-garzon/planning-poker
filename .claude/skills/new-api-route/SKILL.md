---
name: new-api-route
description: Create a new API route following project conventions with Zod validation
disable-model-invocation: true
argument-hint: "[resource-name]"
---

Create a new API route for the `$ARGUMENTS` resource following project conventions.

## Files to Create

### 1. Service Layer (business logic)

```
modules/$ARGUMENTS/services/$ARGUMENTS-service.ts
```

Service contains all business logic as static methods:
```typescript
export class [PascalCase]Service {
  static async getAll() { ... }
  static async getById(id: string) { ... }
  static async create(data: CreateInput) { ... }
  static async update(id: string, data: UpdateInput) { ... }
  static async delete(id: string) { ... }
}
```

### 2. Zod Validation Schemas

```
modules/$ARGUMENTS/lib/validation.ts
```

Define schemas for all inputs:
```typescript
import { z } from 'zod';

export const create[PascalCase]Schema = z.object({ ... });
export const update[PascalCase]Schema = create[PascalCase]Schema.partial();
```

### 3. API Route Files

```
app/api/$ARGUMENTS/route.ts          # GET (list), POST (create)
app/api/$ARGUMENTS/[id]/route.ts     # GET (by id), PATCH (update), DELETE
```

### API Route Pattern

```typescript
import { NextRequest } from 'next/server';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const result = await Service.create(data);
    return Response.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Response Format

All endpoints return consistent JSON:

**Success**: `{ success: true, data: { ... }, timestamp: string }`
**Error**: `{ success: false, error: { message, code, details? }, timestamp: string }`

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Duplicate resource |
| INTERNAL_ERROR | 500 | Server error |

## Rules

- Service layer handles ALL business logic; routes are thin controllers
- Validate ALL inputs with Zod
- Use `import type` for type-only imports
- Follow Biome formatting: 2 spaces, single quotes, semicolons, trailing commas
- Since this project uses client-side IndexedDB, API routes primarily handle SSE broadcasting and session coordination

After creating the route, suggest writing tests for it.
