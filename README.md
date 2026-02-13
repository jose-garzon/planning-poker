# Next.js 15 Production Template

A production-ready Next.js 15 project template with vertical slice architecture, comprehensive testing, CI/CD pipeline, and best practices. Perfect for starting new projects or demonstrating full-stack development skills.

**Use this template to kickstart your next project with a solid foundation!**

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?logo=prisma)
![Biome](https://img.shields.io/badge/Biome-1.9-60a5fa)

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS + Base UI components
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod for runtime type checking
- **Testing**: Vitest (unit/integration) + Playwright (E2E)
- **Linting/Formatting**: Biome (25x faster than ESLint)
- **Package Manager**: Bun

## Features

### Production-Grade Architecture
- ✅ Strict TypeScript configuration (all safety flags enabled)
- ✅ Standardized API response format
- ✅ Custom error classes with proper HTTP status codes
- ✅ Security headers configured
- ✅ Environment variable validation

### Developer Experience
- ✅ VSCode format-on-save integration
- ✅ Strict linting rules (complexity, correctness, security, a11y)
- ✅ Path aliases for clean imports
- ✅ Prisma client singleton (prevents hot reload issues)
- ✅ Comprehensive npm scripts
- ✅ Git hooks for automatic code formatting and linting

### CI/CD Pipeline
- ✅ GitHub Actions workflow for automated quality checks
- ✅ Parallel job execution for faster CI runs
- ✅ Dependency caching with Bun
- ✅ Coverage reports as artifacts
- ✅ Production build verification

### Testing Infrastructure
- ✅ Vitest for unit and integration tests
- ✅ Playwright for E2E tests across multiple browsers
- ✅ Code coverage reporting
- ✅ Test setup with React Testing Library

### Best Practices
- ✅ Accessible UI components with ARIA attributes
- ✅ Database migrations and seeding
- ✅ Input validation at API boundaries
- ✅ Proper error handling and logging
- ✅ Type-safe API routes

## What's Included

This template comes **production-ready** with:

### ⚙️ Infrastructure
- ✅ **Next.js 15** with App Router and TypeScript (strict mode)
- ✅ **Prisma ORM** configured with migrations and seeding
- ✅ **GitHub Actions** CI/CD pipeline (lint, test, build)
- ✅ **Git Hooks** for automatic formatting and linting
- ✅ **Vitest** for unit tests + **Playwright** for E2E tests

### 🏗️ Architecture
- ✅ **Vertical Slice Architecture** with feature modules
- ✅ **Service Layer Pattern** for business logic
- ✅ **Shared Components** library with Base UI
- ✅ **Type-Safe API Routes** with Zod validation
- ✅ **Error Handling** with custom error classes

### 📚 Documentation
- ✅ **Comprehensive Docs** (setup, architecture, testing, deployment)
- ✅ **ADR Templates** for tracking architectural decisions
- ✅ **Feature Templates** for consistent documentation
- ✅ **CLAUDE.md** for AI assistant guidance

### 🎨 Developer Experience
- ✅ **Biome** for ultra-fast linting and formatting
- ✅ **Bun** for faster dependency installation
- ✅ **Path Aliases** (@/shared, @/modules)
- ✅ **VSCode Settings** for format-on-save
- ✅ **Example Code** (users module, health check API)

### 🔒 Best Practices
- ✅ **Security Headers** configured
- ✅ **Environment Validation** with examples
- ✅ **Accessibility** with ARIA attributes
- ✅ **Database Migrations** workflow
- ✅ **Test Setup** with examples

---

## How to Use This Template

This project is designed to be a **starting point for new Next.js projects**. Follow these steps to create your own project from this template:

### Option 1: Use GitHub Template (Recommended)

1. **Click "Use this template"** button on GitHub (or fork the repository)
2. **Create a new repository** with your project name
3. **Clone your new repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_PROJECT_NAME.git
   cd YOUR_PROJECT_NAME
   ```

### Option 2: Manual Clone and Rename

1. **Clone this repository**:
   ```bash
   git clone https://github.com/jose-garzon/next-placeholder.git YOUR_PROJECT_NAME
   cd YOUR_PROJECT_NAME
   ```

2. **Remove the original git history** and start fresh:
   ```bash
   rm -rf .git
   git init
   ```

3. **Update project information** in `package.json`:
   ```json
   {
     "name": "your-project-name",
     "version": "0.1.0",
     "description": "Your project description"
   }
   ```

4. **Update the README.md**:
   - Change the title from "Next.js 15 Interview Scaffold"
   - Update the description
   - Customize badges and links
   - Add your project-specific information

5. **Customize the project**:
   - Remove example modules (`modules/users/`, `modules/home/`) if not needed
   - Update `prisma/schema.prisma` with your database models
   - Modify `shared/components/` to match your design system
   - Update environment variables in `.env.example`

6. **Initialize your new git repository**:
   ```bash
   git add .
   git commit -m "Initial commit from next-placeholder template"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_PROJECT_NAME.git
   git push -u origin main
   ```

### What to Customize

After cloning, customize these files for your project:

| File/Folder | What to Change |
|-------------|----------------|
| `package.json` | Project name, version, description |
| `README.md` | Title, description, badges, project-specific docs |
| `.env.example` | Your environment variables |
| `prisma/schema.prisma` | Your database models |
| `modules/` | Remove examples, add your feature modules |
| `app/page.tsx` | Your landing page |
| `shared/components/` | Your design system components |
| `docs/` | Project-specific documentation |

### Optional: Remove Example Code

To start with a clean slate:

```bash
# Remove example modules
rm -rf modules/users modules/home

# Remove example API routes
rm -rf app/api/users
rm -rf app/users

# Keep only the health check endpoint
# (or remove if not needed: rm -rf app/api/health)
```

Then create your own modules following the established patterns.

---

## Getting Started

### Prerequisites

- **Bun** 1.1.38+ ([Installation Guide](https://bun.sh/docs/installation))
- **PostgreSQL** 14+ (or SQLite for development)
- **Git**

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd next-placeholder
```

2. Install dependencies:
```bash
bun install
```

This will automatically:
- Install all project dependencies
- Generate the Prisma client
- Set up git hooks (auto-format and lint on commit)

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Set up the database:
```bash
# Run migrations
bun run db:migrate

# Seed the database
bun run db:seed
```

5. Generate Prisma client:
```bash
bun run db:generate
```

6. Start the development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Quick Start Checklist

After installation, verify everything works:

- [ ] `bun run type-check` - TypeScript compiles without errors ✅
- [ ] `bun run lint` - Biome linting passes ✅
- [ ] `bun test --run` - Unit tests pass ✅
- [ ] `bun run build` - Production build succeeds ✅
- [ ] Visit `http://localhost:3000` - App loads successfully ✅

**All green?** You're ready to start building! 🚀

### Next Steps

1. **Read the docs**: Start with [Setup Guide](docs/1-getting-started/setup.md)
2. **Understand the architecture**: [Architecture Overview](docs/2-architecture/overview.md)
3. **Create your first module**: [Adding Features](docs/3-development/adding-features.md)
4. **Set up CI/CD**: Push to GitHub to trigger the pipeline

---

## Available Scripts

### Development
- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server

### Code Quality
- `bun lint` - Check for linting errors
- `bun lint:fix` - Fix linting errors
- `bun format` - Format code with Biome
- `bun type-check` - Run TypeScript type checking

### Database
- `bun run db:generate` - Generate Prisma client
- `bun run db:migrate` - Run database migrations
- `bun run db:seed` - Seed the database
- `bun run db:studio` - Open Prisma Studio
- `bun run db:reset` - Reset database

### Testing
- `bun test` - Run unit/integration tests
- `bun test:ui` - Run tests with UI
- `bun test:coverage` - Run tests with coverage
- `bun run test:e2e` - Run E2E tests
- `bun run test:e2e:ui` - Run E2E tests with UI

## Project Structure

This project uses a **Vertical Slice Architecture** with feature modules:

```
.
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── health/           # Health check endpoint
│   │   └── users/            # User CRUD endpoints
│   ├── users/                # User pages
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── error.tsx             # Error boundary
│   ├── loading.tsx           # Loading UI
│   └── not-found.tsx         # 404 page
├── modules/                  # Feature modules (vertical slices)
│   ├── users/                # User feature module
│   │   ├── services/         # Business logic
│   │   │   └── users.service.ts
│   │   └── users.page.tsx    # User components
│   └── home/                 # Home feature module
│       └── home.page.tsx
├── shared/                   # Shared code across modules
│   ├── components/           # Reusable UI components
│   │   └── ui/               # Base UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── dialog.tsx
│   ├── lib/                  # Shared utilities
│   │   ├── api/              # API utilities
│   │   │   ├── response.ts   # Standard responses
│   │   │   └── errors.ts     # Custom errors
│   │   ├── db/               # Database utilities
│   │   │   └── prisma.ts     # Prisma client singleton
│   │   ├── utils/            # Helper functions
│   │   │   └── cn.ts         # Class name merger
│   │   └── validations/      # Zod schemas
│   │       └── user.ts
│   └── types/                # Shared TypeScript types
│       ├── api.ts            # API types
│       ├── models.ts         # Database models
│       └── index.ts
├── prisma/                   # Database schema
│   ├── schema.prisma         # Prisma schema
│   ├── migrations/           # Database migrations
│   └── seed.ts               # Database seeding
├── tests/                    # Test files
│   ├── unit/                 # Unit tests
│   │   └── lib/              # Utility tests
│   ├── integration/          # Integration tests
│   ├── e2e/                  # End-to-end tests
│   ├── setup/                # Test configuration
│   │   └── vitest.setup.ts
│   └── helpers/              # Test utilities
├── docs/                     # Documentation
│   ├── 1-getting-started/    # Setup guides
│   ├── 2-architecture/       # Architecture docs
│   ├── 3-development/        # Dev guides
│   ├── 4-api/                # API documentation
│   ├── 5-deployment/         # Deployment guides
│   ├── 6-reference/          # Reference materials
│   ├── adr/                  # Architecture Decision Records
│   └── templates/            # Documentation templates
├── .github/                  # GitHub configuration
│   └── workflows/            # GitHub Actions
│       └── ci.yml            # CI/CD pipeline
├── CLAUDE.md                 # AI assistant guide
├── README.md                 # This file
└── package.json              # Dependencies and scripts
```

### Architecture Highlights

- **Modules**: Feature-based organization (users, home, etc.)
- **Shared**: Reusable code across all modules
- **Vertical Slices**: Each module contains its own components, services, and types
- **Clean Separation**: Business logic in services, UI in components
- **Type Safety**: Shared types ensure consistency

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Users
- `GET /api/users` - List users (with pagination)
- `POST /api/users` - Create a user
- `GET /api/users/[id]` - Get user by ID
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

See [docs/4-api/endpoints.md](docs/4-api/endpoints.md) for detailed API documentation.

## Architecture

This project follows modern Next.js best practices with a **Vertical Slice Architecture**:

### Core Patterns
- **Vertical Slices**: Features organized as self-contained modules (e.g., `modules/users/`)
- **Service Layer**: Business logic separated from UI in service files
- **App Router**: Leverages Next.js 15 App Router for file-based routing
- **Server Components**: Uses React Server Components by default (Client Components only when needed)
- **API Routes**: RESTful API with standardized responses and error handling
- **Database Layer**: Prisma ORM with PostgreSQL (SQLite for dev)
- **Type Safety**: End-to-end type safety with TypeScript strict mode and Zod validation
- **Testing**: Multi-layer testing strategy (unit, integration, E2E)

### Module Structure
Each feature module contains:
- **Services**: Business logic and data access
- **Components**: UI components specific to the feature
- **Types**: Feature-specific TypeScript types
- **Validation**: Zod schemas for input validation

### Shared Code
- **Components**: Reusable UI components (buttons, inputs, etc.)
- **Lib**: Utilities, API helpers, database client, validation schemas
- **Types**: Shared TypeScript types and interfaces

See [docs/2-architecture/overview.md](docs/2-architecture/overview.md) for detailed architecture documentation.

## Documentation

This project includes comprehensive documentation organized by topic:

- **[Getting Started](docs/1-getting-started/setup.md)** - Installation and setup guide
- **[Architecture](docs/2-architecture/overview.md)** - Technical design and patterns
- **[Development](docs/3-development/testing.md)** - Testing, coding standards, and workflows
- **[API Reference](docs/4-api/endpoints.md)** - API endpoints and examples
- **[Deployment](docs/5-deployment/ci-cd.md)** - CI/CD pipeline and deployment
- **[Reference](docs/6-reference/scripts.md)** - Scripts, env vars, and troubleshooting

For AI assistants (Claude, GitHub Copilot), see [CLAUDE.md](CLAUDE.md) for project conventions and patterns.

Full documentation index: [docs/README.md](docs/README.md)

## Git Hooks

This project uses `simple-git-hooks` to automatically run quality checks before commits:

**Pre-commit Hook** (runs automatically):
- Auto-fixes linting issues with Biome
- Formats code with Biome
- Re-stages modified files

This ensures all committed code is properly formatted and passes linting checks.

**Setup**: Hooks are installed automatically during `bun install`. To manually reinstall:
```bash
bunx simple-git-hooks
```

**Note**: Pre-commit hooks only run in git repositories. Initialize git first:
```bash
git init
bun install  # This will now set up hooks
```

## Key Differentiators

This scaffold demonstrates advanced full-stack development concepts:

1. **Vertical Slice Architecture** - Feature modules with isolated concerns
2. **Strict TypeScript** - All safety flags enabled, end-to-end type safety
3. **Modern Tooling** - Biome (25x faster than ESLint) + Bun package manager
4. **CI/CD Pipeline** - GitHub Actions with automated quality checks
5. **Accessibility** - Base UI components with built-in ARIA support
6. **Comprehensive Testing** - Unit (Vitest) + E2E (Playwright) with coverage
7. **Production Patterns** - Standard API responses, custom errors, security headers
8. **Developer Experience** - Git hooks, format-on-save, strict linting
9. **Comprehensive Documentation** - Architecture ADRs, API docs, guides, templates
10. **Type Safety** - Zod validation + Prisma ORM + TypeScript strict mode
11. **Best Practices** - Environment validation, database migrations, proper separation
12. **Scalability** - Modular structure, service layer, clean code organization

## Troubleshooting Template Setup

### Issue: Git hooks not working after cloning
**Solution**: Reinstall git hooks after cloning
```bash
bunx simple-git-hooks
```

### Issue: Package name conflicts
**Solution**: Update `package.json` name to your project name
```bash
# Edit package.json
{
  "name": "your-unique-project-name"
}
```

### Issue: Database connection errors
**Solution**: Update `DATABASE_URL` in `.env`
```bash
# For development (SQLite)
DATABASE_URL="file:./dev.db"

# For production (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/your_db"
```

### Issue: Port 3000 already in use
**Solution**: Run on a different port
```bash
PORT=3001 bun dev
```

### Issue: Prisma client not generated
**Solution**: Manually generate Prisma client
```bash
bun run db:generate
```

For more troubleshooting, see [docs/6-reference/troubleshooting.md](docs/6-reference/troubleshooting.md)

---

## Contributing

This is a template project designed to be cloned and customized.

**Found a bug or want to improve the template?**
- Open an issue on GitHub
- Submit a pull request with improvements
- Share feedback on what works and what doesn't

**Using this template?**
- Give it a ⭐ on GitHub
- Share your project built with this template
- Contribute improvements back to the template

## License

MIT - Free to use for personal and commercial projects.

---

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org) - React framework
- [Prisma](https://prisma.io) - Database ORM
- [Biome](https://biomejs.dev) - Fast linting and formatting
- [Bun](https://bun.sh) - Fast JavaScript runtime
- [Vitest](https://vitest.dev) - Unit testing framework
- [Playwright](https://playwright.dev) - E2E testing

---

**Happy coding!** 🚀

If you find this template helpful, please consider giving it a star ⭐
