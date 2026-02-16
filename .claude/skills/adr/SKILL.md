---
name: adr
description: Create a new Architecture Decision Record
disable-model-invocation: true
argument-hint: "[decision-title]"
---

Create a new Architecture Decision Record (ADR) for: **$ARGUMENTS**

## Steps

1. **Determine the next ADR number**: Check existing files in `docs/adr/` and increment.

2. **Create the ADR file** at `docs/adr/adr-NNN-$ARGUMENTS.md` (kebab-case title).

3. **Use this template**:

```markdown
# ADR-NNN: $ARGUMENTS

**Date**: !`date +%Y-%m-%d`
**Status**: Proposed
**Deciders**: [Ask the user]
**Tags**: [Relevant tags: architecture, database, api, frontend, testing, tooling]

## Context

[Describe the problem or opportunity driving this decision]

## Decision

[State the decision clearly and how it will be implemented]

## Consequences

### Positive
- [Benefits]

### Negative
- [Drawbacks and mitigation strategies]

### Trade-offs
- [What we gain vs. what we lose]

## Alternatives Considered

### Alternative 1: [Name]
- **Description**: Brief explanation
- **Pros**: What's good about it
- **Cons**: What's not good about it
- **Why rejected**: Reason

## References
- [Links to relevant resources, PRs, or issues]
```

4. **Ask the user** to fill in the Context and Decision sections if not obvious from the title.

5. **Update `docs/README.md`** if an ADR section exists, to include the new ADR.
