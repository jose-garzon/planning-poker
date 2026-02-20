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
- x: 9491+ - **ANIMATED STATE SCREENS** (4 desktop screens)
- y: 2900 row - **MOBILE-FIRST LAYOUTS** (4 screens, added 2026-02-17)
- y: 4050 row - **MOBILE STATE SCREENS** (Loading/Expired/Error, added 2026-02-17)
- y: 5290 row - **DESKTOP STATE SCREENS** (Loading/Expired/Error, added 2026-02-17)
- y: 7000 row - **VOTING UI MOBILE** (No Selection/Selected/Expiring Timer, added 2026-02-17)
- y: 8200 row - **VOTING UI DESKTOP** (No Selection/Selected/Disabled, added 2026-02-17)

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

## Mobile-First Layout Screens (Latest Addition — 2026-02-17)
Four full-page mobile screens at iPhone 14 size (390x844), dark/neon theme:

### 1. Mobile Session View (Host)
- **Location**: x: 0, y: 2900 | **Frame ID**: MobSessionHost
- Fixed #1E2744 header: session name, monospace ID, share button
- Participant list: 4 rows with status dots (green/yellow), HOST badge
- Stories section: 3 stories with status badges (VOTING NOW / PENDING)
- Bottom bar: "ADD STORY" (magenta) + "REVEAL VOTES" (neon green), 48px height

### 2. Mobile Voting View
- **Location**: x: 530, y: 2900 | **Frame ID**: MobVotingView
- Fixed header: NOW VOTING label, story title + description
- 2-column Fibonacci card grid (0,1,2,3,5,8,13,21), cards 165x88
- Selected card: #00FF88 border + glow, "SELECTED" label
- Bottom bar: vote confirmation with CHANGE option

### 3. Mobile Results View
- **Location**: x: 1060, y: 2900 | **Frame ID**: MobResultsView
- Summary card: AVG (4.2), CLOSEST (5), SPREAD (2-8) in 80x80 boxes
- Consensus indicator: yellow "discuss outliers?" prompt
- Distribution bars: green (majority), magenta, gold colored
- Individual votes: 4 rows with color-coded vote badges
- Bottom: full-width "NEXT STORY" CTA (neon green)

### 4. Mobile Join Session
- **Location**: x: 1590, y: 2900 | **Frame ID**: MobJoinView
- Centered card layout, welcoming game feel
- Joker card icon in circular #1E2744 frame
- Session name badge, name input with focus border spec
- Full-width "JOIN SESSION" CTA (neon green), accent line

## Desktop State Screens (Added 2026-02-17)
Three full-page desktop screens at 1920x1080 in a new row at y: 5290. Row title at y: 5200. Annotation boxes at y: 6400.

### 8. Desktop Loading State
- **Location**: x: 0, y: 5290 | **Frame ID**: DskLoadingView
- Centered content on dark navy: branding label, 120x120 spinner ring (#1E2744 track, #00FF88 arc, 6px stroke), poker chip emoji (44px)
- "Restoring your session..." (20px/600) + "This should only take a moment" (14px/muted)
- 3 staggered green loading dots (ellipses, 10x10, cascading opacity: 1.0 / 0.5 / 0.25)
- Animation: 1s linear infinite CSS rotation; dot stagger 150ms/dot; `prefers-reduced-motion` shows static spinner

### 9. Desktop Expired Session
- **Location**: x: 2000, y: 5290 | **Frame ID**: DskExpiredView
- Centered 480px-wide card (#1E2744, radius 16, padding 56/64)
- Hourglass icon (64x64 circular frame, emoji 30px), "This session has expired" title (28px/900)
- Last activity badge (#0F172A bg), gold accent bar (2px, #FFB800) at bottom of card
- "Create New Session" CTA (320x48, #00FF88), "Back to Home" text link (#64748B)

### 10. Desktop Error State (Toast + Fallback)
- **Location**: x: 4000, y: 5290 | **Frame ID**: DskErrorView
- Full desktop session layout with toast banner at very top
- Toast bar: full-width top, 600px toast wrap, red left border (#EF4444), warning icon, "Session Error" title, dismiss X button, auto-dismiss progress bar
- Header below toast: session name, session ID (monospace), share button (unchanged layout)
- Left panel (300px): participant list with 1 participant
- Right area: empty stories list with "No stories yet" state
- Footer: "ADD STORY" (active, magenta) + "REVEAL VOTES" (disabled, #1A1F3A bg, #64748B text)

## Mobile State Screens (Added 2026-02-17)
Three state screens at y: 4050, same 390x844 mobile frame:

### 5. Loading State
- **Location**: x: 0, y: 4050 | **Frame ID**: MobLoadingView
- Centered spinner ring (#1E2744 track, #00FF88 arc) + poker chip icon
- Staggered loading dots (3 green dots with cascading opacity)
- "Restoring your session..." / "This should only take a moment"

### 6. Expired Session
- **Location**: x: 530, y: 4050 | **Frame ID**: MobExpiredView
- Centered card: hourglass icon, "This session has expired" title
- Last activity badge, gold (#FFB800) accent line
- "Create New Session" CTA (neon green) + "Back to Home" text link

### 7. Error State (Toast + Fallback)
- **Location**: x: 1060, y: 4050 | **Frame ID**: MobErrorView
- Error toast overlaid on empty session view
- Toast: red left border (#EF4444), warning icon, dismiss X, auto-progress bar
- Session behind shows fresh/empty state (1 player, no stories)
- Disabled "REVEAL VOTES" button pattern (#1A1F3A bg, #64748B text)

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
  - Contains 4 desktop animated participant list screens (added 2026-02-16)
  - Contains 4 mobile-first layout screens (added 2026-02-17)
  - Contains 3 mobile state screens: Loading/Expired/Error (added 2026-02-17)
  - Desktop screens at 1920x1080, mobile screens at 390x844
  - Mobile row at y: 2900, spaced at x: 0, 530, 1060, 1590
  - Mobile state row at y: 4050, spaced at x: 0, 530, 1060
  - Desktop state row at y: 5290, spaced at x: 0, 2000, 4000
  - Voting UI mobile row at y: 7000, spaced at x: 0, 530, 1060
  - Voting UI desktop row at y: 8200, spaced at x: 0, 2000, 4000
  - Add Story Modal row at y: 9530, frame at x: 0 (1920x1080), annotation at x: 2000
  - All existing screens preserved

**Dev handoff**: All screens have annotation boxes. See animation-specs.md and visual-reference.md. All animations need `prefers-reduced-motion` fallbacks.
