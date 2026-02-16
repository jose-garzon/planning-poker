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

## How to Extend

To add mobile animated variants:
1. Create new frame at Y-offset 812 or below (mobile height)
2. Width: 375px (instead of 1920px)
3. Adjust participant row heights to 36px
4. Position X-axis at matching positions + offset for mobile column
5. Scale down fonts proportionally

Example mobile positions:
- Mobile Pulse: 9491, 812
- Mobile Entrance: 11411, 812
- Mobile Exit: 13331, 812
- Mobile Status: 15251, 812

