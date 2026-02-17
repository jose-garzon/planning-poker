# Full-Page Participant List Screens - Delivery Summary

**Date**: 2026-02-16
**Status**: Complete - 4 screens delivered in full-page context

## Overview

Created 4 full-page animated participant list screens showing different animation states within complete session interface context. Each screen is 1920x1080 and includes:

- Full background gradient (#0F172A to #1A2847)
- Header with join link and copy button
- Left panel: PARTICIPANTS section with animated participant rows
- Right panel: STORIES section (empty state)
- Animation annotation boxes with color-coded specs

## Screen Details

### 1. Pulsing Online Indicators
**Location**: x: 9491, y: 0
**Frame ID**: AnimPulse1
**Participants**: 4 online (Alex Jordan HOST, Sam Rivera, Jordan Lee, Casey Park)

**Animation Specs**:
- All green dots pulse continuously
- Scale: 1.0 → 1.2 → 1.0
- Duration: 1.2s infinite loop
- Easing: ease-in-out
- Color: #00FF88 (neon green)

**Annotation Box**: Green background (#1A2F1A) with detailed pulse timing

---

### 2. New Participant Entrance
**Location**: x: 11411, y: 0
**Frame ID**: AnimEntrance1
**Participants**: 5 total (Alex Jordan HOST, Sam Rivera, Jordan Lee, Casey Park, + Alice Chen NEW)

**Animation Specs**:
- Alice Chen highlighted with green border (2px solid #00FF88)
- Motion: translateX -100% → 0%, opacity 0 → 1
- Duration: 300ms
- Easing: ease-out
- Triggers on new participant join

**Annotation Box**: Green background (#1A2F1A) explaining entrance animation

---

### 3. Participant Exit (Fade Out)
**Location**: x: 13331, y: 0
**Frame ID**: AnimExit1
**Participants**: 4 active + 1 exiting (Alex Jordan HOST, Sam Rivera, Jordan Lee, Alice Chen, Casey Park EXITING)

**Animation Specs**:
- Casey Park at 30% opacity (fading out)
- Motion: opacity 1 → 0, translateX 0 → 20%
- Color change: Green dot (#00FF88) → Gray dot (#4B5563)
- Text dimmed: #E2E8F0 → #64748B
- Duration: 300ms
- Easing: ease-in

**Annotation Box**: Magenta background (#2F1A1A) with exit animation details

---

### 4. Status Change (Idle/Offline)
**Location**: x: 15251, y: 0
**Frame ID**: AnimStatus1
**Participants**: 5 with varied statuses

**Status Breakdown**:
- Alex Jordan (HOST): IDLE - Yellow dot (#FFB800), dimmed text (#B8BDC7)
- Sam Rivera: ONLINE - Green dot (#00FF88), bright text (#E2E8F0)
- Jordan Lee: ONLINE - Green dot, bright text
- Casey Park: OFFLINE - Gray dot (#4B5563), muted text (#64748B)
- Alice Chen: ONLINE - Green dot, bright text

**Animation Specs**:
- Transition duration: 400ms total
- Easing: ease-in-out
- Color progression: Green → Yellow → Gray (200ms per state)
- Text fading proportional to status

**Annotation Box**: Yellow background (#2F2A1A) with multi-status transition details

---

## Design System Compliance

All screens follow the established Planning Poker design system:

**Colors**:
- Page background: #0F172A
- Header background: #0F172A
- Panel headers: #1E2744
- Panel backgrounds: #1E2744
- Participant rows: #1A1F3A
- Accent green: #00FF88
- Accent magenta: #FF006E
- Gold/Yellow: #FFB800
- Gray (offline): #4B5563
- Text primary: #E2E8F0
- Text muted: #64748B

**Typography**:
- Primary font: Bricolage Grotesque
- Icon font: Inter
- Font weights: 700 (participant names), 900 (headers/labels)

**Spacing**:
- Header height: 72px
- Panel header height: 44px
- Participant row height: 44px
- Gap between panels: 20px
- Consistent padding: 12-24px based on component

**Accessibility**:
- WCAG AA contrast ratios maintained
- Color never sole indicator (opacity, text changes accompany color)
- Animation specs include prefers-reduced-motion considerations
- All text readable against backgrounds

---

## File Structure

**Main design file**: `/home/flanagan/workspace/github.com/jose-garzon/planning-poker/design.pen`

**Frame IDs for developer reference**:
1. AnimPulse1 (x: 9491)
2. AnimEntrance1 (x: 11411)
3. AnimExit1 (x: 13331)
4. AnimStatus1 (x: 15251)

**Canvas navigation**:
- Screens are arranged horizontally along X-axis
- Each screen is 1920px wide
- Spacing between screens: ~1920px
- Y-position: 0 (top of canvas)

---

## Next Steps for Implementation

1. Extract animation timing values from annotation boxes
2. Implement in React components with Framer Motion:
   - Use exact timing, easing, and color values specified
   - Test on desktop (1920x1080) and responsive breakpoints
   - Verify 60fps performance
3. Add `prefers-reduced-motion` support:
   - Disable pulse animation
   - Use instant transitions instead of slides/fades
4. Implement SSE listeners for real-time participant updates
5. Test keyboard navigation and screen reader announcements

---

## Developer Handoff Notes

**Animation implementation priorities**:
1. **Pulsing dots** (Screen 1): Continuous visual feedback for online status
2. **Entrance animation** (Screen 2): Welcoming new participants with visual emphasis
3. **Status transitions** (Screen 4): Gradual color/opacity changes for status awareness
4. **Exit animation** (Screen 3): Graceful departure feedback

**Performance considerations**:
- Use CSS transforms (translateX, scale) for GPU acceleration
- Implement will-change hints for animated properties
- Use Framer Motion's layout animations for list reordering
- Debounce rapid status changes to avoid animation stuttering

**Testing checklist**:
- [ ] Animations run at 60fps on target devices
- [ ] prefers-reduced-motion disables all animations
- [ ] Screen readers announce participant join/leave/status changes
- [ ] Color contrast meets WCAG AA in all states
- [ ] Keyboard navigation unaffected by animations
- [ ] Animations don't interfere with clicking/tapping rows

---

## Visual Reference

All screens show the participant list within the complete session interface:

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Join Link + Copy Button                            │ 72px
├──────────────────────┬──────────────────────────────────────┤
│ PARTICIPANTS (4/8)   │ STORIES (0)                          │ 44px
├──────────────────────┼──────────────────────────────────────┤
│                      │                                      │
│ [🟢] 👤 Alex Jordan │                                      │
│      HOST            │                                      │
│                      │                                      │
│ [🟢] 👤 Sam Rivera  │        No stories yet                │
│                      │                                      │
│ [🟢] 👤 Jordan Lee  │                                      │
│                      │                                      │
│ [🟢] 👤 Casey Park  │                                      │
│                      │                                      │
├──────────────────────┤                                      │
│ Animation Annotation │                                      │
│ (Color-coded box)    │                                      │
└──────────────────────┴──────────────────────────────────────┘
```

Each screen maintains this structure with varying participant states and annotation colors.
