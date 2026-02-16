---
name: new-feature-spec
description: Create a feature specification document for a new feature
disable-model-invocation: true
argument-hint: "[feature-name]"
---

Create a feature specification for: **$ARGUMENTS**

Use the `product-owner` agent mindset: ask clarifying questions before writing if requirements are unclear.

## Steps

1. **Ask clarifying questions** about the feature if needed:
   - What problem does it solve? Who benefits?
   - What's in scope vs. out of scope?
   - Any technical constraints or dependencies?
   - How will we know it's successful?

2. **Create the spec file** at `specs/$ARGUMENTS.md` (kebab-case).

3. **Use this structure**:

```markdown
# Feature: [Feature Name]

**Status**: Draft
**Created**: !`date +%Y-%m-%d`
**Owner**: [Ask user]

## Overview
Brief description (2-3 sentences): what, who, why.

## User Stories
1. **As a** [user type], **I want** [goal], **so that** [benefit]

## Requirements

### Functional
- [ ] Requirement 1
- [ ] Requirement 2

### Non-Functional
- [ ] Performance: [specific metric]
- [ ] Accessibility: [specific requirement]

## Technical Design

### Module Structure
Where this feature lives in the vertical slice architecture:
```
modules/[module-name]/
  components/
  hooks/
  services/
  types/
```

### API Endpoints (if applicable)
- `METHOD /api/path` - Description

### Data Model (if applicable)
Types and interfaces needed.

## Implementation Plan
- [ ] Phase 1: Types and data model
- [ ] Phase 2: Service layer and API
- [ ] Phase 3: UI components
- [ ] Phase 4: Tests

## Testing Plan
- Unit tests for: [business logic]
- E2E tests for: [critical user flows]

## Out of Scope
- What we're NOT building

## Open Questions
- [ ] Unresolved decisions
```

4. **Create GitHub issues** for each phase of the implementation plan using the `product-owner` agent if the user wants tracked work items.
