---
name: setup
description: Set up the Planning Poker development environment from scratch
disable-model-invocation: true
allowed-tools: Bash(bun *), Bash(cp *), Read, Glob
---

Set up the Planning Poker development environment. Follow these steps exactly:

## Prerequisites Check

Verify these are installed:
- **Bun** v1.1.38+ (`bun --version`)
- **Node.js** v18+ (`node --version`)
- **Git** (`git --version`)

If any are missing, inform the user and stop.

## Setup Steps

1. **Install dependencies** (MUST use Bun):
   ```bash
   bun install
   ```

2. **Configure environment variables**:
   - Copy `.env.example` to `.env` if it doesn't exist
   - This project uses client-side IndexedDB storage, so no database config is needed
   - Only optional vars: `NODE_ENV`, `NEXT_PUBLIC_APP_URL`

3. **Verify installation** by running these checks in sequence:
   ```bash
   bun run type-check
   bun run lint
   bun test run
   bun run build
   ```

4. **Report results**: Tell the user which checks passed/failed.

## VS Code Extensions (Recommend)

Suggest these extensions:
- `biomejs.biome` - Linting and formatting
- `bradlc.vscode-tailwindcss` - CSS autocomplete

## Git Hooks

Git hooks are installed automatically via `simple-git-hooks` during `bun install`. To reinstall:
```bash
bunx simple-git-hooks
```

## Troubleshooting

- **Port 3000 in use**: `PORT=3001 bun run dev`
- **Git hooks not running**: `bunx simple-git-hooks`
- **Bun not found**: Install from https://bun.sh
