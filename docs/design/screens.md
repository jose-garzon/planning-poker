# Planning Poker — UI Screen Specifications

> **Purpose**: Complete developer reference for implementing every screen in the Planning Poker UI. This document replaces the need to open the design file. All values are extracted directly from `design.pen` (Pencil format v2.8).

---

## Design System Reference

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-page` | `#0F172A` | Page background, deep navy |
| `bg-header` | `#1E2744` | Header panels, section headers |
| `bg-row` | `#1A1F3A` | Participant rows, card rows |
| `bg-card` | `#0F172A` | Modal/card surfaces |
| `accent-green` | `#00FF88` | Primary CTA, online status, success |
| `accent-magenta` | `#FF006E` | Secondary CTA, HOST badge, alerts |
| `accent-gold` | `#FFB800` | Idle status, warnings, accents |
| `text-primary` | `#E2E8F0` | Primary text on dark backgrounds |
| `text-muted` | `#64748B` | Placeholders, secondary info, offline |
| `text-dim` | `#94A3B8` | Descriptions, subtitles |
| `text-white` | `#FFFFFF` | Text on colored badges |
| `status-online` | `#00FF88` | Online indicator dot |
| `status-idle` | `#FFB800` | Idle indicator dot |
| `status-offline` | `#4B5563` | Offline indicator dot |
| `error-red` | `#EF4444` | Error toast border, critical states |
| `bg-gradient` | `linear-gradient(180deg, #0F172A 0%, #1A2847 100%)` | Full-bleed background |
| `overlay` | `rgba(15, 23, 42, 0.85)` | Modal dimmed overlay |
| `selected-card-glow` | `#1A3A2A` | Background of selected/new-entry rows |
| `disabled-btn-bg` | `#1A1F3A` | Disabled button background |
| `disabled-btn-text` | `#64748B` | Disabled button text |

### Typography

**Font family**: `Bricolage Grotesque` (primary for all UI text)
**Font family**: `Inter` (icons and emoji elements only)

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Hero title | 84px | 900 | Landing page "PLANNING" |
| Hero subtitle | 80px | 900 | Landing page "POKER" |
| Modal title | 32px | 900 | Create/Join modal titles |
| Section heading | 28px | 900 | Expired screen card title |
| Body large | 20px | 900 | CTA button text (desktop) |
| Body medium | 14px | 700 | Link URLs, placeholder text, footer status |
| Section label | 13px | 900 | "PARTICIPANTS", "STORIES" headers |
| Name text | 13–14px | 700 | Participant names in full views |
| Name text (list) | 12px | 800 | Participant names in sidebar list |
| Count/badge | 14px | 900 | Participant counts, story counts |
| Helper text | 10–12px | 600–800 | Input labels, constraints |
| Annotation | 9–10px | normal | Design-only notes |

### Spacing System (8px grid)

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Badge padding vertical |
| sm | 8px | Badge padding horizontal, icon-text gaps |
| md | 12px | Row padding, section gaps |
| lg | 16px | Content padding, list gaps |
| xl | 20px | Content area padding |
| 2xl | 24px | Header padding horizontal |
| 3xl | 32px | Modal section gaps |
| 4xl | 48px | Large modal padding |
| 5xl | 56px | Modal content padding |
| 6xl | 64px | CTA button height (desktop) |

### Animation System

| Interaction | Duration | Easing | Effect |
|-------------|----------|--------|--------|
| Hover / tap feedback | 200ms | spring (stiffness 300, damping 20) | Bouncy, snappy |
| Card selection | 200ms | spring | Satisfying pop |
| Participant entrance | 300ms | ease-out `cubic-bezier(0.34, 1.56, 0.64, 1)` | Energetic slide-in |
| Participant exit | 300ms | ease-in `cubic-bezier(0.4, 0, 1, 1)` | Smooth departure |
| Status change | 400ms | ease-in-out `cubic-bezier(0.42, 0, 0.58, 1)` | Gradual color shift |
| Online pulse | 1.2s loop | `cubic-bezier(0.4, 0, 0.2, 1)` | Breathing alive feel |
| Vote reveal | 500ms | spring + 50ms stagger per card | Dramatic reveal |
| Celebration | 800ms | spring (bouncy) | Rewarding burst |
| Spinner rotation | 1s | linear infinite | Loading state |
| Loading dot stagger | 150ms per dot | ease-in-out | Cascading pulse |

```ts
// Framer Motion — Participant Entrance
initial={{ x: '-100%', opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}

// Framer Motion — Participant Exit
animate={{ x: '20%', opacity: 0 }}
transition={{ duration: 0.3, ease: [0.4, 0, 1, 1] }}
// Then remove from DOM after animation completes

// Framer Motion — Online Pulse
animate={{ scale: [1, 1.2, 1], opacity: [1, 1, 1] }}
transition={{ duration: 1.2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}

// Framer Motion — Status Color Change (indicator dot)
animate={{ backgroundColor: targetColor }}
transition={{ duration: 0.4, ease: [0.42, 0, 0.58, 1] }}

// CSS — Loading Spinner
@keyframes spin { to { transform: rotate(360deg); } }
animation: spin 1s linear infinite;

// Framer Motion — Loading Dots Stagger
// Dot 1: delay 0ms,   opacity loop 1.0 → 0.3 → 1.0
// Dot 2: delay 150ms, opacity loop 1.0 → 0.3 → 1.0
// Dot 3: delay 300ms, opacity loop 1.0 → 0.3 → 1.0
```

**Accessibility**: All animations must check `prefers-reduced-motion`. When matched, set duration to 0ms or skip to final state immediately. Color alone is never the sole indicator — text labels and position also carry meaning.

---

## Canvas Organization

The design canvas is a flat JSON structure. Screens are positioned along the X and Y axes:

```
Y:0 row    — Landing, Modals, Session Host/Participant (desktop + mobile), Join, Error pages, Animated participant screens
Y:2900 row — Mobile-first layouts (Session Host, Voting, Results, Join)
Y:4050 row — Mobile state screens (Loading, Expired, Error)
Y:5290 row — Desktop state screens (Loading, Expired, Error)
Y:7080 row — Voting UI mobile (No Selection, Selected, Expiring Timer)
Y:8280 row — Voting UI desktop (No Selection, Selected, Disabled/Revealing)
```

---

## Section 1 — Landing Page

### 1.1 Landing Page Desktop

**Frame ID**: `SZm6E`
**Canvas position**: x: 0, y: 0
**Frame size**: 1920 × 1080px
**Frame fill**: `#0F172A`
**Layout**: vertical, justifyContent: center, alignItems: center

#### Background Layer
- Full-bleed child frame: `fill_container` × `fill_container`
- Fill: `linear-gradient(180deg, #0F172A 0%, #1A2847 100%)`
- Renders behind all other children (absolute-positioned or z-index 0)

#### Menu Panel
- Width: 800px, fill: `#0F172A`, cornerRadius: 4
- Layout: vertical, gap: 32px, padding: [64px, 96px] (top/bottom, left/right)
- alignItems: center

**Title Section** (inside menuPanel):
- Width: fill_container
- Layout: vertical, gap: 16px, padding: [0, 0, 32, 0] (bottom only)
- alignItems: center

| Element | Content | Font size | Weight | Color |
|---------|---------|-----------|--------|-------|
| `mainTitle` | "PLANNING" | 84px | 900 | `#00FF88` |
| `subTitle` | "POKER" | 80px | 900 | `#FF006E` |

**Tagline**:
- Content: `"▶ Real-Time • Team Sync • Smooth Animations ◀"`
- Font: 14px / 700 / `#00FF88`, textAlign: center

**CTA Button** (`ctaBtn`):
- Width: fill_container, height: 72px
- Fill: `#FF006E`, cornerRadius: 4
- Layout: vertical, padding: [20, 64], justifyContent: center, alignItems: center
- Text: `"[ CREATE SESSION ]"`, 22px / 900 / `#0F172A`

**Stats Container** (3 columns, horizontal row):
- Width: fill_container, gap: 16px
- Each stat box: fill `#1E2744`, cornerRadius 4, padding [16, 20], layout vertical, gap 8, alignItems center

| Stat | Label | Label color | Label size | Value | Value size |
|------|-------|-------------|------------|-------|------------|
| Players | "PLAYERS" | `#00FF88` | 11px/800 | "0/8" | 28px/900/`#E2E8F0` |
| Stories | "STORIES" | `#FF006E` | 11px/800 | "0" | 28px/900/`#E2E8F0` |
| Votes | "VOTES" | `#64748B` | 11px/800 | "0" | 28px/900/`#E2E8F0` |

---

### 1.2 Landing Page Mobile

**Frame ID**: `xVZ8g` (name: "Landing Page Mobile")
**Canvas position**: x: 2000, y: 0
**Frame size**: 375 × 812px
**Frame fill**: `#0F172A`
**Layout**: vertical, justifyContent: center, alignItems: center

#### Menu Panel Mobile (`menuPanelMobile`)
- Width: fill_container, fill: `#0F172A`, cornerRadius: 4
- Layout: vertical, gap: 32px, padding: [60, 28], alignItems: center

| Element | Content | Font size | Weight | Color |
|---------|---------|-----------|--------|-------|
| `mainTitleMobile` | "PLANNING" | 64px | 900 | `#00FF88` |
| `subTitleMobile` | "POKER" | 56px | 900 | `#FF006E` |
| `taglineTextMobile` | "Real-Time Voting\nSmooth Play" | 15px | 700 | `#00FF88` |

Title section: layout vertical, gap 12, padding [0, 0, 28, 0], alignItems center

**CTA Button Mobile** (`ctaBtnMobile`):
- Width: fill_container, height: 64px
- Fill: `#FF006E`, cornerRadius: 4
- padding: [18, 40], justifyContent: center, alignItems: center
- Text: `"[ START ]"`, 20px / 900 / `#0F172A`

**Stats Container Mobile** (vertical stack):
- Width: fill_container, layout: vertical, gap: 10px
- Each stat row: height 48px, fill `#1E2744`, cornerRadius 4, padding [14, 20], gap 14, alignItems center
- Label on left, value on right (`textAlign: right`)

| Stat | Label | Label color | Label size | Value size |
|------|-------|-------------|------------|------------|
| Players | "PLAYERS" | `#00FF88` | 12px/800 | 20px/900/`#E2E8F0` |
| Stories | "STORIES" | `#FF006E` | 12px/800 | 20px/900/`#E2E8F0` |
| Votes | "VOTES" | `#64748B` | 12px/800 | 20px/900/`#E2E8F0` |

---

## Section 2 — Create Session Modal

### 2.1 Create Session Modal Desktop

**Frame ID**: `N0dWH`
**Canvas position**: x: 3022, y: 0
**Frame size**: 1920 × 1080px
**Frame fill**: `#0F172A`
**Layout**: vertical, justifyContent: center, alignItems: center

#### Layers (bottom to top):
1. **Background gradient**: full-bleed, `linear-gradient(180deg, #0F172A 0%, #1A2847 100%)`
2. **Dimmed overlay**: full-bleed, fill `rgba(15, 23, 42, 0.85)` — darkens background content
3. **Modal panel**: centered card on top

#### Modal Panel (`modalPanel`)
- Width: 520px, fill: `#0F172A`, cornerRadius: 4
- Layout: vertical, gap: 24px, padding: [48, 56], alignItems: center

**Modal Header**:
- Content: `"PLAYER SETUP"`, 32px / 900 / `#FF006E`, textAlign center
- padding: [0, 0, 24, 0] (bottom padding as section separator)

**Input Label**: `"YOUR NAME:"`, 12px / 800 / `#00FF88`

**Input Field** (`inputField`):
- Width: fill_container, height: 56px
- Fill: `#1E2744`, cornerRadius: 4
- padding: [14, 20], justifyContent: center
- Placeholder: `"Enter name..."`, 14px / 700 / `#64748B`
- Focus state: border `2px solid #00FF88`

**Submit Button** (`startBtn`):
- Width: fill_container, height: 64px
- Fill: `#00FF88`, cornerRadius: 4
- padding: [16, 56], justifyContent: center, alignItems: center
- Text: `"[ START GAME ]"`, 20px / 900 / `#0F172A`

**Helper Text**: `"Max 20 characters • Alphanumeric only"`, 10px / 600 / `#64748B`, textAlign center

---

### 2.2 Create Session Modal Mobile

**Frame ID**: `bnV75`
**Canvas position**: x: 5022, y: 0
**Frame size**: 375 × 812px

**Modal Panel Mobile** (`modalPanelMobile`):
- Width: fill_container, height: 520px
- Fill: `#0F172A`, cornerRadius: 4
- Layout: vertical, gap: 32px, padding: [52, 28], alignItems: center

| Element | Value |
|---------|-------|
| Modal title | "PLAYER SETUP" / 28px / 900 / `#FF006E` |
| Input label | "YOUR NAME:" / 13px / 800 / `#00FF88` |
| Input field | fill_container × 64px, fill `#1E2744`, padding [16, 18] |
| Input placeholder | "Enter name..." / 16px / 700 / `#64748B` |
| Submit button | fill_container × 68px, fill `#00FF88`, padding [18, 40] |
| Submit text | "[ START ]" / 20px / 900 / `#0F172A` |
| Helper text | "Max 20 characters" / 11px / 600 / `#64748B` |

---

## Section 3 — Session Page (Desktop, Host View)

**Frame ID**: `pPBTp`
**Canvas position**: x: 6263, y: 0
**Frame size**: 1920 × 1080px

### Layout Structure

```
┌────────────────────────────────────────────────────────┐
│  HEADER (72px)  [🔗 link box]           [📋 copy btn]  │
├────────────────────────────────────────────────────────┤
│  CONTENT AREA (padding: 20 top, 24 sides, gap: 20px)   │
│  ┌──────────────────────┐  ┌─────────────────────────┐ │
│  │  LEFT PANEL (920px)  │  │  RIGHT PANEL (920px)    │ │
│  │  ┌──────────────┐    │  │  ┌──────────────────┐   │ │
│  │  │PARTICIPANTS  │    │  │  │STORIES           │   │ │
│  │  │header (44px) │    │  │  │header (44px)     │   │ │
│  │  ├──────────────┤    │  │  ├──────────────────┤   │ │
│  │  │ list area    │    │  │  │ list area        │   │ │
│  │  │(empty state) │    │  │  │(empty state)     │   │ │
│  │  └──────────────┘    │  │  └──────────────────┘   │ │
│  └──────────────────────┘  └─────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│  FOOTER (56px)  [⏱ status text]  [ADD STORY] [START]  │
└────────────────────────────────────────────────────────┘
```

### Header (`headerDesktop`)
- Width: fill_container, height: 72px
- Fill: `#0F172A`, gap: 16px, padding: [16, 24], alignItems: center

**Link Box** (`linkBox`):
- Height: 44px, fill: `#1E2744`, cornerRadius: 4
- gap: 12px, padding: [12, 20], alignItems: center
- Link icon: `🔗` emoji, Inter 18px
- Link text: `"poker.app/join/abc123"`, 14px / 700 / `#00FF88`

**Copy Button** (`copyBtnDesktop`):
- 48 × 48px, fill: `#FF006E`, cornerRadius: 4
- padding: [8, 12], justifyContent: center, alignItems: center
- Icon: `📋` emoji, Inter 20px

### Content Area (`contentDesktop`)
- Width: fill_container, gap: 20px, padding: [20, 24]
- Horizontal flex row with two panels

### Left Panel — Participants (`leftPanelDesktop`)
- Width: 920px, layout: vertical, gap: 12px

**Section Header** (`participantsHeaderDesktop`):
- Width: fill_container, height: 44px
- Fill: `#1E2744`, cornerRadius: 4
- gap: 10px, padding: [12, 16], alignItems: center
- Icon: `👥` emoji / Inter 18px
- Label: `"PARTICIPANTS"` / 13px / 900 / `#00FF88`
- Count: `"0/8"` / 14px / 900 / `#E2E8F0` (right-aligned)

**Participants List** (`participantsListDesktop`):
- Width: fill_container, fill: `#1E2744`, cornerRadius: 4
- Layout: vertical, gap: 8px, padding: 16px
- justifyContent: center, alignItems: center
- Empty state: `"Waiting for players..."` / 14px / 700 / `#64748B`

**Populated Participant Row** (when players join):
- Width: fill_container, height: 40px
- Fill: `#0F172A`, cornerRadius: 3
- gap: 10px, padding: [8, 12], alignItems: center
- Avatar: `👤` emoji / Inter 16px
- Name: `"Alex (Host)"` / 13px / 700 / `#E2E8F0`

### Right Panel — Stories (`rightPanelDesktop`)
- Width: 920px, layout: vertical, gap: 12px

**Section Header** (`storiesHeaderDesktop`):
- Width: fill_container, height: 44px
- Fill: `#1E2744`, cornerRadius: 4
- gap: 10px, padding: [12, 16], alignItems: center
- Icon: `📋` emoji / Inter 18px
- Label: `"STORIES"` / 13px / 900 / `#FF006E`
- Count: `"0"` / 14px / 900 / `#E2E8F0` (right-aligned)

**Stories List** (`storiesListDesktop`):
- Width: fill_container, fill: `#1E2744`, cornerRadius: 4
- Layout: vertical, gap: 8px, padding: 16px
- justifyContent: center, alignItems: center
- Empty state: `"No stories yet"` / 14px / 700 / `#64748B`

### Footer (`footerDesktop`)
- Width: fill_container, height: 56px
- Fill: `#0F172A`, gap: 16px, padding: [14, 24], alignItems: center

**Status Text**: `"⏱ Session expires in 15 days"` / 12px / 700 / `#64748B`

**Action Buttons** (right-aligned, gap 12px):

| Button | Height | Fill | Padding | Icon | Label | Text color |
|--------|--------|------|---------|------|-------|------------|
| ADD STORY | 40px | `#FF006E` | [10, 20] | `"+"` 16px/900 | `"ADD STORY"` 11px/900 | `#0F172A` |
| START VOTE | 40px | `#00FF88` | [10, 20] | `"▶"` 14px/900 | `"START VOTE"` 11px/900 | `#0F172A` |

Both buttons: cornerRadius 4, gap 8px, justifyContent center, alignItems center

---

## Section 4 — Session Page (Desktop, Participant View)

**Frame ID**: `SessionParticipantDesktop`
**Canvas position**: x: 6263, y: 1442
**Frame size**: 1920 × 1080px

This view is structurally identical to the Host view with these differences:

1. **No action buttons in footer** — footer shows only status text
2. **Footer status text**: `"⏱ Waiting for host to reveal results..."` / 12px / 700 / `#64748B`
3. **Right panel label**: `"CURRENT STORY"` instead of `"STORIES"`
4. **Right panel empty state**: `"Waiting for host to start voting..."` / 14px / 700 / `#64748B`
5. **Participant count displayed**: `"3/8"` (populated with 3 example participants: Alex (Host), Jordan, Sam)

**Participant rows (populated state)**:
- Height: 40px, fill: `#0F172A`, cornerRadius: 3
- gap: 10px, padding: [8, 12], alignItems: center
- Avatar `👤` (Inter 16px) + Name (13px / 700 / `#E2E8F0`)

---

## Section 5 — Join Page

### 5.1 Join Page Desktop

**Frame ID**: `JoinPageDesktop`
**Canvas position**: x: 3035, y: 1442
**Frame size**: 1920 × 1080px
**Layout**: vertical, justifyContent: center, alignItems: center

**Join Card** (`joinCardDesktop`):
- Width: 520px, fill: `#0F172A`, cornerRadius: 4
- Layout: vertical, gap: 28px, padding: 56px (all sides), alignItems: center

**Join Header** (inside card):
- Layout: vertical, gap: 12px, padding: [0, 0, 16, 0], alignItems: center
- Title: `"You're invited!"` / 32px / 900 / `#00FF88`, textAlign center
- Subtitle: `"Join Alex's Planning Poker session"` / 15px / 600 / `#94A3B8`, textAlign center

**Join Form**:
- Layout: vertical, gap: 16px, width: fill_container
- Label: `"YOUR NAME:"` / 12px / 800 / `#00FF88`
- Input: fill_container × 56px, fill `#1E2744`, cornerRadius 4, padding [14, 20]
- Placeholder: `"Enter your name..."` / 14px / 700 / `#64748B`

**Submit Button** (`joinSubmitBtnDesktop`):
- Width: fill_container, height: 64px
- Fill: `#FF006E`, cornerRadius: 4 (**note: magenta here, not green**)
- padding: [16, 56], justifyContent center, alignItems center
- Text: `"[ JOIN SESSION ]"` / 20px / 900 / `#0F172A`

**Accent Line** (`joinBorderDesktop`):
- Width: fill_container, height: 2px
- Fill: `#00FF88`, cornerRadius: 1
- Decorative green line at bottom of card

---

### 5.2 Join Page Mobile

**Frame ID**: `JoinPageMobile` (referenced in canvas layout)
**Canvas position**: x: 5022, y: 1442
**Frame size**: 375 × 812px

Same structure as desktop join but with:
- Full-width card (`fill_container`)
- Joker card / poker chip icon in a circular `#1E2744` frame (64px × 64px)
- Session name badge above the form
- Input field uses 48px height (touch-friendly)
- CTA: `"JOIN SESSION"` button fills full width
- Bottom accent line: 2px `#00FF88`

---

## Section 6 — Error / Session Not Found

### 6.1 Error Page Desktop

**Frame ID**: `ErrorPageDesktop`
**Canvas position**: x: 11725, y: 0
**Frame size**: 1920 × 1080px
**Layout**: vertical, justifyContent: center, alignItems: center

**Error Card** (`errorCardDesktop`):
- Width: 520px, fill: `#0F172A`, cornerRadius: 4
- Layout: vertical, gap: 32px, padding: 56px, alignItems: center

**Icon Frame**:
- 80 × 80px, fill: `#1E2744`, cornerRadius: 4
- Icon: `❌` emoji / Inter 44px

**Error Header**:
- Layout: vertical, gap: 16px, alignItems: center
- Title: `"Session not found or expired"` / 32px / 900 / `#FF006E`, textAlign center
- Description: `"This session may have ended or the link is invalid"` / 15px / 600 / `#94A3B8`, textAlign center

**CTA Button** (`errorCTADesktop`):
- Width: fill_container, height: 64px
- Fill: `#00FF88`, cornerRadius: 4
- padding: [16, 56], justifyContent center, alignItems center
- Text: `"[ CREATE YOUR OWN SESSION ]"` / 18px / 900 / `#0F172A`

---

### 6.2 Error Page Mobile

**Frame ID**: `ErrorPageMobile`
**Canvas position**: x: 13743, y: 0
**Frame size**: 375 × 812px

**Error Card Mobile** (`errorCardMobile`):
- Width: fill_container, fill: `#0F172A`, cornerRadius: 4
- Layout: vertical, gap: 28px, padding: [48, 28], alignItems: center

**Icon Frame**: 68 × 68px, fill `#1E2744`, cornerRadius 4
**Icon**: `❌` emoji / Inter 38px

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Title | 28px | 900 | `#FF006E` |
| Description | 14px | 600 | `#94A3B8` |
| CTA button height | 56px | — | fill `#00FF88` |
| CTA button text | "[ CREATE SESSION ]" / 16px / 900 | — | `#0F172A` |

---

## Section 7 — Session View Mobile (Legacy/Original)

**Frame ID**: `AB8SI`
**Canvas position**: x: 8269, y: 0
**Frame size**: 375 × 812px
**Layout**: vertical

This is the original compact mobile session view (host perspective). The newer `MobSessionHost` at y:2900 is the preferred reference.

### Header Mobile (`headerMobile`)
- Fill: `#0F172A`, gap: 10px, padding: [14, 16]
- Layout: vertical (link box on top row, copy button below — or inline)

**Link Box** (`linkBoxMobile`):
- Width: fill_container, height: 44px
- Fill: `#1E2744`, cornerRadius: 4, gap: 12, padding: [12, 14]
- Icon: `🔗` / Inter 16px, Text: `"poker.app/join/abc"` / 13px / 800 / `#00FF88`

**Copy Button** (`copyBtnMobile`): 44 × 44px, fill `#FF006E`, cornerRadius 4

### Content Area (`contentMobile`)
- Width: fill_container, height: 620px
- Layout: vertical, gap: 14px, padding: [14, 16]

**Participants Header**: fill_container × 44px, `#1E2744`, padding [12, 14]
- Icon `👥` 16px, Label `"PLAYERS"` 12px/900/`#00FF88`, Count `"0/8"` 13px/900/`#E2E8F0`

**Participants List**: fill_container × 280px, `#1E2744`, padding [16, 14]
- Empty: `"Waiting for players..."` / 13px / 700 / `#64748B`

**Stories Header**: fill_container × 44px, `#1E2744`, padding [12, 14]
- Icon `📋` 16px, Label `"STORIES"` 12px/900/`#FF006E`, Count `"0"` 13px/900/`#E2E8F0`

**Stories List**: fill_container × 280px, `#1E2744`, padding [16, 14]
- Empty: `"No stories yet"` / 13px / 700 / `#64748B`

### Footer Mobile (`footerMobile`)
- Width: fill_container, height: 78px
- Fill: `#0F172A`, layout: vertical, gap: 12px, padding: [14, 16]

Status text: `"⏱ Expires in 15 days"` / 12px / 700 / `#64748B`

Button row: fill_container × 48px, gap 10px

| Button | Height | Fill | Text | Text color |
|--------|--------|------|------|------------|
| Add Story | 48px | `#FF006E` | `"+ ADD"` / 13px / 900 | `#0F172A` |
| Start Vote | 48px | `#00FF88` | `"▶ VOTE"` / 13px / 900 | `#0F172A` |

---

## Section 8 — Participant List Sidebar Component

These are standalone component frames at negative Y positions (design reference only, not full pages).

### Desktop Participant List (`Participant List - Desktop`)
**Frame ID**: `XRW1l`, Canvas: x: 6326, y: -2501
**Frame size**: 320 × 480px, fill: `#0F172A`

**Header**: height 44px, fill `#1E2744`, cornerRadius 2
- Label `"PARTICIPANTS"` / 12px / 900 / `#00FF88`
- Count `"5/8"` / 12px / 900 / `#E2E8F0` (right-aligned)
- padding [12, 14], gap 8

**Participant Row** (repeating):
- Width: fill_container, height: 44px
- Fill: `#1A1F3A`, gap: 10, padding: [8, 12], alignItems: center
- Status dot: 8 × 8px ellipse
- Name: 12px / 800 / `#E2E8F0`

**Status dot colors**:
- `#00FF88` — online (Alice Chen, Bob Smith, Emma Wilson)
- `#64748B` — offline (David Park, Frank Torres)

**HOST badge** (on host row only):
- Height: 24px, fill `#FF006E`, cornerRadius 2
- padding [4, 8], text `"HOST"` / 9px / 900 / `#FFFFFF`

**Overflow note**: `"Scrollable if >6 participants"` annotation

---

### Mobile Participant List (`Participant List - Mobile`)
**Frame ID**: `H3LLn`, Canvas: x: 6726, y: -2501
**Frame size**: 343 × 420px

**Header**: height 40px, fill `#1E2744`, cornerRadius 2
- Label: 11px / 900 / `#00FF88`, Count: 11px / 900 / `#E2E8F0`

**Participant Row Mobile**:
- Height: 36px, fill: `#1A1F3A`, gap: 10, padding: [6, 12]
- Status dot: 7 × 7px ellipse
- Name: 11px / 800 / `#E2E8F0`
- HOST badge: height 20px, padding [3, 6], text 8px / 900 / `#FFFFFF`

---

## Section 9 — Animated Participant Screens

Four full-page desktop screens (1920 × 1080) showing animation states. These serve as developer reference for implementing live participant list animations.

### 9.1 Anim — Participant Pulse (Online Indicators)

**Frame ID**: `AnimPulse1`
**Canvas position**: x: 9286, y: 0
**Frame size**: 1920 × 1080px

**Purpose**: Shows all 4 participants online simultaneously with pulsing green dots.

**Participant row structure** (in this animation screen):
- Width: fill_container, height: 44px
- Fill: `#1A1F3A`, gap: 12px, padding: [8, 16], alignItems: center
- Status dot: 12 × 12px ellipse, fill `#00FF88` — **larger than sidebar (12px vs 8px)**
- Avatar: `👤` emoji / Inter 16px
- Name: 14px / 700 / `#E2E8F0`
- HOST badge (first row only): height 24px, fill `#FF006E`, cornerRadius 3, padding [4, 8], `"HOST"` / 10px / 900 / `#FFFFFF`

Participants shown: Alex Jordan (HOST), Sam Rivera, Jordan Lee, Casey Morgan

Participant list container: fill `#1E2744`, cornerRadius 4, layout vertical, gap 2px, padding 12px

**Animation Spec — Online Pulse**:
```ts
// Applied to each green status dot
animate={{ scale: [1, 1.2, 1] }}
transition={{
  duration: 1.2,
  repeat: Infinity,
  ease: [0.4, 0, 0.2, 1]
}}
```
- Reduced motion: no scale animation; dot renders static at scale 1.0, full opacity
- Pulse gives "alive, breathing" presence to online participants

---

### 9.2 Anim — New Participant Entrance (Slide In)

**Frame ID**: `AnimEntrance1` (or `AnimParticipantEntranceDesktop`)
**Canvas position**: x: 11411, y: 0
**Frame size**: 1920 × 1080px

**Purpose**: Shows Alice Chen sliding into the participant list as the 5th member.

**Alice Chen row (entering participant)**:
- Has `border: 2px solid #00FF88` on the row container
- Background: `#1A3A2A` (greenish tint vs normal `#1A1F3A`)
- Name text color: `#00FF88` (instead of normal `#E2E8F0`)
- This highlighting draws attention to the new arrival

**Animation Spec — Entrance**:
```ts
// Applied to new participant's row wrapper
initial={{ x: '-100%', opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
transition={{
  duration: 0.3,
  ease: [0.34, 1.56, 0.64, 1]  // ease-out with slight overshoot
}}
// For multiple simultaneous entries: stagger 50ms between rows
```
- Requires `overflow: hidden` on the list container for clean slide
- After animation: border and background return to normal state (400ms transition)
- Reduced motion: skip translate, fade in only (opacity 0 → 1, 200ms)

---

### 9.3 Anim — Participant Exit (Fade Out)

**Frame ID**: `AnimExit1`
**Canvas position**: x: 9286, y: 2981
**Frame size**: 1920 × 1080px

**Purpose**: Shows Casey fading out of the list (disconnected).

**Casey row (exiting participant)**:
- Opacity reduced to 0.3 (static representation of mid-animation state)
- Status dot: `#4B5563` (gray, not green)
- Name text: `#64748B` (dimmed)
- No special border

**Animation Spec — Exit**:
```ts
// Applied to exiting participant's row wrapper
animate={{ x: '20%', opacity: 0 }}
transition={{
  duration: 0.3,
  ease: [0.4, 0, 1, 1]  // ease-in, accelerates toward exit
}}
// After animation completes: remove from DOM (or set display: none)
```
- Reduced motion: just fade opacity 1 → 0, no translateX
- Participant count updates after animation completes

---

### 9.4 Anim — Status Change (Offline Transition)

**Frame ID**: `AnimParticipantStatusChangeDesktop`
**Canvas position**: x: 15251, y: 0
**Frame size**: 1920 × 1080px

**Purpose**: Shows participants in various status states (online/idle/offline).

**Participant statuses shown**:
| Name | Status dot | Dot color | Name text color |
|------|-----------|-----------|-----------------|
| Alex (Host) | Online | `#00FF88` | `#E2E8F0` |
| Jordan | Online | `#00FF88` | `#E2E8F0` |
| Sam | Online | `#00FF88` | `#E2E8F0` |
| Casey | Idle | `#FFB800` | `#E2E8F0` |
| Alice Chen | Offline | `#4B5563` | `#64748B` |

**Animation Spec — Status Color Transition**:
```ts
// Applied to the status dot element
// Online → Idle
animate={{ backgroundColor: '#FFB800' }}
transition={{ duration: 0.2, ease: [0.42, 0, 0.58, 1] }}

// Idle → Offline (after 200ms)
animate={{ backgroundColor: '#4B5563' }}
transition={{ duration: 0.2, ease: [0.42, 0, 0.58, 1] }}

// Concurrent name text dimming (online → offline)
animate={{ color: '#64748B' }}
transition={{ duration: 0.4, ease: [0.42, 0, 0.58, 1] }}
```
- Total transition duration: 400ms
- Text color fades slower than dot (400ms vs 200ms) for visual hierarchy
- Reduced motion: jump to final state immediately without animation

---

## Section 10 — Mobile-First Layouts (y: 2900 Row)

These four screens at `y: 2900` are the primary mobile reference. All are **390 × 844px** (iPhone 14).

### 10.1 Mobile Session View (Host) — `MobSessionHost`

**Canvas position**: x: 0, y: 2900
**Frame size**: 390 × 844px

#### Header (fixed, `#1E2744`)
- Session name: bold text
- Monospace session ID
- Share button (icon button)
- Height: ~60–72px

#### Participant List Section
4 rows with status dots (10 × 10px on mobile):
- Green dot: online participants
- Yellow dot: idle participants
- HOST badge on host row: fill `#FF006E`, 20px height

#### Stories Section
3 story rows with status badges:
- `"VOTING NOW"` badge: fill `#00FF88`, text `#0F172A`
- `"PENDING"` badge: fill `#1E2744`, text `#64748B`

#### Bottom Bar (48px height)
- `"ADD STORY"` button: fill `#FF006E`, 48px height, padding [12, 20], text `#0F172A` / 13px / 900
- `"REVEAL VOTES"` button: fill `#00FF88`, 48px height, padding [12, 20], text `#0F172A` / 13px / 900
- Both buttons: cornerRadius 4, equal width (flex 1 each)

---

### 10.2 Mobile Voting View — `MobVotingView`

**Canvas position**: x: 530, y: 2900
**Frame size**: 390 × 844px

#### Header (fixed)
- `"NOW VOTING"` label: small caps, `#FF006E`
- Story title: 16px / 700 / `#E2E8F0`
- Story description: 13px / 500 / `#64748B`
- Padding: [14, 20]

#### Fibonacci Card Grid
- Layout: 2-column grid, gap 12px
- Card size: **165 × 88px**
- Card values: 0, 1, 2, 3, 5, 8, 13, 21 (8 cards = 4 rows × 2 cols)
- Default card: fill `#1A1F3A`, border `1px solid #64748B`, cornerRadius 8
- Card value text: centered, 24px / 900 / `#E2E8F0`

**Selected Card State**:
- Border: `3px solid #00FF88`
- Fill: `#0D2B1A` (very dark green)
- Glow: `box-shadow: 0 0 12px rgba(0, 255, 136, 0.4)`
- `"SELECTED"` label: 10px / 800 / `#00FF88`, above card value
- Card value text color: `#00FF88`

**Hover State** (desktop equivalent tap feedback):
- Scale: 1.05, spring animation 200ms

#### Bottom Bar
- Vote confirmation text: `"You voted: 5"` / 13px / 700 / `#E2E8F0`
- `"CHANGE"` link: 13px / 700 / `#64748B`, tap to clear selection
- Height: 48px

---

### 10.3 Mobile Results View — `MobResultsView`

**Canvas position**: x: 1060, y: 2900
**Frame size**: 390 × 844px

#### Summary Card (top section)
3 stat boxes in a horizontal row (padding [16, 20]):

| Stat | Label | Value | Box size |
|------|-------|-------|----------|
| AVG | "AVG" / `#64748B` / 11px | "4.2" / `#E2E8F0` / 28px/900 | 80 × 80px |
| CLOSEST | "CLOSEST" / `#00FF88` / 11px | "5" / `#E2E8F0` / 28px/900 | 80 × 80px |
| SPREAD | "SPREAD" / `#FF006E` / 11px | "2-8" / `#E2E8F0` / 22px/900 | 80 × 80px |

All boxes: fill `#1A1F3A`, cornerRadius 8, layout vertical center

**Consensus Indicator**:
- Yellow `#FFB800` exclamation badge
- Text: `"discuss outliers?"` / 13px / 700 / `#FFB800`

#### Vote Distribution Bars
Horizontal bar chart showing vote spread:
- Majority vote bar: fill `#00FF88`, height 8px, rounded ends
- Secondary bars: fill `#FF006E` or `#FFB800`
- Bars are full-width containers with proportional fills

#### Individual Votes List
4 rows showing participant votes:
- Row: fill_container × 44px, fill `#1A1F3A`, cornerRadius 4
- Name: 13px / 700 / `#E2E8F0` (left)
- Vote badge: right-aligned, 32 × 32px, cornerRadius 4
  - Majority: fill `#00FF88`, text `#0F172A`
  - Outlier: fill `#FF006E` or `#FFB800`, text `#0F172A`
- Vote value text: 16px / 900

#### Bottom CTA
- `"NEXT STORY"` button: full-width, 48px height
- Fill: `#00FF88`, cornerRadius 4
- Text: `"NEXT STORY"` / 14px / 900 / `#0F172A`

---

### 10.4 Mobile Join Session — `MobJoinView`

**Canvas position**: x: 1590, y: 2900
**Frame size**: 390 × 844px

#### Layout
Centered card layout, vertically centered on screen.

**Poker chip / Joker icon**:
- Circular container: 80 × 80px, fill `#1E2744`, cornerRadius: 50% (circle)
- Inner emoji or icon: 40px

**Session name badge** (above form):
- Fill: `#1E2744`, cornerRadius 20px (pill shape)
- padding [8, 16]
- Text: session name / 13px / 700 / `#E2E8F0`

**Name input field**:
- Width: fill_container, height: 52px
- Fill: `#1E2744`, cornerRadius 8
- padding [14, 18]
- Placeholder: `"Your name..."` / 14px / 700 / `#64748B`
- Focus border: `2px solid #00FF88`

**"JOIN SESSION" CTA**:
- Width: fill_container, height: 52px
- Fill: `#00FF88`, cornerRadius 8
- Text: `"JOIN SESSION"` / 16px / 900 / `#0F172A`

**Accent Line**: 2px × full-width / fill `#00FF88` / cornerRadius 1 — decorative bottom accent

---

## Section 11 — Mobile State Screens (y: 4050 Row)

All three at 390 × 844px.

### 11.1 Mobile Loading State — `MobLoadingView`

**Canvas position**: x: 0, y: 4050

**Layout**: Full-screen centered content (justifyContent center, alignItems center)
**Background**: `linear-gradient(180deg, #0F172A 0%, #1A2847 100%)`

**Spinner Ring**:
- Size: 80 × 80px outer circle
- Track: `#1E2744` (full ring)
- Arc: `#00FF88` (approx 1/4 of ring, rotating)
- Stroke width: 6px
- Center: poker chip emoji `🎰` or `🃏` at 32px

```css
/* CSS implementation */
.spinner-track {
  border: 6px solid #1E2744;
  border-radius: 50%;
  width: 80px;
  height: 80px;
}
.spinner-arc {
  border: 6px solid transparent;
  border-top-color: #00FF88;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

**Loading Text**:
- `"Restoring your session..."` / 16px / 600 / `#E2E8F0`
- `"This should only take a moment"` / 13px / 500 / `#64748B`

**Loading Dots** (3 small ellipses, 10 × 10px each):
- All dots: fill `#00FF88`
- Gap: 8px between dots
- Staggered opacity pulse:
  - Dot 1: opacity 1.0 (no delay)
  - Dot 2: opacity 0.5 (delay 150ms)
  - Dot 3: opacity 0.25 (delay 300ms)
- Each dot: loop 1.0 → 0.3 → 1.0, duration 1.2s

**Reduced motion fallback**: Static spinner, dots at fixed opacity (1.0 / 0.6 / 0.3)

---

### 11.2 Mobile Expired Session — `MobExpiredView`

**Canvas position**: x: 530, y: 4050

**Card** (centered):
- Width: fill_container (with 20px side padding from screen edge)
- Fill: `#1E2744`, cornerRadius 12, padding [32, 24]
- Layout: vertical, gap 20px, alignItems center

**Hourglass Icon**:
- Container: 64 × 64px, fill `#0F172A`, cornerRadius 50% (circle)
- Icon: `⏳` emoji at 30px

**Title**: `"This session has expired"` / 22px / 900 / `#E2E8F0`, textAlign center

**Last Activity Badge**:
- Fill: `#0F172A`, cornerRadius 8, padding [8, 12]
- Text: `"Last active: 2 hours ago"` / 12px / 600 / `#64748B`

**Gold Accent Bar**:
- Width: full card width, height 2px
- Fill: `#FFB800`
- Positioned at bottom of card (or as border-bottom)

**CTA Button** (`"Create New Session"`):
- Width: fill_container, height: 48px
- Fill: `#00FF88`, cornerRadius 8
- Text: `"Create New Session"` / 14px / 900 / `#0F172A`

**Back to Home link**:
- Text: `"Back to Home"` / 13px / 600 / `#64748B`
- No button background, plain text link with underline on hover

---

### 11.3 Mobile Error State — `MobErrorView`

**Canvas position**: x: 1060, y: 4050

**Layout**: Full session view behind, with error toast overlaid at top.

**Error Toast** (fixed at top):
- Width: fill_container (full screen width)
- Fill: `#1E2744`, padding [12, 16]
- Left border: `4px solid #EF4444` (red accent)
- Layout: horizontal row, gap 12px, alignItems center

Toast content:
- Warning icon: `⚠️` / 18px
- Text column:
  - `"Session Error"` / 14px / 700 / `#E2E8F0`
  - `"Connection lost. Attempting to reconnect..."` / 12px / 500 / `#64748B`
- Dismiss `×` button: 24 × 24px, fill transparent, text `#64748B` / 18px

**Auto-dismiss progress bar** (at very bottom of toast):
- Height: 2px, fill `#EF4444`
- Animates width from 100% → 0% over 5s (linear)

**Session behind toast** (dimmed state):
- Same layout as Mobile Session View (host)
- 1 participant showing
- Empty stories list
- `"REVEAL VOTES"` button: disabled state
  - Fill: `#1A1F3A` (dark, no glow)
  - Text: `#64748B` (muted)
  - cursor: not-allowed

---

## Section 12 — Desktop State Screens (y: 5290 Row)

All three at 1920 × 1080px.

### 12.1 Desktop Loading State — `DskLoadingView`

**Canvas position**: x: 0, y: 5290

**Layout**: Full-bleed, all content centered (flexbox center-center)
**Background**: `linear-gradient(180deg, #0F172A 0%, #1A2847 100%)`

**Branding Label** (above spinner):
- `"PLANNING POKER"` / 14px / 700 / `#64748B`, letter-spacing wider
- Optional: tagline subtitle

**Spinner Ring**:
- Container: 120 × 120px
- Track stroke: 6px, color `#1E2744`
- Arc stroke: 6px, color `#00FF88` (~90° arc)
- Center: poker chip emoji `🃏` at 44px
- Animation: rotate 360° in 1s, `linear`, `infinite`

**Loading Text**:
- `"Restoring your session..."` / 20px / 600 / `#E2E8F0`
- `"This should only take a moment"` / 14px / 500 / `#64748B`
- Gap between: 8px

**Loading Dots** (3 × 10px ellipses):
- Fill: `#00FF88`, gap 10px between dots
- Staggered opacity animation (same as mobile but 10px size)
  - Dot 1: delay 0ms, opacity 1.0
  - Dot 2: delay 150ms, opacity 0.5
  - Dot 3: delay 300ms, opacity 0.25

---

### 12.2 Desktop Expired Session — `DskExpiredView`

**Canvas position**: x: 2000, y: 5290

**Layout**: Full-bleed, centered card

**Card** (`expiredCardDesktop`):
- Width: 480px (narrower than other modals)
- Fill: `#1E2744`, cornerRadius: 16, padding: [56, 64] (top/bottom, sides)
- Layout: vertical, gap 32px, alignItems center
- Relative to card: gold accent bar at bottom edge

**Hourglass Icon**:
- Container: 64 × 64px, fill `#0F172A`, cornerRadius 50% (full circle)
- Icon: `⏳` emoji, 30px

**Title**: `"This session has expired"` / 28px / 900 / `#E2E8F0`, textAlign center

**Last Activity Badge**:
- Fill: `#0F172A`, cornerRadius 8, padding [8, 16]
- Text: `"Last active: 2 hours ago"` / 13px / 600 / `#64748B`

**Gold Accent Bar**:
- Width: full card width, height 2px
- Fill: `#FFB800`
- Positioned at very bottom of card interior (before padding ends, acts as bottom border of card content)

**CTA Button**:
- Width: 320px, height: 48px
- Fill: `#00FF88`, cornerRadius 8
- Text: `"Create New Session"` / 15px / 900 / `#0F172A`

**Back Link**: `"Back to Home"` / 14px / 600 / `#64748B`, text link below button

---

### 12.3 Desktop Error State — `DskErrorView`

**Canvas position**: x: 4000, y: 5290

**Layout**: Full session interface visible, with error toast banner pinned to top.

**Error Toast Banner** (absolutely positioned at very top):
- Width: 100%, height: ~52px
- Fill: `#1E2744`
- Left border: `4px solid #EF4444`
- Inner container: max-width 600px, centered horizontally, padding [0, 24]
- Layout: horizontal row, gap 12, alignItems center

Toast content layout:
- Warning icon: `⚠️` / 20px
- Text column:
  - `"Session Error"` / 14px / 700 / `#E2E8F0`
  - `"Unable to sync with session. Data may be stale."` / 12px / 500 / `#64748B`
- Dismiss `×` button: 32 × 32px, `#64748B`, right-aligned
- Progress bar: 4px high, full width at bottom of toast, `#EF4444`, 5s auto-dismiss

**Session Layout Below Toast** (normal session layout, no changes except footer):
- Header: session name, session ID (monospace font, `#00FF88`), share button
- Left panel (300px): participant list — 1 participant visible
- Right panel: stories list — empty state
- Footer:
  - `"ADD STORY"` button: active state, `#FF006E`
  - `"REVEAL VOTES"` button: **disabled** — fill `#1A1F3A`, text `#64748B`, cursor not-allowed

---

## Section 13 — Voting UI Mobile (y: 7080 Row)

Three screens at 390 × 844px.

### 13.1 VotMob1 — No Selection State

**Canvas position**: x: 0, y: 7080
**Frame ID**: `VotMob1`

**Header** (fixed, `#1E2744`, ~72px):
- `"NOW VOTING"` status label: 10px / 800 / `#FF006E`
- Story title: 15px / 700 / `#E2E8F0`
- Brief story description: 12px / 500 / `#64748B`
- Timer ring (80px circle): green ring if >60s remaining

**Timer Ring**:
- Size: 80 × 80px
- Background circle: `#1E2744`
- Colored arc: fill varies by time remaining (see states below)
- Center: countdown seconds text, 18px / 900

Timer ring color states:
| Time remaining | Arc color | Text color | Ring fill |
|----------------|-----------|------------|-----------|
| >60 seconds | `#00FF88` | `#E2E8F0` | `#1E2744` |
| 30-60 seconds | `#FFB800` | `#FFB800` | `#1E2744` |
| <30 seconds | `#EF4444` (red) | `#EF4444` | `#2D0A0A` (dark red fill) |

**Expiring (<30s)**: Red timer pulses using Framer Motion `animate={{ scale: [1, 1.05, 1] }}, repeat: Infinity, duration: 0.8`

**Card Grid** (main content):
- Layout: 3-column grid (not 2 — see canvas-layout.md note correction below)
- Card size: **110 × 80px**
- Gap: 8px between cards
- Fibonacci values shown: 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ? (12 total)

**Default Card**:
- Fill: `#1A1F3A`, cornerRadius 8
- Border: `1px solid #64748B`
- Value text: centered, 20px / 900 / `#E2E8F0`

**Bottom area** (no selection): helper text `"Select a card to vote"` / 12px / 600 / `#64748B`

---

### 13.2 VotMob2 — Selected State

**Canvas position**: x: 530, y: 7080
**Frame ID**: `VotMob2`

Identical to VotMob1 except:

**Selected Card** (e.g., card "5"):
- Fill: `#0D2B1A` (dark green)
- Border: `3px solid #00CC6A` (slightly darker green for selected)
- Text color: `#00FF88`
- Checkmark `✓` above the number (10px / 800 / `#00FF88`)
- `box-shadow: 0 0 16px rgba(0, 255, 136, 0.3)`

**Bottom Bar** (selection confirmed):
- Background: `#1E2744`, 48px height
- `"Voted: 5"` text: 13px / 700 / `#E2E8F0`
- `"Change"` link: 13px / 700 / `#64748B`, right side

---

### 13.3 VotMob3 — Expiring Timer

**Canvas position**: x: 1060, y: 7080
**Frame ID**: `VotMob3`

Same as VotMob1/2 but timer in critical state:
- Timer ring fill: `#2D0A0A` (dark red background circle)
- Arc color: `#EF4444`
- Seconds text: `#EF4444`
- Pulsing scale animation on timer: 0.8s spring loop
- Cards remain fully interactive

---

## Section 14 — Voting UI Desktop (y: 8280 Row)

Three screens at 1920 × 1080px.

### 14.1 VotDsk1 — No Selection State

**Canvas position**: x: 0, y: 8280
**Frame ID**: `VotDsk1`

**Layout structure**:
```
┌──────────────────────────────────────────────────────────────┐
│ TOP BAR (60px) — story title, timer, vote status             │
├────────────────────────────────────────────────────────────-─┤
│ SIDEBAR (280px) │          MAIN CONTENT AREA                 │
│  Participants   │  [Card Grid — 6 columns × 2 rows]          │
│  list with      │                                            │
│  vote status    │  Values: 0 1 2 3 5 8                       │
│                 │          13 21 34 55 89 ?                  │
└─────────────────┴───────────────────────────────────────────-┘
```

**Top Bar** (60px, fill `#1E2744`):
- Story title: 16px / 700 / `#E2E8F0` (left)
- Timer: circular ring (same color logic as mobile)
- Votes cast counter: `"3/5 voted"` / 13px / 700 / `#64748B` (right)

**Sidebar** (280px wide):
- Fill: `#0F172A` or `#1E2744`
- Participant rows with vote-status indicators:
  - `"Voted"` badge: small `#00FF88` checkmark or green dot
  - `"Waiting"` badge: `#64748B` dot or dash
  - Avatar + Name + vote status

**Card Grid** (main area):
- Layout: 6 columns × 2 rows (12 cards total)
- Card size: **100 × 100px**
- Gap: 12px between cards
- Cards centered in main area

**Default Card**:
- Fill: `#1A1F3A`, cornerRadius 8
- Border: `1px solid #64748B`
- Value: 24px / 900 / `#E2E8F0`, centered

---

### 14.2 VotDsk2 — Selected + Hover States

**Canvas position**: x: 2000, y: 8280
**Frame ID**: `VotDsk2`

Shows two simultaneous states for developer reference:
1. One card selected (e.g., "8")
2. One card hovered (e.g., "13")

**Selected Card** (card "8"):
- Fill: `#0D2B1A`
- Border: `3px solid #00CC6A`
- Text: `#00FF88`
- Subtle glow: `box-shadow: 0 0 20px rgba(0, 255, 136, 0.25)`

**Hover Card** (card "13"):
- Fill: `#222B4A` (slightly lighter than default `#1A1F3A`)
- Border: `1px solid #00FF88` (green border on hover)
- Text: `#E2E8F0` → `#00FF88` on hover (transitions together)
- Scale: 1.05 (spring, 200ms)

**Card hover animation** (Framer Motion):
```ts
whileHover={{ scale: 1.05, borderColor: '#00FF88' }}
transition={{ type: 'spring', stiffness: 300, damping: 20 }}
```

---

### 14.3 VotDsk3 — Disabled / Revealing State

**Canvas position**: x: 4000, y: 8280
**Frame ID**: `VotDsk3`

Shown when the host has triggered "Reveal Votes" — cards become non-interactive.

**All cards disabled**:
- Fill: `#111827` (darker than normal)
- Border: `1px solid #374151` (very dark gray border)
- Text: `#64748B` (muted)
- cursor: not-allowed, pointer-events: none

**Previously-selected card** (still marked but dimmed):
- Fill: `#1A3A2A` (dark, desaturated green)
- Border: `1px solid #2D5A3F` (dark green border)
- Text: `#4B8C6A` (dim green)

**Status badge** (top bar, replaces timer):
- Fill: `#FF006E` (magenta)
- Text: `"REVEALING VOTES..."` / 12px / 800 / `#FFFFFF`
- Pulsing animation (scale 1.0 → 1.03 → 1.0, 1s loop)

**Reveal animation** (triggered when votes are shown):
```ts
// Each card flips with stagger
initial={{ rotateY: 180 }}
animate={{ rotateY: 0 }}
transition={{
  duration: 0.5,
  delay: index * 0.05,  // 50ms stagger per card
  type: 'spring', stiffness: 300, damping: 20
}}
```

---

## Global Component Patterns

### Input Field — Default State
```
fill: #1E2744
cornerRadius: 4 (desktop) / 8 (mobile)
padding: [14, 20]
placeholder color: #64748B / 14px / 700
border: none (default)
```

### Input Field — Focus State
```
border: 2px solid #00FF88
outline: none
background: #1E2744 (unchanged)
```

### Button — Primary (Neon Green)
```
fill: #00FF88
text: #0F172A / 900
cornerRadius: 4 (desktop) / 8 (mobile)
height: 64px (desktop) / 48–52px (mobile)
hover: scale 1.02, brightness 1.05
active: scale 0.98
```

### Button — Secondary (Magenta)
```
fill: #FF006E
text: #0F172A / 900
Same sizing as primary
```

### Button — Disabled
```
fill: #1A1F3A
text: #64748B / 900
cursor: not-allowed
pointer-events: none
No hover effect
```

### Section Header Bar
```
height: 44px
fill: #1E2744
cornerRadius: 4
padding: [12, 16] (desktop) / [12, 14] (mobile)
gap: 10px
alignItems: center
icon: emoji / Inter 18px (desktop) / 16px (mobile)
label: 13px / 900 (desktop) / 12px / 900 (mobile)
count: 14px / 900 / #E2E8F0 (desktop) / 13px / 900 (mobile)
```

### Participant Row (animated list version)
```
height: 44px
fill: #1A1F3A
gap: 12px
padding: [8, 16]
alignItems: center
cornerRadius: none (list context) / 3px (panel context)

Children (left to right):
  1. Status dot — 12×12px ellipse (desktop animated) / 8×8px (sidebar) / 10×10px (mobile)
  2. Avatar emoji 👤 — Inter 16px
  3. Name text — 14px / 700 / #E2E8F0
  4. HOST badge (host only) — see below
```

### HOST Badge
```
height: 24px
fill: #FF006E
cornerRadius: 3 (desktop animated) / 2 (sidebar)
padding: [4, 8]
text: "HOST" / 10px / 900 / #FFFFFF (desktop) / 9px / 900 (sidebar) / 8px / 900 (mobile)
```

### Toast — Error
```
position: fixed top
width: 100%
fill: #1E2744
border-left: 4px solid #EF4444
padding: [12, 16] (mobile) / [14, 24] (desktop)
Layout: horizontal row, gap 12, alignItems center

Children:
  - Warning icon ⚠️ — 18px (mobile) / 20px (desktop)
  - Text column: title (14px/700/#E2E8F0) + subtitle (12px/500/#64748B)
  - Dismiss × — 24–32px tap target, #64748B
  - Auto-dismiss bar: 2–4px, #EF4444, animates 100%→0% width over 5s
```

---

## Accessibility Checklist

Every screen and component must satisfy:

| Requirement | Implementation |
|-------------|---------------|
| WCAG AA contrast (4.5:1 minimum) | All text meets ratio against backgrounds |
| Touch targets minimum 44px | All interactive elements are ≥44px in height/width |
| `prefers-reduced-motion` | All Framer Motion animations wrap in `useReducedMotion()` check |
| Color not sole indicator | Status dots paired with text labels and position context |
| Keyboard navigation | All interactive elements reachable via Tab, activated via Enter/Space |
| Focus visible | `outline: 2px solid #00FF88` on focused interactive elements |
| Screen reader support | Participant additions/removals announced via `aria-live="polite"` |
| Alt text | Emoji used decoratively have `aria-hidden="true"` |

### Reduced Motion Fallbacks

```ts
// React hook pattern
import { useReducedMotion } from 'framer-motion';

function ParticipantRow({ participant, isNew, isExiting }) {
  const shouldReduceMotion = useReducedMotion();

  const enterAnim = shouldReduceMotion
    ? { opacity: 1 }  // instant, no slide
    : { x: 0, opacity: 1 };

  const enterInitial = shouldReduceMotion
    ? { opacity: 0 }
    : { x: '-100%', opacity: 0 };

  return (
    <motion.div
      initial={enterInitial}
      animate={enterAnim}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
    />
  );
}
```

---

## Framer Motion Animation Reference

```ts
// Complete animation config reference

// 1. Participant entrance (new player joins)
const participantEntrance = {
  initial: { x: '-100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
  // Reduced motion: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0 } }
};

// 2. Participant exit (player disconnects)
const participantExit = {
  animate: { x: '20%', opacity: 0 },
  transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  // After: remove from DOM
  // Reduced motion: { animate: { opacity: 0 }, transition: { duration: 0.1 } }
};

// 3. Online indicator pulse
const onlinePulse = {
  animate: { scale: [1, 1.2, 1] },
  transition: { duration: 1.2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] },
  // Reduced motion: no animation, static at scale 1
};

// 4. Status color change (online → idle → offline)
const statusChange = (targetColor: string) => ({
  animate: { backgroundColor: targetColor },
  transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] },
  // Phase 1 (online→idle): 200ms to #FFB800
  // Phase 2 (idle→offline): 200ms to #4B5563
});

// 5. Name text dim (concurrent with going offline)
const nameDim = {
  animate: { color: '#64748B' },
  transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] },
};

// 6. Card hover (voting)
const cardHover = {
  whileHover: { scale: 1.05 },
  transition: { type: 'spring', stiffness: 300, damping: 20 },
};

// 7. Card selection
const cardSelect = {
  animate: { scale: [1, 0.95, 1] },
  transition: { type: 'spring', stiffness: 300, damping: 20, duration: 0.2 },
};

// 8. Vote reveal stagger
const voteReveal = (index: number) => ({
  initial: { rotateY: 180, opacity: 0 },
  animate: { rotateY: 0, opacity: 1 },
  transition: {
    duration: 0.5,
    delay: index * 0.05,
    type: 'spring',
    stiffness: 300,
    damping: 20,
  },
});

// 9. Loading dot stagger
const loadingDot = (index: number) => ({
  animate: { opacity: [1, 0.3, 1] },
  transition: {
    duration: 1.2,
    repeat: Infinity,
    ease: 'easeInOut',
    delay: index * 0.15,
  },
});

// 10. Button tap feedback
const buttonTap = {
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 300, damping: 20 },
};
```

---

## Quick Reference — All Screens

| # | Screen Name | Frame ID | Canvas Position | Size |
|---|-------------|----------|-----------------|------|
| 1 | Landing Page Desktop | `SZm6E` | (0, 0) | 1920×1080 |
| 2 | Landing Page Mobile | `xVZ8g` | (2000, 0) | 375×812 |
| 3 | Create Session Modal Desktop | `N0dWH` | (3022, 0) | 1920×1080 |
| 4 | Create Session Modal Mobile | `bnV75` | (5022, 0) | 375×812 |
| 5 | Session View Desktop (Host) | `pPBTp` | (6263, 0) | 1920×1080 |
| 6 | Session View Mobile (Host) | `AB8SI` | (8269, 0) | 375×812 |
| 7 | Session View Desktop (Participant) | `SessionParticipantDesktop` | (6263, 1442) | 1920×1080 |
| 8 | Session View Mobile (Participant) | `SessionParticipantMobile` | (8269, 1442) | 375×812 |
| 9 | Join Page Desktop | `JoinPageDesktop` | (3035, 1442) | 1920×1080 |
| 10 | Join Page Mobile | `JoinPageMobile` | (5022, 1442) | 375×812 |
| 11 | Error Page Desktop | `ErrorPageDesktop` | (11725, 0) | 1920×1080 |
| 12 | Error Page Mobile | `ErrorPageMobile` | (13743, 0) | 375×812 |
| 13 | Anim — Participant Pulse | `AnimPulse1` | (9286, 0) | 1920×1080 |
| 14 | Anim — Participant Entrance | `AnimEntrance1` | (11411, 0) | 1920×1080 |
| 15 | Anim — Participant Exit | `AnimExit1` | (9286, 2981) | 1920×1080 |
| 16 | Anim — Status Change | `AnimParticipantStatusChangeDesktop` | (15251, 0) | 1920×1080 |
| 17 | Mobile Session Host | `MobSessionHost` | (0, 2900) | 390×844 |
| 18 | Mobile Voting View | `MobVotingView` | (530, 2900) | 390×844 |
| 19 | Mobile Results View | `MobResultsView` | (1060, 2900) | 390×844 |
| 20 | Mobile Join View | `MobJoinView` | (1590, 2900) | 390×844 |
| 21 | Mobile Loading State | `MobLoadingView` | (0, 4050) | 390×844 |
| 22 | Mobile Expired State | `MobExpiredView` | (530, 4050) | 390×844 |
| 23 | Mobile Error State | `MobErrorView` | (1060, 4050) | 390×844 |
| 24 | Desktop Loading State | `DskLoadingView` | (0, 5290) | 1920×1080 |
| 25 | Desktop Expired State | `DskExpiredView` | (2000, 5290) | 1920×1080 |
| 26 | Desktop Error State | `DskErrorView` | (4000, 5290) | 1920×1080 |
| 27 | Voting Mobile — No Selection | `VotMob1` | (0, 7080) | 390×844 |
| 28 | Voting Mobile — Selected | `VotMob2` | (530, 7080) | 390×844 |
| 29 | Voting Mobile — Expiring | `VotMob3` | (1060, 7080) | 390×844 |
| 30 | Voting Desktop — No Selection | `VotDsk1` | (0, 8280) | 1920×1080 |
| 31 | Voting Desktop — Selected+Hover | `VotDsk2` | (2000, 8280) | 1920×1080 |
| 32 | Voting Desktop — Disabled/Reveal | `VotDsk3` | (4000, 8280) | 1920×1080 |
