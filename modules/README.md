# Modules

This directory contains the application modules organized by feature/domain using a vertical architecture pattern.

## Structure

Each module is a self-contained unit with its own:

- **Components**: Module-specific React components
- **Hooks**: Custom React hooks for this module
- **Services**: Business logic and API interactions (backend/server-side)
- **Styles**: Module-specific styles (if needed)
- **Entry Point**: A `*.page.tsx` file that serves as the module's main component

## Example Structure

```
modules/
├── home/
│   ├── components/       # Home-specific components
│   ├── hooks/           # Home-specific hooks
│   ├── services/        # Home-specific services
│   ├── styles/          # Home-specific styles
│   └── home.page.tsx    # Entry point for home module
└── users/
    ├── components/       # User-specific components
    ├── hooks/           # User-specific hooks
    ├── services/        # User business logic
    │   └── users.service.ts
    ├── styles/          # User-specific styles
    └── users.page.tsx   # Entry point for users module
```

## Benefits

1. **Isolation**: Each module is independent and can be developed/tested in isolation
2. **Scalability**: Easy to add new modules without affecting existing ones
3. **Maintainability**: Clear boundaries make code easier to understand and modify
4. **Reusability**: Modules can be moved or reused across projects
5. **Team Organization**: Different teams can own different modules

## Usage

The `app/` directory handles routing and imports the page components from modules:

```typescript
// app/users/page.tsx
import UsersPage from '@/modules/users/users.page';

export default UsersPage;
```

## Shared Code

For code shared across modules, use the `shared/` directory instead of duplicating code within modules.
