# Next.js 15 Placeholder - AI Assistant Guide

> **Purpose**: This document guides AI assistants (Claude, GitHub Copilot, etc.) on project conventions, architecture, and best practices.

## Project Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + CSS Modules
- **Database**: Prisma ORM (SQLite for dev, PostgreSQL for prod)
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Linting/Formatting**: Biome
- **Package Manager**: Bun (REQUIRED - see user preferences in auto memory)
- **UI Components**: Base UI Components

### Architecture Pattern
- **Vertical Slice Architecture**: Features organized by domain modules
- **Service Layer Pattern**: Business logic in service files
- **Type-Safe API Routes**: Zod validation for all inputs
- **Server Components First**: Use Client Components only when needed

## Development Guidelines

### TypeScript Requirements
- **Strict Mode**: All TypeScript strict checks enabled
- **No Implicit Any**: Explicit types required
- **No Unused Variables**: Clean up imports and variables
- **Type Imports**: Use `import type` for type-only imports

```typescript
// Good
import type { User } from '@/shared/types';
import { fetchUser } from '@/shared/lib/api';

// Bad
import { User } from '@/shared/types'; // Not type-only
```

### Import Patterns
Use path aliases for cleaner imports:

```typescript
// Shared utilities
import { cn } from '@/shared/lib/utils';

// Module-specific code
import { UserService } from '@/modules/users/server/user.service';

// Next.js App Router
import { Metadata } from 'next';
```

**Import Order**:
1. External dependencies (React, Next.js, etc.)
2. Internal aliases (@/shared, @/modules)
3. Relative imports (./components, ../lib)
4. Type imports (import type)

### Service Layer Pattern
All business logic lives in service files:

```typescript
// modules/users/server/user.service.ts
export class UserService {
  static async getUserById(id: string) {
    // Business logic here
    return await db.user.findUnique({ where: { id } });
  }
}

// app/api/users/[id]/route.ts
import { UserService } from '@/modules/users/server/user.service';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await UserService.getUserById(params.id);
  return Response.json(user);
}
```

### Error Handling
Use structured error responses:

```typescript
import { ZodError } from 'zod';

try {
  // Business logic
} catch (error) {
  if (error instanceof ZodError) {
    return Response.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
  }
  return Response.json({ error: 'Internal server error' }, { status: 500 });
}
```

## Code Style (Biome Configuration)

### Formatting Rules
- **Indent**: 2 spaces
- **Line Width**: 100 characters
- **Quotes**: Single quotes for JS/TS, double quotes for JSX
- **Semicolons**: Always
- **Trailing Commas**: Always
- **Arrow Parens**: Always

```typescript
// Good
const getUser = async (id: string) => {
  return await db.user.findUnique({ where: { id } });
};

// Bad - missing arrow parens, inconsistent quotes
const getUser = async id => {
  return await db.user.findUnique({ where: { id } })
}
```

### Naming Conventions
- **Files**: kebab-case (`user-service.ts`, `user-card.tsx`)
- **Components**: PascalCase (`UserCard`, `ProfileHeader`)
- **Functions**: camelCase (`getUserById`, `validateInput`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`User`, `ApiResponse`)

### Component Patterns
Prefer Server Components:

```tsx
// app/users/page.tsx (Server Component - default)
export default async function UsersPage() {
  const users = await UserService.getAll();
  return <UserList users={users} />;
}

// components/user-list.tsx (Client Component - only when needed)
'use client';
export function UserList({ users }: { users: User[] }) {
  const [filter, setFilter] = useState('');
  // Client-side interactivity
}
```

## Testing Strategy

### Unit Tests (Vitest)
- **Location**: `tests/unit/**/*.test.ts`
- **Pattern**: Co-locate with tested code when possible
- **Coverage**: Aim for 80%+ on business logic

```typescript
// tests/unit/lib/cn.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from '@/shared/lib/utils';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
  });
});
```

### E2E Tests (Playwright)
- **Location**: `tests/e2e/**/*.spec.ts`
- **Focus**: Critical user flows
- **Run**: Before deployment

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

### Testing Commands
```bash
bun test              # Run unit tests in watch mode
bun test:coverage     # Run with coverage report
bun test:e2e          # Run E2E tests
bun test:e2e:ui       # Run E2E with Playwright UI
```

## File Structure

### Module Organization
```
modules/
  users/
    components/        # React components
    server/           # Server-side code (services, db)
    types/            # Module-specific types
    lib/              # Module utilities
```

### Shared Code
```
shared/
  components/         # Reusable UI components
  lib/               # Utilities (cn, validation, etc.)
  types/             # Global types
  styles/            # Global styles
  hooks/             # Custom React hooks
```

### When to Create Files
- **New Module**: Add to `modules/` with full structure
- **Shared Component**: Add to `shared/components/`
- **Utility Function**: Add to `shared/lib/` or module `lib/`
- **API Route**: Add to `app/api/` following Next.js conventions

## Common Tasks

### Adding a New Module
1. Create module directory: `modules/feature-name/`
2. Add subdirectories: `components/`, `server/`, `types/`, `lib/`
3. Create service file: `server/feature.service.ts`
4. Add types: `types/index.ts`
5. Create components as needed
6. Add API routes: `app/api/feature-name/route.ts`

### Creating API Routes
```typescript
// app/api/users/route.ts
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { UserService } from '@/modules/users/server/user.service';

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createUserSchema.parse(body);
    const user = await UserService.create(data);
    return Response.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Database Migrations
```bash
bun run db:migrate        # Create and apply migration
bun run db:migrate:deploy # Deploy migrations (production)
bun run db:generate       # Generate Prisma client
bun run db:studio         # Open Prisma Studio
bun run db:seed           # Seed database
bun run db:reset          # Reset database (dev only)
```

### Running the Application
```bash
bun install              # Install dependencies
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run Biome linter
bun run lint:fix         # Auto-fix linting issues
bun run format           # Format code with Biome
bun run type-check       # Run TypeScript type checking
```

## CI/CD Pipeline

### GitHub Actions Workflow
Automated checks on every push and PR:
1. **Lint & Format**: Biome checks
2. **Type Check**: TypeScript compilation
3. **Unit Tests**: Vitest with coverage
4. **Build**: Next.js production build

All checks must pass before merging.

### Pre-Commit Hooks
Git hooks automatically run on commit:
- Auto-fix linting issues
- Format code
- Re-stage modified files

Setup: `bunx simple-git-hooks` (runs automatically on install)

## Best Practices

### Security
- ✅ Validate all user inputs with Zod
- ✅ Use environment variables for secrets
- ✅ Sanitize database queries (Prisma handles this)
- ❌ Never commit `.env` files
- ❌ Avoid `dangerouslySetInnerHTML`

### Performance
- ✅ Use Server Components by default
- ✅ Optimize images with Next.js `<Image />`
- ✅ Implement proper caching strategies
- ✅ Use dynamic imports for large components
- ❌ Avoid client-side data fetching when possible

### Accessibility
- ✅ Use semantic HTML elements
- ✅ Add ARIA labels where needed
- ✅ Ensure keyboard navigation works
- ✅ Maintain color contrast ratios
- ✅ Test with screen readers

### Code Quality
- ✅ Write self-documenting code
- ✅ Keep functions small and focused
- ✅ Use meaningful variable names
- ✅ Add comments only when logic is complex
- ❌ Avoid over-engineering
- ❌ Don't add features that aren't requested

## Documentation

### Documentation Structure
See `docs/README.md` for the complete documentation index.

**Quick Links**:
- Getting Started: `docs/1-getting-started/`
- Architecture: `docs/2-architecture/`
- Development: `docs/3-development/`
- API Reference: `docs/4-api/`
- Deployment: `docs/5-deployment/`
- Reference: `docs/6-reference/`

### When to Update Docs
- Adding new modules or features
- Changing architecture patterns
- Adding new scripts or commands
- Making breaking changes
- Creating new conventions

## Environment Variables

Required environment variables (see `.env.example`):
- `DATABASE_URL`: Database connection string
- `NODE_ENV`: Environment (development, test, production)

## Git Workflow

### Commit Messages
Follow conventional commits:
```
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
test: add unit tests for user service
chore: update dependencies
```

### Branch Strategy
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches

## AI Assistant Tips

When generating code:
1. ✅ Always use Bun commands (not npm/yarn/pnpm)
2. ✅ Follow the service layer pattern
3. ✅ Use TypeScript strict mode
4. ✅ Add proper error handling
5. ✅ Validate inputs with Zod
6. ✅ Prefer Server Components
7. ✅ Follow Biome formatting rules
8. ✅ Write tests for new features
9. ❌ Don't add unnecessary dependencies
10. ❌ Don't over-engineer solutions

## Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Biome Docs**: https://biomejs.dev
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Vitest Docs**: https://vitest.dev
- **Playwright Docs**: https://playwright.dev
