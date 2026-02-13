# Setup Guide

This guide will help you set up the Next.js 15 Placeholder project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Bun**: v1.1.38 or later ([Installation Guide](https://bun.sh/docs/installation))
- **Node.js**: v18.x or later (required for some dependencies)
- **Git**: For version control
- **VS Code** (recommended): For the best development experience

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd next-placeholder
```

### 2. Install Dependencies

**IMPORTANT**: This project uses Bun as the package manager. Do not use npm, yarn, or pnpm.

```bash
bun install
```

This will:
- Install all project dependencies
- Generate the Prisma client automatically (via postinstall script)
- Set up git hooks (simple-git-hooks)

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the following variables:

```env
# Database (SQLite for development)
DATABASE_URL="file:./dev.db"

# Environment
NODE_ENV="development"
```

For production, you'll use PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NODE_ENV="production"
```

### 4. Set Up the Database

Run Prisma migrations to create the database schema:

```bash
bun run db:migrate
```

(Optional) Seed the database with sample data:

```bash
bun run db:seed
```

### 5. Verify Installation

Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Next.js welcome page.

## Development Tools Setup

### VS Code Extensions (Recommended)

Install these extensions for the best development experience:

1. **Biome** (`biomejs.biome`) - Linting and formatting
2. **Prisma** (`Prisma.prisma`) - Database schema support
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) - CSS autocomplete
4. **TypeScript and JavaScript** (built-in) - Type checking

### VS Code Settings

Add these to your `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

### Git Hooks

Git hooks are automatically set up during `bun install`. They will:
- Auto-fix linting issues before commit
- Format code before commit
- Re-stage modified files

To manually reinstall hooks:

```bash
bunx simple-git-hooks
```

## Available Scripts

### Development
```bash
bun run dev          # Start development server (http://localhost:3000)
bun run build        # Build for production
bun run start        # Start production server
```

### Code Quality
```bash
bun run lint         # Run Biome linter
bun run lint:fix     # Auto-fix linting issues
bun run format       # Format code with Biome
bun run type-check   # Run TypeScript type checking
```

### Database
```bash
bun run db:generate       # Generate Prisma client
bun run db:migrate        # Create and apply migration
bun run db:migrate:deploy # Deploy migrations (production)
bun run db:seed           # Seed database
bun run db:studio         # Open Prisma Studio
bun run db:reset          # Reset database (dev only)
```

### Testing
```bash
bun test              # Run unit tests (watch mode)
bun test:coverage     # Run tests with coverage
bun test:ui           # Run tests with Vitest UI
bun test:e2e          # Run E2E tests
bun test:e2e:ui       # Run E2E tests with Playwright UI
```

## Verification

After setup, verify everything works:

### 1. Type Checking
```bash
bun run type-check
```
Should complete without errors.

### 2. Linting
```bash
bun run lint
```
Should complete without errors.

### 3. Tests
```bash
bun test
```
Should show passing tests.

### 4. Build
```bash
bun run build
```
Should build successfully.

## Troubleshooting

### Issue: Bun not found
**Solution**: Install Bun from [bun.sh](https://bun.sh/docs/installation)

### Issue: Database connection errors
**Solution**: Check that `DATABASE_URL` is set correctly in `.env`

### Issue: Port 3000 already in use
**Solution**: Kill the process using port 3000 or change the port:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 bun run dev
```

### Issue: Git hooks not running
**Solution**: Reinstall git hooks:
```bash
bunx simple-git-hooks
```

### Issue: Prisma client not generated
**Solution**: Manually generate the Prisma client:
```bash
bun run db:generate
```

## Next Steps

Now that your environment is set up:

1. Read [First Steps](first-steps.md) to make your first changes
2. Review [Architecture Overview](../2-architecture/overview.md) to understand the codebase
3. Check [Coding Standards](../3-development/coding-standards.md) for style guidelines
4. Explore [Common Tasks](../3-development/common-tasks.md) for development workflows

## Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Biome Documentation](https://biomejs.dev)
