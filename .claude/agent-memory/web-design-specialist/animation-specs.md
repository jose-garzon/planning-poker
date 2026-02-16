# Participant List Animation Specifications

## Online Indicator Pulse Animation

**State**: Participant is active and online
**Element**: 12x12px green circle indicator
**Animation**: Continuous pulse
- Initial state: scale 1.0, opacity 1.0
- Keyframes: 1.0 → 1.2 → 1.0
- Duration: 1.2s (continuous loop)
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Color: #00FF88 (neon green)

**Implementation Note**: Use CSS keyframes with infinite animation, or Framer Motion `whileInView` with repeat infinity.

---

## New Participant Entrance Animation

**State**: Participant just joined the session
**Elements**:
- Participant row container
- Indicator dot
- Avatar emoji
- Name text
- Border highlight (green accent)

**Animation**: Slide in from left with fade
- Transform: translateX(-100%) → 0%
- Opacity: 0 → 1
- Duration: 300ms
- Easing: cubic-bezier(0.34, 1.56, 0.64, 1) [ease-out]
- Stagger: 50ms between each new participant

**Visual cue**: Green border (#00FF88) with 2px thickness frames the new row

**Implementation Note**: Container uses `overflow: hidden` for clean slide, border color same as indicator. Apply transform to row container.

---

## Participant Exit Animation

**State**: Participant left/disconnected from session
**Elements**:
- Entire participant row
- All child elements

**Animation**: Fade out + slide right
- Transform: translateX(0) → translateX(20%)
- Opacity: 1 → 0
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 1, 1) [ease-in]
- Height collapse: After animation completes, remove from DOM

**Visual state during animation**: Row becomes semi-transparent (0.3 opacity in static preview)

**Implementation Note**: After animation, row can be removed or kept with reduced opacity depending on UX preference. Consider stagger if multiple participants exit.

---

## Status Change Animation (Online → Idle → Offline)

**State**: Participant status transitions
**Element**: Indicator dot (12x12px circle)
**Transitions**:
1. Online → Idle: #00FF88 → #FFB800 (200ms)
2. Idle → Offline: #FFB800 → #4B5563 (200ms)

**Name text fade** (occurs during offline transition):
- Color: #E2E8F0 → #64748B
- Duration: 400ms total
- Opacity: Stays 1.0

**Easing**: cubic-bezier(0.42, 0, 0.58, 1) [ease-in-out]

**Color codes**:
- Online (active): #00FF88
- Idle (away): #FFB800
- Offline (disconnected): #4B5563 (gray)

**Implementation Note**: All transitions include the indicator dot and text color changes. Indicator animates faster than text to create visual hierarchy.

---

## Accessibility Considerations

All animations must:
1. Respect `prefers-reduced-motion` media query
   - Reduce duration to 0ms or 100ms
   - Remove scale/transform complexity
   - Show final state immediately

2. Include focus states for keyboard navigation
   - Participant row: focus outline 2px solid #00FF88
   - Maintain 4.5:1 contrast for text

3. Maintain semantic meaning without animation
   - Green indicator = online (also supported by position and text)
   - Gray indicator = offline (clearly visible)
   - Yellow indicator = idle (distinct color)

---

## Performance Notes

- GPU acceleration: Use `transform` and `opacity` only (not `width`, `height`, `left`, `top`)
- Frame rate: Target 60fps on all animations
- Mobile: Same animations at same durations
- Stagger timing: 50ms between items in lists for smooth sequential entrance

---

## Testing Checklist

- [ ] Pulse animation runs smoothly at 60fps
- [ ] Entry animation feels responsive (not sluggish)
- [ ] Exit animation doesn't feel abrupt
- [ ] Status changes are clearly visible
- [ ] Animations work in Chrome, Firefox, Safari, Edge
- [ ] Mobile animations match desktop timing
- [ ] prefers-reduced-motion disables animations
- [ ] Keyboard navigation unaffected
- [ ] Color contrast maintained in all states

