# Missing Pages & Overlays

These are screen-level flows missing from the current implementation. Each entry includes a mockup suggestion and a ready-to-use prompt for the `web-design-specialist` agent.

---

## 1. Add Story Form (Modal)

**Trigger**: Host clicks "ADD STORY" in the session footer.
**File to create**: `modules/poker-session/components/add-story-modal.tsx`

### Mockup

```
╔══════════════════════════════════════════╗
║  backdrop: bg-poker-bg-page/80 blur-sm   ║
║                                          ║
║  ┌──────────────────────────────────┐    ║
║  │  ADD STORY              [✕]      │    ║
║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    ║
║  │                                  │    ║
║  │  STORY ID:                       │    ║
║  │  ┌──────────────────────────┐    │    ║
║  │  │ e.g. MIC-100             │    │    ║
║  │  └──────────────────────────┘    │    ║
║  │                                  │    ║
║  │  TITLE:                          │    ║
║  │  ┌──────────────────────────┐    │    ║
║  │  │ As a user I can...       │    │    ║
║  │  └──────────────────────────┘    │    ║
║  │                                  │    ║
║  │  [CANCEL]      [+ ADD STORY]     │    ║
║  └──────────────────────────────────┘    ║
║                                          ║
╚══════════════════════════════════════════╝
```

### web-design-specialist prompt

```
Create `modules/poker-session/components/add-story-modal.tsx`.

This is a modal overlay the host uses to add a new story to the session.
It appears over the session lobby when the host clicks "ADD STORY".

Props interface:
```ts
interface AddStoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (storyId: string, title: string) => void;
}
```

Layout:
- Full-screen backdrop: `bg-poker-bg-page/80 backdrop-blur-sm`, fixed inset-0, flex center
- Card: `bg-poker-bg-header rounded-[4px] w-full max-w-[480px] mx-4 p-6 flex flex-col gap-5`
- Animate card with Framer Motion: scale 0.96→1 + opacity 0→1 on open, reverse on close (AnimatePresence)

Header row (space-between):
- Title: `text-[14px] font-black tracking-widest text-poker-magenta` — "ADD STORY"
- Close button: `Button variant="ghost" size="sm"` with ✕ character, calls onClose

Divider: `h-[1px] bg-poker-bg-row`

Form (`flex flex-col gap-4`):
- Use shared `Input` component for both fields
  - Story ID: `label="STORY ID:" labelClassName="text-[11px] font-black tracking-widest text-poker-green"` placeholder="e.g. MIC-100" maxLength={20}
  - Title: same labelClassName, label="TITLE:", placeholder="As a user, I can..." maxLength={80}
- Footer row (`flex gap-3 justify-end`):
  - `Button variant="ghost" size="md"` — "CANCEL" — calls onClose
  - `Button variant="primary" size="md" type="submit"` — "+ ADD STORY"

Behaviour:
- Pressing Escape calls onClose (keydown listener)
- Clicking backdrop calls onClose
- `'use client'` directive required
- No hardcoded hex/rgb colors — all Tailwind theme classes only
- 2-space indent, 100 char line width, single quotes, semicolons always
```

---

## 2. Timer Setup (Bottom Sheet / Modal)

**Trigger**: Host clicks "START VOTE" in the session footer.
**File to create**: `modules/poker-session/components/timer-setup-modal.tsx`

### Mockup

```
╔══════════════════════════════════════════╗
║  backdrop: bg-poker-bg-page/80           ║
║                                          ║
║  ┌──────────────────────────────────┐    ║
║  │  START VOTE             [✕]      │    ║
║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    ║
║  │                                  │    ║
║  │  Story voting for:               │    ║
║  │  "As a user, I can log in"       │    ║
║  │                                  │    ║
║  │  TIMER DURATION:                 │    ║
║  │                                  │    ║
║  │  ┌──────┐  ┌──────┐  ┌──────┐   │    ║
║  │  │  1m  │  │  2m  │  │  5m  │   │    ║
║  │  └──────┘  └──────┘  └──────┘   │    ║
║  │                                  │    ║
║  │  ┌──────────────────────────┐    │    ║
║  │  │  [ START VOTE ▶ ]        │    │    ║
║  │  └──────────────────────────┘    │    ║
║  └──────────────────────────────────┘    ║
╚══════════════════════════════════════════╝
```

### web-design-specialist prompt

```
Create `modules/poker-session/components/timer-setup-modal.tsx`.

Host uses this to choose timer duration before voting starts.

Props interface:
```ts
interface TimerSetupModalProps {
  open: boolean;
  storyTitle: string;
  onClose: () => void;
  onStart: (durationSeconds: number) => void;
}
```

Layout:
- Full-screen backdrop: `bg-poker-bg-page/80 backdrop-blur-sm` fixed inset-0, flex center
- Card: `bg-poker-bg-header rounded-[4px] w-full max-w-[400px] mx-4 p-6 flex flex-col gap-5`
- Animate card with Framer Motion: scale 0.96→1 + opacity 0→1, AnimatePresence for unmount

Header row (space-between):
- "START VOTE" in `text-[14px] font-black tracking-widest text-poker-green`
- Close button: `Button variant="ghost" size="sm"` with ✕

Story label:
- `text-[11px] font-black tracking-widest text-poker-muted` — "VOTING FOR:"
- `text-sm text-poker-text font-medium mt-1 truncate` — story title

Duration picker:
- Label: `text-[11px] font-black tracking-widest text-poker-green` — "TIMER DURATION:"
- Three option buttons: 1 min (60s), 2 min (120s), 5 min (300s)
- Each: `h-12 flex-1 rounded-[4px] text-sm font-black border-2 transition-colors`
  - Unselected: `border-poker-bg-row bg-poker-bg-row text-poker-muted`
  - Selected: `border-poker-green bg-poker-green/10 text-poker-green`
- Local state `selectedDuration`, default 120
- Wrap in `flex gap-3`

CTA:
- `Button variant="primary" size="xl" className="w-full rounded-[4px]"` — "START VOTE ▶"
- Calls `onStart(selectedDuration)` then `onClose()`

Escape key closes modal. Backdrop click closes modal.
- 'use client', no hardcoded hex/rgb, 2-space indent, single quotes, semicolons
```

---

## 3. Offline / Reconnecting Banner

**Trigger**: SSE connection drops.
**File to create**: `modules/poker-session/components/reconnecting-banner.tsx`

### Mockup

```
┌──────────────────────────────────────────────┐
│  ⟳  Connection lost — reconnecting...  3s   │
└──────────────────────────────────────────────┘
 (fixed top of screen, below header, full width)
```

### web-design-specialist prompt

```
Create `modules/poker-session/components/reconnecting-banner.tsx`.

A fixed banner shown when the SSE connection is lost.

Props interface:
```ts
interface ReconnectingBannerProps {
  visible: boolean;
  retryIn: number; // seconds until next retry
}
```

Layout:
- `fixed top-14 md:top-[72px] inset-x-0 z-50` (sits just below the LobbyHeader)
- Inner div: `bg-poker-magenta px-4 py-2 flex items-center justify-center gap-3`
- Animate with Framer Motion: `AnimatePresence`, slide in from top (`y: -40 → 0`) + opacity

Content (single row, centred):
- Spinning icon: an SVG arrow-circle or just "⟳" in a `motion.span` with `animate={{ rotate: 360 }}` `transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}`
- Text: `text-xs font-black text-poker-bg-page` — "Connection lost — reconnecting..."
- Countdown: `text-xs font-black text-poker-bg-page/70` — `{retryIn}s`

No interactive elements. Banner disappears (`visible=false`) when connection restores.
- 'use client', no hardcoded hex/rgb, 2-space indent, single quotes, semicolons
```

---

## 4. Host Disconnected Overlay

**Trigger**: Participant's SSE receives a `host-offline` event.
**File to create**: `modules/poker-session/components/host-offline-overlay.tsx`

### Mockup

```
╔══════════════════════════════════════════╗
║  backdrop: bg-poker-bg-page/70 blur-sm   ║
║                                          ║
║        ┌──────────────────────┐          ║
║        │  HOST OFFLINE        │          ║
║        │  ──────────────────  │          ║
║        │                      │          ║
║        │  Waiting for host    │          ║
║        │  to reconnect...     │          ║
║        │                      │          ║
║        │    ●  ●  ●  (pulse)  │          ║
║        └──────────────────────┘          ║
║                                          ║
╚══════════════════════════════════════════╝
```

### web-design-specialist prompt

```
Create `modules/poker-session/components/host-offline-overlay.tsx`.

Shown to participants when the host's connection drops.

Props interface:
```ts
interface HostOfflineOverlayProps {
  visible: boolean;
}
```

Layout:
- Full-screen backdrop: `bg-poker-bg-page/70 backdrop-blur-sm` fixed inset-0 z-50, flex center
- Card: `bg-poker-bg-header rounded-[4px] w-full max-w-[320px] mx-4 p-8 flex flex-col items-center gap-4 text-center`
- AnimatePresence + Framer Motion: card scale 0.9→1 + opacity, backdrop fades in

Card content:
- Header: `text-[14px] font-black tracking-widest text-poker-magenta` — "HOST OFFLINE"
- Divider: `h-[1px] w-full bg-poker-bg-row`
- Body text: `text-sm text-poker-muted` — "Waiting for host to reconnect..."
- Pulsing dots: three `motion.span` elements with `bg-poker-muted w-2 h-2 rounded-full`
  - Stagger their `animate={{ opacity: [1, 0.2, 1] }}` by 0.2s delay each
  - `transition={{ repeat: Infinity, duration: 1.2 }}`
  - Wrap in `flex gap-2 mt-2`

No interactive elements — purely informational.
- 'use client', no hardcoded hex/rgb, 2-space indent, single quotes, semicolons
```
