---
name: design-review
description: Review UI components for accessibility, visual hierarchy, and animation quality
disable-model-invocation: true
argument-hint: "[component-or-file-path]"
---

Review the component or screen at `$ARGUMENTS` for design quality.

## Review Checklist

### Accessibility (WCAG 2.1 AA)
- [ ] Text contrast ratio >= 4.5:1 (7:1 preferred)
- [ ] Touch targets >= 44x44px
- [ ] Color is not the only way meaning is conveyed
- [ ] Focus states are visible and intentional
- [ ] Semantic HTML and ARIA labels used correctly
- [ ] Keyboard navigation works throughout

### Visual Hierarchy
- [ ] Clear primary vs secondary actions
- [ ] Consistent spacing (8px grid)
- [ ] Visual grouping through proximity
- [ ] Strategic use of white space

### Animations
- [ ] Purposeful, not decorative (max 300-500ms)
- [ ] Uses `transform` and `opacity` only (GPU accelerated)
- [ ] Respects `prefers-reduced-motion`
- [ ] Spring physics for natural feel (not linear)
- [ ] Runs at 60fps (no `left`, `top`, `width`, `height` animations)

### Project Design System
Reference the established palette:
- **Backgrounds**: `#0F172A` (page), `#1E2744` (header), `#1A1F3A` (rows)
- **Accents**: `#00FF88` (neon green), `#FF006E` (magenta), `#FFB800` (yellow)
- **Text**: `#E2E8F0` (primary), `#64748B` (muted/offline)
- **Typography**: Bricolage Grotesque
- **Status indicators**: Green (online), Yellow (idle), Gray `#4B5563` (offline)

### Animation Timing Standards
| Animation | Duration | Easing |
|-----------|----------|--------|
| Hover/Tap | 200ms | spring (stiffness: 300, damping: 20) |
| Entrance | 300ms | ease-out |
| Exit | 300ms | ease-in |
| Status change | 400ms | ease-in-out |
| Pulse (online) | 1.2s | ease-in-out (loop) |
| Stagger delay | 50ms between items | - |

## Output

Provide:
1. Issues found (with severity: critical/minor)
2. Specific fix suggestions with code snippets
3. Confirmation of what passes

For deeper design context, check agent memory at `.claude/agent-memory/web-design-specialist/`.
