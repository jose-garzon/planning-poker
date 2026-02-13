# Scripts Reference

This document lists all available Bun scripts and their usage.

## Quick Reference

| Category | Script | Description |
|----------|--------|-------------|
| **Development** | `bun run dev` | Start development server |
| | `bun run build` | Build for production |
| | `bun run start` | Start production server |
| **Code Quality** | `bun run lint` | Run Biome linter |
| | `bun run lint:fix` | Auto-fix linting issues |
| | `bun run format` | Format code with Biome |
| | `bun run type-check` | Run TypeScript type checking |
| **Database** | `bun run db:generate` | Generate Prisma client |
| | `bun run db:migrate` | Create and apply migration |
| | `bun run db:migrate:deploy` | Deploy migrations (production) |
| | `bun run db:seed` | Seed database with sample data |
| | `bun run db:studio` | Open Prisma Studio |
| | `bun run db:reset` | Reset database (dev only) |
| **Testing** | `bun test` | Run unit tests (watch mode) |
| | `bun test:ui` | Run tests with Vitest UI |
| | `bun test:coverage` | Run tests with coverage |
| | `bun test:e2e` | Run E2E tests |
| | `bun test:e2e:ui` | Run E2E tests with Playwright UI |

---

## Development Scripts

### `bun run dev`

Starts the Next.js development server.

**What it does**:
- Starts server on `http://localhost:3000`
- Enables Fast Refresh (hot reload)
- Shows detailed error messages
- Enables React strict mode

**Usage**:
```bash
bun run dev

# Or on a different port
PORT=3001 bun run dev
```

**When to use**:
- Active development
- Testing changes locally
- Debugging issues

**Configuration**:
- Edit `next.config.ts` to customize

---

### `bun run build`

Builds the Next.js application for production.

**What it does**:
- Compiles TypeScript to JavaScript
- Optimizes React components
- Generates static pages (if using SSG)
- Minifies and bundles code
- Creates optimized images
- Generates build manifest

**Usage**:
```bash
bun run build
```

**Output**:
- `.next/` directory contains the production build
- Build statistics are displayed in terminal

**Before building**:
- Ensure `DATABASE_URL` is set in `.env`
- Run `bun run type-check` to catch errors early
- Run `bun test` to ensure tests pass

**Common issues**:
- **TypeScript errors**: Run `bun run type-check` first
- **Missing env vars**: Check `.env` file
- **Out of memory**: Increase Node.js heap size:
  ```bash
  NODE_OPTIONS="--max-old-space-size=4096" bun run build
  ```

---

### `bun run start`

Starts the Next.js production server.

**What it does**:
- Serves the production build from `.next/`
- Runs on `http://localhost:3000` by default
- Optimized for performance

**Usage**:
```bash
bun run start

# Or on a different port
PORT=3001 bun run start
```

**Before starting**:
- Run `bun run build` first
- Set production environment variables

**When to use**:
- Testing the production build locally
- Verifying performance optimizations
- Debugging production-only issues

---

## Code Quality Scripts

### `bun run lint`

Runs Biome linter to check for code quality issues.

**What it does**:
- Checks all `.ts`, `.tsx`, `.js`, `.jsx` files
- Reports linting errors and warnings
- Checks for accessibility issues
- Validates code style

**Usage**:
```bash
bun run lint

# Check specific files
bunx biome check src/app/page.tsx
```

**Common errors**:
- `noUnusedVariables`: Remove unused variables
- `noExplicitAny`: Add proper types
- `noDoubleEquals`: Use `===` instead of `==`

**Exit codes**:
- `0`: No errors
- `1`: Errors found

---

### `bun run lint:fix`

Auto-fixes linting issues where possible.

**What it does**:
- Fixes auto-fixable linting errors
- Organizes imports
- Applies code style rules
- Reports unfixable errors

**Usage**:
```bash
bun run lint:fix
```

**What it fixes**:
- Import organization
- Some code style issues
- Unused imports
- Simple refactorings

**What it doesn't fix**:
- Type errors
- Logic errors
- Complex refactorings
- Some style issues (need manual fix)

---

### `bun run format`

Formats code using Biome.

**What it does**:
- Formats all `.ts`, `.tsx`, `.js`, `.jsx` files
- Applies consistent indentation (2 spaces)
- Adds/removes semicolons
- Adjusts line length (100 chars max)
- Normalizes quotes (single for JS, double for JSX)

**Usage**:
```bash
# Format all files
bun run format

# Check formatting without writing
bun run format --check

# Format specific files
bunx biome format --write src/app/page.tsx
```

**Configuration**:
- See `biome.json` for formatting rules

---

### `bun run type-check`

Runs TypeScript compiler in check mode (no output).

**What it does**:
- Checks all TypeScript files for type errors
- Validates type definitions
- Checks for missing imports
- Verifies strict mode compliance

**Usage**:
```bash
bun run type-check
```

**Common errors**:
- `Type 'X' is not assignable to type 'Y'`
- `Property 'X' does not exist on type 'Y'`
- `Cannot find module 'X'`

**When to use**:
- Before committing code
- After changing types
- Before building for production

---

## Database Scripts

### `bun run db:generate`

Generates the Prisma Client based on your schema.

**What it does**:
- Reads `prisma/schema.prisma`
- Generates TypeScript types
- Creates `@prisma/client` package
- Updates `node_modules/.prisma/client`

**Usage**:
```bash
bun run db:generate
```

**When to use**:
- After changing `schema.prisma`
- After `bun install` (runs automatically via postinstall)
- When Prisma client types are missing

---

### `bun run db:migrate`

Creates and applies a new database migration.

**What it does**:
- Prompts for migration name
- Creates migration SQL file
- Applies migration to database
- Updates `prisma/migrations/` directory
- Regenerates Prisma Client

**Usage**:
```bash
bun run db:migrate

# You'll be prompted:
# Enter a name for the new migration: › add_user_table
```

**When to use**:
- After changing `schema.prisma`
- When adding new models
- When modifying existing models

**Files created**:
```
prisma/migrations/
  └── 20260213120000_add_user_table/
      └── migration.sql
```

**⚠️ Warning**: This modifies your database schema. Always backup production data first.

---

### `bun run db:migrate:deploy`

Applies pending migrations to the database (production).

**What it does**:
- Applies unapplied migrations
- Does not create new migrations
- Does not prompt for confirmation
- Suitable for CI/CD pipelines

**Usage**:
```bash
bun run db:migrate:deploy
```

**When to use**:
- Deploying to production
- In CI/CD pipelines
- Applying migrations to staging

**⚠️ Warning**: Cannot be undone. Always test migrations in staging first.

---

### `bun run db:seed`

Seeds the database with sample data.

**What it does**:
- Runs `prisma/seed.ts`
- Populates database with initial data
- Useful for development and testing

**Usage**:
```bash
bun run db:seed
```

**When to use**:
- Setting up a new development environment
- Resetting database with fresh data
- Populating test database

**Customize**:
- Edit `prisma/seed.ts` to change seed data

---

### `bun run db:studio`

Opens Prisma Studio, a visual database editor.

**What it does**:
- Starts Prisma Studio on `http://localhost:5555`
- Provides GUI for viewing/editing database data
- Shows database schema
- Allows data manipulation

**Usage**:
```bash
bun run db:studio
```

**When to use**:
- Inspecting database contents
- Manually editing data
- Debugging database issues

**Stop**: Press `Ctrl+C` in the terminal

---

### `bun run db:reset`

Resets the database (dev only).

**What it does**:
- Drops the database
- Recreates the database
- Applies all migrations
- Runs seed script

**Usage**:
```bash
bun run db:reset
```

**When to use**:
- Starting fresh in development
- After breaking database schema
- Testing migrations from scratch

**⚠️ Warning**: Deletes all data. Never use in production.

---

## Testing Scripts

### `bun test`

Runs unit tests in watch mode.

**What it does**:
- Runs all tests in `tests/unit/`
- Watches for file changes
- Re-runs tests on changes
- Shows test results in terminal

**Usage**:
```bash
# Watch mode (default)
bun test

# Run once
bun test run

# Run specific test file
bun test tests/unit/lib/cn.test.ts

# Run tests matching pattern
bun test user
```

**When to use**:
- During active development
- After making code changes
- Before committing

---

### `bun test:ui`

Runs tests with Vitest UI.

**What it does**:
- Opens Vitest UI in browser
- Shows test results visually
- Allows filtering and searching
- Provides test coverage view

**Usage**:
```bash
bun test:ui
```

**Opens**: `http://localhost:51204` (or similar)

**When to use**:
- Debugging failing tests
- Exploring test coverage
- Visualizing test results

---

### `bun test:coverage`

Runs tests with coverage report.

**What it does**:
- Runs all unit tests
- Generates coverage report
- Creates HTML coverage report
- Shows coverage summary in terminal

**Usage**:
```bash
bun test:coverage
```

**Output**:
- `coverage/` directory with HTML report
- Terminal summary with percentages

**View report**:
```bash
open coverage/index.html
```

**When to use**:
- Before merging PRs
- Checking test coverage
- Identifying untested code

---

### `bun test:e2e`

Runs end-to-end tests with Playwright.

**What it does**:
- Runs all tests in `tests/e2e/`
- Tests in headless browsers
- Runs in parallel
- Generates test report

**Usage**:
```bash
bun test:e2e

# Run specific test file
bunx playwright test tests/e2e/auth.spec.ts

# Run in headed mode (see browser)
bunx playwright test --headed

# Debug mode
bunx playwright test --debug
```

**When to use**:
- Testing user flows
- Before deployment
- Validating critical paths

---

### `bun test:e2e:ui`

Runs E2E tests with Playwright UI.

**What it does**:
- Opens Playwright test runner UI
- Allows interactive test execution
- Shows browser view
- Provides debugging tools

**Usage**:
```bash
bun test:e2e:ui
```

**When to use**:
- Debugging E2E tests
- Writing new E2E tests
- Exploring test failures

---

## Lifecycle Scripts

### `postinstall`

Automatically runs after `bun install`.

**What it does**:
- Generates Prisma Client
- Installs git hooks (simple-git-hooks)

**Runs automatically after**:
- `bun install`
- `bun add <package>`
- `bun remove <package>`

**Configuration**:
```json
{
  "scripts": {
    "postinstall": "prisma generate && simple-git-hooks"
  }
}
```

---

## Custom Workflows

### Run All Quality Checks (CI Simulation)

```bash
bun run lint && \
bun run format --check && \
bun run type-check && \
bun test:coverage && \
bun run build
```

Or add to `package.json`:
```json
{
  "scripts": {
    "ci": "bun run lint && bun run format --check && bun run type-check && bun test:coverage && bun run build"
  }
}
```

Then run:
```bash
bun run ci
```

### Pre-Push Hook

```bash
bun run lint:fix && \
bun run format && \
bun run type-check && \
bun test run
```

---

## Environment Variables

Some scripts require environment variables:

```bash
# Development
DATABASE_URL="file:./dev.db"
NODE_ENV="development"

# Production
DATABASE_URL="postgresql://user:pass@host:5432/db"
NODE_ENV="production"
```

Set in `.env` file or pass directly:

```bash
DATABASE_URL="postgresql://..." bun run build
```

---

## Troubleshooting

### Issue: Script not found
**Solution**: Check `package.json` scripts section

### Issue: Permission denied
**Solution**: Make sure Bun is installed and in PATH

### Issue: Out of memory
**Solution**: Increase heap size:
```bash
NODE_OPTIONS="--max-old-space-size=4096" bun run build
```

### Issue: Port already in use
**Solution**: Kill process or use different port:
```bash
PORT=3001 bun run dev
```

---

## Additional Commands

### Install Dependencies
```bash
bun install                # Install all dependencies
bun add <package>          # Add dependency
bun add -D <package>       # Add dev dependency
bun remove <package>       # Remove dependency
bun update                 # Update all dependencies
```

### Bun Commands
```bash
bun --version              # Check Bun version
bun upgrade                # Upgrade Bun
bunx <command>             # Run package without installing
```

---

## Related Documentation

- [Setup Guide](../1-getting-started/setup.md)
- [Testing Guide](../3-development/testing.md)
- [CI/CD Pipeline](../5-deployment/ci-cd.md)
