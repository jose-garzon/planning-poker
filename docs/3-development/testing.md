# Testing Guide

This guide covers unit testing with Vitest and end-to-end testing with Playwright.

## Testing Philosophy

- **Test behavior, not implementation**: Focus on what the code does, not how it does it
- **Write tests first** (when possible): TDD helps clarify requirements
- **Keep tests simple**: Tests should be easier to understand than the code they test
- **Aim for 80%+ coverage**: Focus on business logic, not boilerplate

## Unit Testing with Vitest

### Test Structure

Tests are located in `tests/unit/` and mirror the project structure:

```
tests/unit/
  lib/
    cn.test.ts           # Test for shared/lib/utils/cn
  modules/
    users/
      user.service.test.ts  # Test for modules/users/server/user.service
```

### Writing Your First Test

```typescript
// tests/unit/lib/cn.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from '@/shared/lib/utils';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'active');
    expect(result).toBe('base active');
  });

  it('merges Tailwind classes without conflicts', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4'); // px-4 overrides px-2
  });
});
```

### Testing React Components

```typescript
// tests/unit/components/user-card.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserCard } from '@/shared/components/user-card';

describe('UserCard', () => {
  it('renders user information', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    render(<UserCard user={user} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('handles missing user gracefully', () => {
    render(<UserCard user={null} />);
    expect(screen.getByText('No user found')).toBeInTheDocument();
  });
});
```

### Testing Service Layer

```typescript
// tests/unit/modules/users/user.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '@/modules/users/server/user.service';
import { db } from '@/shared/lib/db';

// Mock Prisma
vi.mock('@/shared/lib/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserById', () => {
    it('returns user when found', async () => {
      const mockUser = { id: '1', name: 'John', email: 'john@example.com' };
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser);

      const user = await UserService.getUserById('1');

      expect(user).toEqual(mockUser);
      expect(db.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('returns null when user not found', async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(null);

      const user = await UserService.getUserById('999');

      expect(user).toBeNull();
    });
  });

  describe('createUser', () => {
    it('creates a new user', async () => {
      const newUser = { name: 'Jane', email: 'jane@example.com' };
      const createdUser = { id: '2', ...newUser };
      vi.mocked(db.user.create).mockResolvedValue(createdUser);

      const user = await UserService.createUser(newUser);

      expect(user).toEqual(createdUser);
      expect(db.user.create).toHaveBeenCalledWith({ data: newUser });
    });
  });
});
```

### Testing API Routes

```typescript
// tests/unit/api/users.test.ts
import { describe, it, expect, vi } from 'vitest';
import { GET, POST } from '@/app/api/users/route';
import { UserService } from '@/modules/users/server/user.service';

vi.mock('@/modules/users/server/user.service');

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('returns all users', async () => {
      const mockUsers = [
        { id: '1', name: 'John', email: 'john@example.com' },
        { id: '2', name: 'Jane', email: 'jane@example.com' },
      ];
      vi.mocked(UserService.getAll).mockResolvedValue(mockUsers);

      const response = await GET(new Request('http://localhost/api/users'));
      const data = await response.json();

      expect(data).toEqual(mockUsers);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/users', () => {
    it('creates a new user', async () => {
      const newUser = { name: 'Alice', email: 'alice@example.com' };
      const createdUser = { id: '3', ...newUser };
      vi.mocked(UserService.createUser).mockResolvedValue(createdUser);

      const request = new Request('http://localhost/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toEqual(createdUser);
      expect(response.status).toBe(201);
    });

    it('returns 400 for invalid data', async () => {
      const request = new Request('http://localhost/api/users', {
        method: 'POST',
        body: JSON.stringify({ name: '' }), // Missing email
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });
  });
});
```

### Running Unit Tests

```bash
# Watch mode (re-runs on file changes)
bun test

# Run once
bun test run

# With coverage
bun test:coverage

# With UI
bun test:ui

# Run specific test file
bun test tests/unit/lib/cn.test.ts

# Run tests matching a pattern
bun test user
```

### Coverage Reports

After running `bun test:coverage`, view the report:

```bash
# Terminal summary
bun test:coverage

# HTML report (opens in browser)
open coverage/index.html
```

**Coverage Goals**:
- **Business Logic**: 80%+ coverage
- **Utilities**: 90%+ coverage
- **Components**: 70%+ coverage
- **API Routes**: 80%+ coverage

## E2E Testing with Playwright

### Test Structure

E2E tests are located in `tests/e2e/`:

```
tests/e2e/
  auth.spec.ts           # Authentication flows
  users.spec.ts          # User management
  navigation.spec.ts     # Navigation and routing
```

### Writing E2E Tests

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can log in', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'invalid@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error')).toContainText('Invalid credentials');
  });

  test('user can log out', async ({ page }) => {
    // Assume already logged in
    await page.goto('/dashboard');
    await page.click('button:has-text("Logout")');

    await expect(page).toHaveURL('/login');
  });
});
```

### Page Object Pattern

For complex flows, use the Page Object pattern:

```typescript
// tests/e2e/pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async getErrorMessage() {
    return await this.page.locator('.error').textContent();
  }
}

// tests/e2e/auth.spec.ts
import { LoginPage } from './pages/login.page';

test('user can log in with page object', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('test@example.com', 'password123');
  await expect(page).toHaveURL('/dashboard');
});
```

### Running E2E Tests

```bash
# Run all E2E tests
bun test:e2e

# With UI (interactive)
bun test:e2e:ui

# Run specific test file
bunx playwright test tests/e2e/auth.spec.ts

# Run in headed mode (see browser)
bunx playwright test --headed

# Debug mode
bunx playwright test --debug
```

### Playwright Configuration

The project uses these Playwright settings (see `playwright.config.ts`):

- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Retries**: 2 (on CI), 0 (locally)
- **Parallel**: Yes
- **Screenshots**: On failure
- **Videos**: On first retry

## Test Organization Best Practices

### File Naming
- Unit tests: `*.test.ts` or `*.test.tsx`
- E2E tests: `*.spec.ts`
- Test utilities: `*.helper.ts`

### Test Naming
Use descriptive test names:

```typescript
// Good
it('returns 404 when user not found', ...)
it('creates user with valid data', ...)
it('handles concurrent updates correctly', ...)

// Bad
it('works', ...)
it('test user', ...)
it('should return user', ...)
```

### Arrange-Act-Assert Pattern

```typescript
it('creates a new user', async () => {
  // Arrange: Set up test data
  const newUser = { name: 'Alice', email: 'alice@example.com' };
  vi.mocked(db.user.create).mockResolvedValue({ id: '1', ...newUser });

  // Act: Execute the code under test
  const user = await UserService.createUser(newUser);

  // Assert: Verify the results
  expect(user).toEqual({ id: '1', ...newUser });
  expect(db.user.create).toHaveBeenCalledWith({ data: newUser });
});
```

## Mocking

### Mocking Modules

```typescript
// Mock entire module
vi.mock('@/shared/lib/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock specific function
vi.mock('@/shared/lib/api', () => ({
  fetchUser: vi.fn(),
}));
```

### Mocking Next.js Router

```typescript
// tests/setup/vitest.setup.ts
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/test-path',
}));
```

## CI/CD Integration

Tests run automatically on every push and pull request via GitHub Actions:

1. Unit tests with coverage
2. E2E tests (on deploy preview)
3. Coverage reports uploaded as artifacts

All tests must pass before merging.

## Troubleshooting

### Issue: Tests fail locally but pass in CI
**Solution**: Ensure your database is reset between test runs:
```bash
bun run db:reset
bun test
```

### Issue: Playwright browser not installed
**Solution**: Install Playwright browsers:
```bash
bunx playwright install
```

### Issue: Flaky E2E tests
**Solution**: Add proper waits and assertions:
```typescript
// Bad - race condition
await page.click('button');
expect(page.locator('.result')).toBeVisible();

// Good - wait for element
await page.click('button');
await page.waitForSelector('.result');
expect(page.locator('.result')).toBeVisible();
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Testing Library](https://testing-library.com)
- [Test Doubles (Mocks, Stubs, Spies)](https://martinfowler.com/bliki/TestDouble.html)
