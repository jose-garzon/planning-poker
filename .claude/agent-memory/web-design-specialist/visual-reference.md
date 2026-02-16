# Visual Reference for Participant List Animations

## Screen 1: Pulsing Dot Animation (Online Indicators)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  PARTICIPANT LIST (4 Online)                                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 👥 PARTICIPANTS                                     4/8  │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ 🟢 👤 Alex (Host)                                        │ │  ← Pulsing dot
│  │ 🟢 👤 Jordan                                             │ │  ← Pulsing dot
│  │ 🟢 👤 Sam                                                │ │  ← Pulsing dot
│  │ 🟢 👤 Casey                                              │ │  ← Pulsing dot
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ANIMATION: Each green dot (🟢) continuously pulses           │
│  Scale: 1.0 → 1.2 → 1.0 (repeating)                          │
│  Timing: Smooth, natural pulse, cubic-bezier easing          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Color**: #00FF88 (neon green)
**Size**: 12x12px circles
**Feel**: Alive, active, present

---

## Screen 2: New Participant Entrance (Slide In)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  PARTICIPANT LIST (5 Total, 1 New)                             │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 👥 PARTICIPANTS                                     5/8  │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ 🟢 👤 Alex (Host)                                        │ │
│  │ 🟢 👤 Jordan                                             │ │
│  │ 🟢 👤 Sam                                                │ │
│  │ 🟢 👤 Casey                                              │ │
│  │ ┌──────────────────────────────────────────────────────┐ │  ← NEW!
│  │ │ 🟢 👤 Alice Chen                    ║ (green border) │ │  ← Sliding in
│  │ └──────────────────────────────────────────────────────┘ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ANIMATION: Alice Chen slides in from left                    │
│  Start:  x = -100%, opacity = 0 (off-screen)                 │
│  End:    x = 0%, opacity = 1 (in-view)                       │
│  Effect: Green border + bright text highlights new arrival    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**New participant styling**:
- Green border (#00FF88) around row
- Green text (#00FF88) for name
- Light background (#1A3A2A)
- Draws all eyes to the entrance

**Animation**: 300ms slide-in, ease-out easing creates snappy feel

---

## Screen 3: Participant Exit (Fade Out)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  PARTICIPANT LIST (4 Active, 1 Exiting)                        │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 👥 PARTICIPANTS                                     4/8  │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ 🟢 👤 Alex (Host)                                        │ │
│  │ 🟢 👤 Jordan                                             │ │
│  │ 🟢 👤 Sam                                                │ │
│  │ 🟢 👤 Casey                                              │ │
│  │                                                           │ │
│  │ ░░ 👤 (exiting...) opacity: 30%                  ✕      │ │  ← Fading out
│  │                                                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ANIMATION: Casey fades out and slides right                  │
│  Start:  x = 0%, opacity = 1, indicator = green              │
│  End:    x = 20%, opacity = 0, indicator = gray              │
│  Effect: Gradual disappearance signals departure              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Exiting participant styling**:
- Opacity reduced to 30%
- Indicator turns gray (#4B5563)
- Text turns gray (#64748B)
- Slight rightward slide creates exit metaphor

**Animation**: 300ms fade-out, ease-in easing for graceful departure
**Afterward**: Participant removed from list entirely

---

## Screen 4: Status Change Animation (Online → Idle → Offline)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  PARTICIPANT LIST (Multiple Status Transitions)                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 👥 PARTICIPANTS                                     5/8  │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ 🟢 👤 Alex (Host)          ← Online (active)            │ │
│  │ 🟢 👤 Jordan               ← Online (active)            │ │
│  │ 🟢 👤 Sam                  ← Online (active)            │ │
│  │ 🟡 👤 Casey                ← Idle (away, transitioning) │ │
│  │ ⚪ 👤 Alice Chen             ← Offline (disconnected)    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  COLOR PROGRESSION (Alice Chen example):                       │
│  🟢 #00FF88 (Online)                                           │
│  → 🟡 #FFB800 (Idle - 200ms)                                  │
│  → ⚪ #4B5563 (Offline - 400ms total)                          │
│                                                                │
│  TEXT FADE (Alice Chen name):                                  │
│  #E2E8F0 (bright white) → #64748B (dim gray) over 400ms       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Status indicator colors**:
- Green (#00FF88): Online, present, voting
- Yellow (#FFB800): Idle, away briefly, can return
- Gray (#4B5563): Offline, disconnected, unavailable

**Name text colors**:
- Bright (#E2E8F0): For online participants
- Dim gray (#64748B): For offline participants

**Animation**: 400ms total
- 0-200ms: Green → Yellow (idle state)
- 200-400ms: Yellow → Gray + text fade (offline state)
- Easing: ease-in-out for smooth transitions

---

## Color Legend

| Color | Hex | Usage | Meaning |
|-------|-----|-------|---------|
| Neon Green | #00FF88 | Active indicator dot, online status | Online & Active |
| Bright Text | #E2E8F0 | Participant names (online) | Ready to participate |
| Yellow/Gold | #FFB800 | Idle indicator dot | Temporarily away |
| Dark Gray | #4B5563 | Offline indicator dot | Disconnected |
| Dim Text | #64748B | Participant names (offline) | Not available |
| Row Background | #0F172A | Normal participant rows | Standard state |
| Border Green | #00FF88 | New participant row border | Just joined |

---

## Animation Timing Reference

| Animation | Duration | Easing | Effect |
|-----------|----------|--------|--------|
| Pulse | 1.2s loop | ease-in-out | Natural, breathing feel |
| Entrance | 300ms | ease-out | Snappy arrival |
| Exit | 300ms | ease-in | Smooth departure |
| Status Change | 400ms | ease-in-out | Gradual transition |

---

## Interaction Principles

1. **Entrance (Alice Chen joins)**
   - Should feel energetic and welcoming
   - Green accent draws attention positively
   - Slide animation suggests movement into view

2. **Exit (Casey leaves)**
   - Should feel gentle, not jarring
   - Fade prevents harsh removal
   - Slide right creates "leaving" metaphor

3. **Status Pulse (online)**
   - Continuous gentle pulse shows presence
   - Not too fast (would be distracting)
   - Not too slow (would feel dead)

4. **Status Change (offline)**
   - Clear visual downgrade
   - Color progression prepares users
   - Text fade reinforces unavailability

---

## Implementation Checklist for Developers

- [ ] Create animation keyframes for each state
- [ ] Implement pulse as infinite loop
- [ ] Entrance animation triggers on participant add
- [ ] Exit animation triggers before DOM removal
- [ ] Status transitions use color interpolation
- [ ] All animations respect prefers-reduced-motion
- [ ] Animations run at 60fps (profile with DevTools)
- [ ] Mobile animations match desktop timing
- [ ] Keyboard navigation unaffected by animations
- [ ] Screen reader announcements still work during animation

