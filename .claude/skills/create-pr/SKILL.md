---
name: create-pr
description: Create a pull request for the current branch following project conventions
disable-model-invocation: true
argument-hint: "[base-branch]"
allowed-tools: Bash(git *), Bash(gh *)
---

Create a pull request for the current branch targeting `$ARGUMENTS` (default: `main`).

## Steps

1. **Gather context** by running these commands:
   - `git status` to check for uncommitted changes
   - `git log --oneline $(git merge-base HEAD $ARGUMENTS)..HEAD` to see all commits on this branch
   - `git diff $ARGUMENTS...HEAD --stat` to see changed files summary

2. **If there are uncommitted changes**, warn the user and ask if they want to commit first.

3. **Push the branch** if it hasn't been pushed yet:
   ```bash
   git push -u origin $(git branch --show-current)
   ```

4. **Analyze the changes** across ALL commits (not just the latest) to understand the full scope.

5. **Create the PR** using `gh pr create` with this template:

```bash
gh pr create --title "<type>: <short description>" --body "$(cat <<'EOF'
## Summary

<1-3 bullet points describing what this PR does and why>

## Changes

<Bulleted list of specific changes made, grouped by area>

### Files Changed
<List key files modified/created/deleted>

## How to Test

- [ ] <Step-by-step testing instructions>
- [ ] <Verify specific behavior>

## Screenshots / Recordings

<If UI changes, add before/after screenshots or remove this section>

## Checklist

- [ ] Code follows project conventions (Biome formatting, TypeScript strict)
- [ ] Unit tests added/updated for business logic
- [ ] E2E tests added/updated for critical flows
- [ ] Animations run at 60fps (if applicable)
- [ ] Accessibility verified (keyboard nav, ARIA labels, contrast)
- [ ] No console errors or warnings

## Related

- Closes #<issue-number> (if applicable)
- Spec: `specs/<spec-name>.md` (if applicable)

---
Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

## PR Title Convention

Use conventional commit format for the title:
- `feat: add card selection animation`
- `fix: resolve SSE reconnection bug`
- `refactor: extract voting service`
- `test: add E2E tests for session flow`
- `docs: update API documentation`
- `chore: update dependencies`

Keep the title under 70 characters.

## Rules

- Fill in ALL template sections with real content from the branch diff
- Remove sections that don't apply (e.g., Screenshots if no UI changes)
- Reference GitHub issues if the commits mention them
- The summary should explain the "why", the changes section explains the "what"
- Never create a PR with placeholder text - every section must be filled in or removed
