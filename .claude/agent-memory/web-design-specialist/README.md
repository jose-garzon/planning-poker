# Web Design Specialist - Agent Memory

This directory contains persistent design documentation for the Planning Poker project across Claude Code sessions.

## Files Overview

### Core Reference
- **MEMORY.md** - Quick reference guide for design patterns and latest additions (loaded in system prompt)

### Documentation
- **IMPLEMENTATION-SUMMARY.md** - Complete overview of the 4 new animated state screens
- **animation-specs.md** - Detailed technical specifications for each animation with timing and easing
- **visual-reference.md** - ASCII mockups, color legends, and interaction principles
- **canvas-layout.md** - Design canvas positioning map and navigation guide
- **DELIVERY-CHECKLIST.md** - Task completion verification and quality assurance

### This File
- **README.md** - This file, explaining the memory structure

## What Was Accomplished

Added 4 new full-page design screens to `/home/flanagan/workspace/github.com/jose-garzon/planning-poker/design.pen` demonstrating Participant List animations:

1. **Pulsing Dot Animation** - Online status indicators with continuous pulse
2. **New Participant Entrance** - Alice Chen sliding in from left with green highlight
3. **Participant Exit** - Casey fading out and sliding right
4. **Status Change** - Transitions from online (green) → idle (yellow) → offline (gray)

All screens show animations in full page context (header, participant list, stories section) with detailed annotation boxes.

## Key Information

**Design Canvas Positions:**
- Animation screens start at x: 9491
- Positioned sequentially every ~1920px (screen width)
- All screens at y: 0 (desktop breakpoint)
- Mobile variants can be added at y: 812

**Color System:**
- Online: #00FF88 (neon green)
- Idle: #FFB800 (yellow)
- Offline: #4B5563 (dark gray)
- Background: #0F172A (dark navy)

**Animation Timing:**
- Pulse: 1.2s continuous loop
- Entrance: 300ms ease-out
- Exit: 300ms ease-in
- Status change: 400ms ease-in-out

## How to Use These Files

### For Designers
1. Read **visual-reference.md** for ASCII mockups and color legends
2. Reference **canvas-layout.md** to navigate the design file
3. Check **IMPLEMENTATION-SUMMARY.md** for design decisions

### For Developers
1. Start with **animation-specs.md** for technical implementation details
2. Reference specific timing and easing values
3. Use **MEMORY.md** for quick lookups
4. Cross-reference **DELIVERY-CHECKLIST.md** to verify completeness

### For Project Managers
1. Check **IMPLEMENTATION-SUMMARY.md** for scope
2. Review **DELIVERY-CHECKLIST.md** for completion status
3. Reference **canvas-layout.md** for canvas organization

## File Locations

**Design file:**
```
/home/flanagan/workspace/github.com/jose-garzon/planning-poker/design.pen
```

**Memory directory:**
```
/home/flanagan/workspace/github.com/jose-garzon/planning-poker/.claude/agent-memory/web-design-specialist/
```

**Individual files:**
- MEMORY.md (system prompt included)
- IMPLEMENTATION-SUMMARY.md
- animation-specs.md
- visual-reference.md
- canvas-layout.md
- DELIVERY-CHECKLIST.md
- README.md (this file)

## Updating This Memory

When making changes to the design or animations:

1. Update **MEMORY.md** with any new patterns discovered
2. Add detailed specs to **animation-specs.md** if timing changes
3. Update **visual-reference.md** if colors or layouts change
4. Keep **IMPLEMENTATION-SUMMARY.md** as the source of truth
5. Update **DELIVERY-CHECKLIST.md** if requirements change

## Integration with Project

These files support development of the Planning Poker real-time voting interface. They document:
- Animation behavior for multiplayer participant joining/leaving
- Status indicators (online/idle/offline)
- Real-time UI responsiveness patterns
- Accessibility-first animation design

All animations are built to:
- Respect prefers-reduced-motion
- Run at 60fps on desktop and mobile
- Support keyboard navigation
- Maintain WCAG AA contrast standards

## Questions or Updates?

Refer to CLAUDE.md in the project root for overall architecture and coding standards. This memory is specific to design system implementation for the Participant List component.

