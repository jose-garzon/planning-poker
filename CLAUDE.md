# Planning Poker Game - AI Assistant Guide

> **Purpose**: This document guides AI assistants (Claude, GitHub Copilot, etc.) on project conventions, architecture, and best practices for the Planning Poker application.

## Project Overview

**Planning Poker**: A real-time voting game for agile teams to estimate user stories. Host creates a session, participants join via link, select Fibonacci cards to vote, and see results animated in real-time.

### Tech Stack
- **Framework**: Next.js 15 with App Router (fullstack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + CSS Modules
- **Animations**: Framer Motion (smooth 60fps interactions)
- **State Management**: Zustand (lightweight)
- **Real-Time**: Server-Sent Events (SSE) from API routes
- **Data Storage**: Client-side IndexedDB/LocalStorage (no database)
- **Testing**: Vitest (unit) + Playwright (E2E) - balanced approach
- **Linting/Formatting**: Biome
- **Package Manager**: Bun (REQUIRED)

### Architecture Pattern
- **Vertical Slice Architecture**: Features organized by domain modules (`poker-session/`, `voting/`, etc.)
- **Component Pattern**: Presentational (dumb) + Container (smart) components
- **Service Layer Pattern**: Business logic in service files
- **Type-Safe API Routes**: Zod validation for all inputs
- **Optimistic Updates**: UI updates immediately, reconciles with server
- **Real-Time First**: SSE for multiplayer coordination with <50ms latency target
- **Single Entry Point Per Module**: Each module exports ONE entry point:
  - **Page modules** (full pages): Export `module.page.tsx` → Used by `app/[path]/page.tsx`
  - **Feature modules** (components): Export `feature.component.tsx` → Used by other modules
  - App Router files contain ONLY routing logic, no component code

## Base UI Components Reference

**IMPORTANT**: When building visual UI components, consult `/llms.txt` in the project root for Base UI component documentation.

The `llms.txt` file provides:
- Component library overview (Button, Dialog, Menu, Tabs, etc.)
- Styling patterns with Tailwind CSS
- Animation composition patterns
- Forms and accessibility guidelines
- TypeScript best practices

Use Base UI as the foundation for all UI components, then enhance with Framer Motion animations and Tailwind CSS styling.

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

### Component Patterns: Presentational + Container

**Container Components** (Smart) - Handle state and logic:
```tsx
'use client';
import { useVoting } from '../hooks/useVoting';
import { CardSelectorPresentation } from './CardSelectorPresentation';

export function CardSelector() {
  const { selectedCard, isLoading, castVote } = useVoting();
  return (
    <CardSelectorPresentation
      cards={FIBONACCI_SEQUENCE}
      selectedCard={selectedCard}
      onSelect={castVote}
      isLoading={isLoading}
    />
  );
}
```

**Presentational Components** (Dumb) - Pure UI with no logic:
```tsx
import { motion } from 'framer-motion';

interface CardProps {
  value: string;
  selected: boolean;
  onClick: () => void;
}

export function Card({ value, selected, onClick }: CardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={cn('px-6 py-4 rounded-lg', selected && 'bg-blue-600')}
    >
      {value}
    </motion.button>
  );
}
```

**When to use Server Components** (for static content):

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

## Animation Standards (Framer Motion)

**CRITICAL**: Every interaction must feel smooth. Target 60fps for all animations. Focus on:
- Card selection feedback (click animation)
- Micro-interactions on buttons (hover, tap)
- Smooth state transitions

### Card Selection Animation

```tsx
// Smooth scale feedback with spring physics
<motion.button
  whileHover={{ scale: 1.08 }}           // Expand on hover
  whileTap={{ scale: 0.92 }}             // Compress on click
  transition={{
    type: 'spring',
    stiffness: 300,                       // Bouncy feel
    damping: 20,
  }}
  layout                                  // Smooth FLIP layout changes
>
  {cardValue}
</motion.button>
```

### Button Micro-Interactions

```tsx
// Color change on hover/tap with smooth transition
<motion.button
  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.9)' }}
  whileTap={{ backgroundColor: 'rgba(59, 130, 246, 0.7)' }}
  transition={{ duration: 0.2 }}
>
  {label}
</motion.button>
```

### Vote Results Reveal (Stagger)

```tsx
// Stagger animation when results appear
<motion.div layout>
  {votes.map((vote, i) => (
    <motion.div
      key={vote.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}    // Stagger: 50ms between each
      layout
    >
      {vote.value}
    </motion.div>
  ))}
</motion.div>
```

### Animation Guidelines

- ✅ Use `spring` physics for natural feel (not linear `duration`)
- ✅ Keep animations under 300ms for snappy feedback
- ✅ Use `transform` and `opacity` (GPU accelerated)
- ✅ Use Framer Motion's `layout` prop to avoid reflow
- ✅ Test on real devices; desktop DevTools can be misleading
- ✅ Profile with Chrome DevTools Performance to verify 60fps
- ❌ Never animate `left`, `top`, `width`, `height` (causes reflow)
- ❌ Never create new animation variants in render (define outside component)
- ❌ Never block animations with heavy computation (use `startTransition`)

## Real-Time SSE & Optimistic Updates

### Server-Sent Events (API Route)

```typescript
// app/api/sessions/[sessionId]/stream/route.ts
import { NextRequest } from 'next/server';

const clients = new Map<string, ReadableStreamDefaultController>();

export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {
  const { sessionId } = params;

  const stream = new ReadableStream({
    start(controller) {
      clients.set(`${sessionId}-${crypto.randomUUID()}`, controller);

      // Keep alive with 30s heartbeat
      const interval = setInterval(() => {
        controller.enqueue('data: {"type":"heartbeat"}\n\n');
      }, 30000);

      return () => {
        clearInterval(interval);
        clients.delete(sessionId);
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Broadcast votes to all participants
export function broadcastVote(sessionId: string, vote: Vote) {
  const event = `data: ${JSON.stringify({ type: 'vote', vote })}\n\n`;
  clients.forEach((controller, clientId) => {
    if (clientId.startsWith(sessionId)) {
      controller.enqueue(event);
    }
  });
}
```

### Client-Side SSE Hook

```typescript
// modules/shared/hooks/useSSE.ts
import { useEffect } from 'react';

export function useSSE(sessionId: string, onMessage: (event: any) => void) {
  useEffect(() => {
    const eventSource = new EventSource(`/api/sessions/${sessionId}/stream`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type !== 'heartbeat') {
        onMessage(data);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      // Reconnect after 3 seconds
      setTimeout(() => new EventSource(`/api/sessions/${sessionId}/stream`), 3000);
    };

    return () => eventSource.close();
  }, [sessionId, onMessage]);
}
```

### Optimistic Updates Pattern

Always update UI immediately, reconcile with server:

```typescript
// Cast vote immediately, retry on failure
const castVote = useCallback(async (cardValue: string) => {
  // 1. Update UI optimistically
  selectCard(cardValue);

  // 2. Send to server in background
  try {
    const response = await fetch(`/api/sessions/${sessionId}/votes`, {
      method: 'POST',
      body: JSON.stringify({ cardValue }),
    });

    if (!response.ok) {
      // Server rejected: revert UI
      selectCard(null);
      throw new Error('Vote failed');
    }

    // 3. Server confirms, update with confirmed data
    const confirmedVote = await response.json();
    syncVotes(confirmedVote);
  } catch (error) {
    // Queue vote for retry when online
    queueOfflineVote(sessionId, cardValue);
  }
}, [sessionId]);
```

## Client-Side Data Storage (IndexedDB)

Host stores sessions and votes in IndexedDB for persistence across refreshes.

```typescript
// modules/shared/lib/indexedDB.ts
export class PokerDB {
  async saveSessions(sessions: PokerSession[]) {
    const tx = this.db.transaction('sessions', 'readwrite');
    sessions.forEach(s => tx.objectStore('sessions').put(s));
    return new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  async getSessions(): Promise<PokerSession[]> {
    return new Promise((resolve, reject) => {
      const request = this.db.transaction('sessions').objectStore('sessions').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
```

## State Management: Zustand

Use Zustand for lightweight, predictable state:

```typescript
// modules/voting/store/votingStore.ts
import { create } from 'zustand';

interface VotingState {
  selectedCard: string | null;
  votes: Record<string, Vote>;
  selectCard: (value: string | null) => void;
  syncVotes: (votes: Record<string, Vote>) => void;
}

export const useVotingStore = create<VotingState>((set) => ({
  selectedCard: null,
  votes: {},
  selectCard: (value) => set({ selectedCard: value }),
  syncVotes: (votes) => set({ votes }),
}));
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

### Data Management

Planning Poker stores data client-side in IndexedDB. No database migrations needed.

```bash
# Data is stored locally in the host's browser
# Sessions persist across page refreshes via IndexedDB
# Participants' votes are sent via SSE in real-time
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

### Performance (Animations First)
- ✅ **Smooth animations**: 60fps target for all micro-interactions
- ✅ **SSE latency**: <50ms for vote broadcasts to all participants
- ✅ **Bundle size**: Keep JavaScript small; Framer Motion + Zustand is ~60kb
- ✅ **GPU acceleration**: Use `transform` and `opacity` only in animations
- ✅ **Profile before shipping**: Use Chrome DevTools Performance tab
- ✅ **Test on real devices**: Mobile phones and tablets, not just desktop
- ❌ Never animate `left`, `top`, `width`, `height` (causes reflow)
- ❌ Don't compute expensive logic during animation frames (use `startTransition`)

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

Optional environment variables (see `.env.example`):
- `NODE_ENV`: Environment (development, test, production)
- `NEXT_PUBLIC_APP_URL`: Public URL for SSE stream (needed for self-hosted)

No database configuration needed. All data is client-side.

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

## Planning Poker Specific Patterns

### Folder Structure Example

```
modules/
  poker-session/                    # PAGE MODULE (full page)
    poker-session.page.tsx          # ⭐ ENTRY POINT (used by app/session/page.tsx)
    components/
      host-view/                    # Component folder (container + UI)
        host-view-container.tsx     # Smart: state & logic
        host-view-ui.tsx            # Dumb: pure presentation
        host-view-container.test.tsx
        host-view-container.style.css  # Optional: reusable tailwind
      session-join-form/            # Component folder
        session-join-form-container.tsx
        session-join-form-ui.tsx
        session-join-form-container.test.tsx
      session-list/                 # Component folder
        session-list-container.tsx
        session-list-ui.tsx
        session-list-container.test.tsx
    hooks/
      useSessionSync.ts             # Real-time sync with server
      useSessionStorage.ts          # IndexedDB persistence
    services/
      sessionService.ts             # Create, delete, list sessions
      sseService.ts                # SSE connection management
    types/
      index.ts                     # PokerSession, Participant types
    lib/
      sessionStorage.ts            # IndexedDB helper functions

  voting/                           # FEATURE MODULE (component)
    voting-deck.component.tsx       # ⭐ ENTRY POINT (used by other modules)
    components/
      card-selector/                # Component folder (container + UI)
        card-selector-container.tsx # Smart: state & vote logic
        card-selector-ui.tsx        # Dumb: card grid presentation
        card-selector-container.test.tsx
      card/                        # Component folder
        card-container.tsx         # Smart: animation & click logic
        card-ui.tsx                # Dumb: styled card display
        card-container.test.tsx
        card-container.style.css
      vote-results/                # Component folder
        vote-results-container.tsx
        vote-results-ui.tsx
        vote-results-container.test.tsx
        vote-results-container.style.css
    hooks/
      useVoting.ts                # Vote state (Zustand) + sync
    services/
      votingService.ts            # Vote validation, vote logic
    types/
      index.ts                   # Vote, VoteEvent types

  shared/
    components/
      button/                       # Component folder
        button-container.tsx        # Smart: click handlers, state
        button-ui.tsx               # Dumb: styled button
        button-container.test.tsx
        button-container.style.css
      modal/                        # Component folder
        modal-container.tsx         # Smart: open/close state
        modal-ui.tsx                # Dumb: modal structure
        modal-container.test.tsx
        modal-container.style.css
    hooks/
      useSSE.ts                     # Generic SSE hook
      useIndexedDB.ts               # Generic IndexedDB hook
    lib/
      indexedDB.ts                  # IndexedDB utilities
      fibonacci.ts                  # Card values constant
```

### Component Folder Structure

**Each component lives in its own folder** with container (smart) and UI (dumb) files:

```
component-name/
  component-name-container.tsx      # Smart: state, hooks, logic
  component-name-ui.tsx             # Dumb: pure presentation
  component-name-container.test.tsx # Tests
  component-name-container.style.css# Optional: reusable tailwind classes
```

**Why this structure?**
- ✅ One component per folder makes it easy to find
- ✅ Container/UI split makes components reusable
- ✅ Tests co-located with the component
- ✅ Styles stay with the component, easy to locate

**Building UI Components**:
1. **Check `/llms.txt`** for Base UI components that match your needs
2. **Use Base UI as foundation** for unstyled, accessible components
3. **Enhance with Framer Motion** for animations (smooth micro-interactions)
4. **Style with Tailwind CSS** for the visual design
5. **Keep presentational components pure** (just display logic)

**Example: Card Component**

```tsx
// modules/voting/components/card/card-container.tsx
'use client';
import { motion } from 'framer-motion';
import { CardUI } from './card-ui';

interface CardContainerProps {
  value: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function CardContainer({ value, isSelected, onSelect }: CardContainerProps) {
  return (
    <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
      <CardUI value={value} isSelected={isSelected} onClick={onSelect} />
    </motion.div>
  );
}
```

```tsx
// modules/voting/components/card/card-ui.tsx
interface CardUIProps {
  value: string;
  isSelected: boolean;
  onClick: () => void;
}

export function CardUI({ value, isSelected, onClick }: CardUIProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-6 py-4 rounded-lg font-bold',
        isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200',
      )}
    >
      {value}
    </button>
  );
}
```

### Entry Point Pattern

**Page Module** (`poker-session.page.tsx`):
```tsx
// modules/poker-session/poker-session.page.tsx
'use client';
import { SessionList } from './components/SessionList';
import { useSessionStorage } from './hooks/useSessionStorage';

export function PokerSessionPage() {
  const { sessions } = useSessionStorage();
  return <SessionList sessions={sessions} />;
}
```

**Used in App Router** (`app/session/page.tsx`):
```tsx
// app/session/page.tsx - ONLY ROUTING LOGIC
import { PokerSessionPage } from '@/modules/poker-session/poker-session.page';

export default function SessionPage() {
  return <PokerSessionPage />;
}
```

**Feature Component** (`voting-deck.component.tsx`):
```tsx
// modules/voting/voting-deck.component.tsx
'use client';
import { CardSelector } from './components/CardSelector';
import { VoteResults } from './components/VoteResults';
import { useVoting } from './hooks/useVoting';

export function VotingDeck() {
  const { selectedCard, votes } = useVoting();
  return (
    <>
      <CardSelector />
      {votes.length > 0 && <VoteResults votes={votes} />}
    </>
  );
}
```

**Used by Other Modules**:
```tsx
// modules/poker-session/components/HostView.tsx
import { VotingDeck } from '@/modules/voting/voting-deck.component';

export function HostView({ sessionId }: { sessionId: string }) {
  return (
    <div>
      <h1>Session {sessionId}</h1>
      <VotingDeck />
    </div>
  );
}
```

### Module Dependencies

- `poker-session` manages sessions and participants (page module)
- `voting` handles card selection and vote sync (feature module)
- `shared` provides reusable hooks and utilities
- Server routes in `app/api/` call service functions
- App router files (`app/*/page.tsx`) only contain routing logic, import entry points from modules

### Critical Paths to Test (E2E)

1. Host creates session → Gets shareable link
2. Participant joins session via link → Sees available cards
3. Participant clicks card → Selection animates smoothly
4. Host sees all votes update in real-time (SSE)
5. Host reveals votes → Results animate in
6. Host can delete session → Clears IndexedDB

## AI Assistant Tips for Planning Poker

When generating code:
1. ✅ **Animations first**: Every interaction must feel smooth (60fps)
2. ✅ **Real-time sync**: Use optimistic updates + SSE for multiplayer
3. ✅ **Client-side storage**: Persist to IndexedDB, survive refresh
4. ✅ **Always use Bun** (not npm/yarn/pnpm)
5. ✅ **Vertical slice**: Organize by feature (poker-session, voting)
6. ✅ **Presentational + Container**: Split components for reusability
7. ✅ **TypeScript strict mode**: No `any` types
8. ✅ **Error handling**: Offline support, retry with backoff
9. ✅ **Test critical flows**: Host → join → vote → results
10. ❌ Don't animate `left/top` (use `transform`)
11. ❌ Don't block animations with heavy computation
12. ❌ Don't over-engineer; KISS principle applies

## Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Biome Docs**: https://biomejs.dev
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Vitest Docs**: https://vitest.dev
- **Playwright Docs**: https://playwright.dev
