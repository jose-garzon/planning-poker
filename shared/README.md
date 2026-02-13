# Shared

This directory contains code and utilities shared across all modules.

## Structure

```
shared/
├── components/          # Reusable UI components
│   └── ui/             # Base UI components (Button, Input, etc.)
├── lib/                # Utility libraries
│   ├── api/           # API utilities (responses, errors)
│   ├── db/            # Database utilities (Prisma client)
│   ├── utils/         # Helper functions (cn, etc.)
│   └── validations/   # Zod schemas
└── types/             # TypeScript type definitions
    ├── api.ts
    ├── models.ts
    └── index.ts
```

## Guidelines

### When to Use Shared

Place code in `shared/` when it:
- Is used by 2+ modules
- Provides core functionality (database, API, validation)
- Contains UI primitives that should be consistent across the app
- Defines common types or interfaces

### When NOT to Use Shared

Keep code in modules when it:
- Is specific to one feature/domain
- Has business logic tied to that module
- Would make the module dependent on implementation details

## Examples

### Shared Components
```typescript
// shared/components/ui/button.tsx
export const Button = ...
```

### Shared Utilities
```typescript
// shared/lib/utils/cn.ts
export function cn(...inputs: ClassValue[]) { ... }
```

### Shared Types
```typescript
// shared/types/api.ts
export interface ApiResponse<T> { ... }
```

### Shared Services
```typescript
// shared/lib/db/prisma.ts
export const prisma = ...
```

## Import Pattern

Always use the `@/shared/*` alias for imports:

```typescript
import { Button } from '@/shared/components/ui/button';
import { prisma } from '@/shared/lib/db/prisma';
import { apiResponse } from '@/shared/lib/api/response';
import type { User } from '@/shared/types/models';
```
