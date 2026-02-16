---
name: ci-local
description: Run all CI pipeline checks locally before pushing
disable-model-invocation: true
allowed-tools: Bash(bun *)
---

Run the full CI pipeline locally, matching what GitHub Actions runs on push/PR.

## Pipeline Steps (run in order)

Execute these commands sequentially, stopping on first failure:

1. **Lint & Format Check**:
   ```bash
   bun run lint
   ```

2. **TypeScript Type Check**:
   ```bash
   bun run type-check
   ```

3. **Unit Tests with Coverage**:
   ```bash
   bun test:coverage
   ```

4. **Production Build**:
   ```bash
   bun run build
   ```

## Reporting

After running all steps, report:
- Which steps passed/failed
- For failures: show the relevant error output
- Suggest fixes for any failures:
  - **Lint errors**: `bun run lint:fix` to auto-fix
  - **Format errors**: `bun run format` to auto-fix
  - **Type errors**: Show the specific type error and suggest a fix
  - **Test failures**: Show which tests failed
  - **Build errors**: Show the build error

## CI Config Reference

The GitHub Actions workflow is defined in `.github/workflows/ci.yml`. The pipeline runs on push to `main`/`develop` and on all PRs. All checks must pass before merging.
