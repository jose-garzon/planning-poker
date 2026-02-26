# Planning Poker Game - AI Assistant Guide

> **Purpose**: This document provides general project conventions and pointers to detailed documentation. Specialized agents contain implementation-specific patterns and examples.

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
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Linting/Formatting**: Biome
- **Package Manager**: Bun (REQUIRED - never use npm/yarn/pnpm)

### Architecture Principles
- **Vertical Slice Architecture**: Features organized by domain modules (`poker-session/`, `voting/`, etc.)
- **Presentational + Container**: Split components into smart (state/logic) and dumb (pure UI)
- **Single Entry Point Per Module**: Page modules export `module.page.tsx`, feature modules export `feature.component.tsx`
- **App Router = Routing Only**: No component code in `app/` files
- **Optimistic Updates**: UI updates immediately, reconciles with server
- **Real-Time First**: SSE for multiplayer coordination with <50ms latency target

## Base UI Components

When building visual UI components, consult `/llms.txt` in the project root for Base UI component documentation, styling patterns, and animation composition.

## Code Conventions

### Formatting (Biome)
- 2 spaces indent, 100 char line width
- Single quotes for JS/TS, double quotes for JSX
- Semicolons always, trailing commas always, arrow parens always

### Naming
- **Files**: kebab-case (`user-service.ts`, `user-card.tsx`)
- **Components**: PascalCase (`UserCard`, `ProfileHeader`)
- **Functions/Hooks**: camelCase (`getUserById`, `useVoting`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`User`, `ApiResponse`)

### TypeScript
- Strict mode, no implicit `any`
- Use `import type` for type-only imports
- Clean up unused imports and variables

### Import Order
1. External dependencies (React, Next.js, etc.)
2. Internal aliases (`@/shared`, `@/modules`)
3. Relative imports (`./components`, `../lib`)
4. Type imports (`import type`)

## Git Workflow

### Commit Messages
Follow conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`

### Branch Strategy
- `main`: Production-ready code
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches

## Commands

```bash
bun install              # Install dependencies
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run Biome linter
bun run lint:fix         # Auto-fix linting issues
bun run format           # Format code with Biome
bun run type-check       # Run TypeScript type checking
bun test                 # Run unit tests in watch mode
bun test:coverage        # Run with coverage report
bun test:e2e             # Run E2E tests
bun test:e2e:ui          # Run E2E with Playwright UI
```

## Environment Variables

Optional (see `.env.example`):
- `NODE_ENV`: Environment (development, test, production)
- `NEXT_PUBLIC_APP_URL`: Public URL for SSE stream (needed for self-hosted)

No database configuration needed. All data is client-side.

## Skills (Slash Commands)

Use these to automate common workflows:

| Skill | Description |
|-------|-------------|
| `/setup` | Set up the development environment from scratch |
| `/new-module [name] [page\|feature]` | Scaffold a new vertical slice module |
| `/new-api-route [resource-name]` | Create API route with Zod validation and service layer |
| `/ci-local` | Run the full CI pipeline locally before pushing |
| `/adr [decision-title]` | Create an Architecture Decision Record |
| `/new-feature-spec [feature-name]` | Create a feature specification document |
| `/create-pr [base-branch]` | Create a PR with conventional title and structured body |
| `/design-review [component-path]` | Audit a component for accessibility, hierarchy, and animations |

## Where to Find More Context

### Documentation
- **Architecture**: `docs/2-architecture/overview.md` - Tech choices, API design, patterns
- **Folder Structure**: `docs/2-architecture/folder-structure.md` - Module organization, import rules
- **Testing Guide**: `docs/3-development/testing.md` - Vitest/Playwright examples, mocking patterns
- **Full Index**: `docs/README.md`

### Specifications
- **Product Overview**: `specs/planning-poker-overview.md`
- **Developer Quick Start**: `specs/DEVELOPER-QUICK-START.md`
- **Sprint Details**: `specs/sprint-1-foundation.md`, `specs/sprint-2-voting.md`

### Design
- **Design File**: `design.pen` (used by web-design-specialist agent)

## When to Use Specialized Agents

### `web-design-specialist` — Visual Components & Gamified Experience
Use for **all visual/presentational work**. This agent owns the look, feel, and gamified experience of the app.

**Owns:**
- All JSX for presentational components — writes the actual `.tsx` files
- Design system tokens and Tailwind theme updates (new colors, spacing, typography)
- Framer Motion animations — entrance/exit, hover, tap, stagger, reveal sequences
- Accessibility (reduced motion, ARIA, contrast, keyboard nav)
- Design-file iteration using Pencil MCP tools (`design.pen`)
- Responsive layouts (mobile-first, desktop breakpoints)
- Game-feel details: card selection effects, celebration bursts, pulsing indicators, countdown urgency

**Does NOT own:**
- Container components (components that read from stores or call hooks with real data)
- API calls, SSE subscriptions, or Zustand store definitions
- Business logic of any kind — only accepts data via props

**Boundary rule**: Every component this agent writes is a pure function of its props. If a component needs `useEffect`, `useStore`, or `fetch`, that logic belongs to `software-developer` who wraps it in a container.

---

### `software-developer` — Backend, API & Integration Logic
Use for **all data, state, and integration work**. This agent owns everything that happens below the visual layer.

**Owns:**
- API routes (`app/api/**`) — Zod validation, service layer, error handling
- SSE implementation — event streams, reconnection, <50ms latency patterns
- Zustand stores — session state, voting state, participant presence
- IndexedDB / LocalStorage persistence layer
- Container components — smart wrappers that pass real data to presentational components
- Custom hooks (`useVoting`, `useSession`, `useSSE`, etc.)
- Optimistic updates and server reconciliation
- Unit tests (Vitest) and E2E tests (Playwright)
- TypeScript types and domain models shared across the app

**Does NOT own:**
- Tailwind classes, animation configs, or visual layout decisions
- Creating new presentational components — hands off a props interface and lets `web-design-specialist` build the visual

**React coding conventions (enforced):**
- **No unnecessary `useState`** — derive values inline from existing state or props instead of storing them
- **No unnecessary `useEffect`** — avoid syncing state with other state; prefer event handlers, derived values, or `useTransition`
- **Always state machines over booleans** — never use multiple boolean flags for async status; use a discriminated union: `type Status = { kind: 'idle' } | { kind: 'loading' } | { kind: 'error'; message: string } | { kind: 'success'; data: T }`
- **Always `async/await`** — never write `.then()/.catch()` chains; use `try/catch` for error handling
- **Prefer `use(promise)` over `useEffect` for async data** — for browser-only async APIs (IndexedDB, etc.), use React's `use()` hook with a module-level promise cache. Keep the cache (`Map<string, Promise<T>>`) and the `async` fetch function separate so the cache always returns the same Promise reference (required for `use()` not to re-suspend on every render)
- **Prefer `useTransition`** over manual loading flags for async operations (form submits, mutations)

---

### `product-owner`
Use for **product decisions**: refining features, writing specs, creating GitHub issues, maintaining documentation. This agent does NOT write code — only specs and docs.
