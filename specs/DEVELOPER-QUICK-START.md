# Developer Quick Start - Planning Poker

**Last Updated**: 2026-02-16

This guide helps developers quickly understand the project and start working on Sprint 1.

---

## TL;DR

Planning Poker is a real-time voting app for agile teams. You're building:
- **Sprint 1 (Week 1-2)**: Session creation, participant join, real-time participant list
- **Sprint 2 (Week 3-4)**: Story management, voting with Fibonacci cards, results reveal

**Key Tech**: Next.js 15, TypeScript strict, SSE for real-time, IndexedDB for persistence, Framer Motion for 60fps animations.

---

## Setup (5 minutes)

```bash
# Clone repo (if needed)
git clone https://github.com/jose-garzon/planning-poker.git
cd planning-poker

# Install dependencies (MUST use Bun)
bun install

# Start dev server
bun run dev

# Open http://localhost:3000
```

---

## First Task: Pick an Issue

Go to [GitHub Issues](https://github.com/jose-garzon/planning-poker/issues) and pick a Sprint 1 story:

| Issue | Story | Good First Issue? |
|-------|-------|-------------------|
| [#1](https://github.com/jose-garzon/planning-poker/issues/1) | Session creation + shareable link | ✅ Start here |
| [#2](https://github.com/jose-garzon/planning-poker/issues/2) | Participant join flow | After #1 |
| [#3](https://github.com/jose-garzon/planning-poker/issues/3) | Real-time participant list (SSE) | After #1, #2 |
| [#4](https://github.com/jose-garzon/planning-poker/issues/4) | Mobile-first UI shell | Parallel with #1-#3 |
| [#5](https://github.com/jose-garzon/planning-poker/issues/5) | IndexedDB persistence | After #1 |

**Suggested Order**: #1 → #5 → #2 → #3 → #4

---

## Project Structure

```
planning-poker/
├── app/                          # Next.js App Router (ONLY routing logic)
│   ├── page.tsx                  # Landing page (imports module.page.tsx)
│   ├── session/
│   │   └── [sessionId]/page.tsx  # Session page (imports poker-session.page.tsx)
│   └── api/                      # API routes
│       └── sessions/
│           ├── route.ts          # POST /api/sessions (create session)
│           └── [sessionId]/
│               ├── join/route.ts # POST /api/sessions/[id]/join
│               └── stream/route.ts # GET /api/sessions/[id]/stream (SSE)
│
├── modules/                      # Feature modules (vertical slices)
│   ├── poker-session/            # Page module (full page)
│   │   ├── poker-session.page.tsx # ⭐ ENTRY POINT (used by app/session/[id]/page.tsx)
│   │   ├── components/           # Session UI components
│   │   │   ├── session-header/
│   │   │   │   ├── session-header-container.tsx  # Smart (state + logic)
│   │   │   │   └── session-header-ui.tsx         # Dumb (pure presentation)
│   │   │   └── participant-list/
│   │   │       ├── participant-list-container.tsx
│   │   │       └── participant-list-ui.tsx
│   │   ├── services/             # Business logic
│   │   │   ├── sessionService.ts # Create, validate, delete sessions
│   │   │   ├── participantService.ts
│   │   │   └── sseService.ts     # SSE connection management
│   │   ├── hooks/
│   │   │   ├── useSessionStorage.ts # IndexedDB hook
│   │   │   └── useSessionSync.ts    # Real-time sync hook
│   │   └── types/
│   │       └── index.ts          # Session, Participant, Story types
│   │
│   ├── voting/                   # Feature module (component, Sprint 2)
│   │   └── voting-deck.component.tsx # ⭐ ENTRY POINT (used by poker-session)
│   │
│   └── shared/                   # Reusable code
│       ├── components/           # Button, Modal, etc.
│       ├── hooks/
│       │   ├── useSSE.ts         # Generic SSE hook
│       │   └── useIndexedDB.ts   # Generic IndexedDB hook
│       └── lib/
│           ├── indexedDB.ts      # IndexedDB utilities
│           └── utils.ts          # cn(), validation helpers
│
├── specs/                        # Product specifications (read these!)
│   ├── planning-poker-overview.md # Complete product spec
│   ├── sprint-1-foundation.md     # Sprint 1 user stories
│   └── sprint-2-voting.md         # Sprint 2 user stories
│
├── CLAUDE.md                     # AI assistant guide (conventions, patterns)
└── docs/                         # Architecture, API, testing docs
```

---

## Code Conventions (Must Follow)

### TypeScript Strict Mode
```typescript
// ✅ Good: Explicit types
function createSession(hostName: string): Session {
  return { id: crypto.randomUUID(), hostName, createdAt: Date.now() };
}

// ❌ Bad: Implicit any
function createSession(hostName) {
  return { id: crypto.randomUUID(), hostName };
}
```

### Component Pattern: Container (Smart) + UI (Dumb)
```typescript
// ✅ session-header-container.tsx (Smart: state + logic)
'use client';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { SessionHeaderUI } from './session-header-ui';

export function SessionHeader({ sessionId }: { sessionId: string }) {
  const { session } = useSessionStorage(sessionId);
  const handleCopy = () => navigator.clipboard.writeText(session.shareableLink);
  return <SessionHeaderUI link={session.shareableLink} onCopy={handleCopy} />;
}

// ✅ session-header-ui.tsx (Dumb: pure presentation)
interface Props {
  link: string;
  onCopy: () => void;
}

export function SessionHeaderUI({ link, onCopy }: Props) {
  return (
    <div>
      <input readOnly value={link} />
      <button onClick={onCopy}>Copy</button>
    </div>
  );
}
```

### Animation Standards (60fps)
```typescript
import { motion } from 'framer-motion';

// ✅ Good: Spring physics, transform + opacity only
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
>
  Click Me
</motion.button>

// ❌ Bad: Animating width/height (causes reflow)
<motion.div animate={{ width: 200 }}>
  Content
</motion.div>
```

### Service Layer Pattern
```typescript
// ✅ modules/poker-session/services/sessionService.ts
export class SessionService {
  static async createSession(hostName: string): Promise<Session> {
    const session: Session = {
      id: crypto.randomUUID(),
      hostId: crypto.randomUUID(),
      hostName,
      createdAt: Date.now(),
      expiresAt: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15 days
      stories: [],
      participants: [],
    };
    await indexedDB.saveSession(session);
    return session;
  }
}

// ✅ app/api/sessions/route.ts (API calls service)
import { SessionService } from '@/modules/poker-session/services/sessionService';

export async function POST(req: Request) {
  const { hostName } = await req.json();
  const session = await SessionService.createSession(hostName);
  return Response.json({ sessionId: session.id, shareableLink: `${process.env.NEXT_PUBLIC_APP_URL}/session/${session.id}` });
}
```

---

## Common Tasks

### Adding a New Component

1. Create component folder:
   ```bash
   mkdir -p modules/poker-session/components/my-component
   ```

2. Create container (smart) file:
   ```typescript
   // my-component-container.tsx
   'use client';
   import { useState } from 'react';
   import { MyComponentUI } from './my-component-ui';

   export function MyComponent() {
     const [state, setState] = useState('');
     return <MyComponentUI value={state} onChange={setState} />;
   }
   ```

3. Create UI (dumb) file:
   ```typescript
   // my-component-ui.tsx
   interface Props {
     value: string;
     onChange: (value: string) => void;
   }

   export function MyComponentUI({ value, onChange }: Props) {
     return <input value={value} onChange={(e) => onChange(e.target.value)} />;
   }
   ```

### Creating an API Route

```typescript
// app/api/sessions/route.ts
import { NextRequest } from 'next/server';
import { z } from 'zod';

const createSessionSchema = z.object({
  hostName: z.string().min(2).max(50),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hostName } = createSessionSchema.parse(body);

    // Call service
    const session = await SessionService.createSession(hostName);

    return Response.json({ sessionId: session.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Using IndexedDB

```typescript
// modules/poker-session/hooks/useSessionStorage.ts
import { useEffect, useState } from 'react';
import { getSession, saveSession } from '@/shared/lib/indexedDB';
import type { Session } from '../types';

export function useSessionStorage(sessionId: string) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession(sessionId).then((data) => {
      setSession(data);
      setLoading(false);
    });
  }, [sessionId]);

  const updateSession = async (updatedSession: Session) => {
    await saveSession(updatedSession);
    setSession(updatedSession);
  };

  return { session, loading, updateSession };
}
```

### Setting Up SSE

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
      // Auto-reconnect after 3 seconds
      setTimeout(() => new EventSource(`/api/sessions/${sessionId}/stream`), 3000);
    };

    return () => eventSource.close();
  }, [sessionId, onMessage]);
}
```

---

## Testing

### Run Tests
```bash
# Unit tests (watch mode)
bun test

# Unit tests with coverage
bun test:coverage

# E2E tests
bun test:e2e

# E2E tests with UI
bun test:e2e:ui
```

### Writing a Unit Test
```typescript
// modules/poker-session/services/sessionService.test.ts
import { describe, it, expect } from 'vitest';
import { SessionService } from './sessionService';

describe('SessionService', () => {
  it('creates session with valid UUID', async () => {
    const session = await SessionService.createSession('Alice');
    expect(session.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it('sets expiry to 15 days', async () => {
    const session = await SessionService.createSession('Alice');
    const fifteenDays = 15 * 24 * 60 * 60 * 1000;
    expect(session.expiresAt - session.createdAt).toBe(fifteenDays);
  });
});
```

---

## Troubleshooting

### "Cannot find module '@/modules/...'"
- Check `tsconfig.json` has path alias: `"@/*": ["./*"]`
- Restart dev server: `Ctrl+C` then `bun run dev`

### IndexedDB not persisting
- Open Chrome DevTools → Application → IndexedDB
- Check for quota errors in console
- Clear IndexedDB: `indexedDB.deleteDatabase('planning-poker')`

### SSE not connecting
- Check API route is at `app/api/sessions/[sessionId]/stream/route.ts`
- Verify response headers: `Content-Type: text/event-stream`, `Cache-Control: no-cache`
- Check Network tab for SSE connection (should stay open)

### Animations janky
- Open Chrome DevTools → Performance → Record
- Look for dropped frames (red bars)
- Verify you're animating `transform` and `opacity` only (not `width`, `height`, `left`, `top`)

---

## Resources

### Documentation
- **Product Spec**: `/specs/planning-poker-overview.md` - Complete feature list
- **Sprint 1 Stories**: `/specs/sprint-1-foundation.md` - Detailed acceptance criteria
- **Tech Guide**: `/CLAUDE.md` - Architecture patterns, conventions
- **API Docs**: `/docs/4-api/endpoints.md` - API routes reference

### External Links
- **Next.js Docs**: https://nextjs.org/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Zustand**: https://github.com/pmndrs/zustand
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vitest**: https://vitest.dev
- **Playwright**: https://playwright.dev

---

## Need Help?

1. **Check the specs**: Most questions answered in `/specs/` directory
2. **Read CLAUDE.md**: Architecture patterns and conventions
3. **Check GitHub Issues**: Each issue has detailed acceptance criteria and design prompts
4. **Ask the team**: Product Owner available for clarifications

**Happy coding!** 🚀
