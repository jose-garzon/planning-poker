# Folder Structure

This project uses a **vertical (module-based) architecture** for better scalability and maintainability.

## Overview

```
next-placeholder/
├── app/                      # Next.js App Router (routing only)
│   ├── api/                  # API routes (thin controllers)
│   │   ├── health/
│   │   └── users/
│   ├── users/
│   ├── layout.tsx
│   ├── page.tsx              # Imports HomePage from modules
│   ├── error.tsx
│   ├── loading.tsx
│   └── not-found.tsx
├── modules/                  # Feature modules (vertical slices)
│   ├── home/
│   │   ├── components/       # Home-specific components
│   │   ├── hooks/            # Home-specific hooks
│   │   ├── services/         # Home business logic
│   │   ├── styles/           # Home-specific styles
│   │   └── home.page.tsx     # Entry point
│   └── users/
│       ├── components/       # User-specific components
│       ├── hooks/            # User-specific hooks
│       ├── services/         # User business logic
│       │   └── users.service.ts
│       ├── styles/           # User-specific styles
│       └── users.page.tsx    # Entry point
├── shared/                   # Shared code across modules
│   ├── components/
│   │   └── ui/              # Reusable UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── dialog.tsx
│   ├── lib/
│   │   ├── api/             # API utilities
│   │   │   ├── response.ts
│   │   │   └── errors.ts
│   │   ├── db/              # Database utilities
│   │   │   └── prisma.ts
│   │   ├── utils/           # Helper functions
│   │   │   └── cn.ts
│   │   └── validations/     # Zod schemas
│   │       └── user.ts
│   └── types/               # TypeScript types
│       ├── api.ts
│       ├── models.ts
│       └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── tests/
    ├── unit/
    ├── integration/
    ├── e2e/
    ├── setup/
    └── helpers/
```

## Architecture Patterns

### 1. App Directory (Routing Layer)
**Purpose**: Handle Next.js routing only

- Contains route definitions
- Imports page components from `modules/`
- API routes are thin controllers that delegate to services
- No business logic

**Example**:
```typescript
// app/users/page.tsx
import UsersPage from '@/modules/users/users.page';
export default UsersPage;
```

### 2. Modules (Feature Modules)
**Purpose**: Self-contained feature implementations

Each module contains:
- **components/**: Module-specific UI components
- **hooks/**: Custom React hooks for this module
- **services/**: Business logic and data operations
- **styles/**: Module-specific styles (optional)
- **\*.page.tsx**: Entry point component

**Benefits**:
- ✅ Isolated features
- ✅ Easy to understand scope
- ✅ Scalable (add modules without conflicts)
- ✅ Team ownership (different teams = different modules)
- ✅ Portable (can move/extract modules easily)

**Example**:
```typescript
// modules/users/services/users.service.ts
export class UsersService {
  static async listUsers(params: unknown) {
    // Business logic here
  }
}
```

### 3. Shared (Cross-Module Code)
**Purpose**: Code used by multiple modules

Contains:
- **components/**: Reusable UI primitives
- **lib/**: Utilities, API helpers, database, validation
- **types/**: Shared TypeScript types

**Guidelines**:
- Only add code here if used by 2+ modules
- Keep it generic and module-agnostic
- Prefer keeping code in modules when possible

**Example**:
```typescript
// shared/components/ui/button.tsx
export const Button = ...

// shared/lib/api/response.ts
export function apiResponse<T>(...) { ... }
```

## Import Patterns

### Path Aliases

```typescript
// Import from shared
import { Button } from '@/shared/components/ui/button';
import { prisma } from '@/shared/lib/db/prisma';
import type { User } from '@/shared/types/models';

// Import from modules
import HomePage from '@/modules/home/home.page';
import { UsersService } from '@/modules/users/services/users.service';
```

### Import Rules

1. **Modules can import from**:
   - ✅ `@/shared/*` (shared code)
   - ✅ Same module (`./components`, `./hooks`, etc.)
   - ❌ Other modules (use shared instead)

2. **Shared can import from**:
   - ✅ Other shared code
   - ✅ External packages
   - ❌ Modules (creates circular dependency)

3. **App routes can import from**:
   - ✅ `@/modules/*` (page components)
   - ✅ `@/shared/*` (utilities)

## Migration from Horizontal Architecture

We migrated from:
```
OLD:
├── components/ui/    → MOVED TO: shared/components/ui/
├── lib/              → MOVED TO: shared/lib/
└── types/            → MOVED TO: shared/types/
```

To vertical modules:
```
NEW:
├── modules/          → NEW: Feature modules
│   ├── home/
│   └── users/
└── shared/           → Shared utilities
```

## When to Create a New Module

Create a new module when:
- ✅ Adding a distinct feature/domain (e.g., "products", "orders")
- ✅ The code is cohesive and related
- ✅ It could potentially be owned by a team
- ✅ It has its own business logic

Don't create a module when:
- ❌ It's just a few components used everywhere
- ❌ It's purely presentational
- ❌ It's a utility or helper (use `shared/` instead)

## Example: Adding a New Module

1. Create module structure:
```bash
mkdir -p modules/products/{components,hooks,services,styles}
```

2. Create entry point:
```typescript
// modules/products/products.page.tsx
export default function ProductsPage() {
  return <div>Products</div>
}
```

3. Add route:
```typescript
// app/products/page.tsx
import ProductsPage from '@/modules/products/products.page';
export default ProductsPage;
```

4. Add service (if needed):
```typescript
// modules/products/services/products.service.ts
export class ProductsService {
  static async listProducts() { ... }
}
```

5. Add API route:
```typescript
// app/api/products/route.ts
import { ProductsService } from '@/modules/products/services/products.service';
export async function GET() {
  const products = await ProductsService.listProducts();
  return apiResponse({ data: products });
}
```

## Benefits of This Architecture

1. **Scalability**: Add features without touching existing code
2. **Maintainability**: Clear boundaries and responsibilities
3. **Team Collaboration**: Different teams can own different modules
4. **Testing**: Easy to test modules in isolation
5. **Code Organization**: Logical grouping by feature, not by type
6. **Reduced Merge Conflicts**: Teams work in separate directories
