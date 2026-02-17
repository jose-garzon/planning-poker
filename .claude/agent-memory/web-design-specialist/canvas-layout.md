# Design Canvas Layout Map

## Overview
The design.pen file organizes screens horizontally across the X-axis. Below is the spatial arrangement:

```
X-AXIS POSITION MAP (1920px wide frames)
═══════════════════════════════════════════════════════════════════════════════

0px
├─ Landing Page Desktop (1920x1080)
│  ID: SZm6E
│  The main entry point with "PLANNING POKER" title

0px (offset below)
├─ Create Session Modal Desktop (1920x1080)
│  ID: 2Kqiu
│  Modal overlay for session creation

5022px
├─ Landing Page Mobile (375x812)
│  ID: qoUVL
│  Mobile variant of landing page

5022px (offset)
├─ Create Session Modal Mobile (375x812)
│  ID: bnV75
│  Mobile variant of modal

6263px
├─ Session View Desktop (1920x1080)
│  ID: Host1Desktop
│  Host's view with participant list, stories, actions

8269px
├─ Session View Mobile (375x812)
│  ID: AB8SI
│  Mobile participant view

3035px (Y-offset: 1442)
├─ Join Page Desktop (1920x1080)
│  ID: JoinPageDesktop
│  Participant join screen

5022px (Y-offset: 1442)
├─ Join Page Mobile (375x812)
│  ID: JoinPageMobile
│  Mobile join screen

5022px (Y-offset: 812)
├─ Error Page Mobile (375x812)
│  ID: ErrorPageMobile
│  Session not found error

6263px (Y-offset: 1442)
├─ Session View - Participant Desktop (1920x1080)
│  ID: SessionParticipantDesktop
│  Participant's view (not host)

11411px (NEW ANIMATED STATE SCREENS)

9491px ⭐ NEW
├─ Anim - Participant Pulse (Online Indicators) (1920x1080)
│  ID: AnimParticipantPulseDesktop
│  Shows online status with pulsing green indicators
│  Full page context with header, participant list, annotation

11411px ⭐ NEW
├─ Anim - New Participant Entrance (Slide In) (1920x1080)
│  ID: AnimParticipantEntranceDesktop
│  Shows Alice Chen sliding into participant list
│  Green border highlight + annotation showing animation spec

13331px ⭐ NEW
├─ Anim - Participant Exit (Fade Out) (1920x1080)
│  ID: AnimParticipantExitDesktop
│  Shows Casey fading out (reduced opacity, gray indicator)
│  Full context with annotation for fade-out specs

15251px ⭐ NEW
├─ Anim - Status Change (Offline) (1920x1080)
│  ID: AnimParticipantStatusChangeDesktop
│  Shows Alice Chen transitioning to offline state
│  Indicator color changes: green → yellow → gray
```

## Quick Navigation

**Click positions to jump to:**
- Landing: 0, 0
- Session (Host): 6263, 0
- Session (Participant): 6263, 1442
- **Animations Start**: 9491, 0
- **Mobile Layouts**: 0, 2900
- **Mobile State Screens**: 0, 4050
- **Desktop State Screens**: 0, 5290

## New Animated State Screens Details

All four new screens follow the same structure:

```
┌─────────────────────────────────────────┐
│ Header (with join link + copy button)   │ 72px
├─────────────────────────────────────────┤
│                                         │
│  Participant List Section:              │
│  ┌─────────────────────────────────────┐│
│  │ PARTICIPANTS Header (4/8 or 5/8)    ││ 44px
│  ├─────────────────────────────────────┤│
│  │ [🟢] [👤] Alex (Host)               ││
│  │ [🟢] [👤] Jordan                    ││
│  │ [🟢] [👤] Sam                       ││
│  │ [🟢] [👤] Casey                     ││
│  │ [🟢] [👤] Alice Chen (if entrance)  ││ (varying)
│  └─────────────────────────────────────┘│
│                                         │
│  Animation Annotation Box:              │
│  ┌─────────────────────────────────────┐│
│  │ Animation Label (color-coded)       ││
│  │ Animation Spec Description 1        ││
│  │ Animation Spec Description 2        ││
│  └─────────────────────────────────────┘│
│                                         │
├─────────────────────────────────────────┤
│ Stories Section (empty)                 │
└─────────────────────────────────────────┘
```

## Screen IDs for Reference

### Animated Screens
1. **AnimParticipantPulseDesktop** (9491, 0)
   - 4 participants with pulsing indicators
   - Green annotation: "Pulsing dot animation"

2. **AnimParticipantEntranceDesktop** (11411, 0)
   - 5 participants, Alice Chen highlighted with green border
   - Green annotation: "New participant entrance animation"

3. **AnimParticipantExitDesktop** (13331, 0)
   - 4 participants + 1 fading out (Casey at reduced opacity)
   - Magenta annotation: "Participant exit animation"

4. **AnimParticipantStatusChangeDesktop** (15251, 0)
   - 5 participants, Alice transitioning offline
   - Yellow indicator on Alice, gray text
   - Yellow annotation: "Status change animation"

## Mobile-First Layout Screens (Y: 2900 Row) -- Added 2026-02-17

```
Y: 2900 ROW — MOBILE-FIRST LAYOUTS (iPhone 14 — 390x844)
═══════════════════════════════════════════════════════════

x:0        x:530      x:1060     x:1590
├──────┐   ├──────┐   ├──────┐   ├──────┐
│      │   │      │   │      │   │      │
│ Sess │   │ Vote │   │ Rslts│   │ Join │
│ Host │   │      │   │      │   │      │
│      │   │      │   │      │   │      │
│ 390  │   │ 390  │   │ 390  │   │ 390  │
│ x844 │   │ x844 │   │ x844 │   │ x844 │
│      │   │      │   │      │   │      │
├──────┘   ├──────┘   ├──────┘   ├──────┘
│ Annot│   │ Annot│   │ Annot│   │ Annot│
└──────┘   └──────┘   └──────┘   └──────┘
```

### Screen IDs
1. **MobSessionHost** (0, 2900) — Host session view with participants + stories
2. **MobVotingView** (530, 2900) — Fibonacci card grid, 2-col, selected state
3. **MobResultsView** (1060, 2900) — Results summary, distribution, individual votes
4. **MobJoinView** (1590, 2900) — Join session with name input

Each screen has:
- Label text at y: 2860 (above frame)
- Annotation box at y: 3770 (below frame) with animation specs

### Mobile Layout Principles Applied
- All content single-column vertical stack
- Touch targets: 44-48px minimum height
- Voting cards: 165x88px (2-col grid)
- 20px page padding, 16px section gaps
- Fixed headers, bottom CTAs in thumb zone
- Status dots: 10x10px (larger than desktop 8x8)

## Mobile State Screens (Y: 4050 Row) -- Added 2026-02-17

```
Y: 4050 ROW — STATES: LOADING / EXPIRED / ERROR (390x844)
══════════════════════════════════════════════════════════

x:0        x:530      x:1060
├──────┐   ├──────┐   ├──────┐
│      │   │      │   │Toast │
│ Load │   │ Exp  │   │──────│
│  ing │   │ ired │   │Empty │
│      │   │      │   │Sessn │
│ 390  │   │ 390  │   │ 390  │
│ x844 │   │ x844 │   │ x844 │
│      │   │      │   │      │
├──────┘   ├──────┘   ├──────┘
│ Annot│   │ Annot│   │ Annot│
└──────┘   └──────┘   └──────┘
```

### Screen IDs
5. **MobLoadingView** (0, 4050) — Centered spinner + loading text
6. **MobExpiredView** (530, 4050) — Hourglass icon, expired message, CTA
7. **MobErrorView** (1060, 4050) — Error toast over empty session fallback

Each screen has:
- Row title at y: 3960 (magenta, "STATES: LOADING / EXPIRED / ERROR")
- Label text at y: 4010 (above frame)
- Annotation box at y: 4920 (below frame) with animation specs

### State Screen Design Patterns
- Loading: minimal centered content, spinner + staggered dots
- Expired: card layout (matches Join Session pattern), gold accent
- Error: toast overlay pattern with red severity indicator (#EF4444)
- Disabled button pattern: #1A1F3A bg + #64748B text (non-interactive)
- All include prefers-reduced-motion fallback notes

## Desktop State Screens (Y: 5290 Row) -- Added 2026-02-17

```
Y: 5290 ROW — DESKTOP STATES: LOADING / EXPIRED / ERROR (1920x1080)
══════════════════════════════════════════════════════════════════════

x:0                    x:2000                 x:4000
├────────────────────┐ ├────────────────────┐ ├────────────────────┐
│                    │ │                    │ │ Toast Banner        │
│   [Spinner Ring]   │ │   [Hourglass Ico]  │ │────────────────────│
│                    │ │                    │ │ Header              │
│ Restoring your     │ │ This session has   │ │────────────────────│
│ session...         │ │ expired            │ │ Left│ Right         │
│                    │ │                    │ │ Part│ (empty)       │
│ [dot dot dot]      │ │ [Create New Sess]  │ │     │               │
│ 1920x1080          │ │ Back to Home       │ │ 1920x1080          │
│                    │ │ 1920x1080          │ │                    │
├────────────────────┘ ├────────────────────┘ ├────────────────────┘
│ Annotation (640px) │ │ Annotation (640px) │ │ Annotation (640px) │
└────────────────────┘ └────────────────────┘ └────────────────────┘
```

### Screen IDs
8. **DskLoadingView** (0, 5290) — Centered spinner ring + branding + staggered dots
9. **DskExpiredView** (2000, 5290) — Centered card: hourglass, expired message, CTA
10. **DskErrorView** (4000, 5290) — Full session layout with error toast at top

Each desktop state screen has:
- Row title "DESKTOP STATES: LOADING / EXPIRED / ERROR (1920x1080)" at y: 5200 (magenta)
- Label text at y: 5250 (green, above frame)
- Frame at y: 5290 (1920x1080)
- Annotation box at y: 6400 (640px wide, below frame)

### Desktop State Design Specifics
- **DskLoadingView**: Full-bleed gradient bg (0F172A → 1A2847), spinner 120x120 (6px stroke), 3 dots at 10x10, justifyContent: center
- **DskExpiredView**: 480px centered card (#1E2744), padding 56/64, gold accent bar at bottom (2px #FFB800)
- **DskErrorView**: Toast banner spans full width at top, 600px toast inner wrap, session layout beneath unchanged; footer disabled reveal btn uses #1A1F3A bg + #64748B text
- All: Framer Motion spring (stiff:300 damp:20) for entrances, prefers-reduced-motion shows static content

