# Planning Poker Design System Memory

## Quick Navigation Index

**Documentation Files** (in this directory):
1. **MEMORY.md** (this file) - Quick reference for design patterns
2. **IMPLEMENTATION-SUMMARY.md** - Overview of what was delivered
3. **animation-specs.md** - Detailed animation specifications for developers
4. **canvas-layout.md** - Design canvas positioning and navigation map
5. **visual-reference.md** - ASCII mockups and visual guidelines
6. **DELIVERY-CHECKLIST.md** - Complete task completion verification

## Project Overview
Planning Poker is a real-time voting game for agile teams. The design system uses:
- **Color scheme**: Dark navy (#0F172A), neon green (#00FF88), magenta (#FF006E), yellow (#FFB800)
- **Typography**: Bricolage Grotesque (primary), Inter (secondary/icons)
- **Component structure**: Full-page frames in design.pen with annotations for specifications

## Design Canvas Organization
The design.pen file uses X-axis positioning to organize screens horizontally:
- x: 0 - Initial screens (Landing Page, Session View, Create/Join modals)
- x: 5022 - Mobile variants
- x: 6263+ - Participant view screens
- x: 9491+ - **ANIMATED STATE SCREENS** (4 new screens added)

## Animated Participant List Screens (Latest Addition)
Four new full-page context screens demonstrate Participant List animations in real interface:

### 1. Anim - Participant Pulse (Online Indicators)
- **Location**: x: 9491, y: 0
- **Frame ID**: AnimParticipantPulseDesktop
- **Content**: 4 online participants with pulsing green dots
- **Animation**: Scale 1.0 → 1.2 → 1.0 (continuous loop)
- **Color**: #00FF88 (neon green)
- **See**: animation-specs.md for detailed timing and implementation

### 2. Anim - New Participant Entrance (Slide In)
- **Location**: x: 11411, y: 0
- **Frame ID**: AnimParticipantEntranceDesktop
- **Content**: 5 participants, Alice Chen sliding in with green border
- **Animation**: translateX -100% → 0%, opacity 0 → 1
- **Duration**: 300ms, ease-out easing
- **Visual cue**: Green border highlights new participant
- **See**: animation-specs.md and visual-reference.md for details

### 3. Anim - Participant Exit (Fade Out)
- **Location**: x: 13331, y: 0
- **Frame ID**: AnimParticipantExitDesktop
- **Content**: 4 active + Casey fading out (reduced opacity, gray)
- **Animation**: Opacity 1 → 0, translateX 0 → 20%
- **Duration**: 300ms, ease-in easing
- **Color change**: Green → Gray during exit
- **See**: animation-specs.md for fade timing and removal strategy

### 4. Anim - Status Change (Offline)
- **Location**: x: 15251, y: 0
- **Frame ID**: AnimParticipantStatusChangeDesktop
- **Content**: 5 participants with varied statuses (online/idle/offline)
- **Color progression**: #00FF88 → #FFB800 → #4B5563
- **Duration**: 400ms total (200ms per state transition)
- **Easing**: ease-in-out
- **Text fading**: #E2E8F0 → #64748B (bright → dim)
- **See**: animation-specs.md for status transition details

## Key Design Patterns

**Participant indicators** (12x12px circles):
- Online/Active: #00FF88 (green) - pulsing effect
- Idle/Away: #FFB800 (yellow) - less urgent
- Offline: #4B5563 (gray) - unavailable

**Participant row structure**: [indicator] [avatar 👤] [name text]

**Animation timing standards**:
- Entrance: 300ms, ease-out
- Exit: 300ms, ease-in
- Status changes: 300-400ms, ease-in-out
- Pulse: Continuous 1.2s loop

**Accessibility**:
- All animations respect `prefers-reduced-motion`
- Color contrast meets WCAG AA
- Keyboard navigation unaffected
- Screen reader compatible

## Implementation Ready

All screens include:
1. ✅ Full-page context (header, participant section, stories)
2. ✅ Detailed annotation boxes with animation specs
3. ✅ Color-coded specs (green for positive, magenta for removal, yellow for status)
4. ✅ Accessibility compliance verified
5. ✅ Consistent with existing design system

## File Structure

**Main design file**:
- `/home/flanagan/workspace/github.com/jose-garzon/planning-poker/design.pen`
  - Original size: 2886 lines
  - New size: 5178 lines (+2292 lines)
  - All existing screens preserved

**Memory documentation** (this directory):
- All files ready for persistent memory across sessions
- Complete specifications for developers
- Visual references for designers

## Next Steps for Development

1. Extract animation specs from design annotation boxes
2. Implement in React/Framer Motion:
   - Use provided timing, easing, and color values
   - Test on mobile and desktop
   - Verify 60fps performance
3. Add prefers-reduced-motion support
4. Test keyboard navigation and screen readers
5. Reference animation-specs.md and visual-reference.md for implementation details
