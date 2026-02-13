# Feature: [Feature Name]

**Status**: [Draft | In Progress | Completed | Deprecated]
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD
**Owner**: [Team or Person]
**Related**: [Links to issues, PRs, ADRs]

## Overview

Brief description of the feature (2-3 sentences).

- What problem does it solve?
- Who is it for?
- What value does it provide?

## User Stories

### Primary User Stories
1. **As a** [type of user], **I want** [goal], **so that** [benefit]
2. **As a** [type of user], **I want** [goal], **so that** [benefit]
3. **As a** [type of user], **I want** [goal], **so that** [benefit]

### Secondary User Stories
1. **As a** [type of user], **I want** [goal], **so that** [benefit]
2. **As a** [type of user], **I want** [goal], **so that** [benefit]

## Requirements

### Functional Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

### Non-Functional Requirements
- [ ] Performance: [specific metric]
- [ ] Security: [specific requirement]
- [ ] Accessibility: [specific requirement]
- [ ] Usability: [specific requirement]

## Technical Design

### Architecture

Describe the high-level architecture:
- What components will be created/modified?
- How do they interact?
- What are the data flows?

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │─────▶│  API Route  │─────▶│   Service   │
│ Component   │      │  /api/...   │      │   Layer     │
└─────────────┘      └─────────────┘      └─────────────┘
                                                   │
                                                   ▼
                                           ┌─────────────┐
                                           │  Database   │
                                           │   (Prisma)  │
                                           └─────────────┘
```

### Database Changes

**New Models**:
```prisma
model FeatureModel {
  id        String   @id @default(cuid())
  field1    String
  field2    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Model Updates**:
- Add field `xyz` to `User` model
- Add relation between `User` and `Feature`

**Migration Plan**:
1. Create migration: `bun run db:migrate`
2. Update seed data: `prisma/seed.ts`
3. Test migration on staging
4. Deploy to production

### API Endpoints

#### GET /api/features
- **Description**: Get all features
- **Auth**: Required
- **Query Params**: `?page=1&limit=10&filter=active`
- **Response**: `{ data: Feature[], total: number }`

#### POST /api/features
- **Description**: Create a new feature
- **Auth**: Required (admin only)
- **Request Body**:
  ```json
  {
    "field1": "value",
    "field2": 123
  }
  ```
- **Response**: `{ data: Feature }`
- **Validation**: Zod schema (see below)

### Data Models / Types

```typescript
// modules/features/types/index.ts

export interface Feature {
  id: string;
  field1: string;
  field2: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFeatureInput {
  field1: string;
  field2: number;
}

export interface UpdateFeatureInput {
  field1?: string;
  field2?: number;
}
```

### Validation Schemas

```typescript
// modules/features/lib/validation.ts

import { z } from 'zod';

export const createFeatureSchema = z.object({
  field1: z.string().min(1).max(255),
  field2: z.number().int().positive(),
});

export const updateFeatureSchema = createFeatureSchema.partial();
```

### Components

**New Components**:
- `FeatureList` - Display list of features
- `FeatureCard` - Individual feature card
- `FeatureForm` - Form for creating/editing features
- `FeatureDetails` - Detailed feature view

**Updated Components**:
- `Navigation` - Add link to features page
- `Dashboard` - Add features widget

### File Structure

```
modules/features/
  ├── components/
  │   ├── feature-list.tsx
  │   ├── feature-card.tsx
  │   ├── feature-form.tsx
  │   └── feature-details.tsx
  ├── server/
  │   ├── feature.service.ts
  │   └── feature.repository.ts
  ├── types/
  │   └── index.ts
  └── lib/
      └── validation.ts

app/
  ├── features/
  │   ├── page.tsx
  │   └── [id]/
  │       └── page.tsx
  └── api/
      └── features/
          ├── route.ts
          └── [id]/
              └── route.ts
```

## Implementation Plan

### Phase 1: Database & Types
- [ ] Create Prisma schema
- [ ] Run migration
- [ ] Create TypeScript types
- [ ] Create validation schemas
- [ ] Update seed data

### Phase 2: Backend (API & Services)
- [ ] Create service layer (`FeatureService`)
- [ ] Create API routes
- [ ] Add authentication/authorization
- [ ] Add error handling
- [ ] Write unit tests for services

### Phase 3: Frontend (Components & Pages)
- [ ] Create `FeatureList` component
- [ ] Create `FeatureCard` component
- [ ] Create `FeatureForm` component
- [ ] Create feature pages
- [ ] Add navigation links
- [ ] Style with Tailwind CSS

### Phase 4: Testing
- [ ] Write unit tests for services
- [ ] Write component tests
- [ ] Write E2E tests for critical flows
- [ ] Test error scenarios
- [ ] Verify accessibility

### Phase 5: Documentation & Deployment
- [ ] Update API documentation
- [ ] Update user documentation
- [ ] Create migration guide
- [ ] Deploy to staging
- [ ] QA testing
- [ ] Deploy to production

## Testing Plan

### Unit Tests
```typescript
// tests/unit/modules/features/feature.service.test.ts
describe('FeatureService', () => {
  it('creates a new feature', async () => {
    // Test implementation
  });

  it('gets feature by ID', async () => {
    // Test implementation
  });
});
```

### Component Tests
```typescript
// tests/unit/modules/features/feature-card.test.tsx
describe('FeatureCard', () => {
  it('renders feature information', () => {
    // Test implementation
  });
});
```

### E2E Tests
```typescript
// tests/e2e/features.spec.ts
test('user can create a feature', async ({ page }) => {
  // Test implementation
});
```

### Test Coverage Goals
- Service layer: 90%+
- Components: 80%+
- API routes: 85%+

## Security Considerations

- [ ] Input validation with Zod
- [ ] Authentication required for all endpoints
- [ ] Authorization checks (role-based)
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention (React handles this)
- [ ] Rate limiting on API endpoints
- [ ] CSRF protection (Next.js handles this)

## Performance Considerations

- [ ] Database indexes on frequently queried fields
- [ ] Pagination for list views (default: 20 items)
- [ ] Caching strategy (if needed)
- [ ] Optimistic UI updates
- [ ] Image optimization (Next.js Image component)
- [ ] Code splitting for large components

## Accessibility

- [ ] Semantic HTML elements
- [ ] ARIA labels for interactive elements
- [ ] Keyboard navigation support
- [ ] Screen reader testing
- [ ] Color contrast ratios (WCAG AA)
- [ ] Focus indicators
- [ ] Error messages are descriptive

## Migration Guide

### For Users
No user migration required. This is a new feature.

### For Developers
1. Pull latest code
2. Install dependencies: `bun install`
3. Run migrations: `bun run db:migrate`
4. Seed database: `bun run db:seed`
5. Start dev server: `bun run dev`

### Database Migration
```bash
# Development
bun run db:migrate

# Production
bun run db:migrate:deploy
```

## Dependencies

### New Dependencies
None required (uses existing stack)

### Updated Dependencies
None required

## Rollout Plan

1. **Deploy to staging** - Test with internal team
2. **Beta release** - Enable for select users
3. **Gradual rollout** - Enable for 10%, 50%, 100% of users
4. **Monitor** - Watch for errors, performance issues
5. **Iterate** - Gather feedback and improve

## Metrics & Success Criteria

### Metrics to Track
- Number of features created
- User engagement with feature
- API response times
- Error rates
- User satisfaction (surveys/feedback)

### Success Criteria
- [ ] All acceptance tests pass
- [ ] Performance: API responses < 200ms (p95)
- [ ] Error rate < 1%
- [ ] Test coverage > 80%
- [ ] Accessibility audit passes
- [ ] User satisfaction > 4/5

## Open Questions

- [ ] Question 1: What should happen if...?
- [ ] Question 2: How should we handle...?
- [ ] Question 3: Should we support...?

## Related Documentation

- [API Documentation](../4-api/endpoints.md)
- [Architecture Overview](../2-architecture/overview.md)
- [Testing Guide](../3-development/testing.md)
- [ADR-XXX: Related Decision](../adr/template.md)

## Changelog

### YYYY-MM-DD
- Initial draft

### YYYY-MM-DD
- Updated technical design based on team feedback

### YYYY-MM-DD
- Completed implementation
- Added migration guide
