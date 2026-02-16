---
name: new-module
description: Scaffold a new vertical slice module with the correct folder structure
disable-model-invocation: true
argument-hint: "[module-name] [page|feature]"
---

Create a new vertical slice module named `$0` of type `$1` (default: `page`).

## Module Types

- **page**: A full page module with entry point `$0.page.tsx`, used by `app/[path]/page.tsx`
- **feature**: A feature component module with entry point `$0.component.tsx`, used by other modules

## Folder Structure to Create

```
modules/$0/
  components/          # Component folders (each with container + UI)
  hooks/               # Custom hooks for this module
  services/            # Business logic
  types/
    index.ts           # Module-specific types
  lib/                 # Module utilities
```

### For Page Modules

Create the entry point:
```tsx
// modules/$0/$0.page.tsx
'use client';

export function [PascalCase($0)]Page() {
  return <div>[PascalCase($0)] Page</div>;
}
```

Create the app router file:
```tsx
// app/$0/page.tsx - ONLY routing logic
import { [PascalCase($0)]Page } from '@/modules/$0/$0.page';

export default function [PascalCase($0)]Route() {
  return <[PascalCase($0)]Page />;
}
```

### For Feature Modules

Create the entry point:
```tsx
// modules/$0/$0.component.tsx
'use client';

export function [PascalCase($0)]() {
  return <div>[PascalCase($0)]</div>;
}
```

## Component Folder Convention

Each component in `components/` lives in its own folder:
```
component-name/
  component-name-container.tsx      # Smart: state, hooks, logic
  component-name-ui.tsx             # Dumb: pure presentation
  component-name-container.test.tsx # Tests
  component-name-container.style.css# Optional: reusable tailwind classes
```

## Types File Starter

```typescript
// modules/$0/types/index.ts
export interface [PascalCase($0)] {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Rules

- Use kebab-case for all file and folder names
- PascalCase for component and type names
- Each module has ONE entry point (either `.page.tsx` or `.component.tsx`)
- App router files contain ONLY routing logic
- Consult `/llms.txt` for Base UI components when building UI
- Follow Biome formatting: 2 spaces, single quotes, semicolons, trailing commas

After scaffolding, inform the user what was created and suggest next steps.
