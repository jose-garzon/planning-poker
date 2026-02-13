# CI/CD Pipeline

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline implemented with GitHub Actions.

## Overview

The CI/CD pipeline automatically runs quality checks on every push and pull request to ensure code quality and prevent broken code from being merged.

## Pipeline Jobs

The workflow is defined in `.github/workflows/ci.yml` and consists of 5 jobs:

### 1. Setup & Cache Dependencies

**Purpose**: Install dependencies and cache them for faster subsequent jobs

**Steps**:
- Checkout code
- Setup Bun runtime
- Cache dependencies (node_modules and Bun cache)
- Install dependencies if cache miss

**Benefits**:
- Speeds up subsequent jobs by reusing cached dependencies
- Reduces network bandwidth and installation time

### 2. Lint & Format Check

**Purpose**: Ensure code follows linting rules and formatting standards

**Steps**:
- Restore dependencies from cache
- Run Biome linter (`bun run lint`)
- Check code formatting (`bun run format --check`)

**Fails if**:
- Linting errors are found
- Code is not properly formatted

**Local equivalent**:
```bash
bun run lint
bun run format --check
```

### 3. TypeScript Type Check

**Purpose**: Verify that all TypeScript code is type-safe

**Steps**:
- Restore dependencies from cache
- Generate Prisma client
- Run TypeScript compiler in check mode

**Fails if**:
- Type errors are found
- Missing type definitions
- Invalid TypeScript syntax

**Local equivalent**:
```bash
bun run type-check
```

### 4. Unit Tests

**Purpose**: Run unit tests and generate coverage reports

**Steps**:
- Restore dependencies from cache
- Generate Prisma client
- Run Vitest with coverage
- Upload coverage reports as artifacts

**Fails if**:
- Any test fails
- Tests timeout

**Local equivalent**:
```bash
bun test:coverage
```

**Artifacts**:
- Coverage reports (HTML and JSON)
- Retained for 30 days
- Downloadable from GitHub Actions UI

### 5. Build Production Bundle

**Purpose**: Verify that the application builds successfully for production

**Dependencies**: Runs only after lint, type-check, and test jobs pass

**Steps**:
- Restore dependencies from cache
- Generate Prisma client
- Build Next.js production bundle
- Upload build artifacts

**Fails if**:
- Build errors occur
- Missing environment variables (critical ones)
- Build timeout

**Local equivalent**:
```bash
bun run build
```

**Artifacts**:
- `.next/` build output
- Retained for 7 days

## Workflow Configuration

### Trigger Events

The pipeline runs on:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

**On Push**: Validates code pushed to main or develop branches
**On Pull Request**: Validates code before merging

### Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Cancels in-progress runs when a new commit is pushed to the same branch, saving CI resources.

### Job Dependencies

```
setup-and-cache
    ├── lint-and-format
    ├── type-check
    └── test-unit
            └── build (runs only if all above pass)
```

Jobs run in parallel when possible, with the build job waiting for all quality checks to pass.

## Caching Strategy

### What is Cached
- `~/.bun/install/cache` - Bun's download cache
- `node_modules/` - Installed dependencies

### Cache Key
```
${{ runner.os }}-bun-${{ hashFiles('**/bun.lock') }}
```

Cache is invalidated when:
- `bun.lock` changes (dependencies updated)
- OS changes (unlikely in CI)

### Cache Benefits
- **First run**: ~60 seconds to install dependencies
- **Cached run**: ~5 seconds to restore dependencies
- **Savings**: 10x faster subsequent runs

## Environment Variables

### Required for Build
```env
DATABASE_URL="file:./dev.db"
NODE_ENV="production"
```

These are set in the workflow for the build job.

### Secrets
For production deployments, add secrets in GitHub:
- `DATABASE_URL` - Production database connection
- `NEXTAUTH_SECRET` - Authentication secret (if using NextAuth)

**To add secrets**:
1. Go to repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"

## Status Checks

### Branch Protection

Recommended settings for `main` branch:

1. **Require status checks to pass before merging**
   - ✅ lint-and-format
   - ✅ type-check
   - ✅ test-unit
   - ✅ build

2. **Require branches to be up to date before merging**
   - ✅ Enabled

3. **Require pull request reviews before merging**
   - Recommended: At least 1 approval

**To configure**:
1. Go to repository Settings
2. Navigate to Branches
3. Add rule for `main`
4. Enable protection rules

## Performance Optimization

### Parallel Execution
Independent jobs run in parallel:
- Lint & Format
- Type Check
- Unit Tests

This reduces total pipeline time from ~4 minutes (sequential) to ~2 minutes (parallel).

### Dependency Caching
- Restore dependencies in ~5 seconds (vs. ~60 seconds without cache)
- Shared cache across jobs
- Automatic cache eviction after 7 days of no use

### Early Termination
- Jobs fail fast on first error
- Cancelled in-progress runs when new commits are pushed

## Monitoring and Debugging

### Viewing Workflow Runs

1. Go to the **Actions** tab in GitHub
2. Select the workflow run
3. View job details and logs

### Downloading Artifacts

1. Open the workflow run
2. Scroll to **Artifacts** section
3. Download coverage reports or build output

### Debugging Failed Runs

**Check the logs**:
1. Click on the failed job
2. Expand the failed step
3. Read the error message

**Common issues**:
- **Lint errors**: Run `bun run lint:fix` locally
- **Type errors**: Run `bun run type-check` locally
- **Test failures**: Run `bun test` locally
- **Build errors**: Run `bun run build` locally

### Re-running Jobs

1. Open the workflow run
2. Click "Re-run jobs" dropdown
3. Select "Re-run failed jobs" or "Re-run all jobs"

## Local Simulation

Run the same checks locally before pushing:

```bash
# Run all checks (equivalent to CI)
bun run lint && \
bun run format --check && \
bun run type-check && \
bun test:coverage && \
bun run build
```

Or create a script in `package.json`:

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

## Pre-Commit Hooks

Git hooks run automatically before commits to catch issues early:

```bash
# Automatically runs on git commit
bun run lint:fix && bun run format && git add -u
```

This prevents committing:
- Unformatted code
- Linting errors (auto-fixable)

**Setup**: Hooks are installed automatically on `bun install` via `simple-git-hooks`.

## Continuous Deployment

### Manual Deployment

After CI passes, manually deploy:

```bash
# Deploy to Vercel
vercel --prod

# Or deploy to your hosting provider
bun run build
# Upload .next/ directory
```

### Automatic Deployment

For automatic deployment, add a deploy job:

```yaml
deploy:
  name: Deploy to Production
  runs-on: ubuntu-latest
  needs: build
  if: github.ref == 'refs/heads/main'
  steps:
    - name: Deploy to Vercel
      run: vercel --prod
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## Best Practices

### For Developers
1. ✅ Run tests locally before pushing
2. ✅ Let pre-commit hooks auto-fix issues
3. ✅ Don't push directly to `main` (use PRs)
4. ✅ Keep PRs small for faster CI runs
5. ✅ Fix CI failures promptly

### For Maintainers
1. ✅ Enable branch protection on `main`
2. ✅ Require status checks before merge
3. ✅ Monitor CI performance and optimize
4. ✅ Keep dependencies up to date
5. ✅ Review and approve PRs carefully

## Troubleshooting

### Issue: CI runs are slow
**Solutions**:
- Check if cache is working (look for "Cache hit" in logs)
- Reduce test timeout values
- Remove unnecessary dependencies

### Issue: Flaky tests
**Solutions**:
- Increase test timeouts
- Add proper waits in E2E tests
- Mock time-dependent logic

### Issue: Cache not working
**Solutions**:
- Verify `bun.lock` is committed
- Check cache key matches across jobs
- Clear GitHub Actions cache (Settings → Actions → Caches)

### Issue: Out of disk space
**Solutions**:
- Clean up old artifacts
- Reduce artifact retention days
- Optimize build output size

## Future Enhancements

Potential improvements to the CI/CD pipeline:

- [ ] Add E2E tests to pipeline
- [ ] Lighthouse performance audits
- [ ] Security scanning (npm audit, Snyk)
- [ ] Automated dependency updates (Dependabot)
- [ ] Deploy preview environments for PRs
- [ ] Slack/Discord notifications on failures
- [ ] Code coverage thresholds enforcement
- [ ] Bundle size tracking

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Bun in CI/CD](https://bun.sh/docs/install/ci)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vitest in CI](https://vitest.dev/guide/ci.html)
