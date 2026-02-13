# Architecture Documentation

## Technology Choices

### Next.js 15 with App Router

**Why?**
- Server Components by default for better performance
- Simplified data fetching with async/await
- Built-in TypeScript support
- Excellent developer experience
- Production-ready out of the box

**Trade-offs:**
- Learning curve for developers familiar with Pages Router
- Some third-party libraries may not be compatible yet

### TypeScript (Strict Mode)

**Why?**
- Catch errors at compile time
- Better IDE support with autocomplete
- Self-documenting code
- Safer refactoring

**Configuration:**
```typescript
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitReturns": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

### Biome (Linting & Formatting)

**Why chosen over ESLint/Prettier?**
- **25x faster** than ESLint
- **Single tool** replaces ESLint + Prettier
- **Zero config conflicts** between linting and formatting
- **Better error messages**
- **Built-in import sorting**

**Trade-offs:**
- Smaller ecosystem than ESLint
- Fewer plugins available

### Tailwind CSS + Base UI

**Why Tailwind?**
- Utility-first approach
- No CSS naming conflicts
- Excellent IDE support
- Tree-shaking for small bundles

**Why Base UI?**
- **Headless components** - full styling control
- **Accessibility built-in** - ARIA attributes handled
- **Lightweight** - no CSS framework baggage
- **Framework agnostic** - works anywhere

**Alternative considered:** shadcn/ui (great but more opinionated)

### Prisma ORM

**Why?**
- Type-safe database queries
- Great migration system
- Excellent TypeScript support
- Auto-completion for queries
- Prisma Studio for database management

**Trade-offs:**
- Adds build step (code generation)
- Can be slower than raw SQL for complex queries

### Zod

**Why?**
- Runtime type validation
- Integrates with TypeScript
- Great error messages
- Schema composition
- Type inference

**Pattern:**
```typescript
// Define schema
const schema = z.object({ email: z.string().email() });

// Infer TypeScript type
type Input = z.infer<typeof schema>;

// Validate at runtime
const result = schema.parse(data);
```

### Vitest + Playwright

**Why Vitest?**
- Vite-powered (fast)
- Jest-compatible API
- ESM support
- Great TypeScript support

**Why Playwright?**
- Multi-browser testing
- Mobile device emulation
- Auto-wait (less flaky tests)
- Great debugging tools

## Project Structure

### App Directory (`/app`)

Following Next.js 15 conventions:
- `layout.tsx` - Root layout with HTML structure
- `page.tsx` - Route pages
- `api/` - API routes
- `error.tsx` - Error boundaries
- `loading.tsx` - Loading states
- `not-found.tsx` - 404 pages

### Components (`/components`)

Organized by type:
- `ui/` - Reusable UI primitives (Button, Input, etc.)
- `forms/` - Form components with validation
- `layouts/` - Layout components
- `providers/` - Context providers

### Library (`/lib`)

Utility functions organized by domain:
- `api/` - API utilities (responses, errors)
- `db/` - Database utilities (Prisma client)
- `validations/` - Zod schemas
- `utils/` - Helper functions

### Types (`/types`)

Centralized TypeScript types:
- `api.ts` - API request/response types
- `models.ts` - Data model types
- `index.ts` - Re-exports

## API Design Patterns

### Standardized Responses

All API endpoints return consistent JSON:

**Success:**
```typescript
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error:**
```typescript
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": { ... }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Handling

Custom error classes with HTTP status codes:
- `ApiError` - Base error class
- `ValidationError` - 400 Bad Request
- `UnauthorizedError` - 401 Unauthorized
- `ForbiddenError` - 403 Forbidden
- `NotFoundError` - 404 Not Found
- `ConflictError` - 409 Conflict

### Validation Flow

1. Parse request body/params
2. Validate with Zod schema
3. Check business rules
4. Execute database operation
5. Return standardized response

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Parse
    const body = await request.json();

    // 2. Validate
    const data = createUserSchema.parse(body);

    // 3. Business rules
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new ConflictError('Email exists');

    // 4. Execute
    const user = await prisma.user.create({ data });

    // 5. Respond
    return apiResponse({ data: { user }, status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
```

## Database Strategy

### Schema Design

- **User model** - Authentication and authorization
- **Post model** - Content with status workflow
- **Enums** - Role (USER, ADMIN), PostStatus (DRAFT, PUBLISHED, ARCHIVED)
- **Relations** - One-to-many (User -> Posts)
- **Indexes** - On frequently queried fields (email, status)

### Migration Workflow

1. Edit `prisma/schema.prisma`
2. Run `bun run db:migrate` to create migration
3. Migration files stored in `prisma/migrations/`
4. Prisma client auto-generated

### Singleton Pattern

Prevents multiple Prisma client instances in development:

```typescript
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ ... });

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma;
```

## Testing Strategy

### Unit Tests

- Test individual functions/components
- Mock external dependencies
- Fast execution
- High code coverage

**Example:** Button component variants, utility functions

### Integration Tests

- Test API routes end-to-end
- Use test database
- Test business logic
- Validate responses

**Example:** User CRUD operations

### E2E Tests

- Test user workflows
- Multiple browsers
- Mobile devices
- Real environment

**Example:** Create user flow, navigation

## Security Considerations

### Headers

Configured in `next.config.ts`:
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy` - Control referrer information
- `Permissions-Policy` - Restrict browser features

### Input Validation

- All inputs validated with Zod
- Type coercion where appropriate
- Sanitization for dangerous content
- Max length limits

### Database

- Parameterized queries (Prisma handles)
- No raw SQL by default
- Cascade deletes configured
- Foreign key constraints

### Environment Variables

- Never commit `.env` files
- Use `.env.example` for documentation
- Validate required variables at startup

## Performance Optimizations

### Server Components

- Default to Server Components
- Only use 'use client' when needed
- Reduces JavaScript bundle size

### Database Queries

- Proper indexes on frequently queried fields
- Use `select` to limit returned fields
- Batch queries with `Promise.all`
- Pagination for large datasets

### Caching

- Next.js automatic caching for Server Components
- Prisma connection pooling
- Static page generation where possible

## Scalability Patterns

### Modular Structure

- Clear separation of concerns
- Easy to add new features
- Components are reusable
- Types are centralized

### Extensibility

- Add new API routes by copying pattern
- Create new components from Base UI
- Extend validation schemas
- Add database models with migrations

### Future Enhancements

Potential additions:
- Authentication (NextAuth.js)
- File uploads (S3/Cloudinary)
- Real-time features (Pusher/WebSockets)
- Email (Resend/SendGrid)
- Background jobs (BullMQ)
- Caching (Redis)
- Monitoring (Sentry)

## Development Workflow

1. Create feature branch
2. Make changes
3. Run `bun lint:fix` and `bun format`
4. Run `bun type-check`
5. Run `bun test`
6. Test manually in browser
7. Create pull request
8. Merge to main

## Deployment

Recommended platforms:
- **Vercel** - Best Next.js support
- **Railway** - Easy PostgreSQL
- **Fly.io** - Good for global apps
- **AWS** - Most control

Environment setup:
1. Set `DATABASE_URL` in production
2. Run migrations: `bun run db:migrate:deploy`
3. Set `NODE_ENV=production`
4. Configure build command: `bun build`

## Conclusion

This architecture prioritizes:
1. **Type Safety** - Catch errors early
2. **Developer Experience** - Fast feedback loops
3. **Code Quality** - Consistent patterns
4. **Maintainability** - Clear structure
5. **Scalability** - Easy to extend

The patterns are production-tested and ready to scale from prototype to production application.
