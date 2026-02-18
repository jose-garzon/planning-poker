# Mockup Build Plan

Static UI mockups following the design in `docs/design/screens.md`. No business logic — only visual fidelity with Framer Motion animations. Real routes, vertical slice architecture.

**Mockup navigation via `?state=` query param:**
- `/` — Landing
- `/join/demo-session` — Join page
- `/session/demo` — Lobby (default)
- `/session/demo?state=voting` — Voting
- `/session/demo?state=results` — Results
- `/session/demo?state=expired` — Expired

---

## Step 1 — Design System Foundation

- [x] Install `framer-motion` and `zustand` via `bun add`
- [x] Add `Bricolage_Grotesque` font via `next/font/google` in `app/layout.tsx` (weights: 400, 600, 700, 800), expose as `--font-bricolage` CSS var
- [x] Add Planning Poker color tokens to `tailwind.config.ts` under `theme.extend.colors.poker`:
  - `bg-page: #0F172A`, `bg-header: #1E2744`, `bg-row: #1A1F3A`
  - `green: #00FF88`, `magenta: #FF006E`, `gold: #FFB800`
  - `text: #E2E8F0`, `muted: #64748B`, `dim: #94A3B8`, `error: #EF4444`
- [x] Update `app/globals.css`: apply dark theme as default, set `font-family: var(--font-bricolage)` on body
- [x] Delete `shared/components/ui/button.tsx`, `input.tsx`, `dialog.tsx`
- [ ] Rebuild `shared/components/ui/button.tsx` — variants: `primary` (green), `secondary` (magenta), `ghost`, `danger`; sizes: `sm` 36px / `md` 44px / `lg` 52px; `whileTap={{ scale: 0.95 }}`
- [x] Rebuild `shared/components/ui/input.tsx` — #1E2744 bg, #64748B border → #00FF88 focus, 48px height
- [x] Create `shared/components/ui/status-dot.tsx` — 12px circle, `online` (#00FF88 pulse) / `idle` (#FFB800) / `offline` (#64748B)
- [x] Create `shared/components/ui/badge.tsx` — HOST badge (#FF006E bg), vote count badge
- [x] Create `shared/components/ui/timer-ring.tsx` — 80px SVG ring, green >60s / yellow 30-60s / red <30s pulsing, time text in center

---

## Step 2 — Landing Page (`/`)

- [x] Replace `modules/home/home.page.tsx` with Planning Poker hero layout
  - Full-page gradient (#0F172A → #1A2847)
  - "PLANNING" (#00FF88, 84px/900) + "POKER" (#FF006E, 84px/900)
  - Subtitle (#E2E8F0, 20px), "Create Session" CTA (magenta, lg), "or join with a link" text link
  - Mobile: 48px title, full-width button, single column
  - Animation: hero text stagger fade-in (50ms/word), button scale entrance (200ms)

---

## Step 3 — Join Session Page (`/join/[id]`)

- [x] Create `app/join/[id]/page.tsx` — delegates to module
- [x] Create `modules/join/join.page.tsx` — centered card layout
  - Dark bg #0F172A, card #1E2744 (max-width 420px, 16px radius)
  - Poker chip icon (64×64) + "You're invited!" (#00FF88, 28px/900)
  - Session name badge (#1A1F3A, #FF006E text)
  - Name `<Input>` (52px), "JOIN SESSION" `<Button>` (primary, full width), hint text
  - 2px #00FF88 accent line at card bottom
  - Animation: card fade + scale 0.9→1.0 (200ms), input border → #00FF88 on focus

---

## Step 4 — Session View (`/session/[id]`)

- [x] Create `app/session/[id]/page.tsx` — reads `?state` search param, passes to module
- [x] Create `modules/poker-session/session.page.tsx` — switches between lobby/voting/results/expired views
- [x] Create `modules/poker-session/components/participant-row.tsx`
  - Height 48px (desktop) / 52px (mobile), #1A1F3A bg, 8px radius
  - StatusDot + 32px avatar (initials) + name + HOST badge
  - Animation: slide-in from left translateX -100%→0 (300ms) on mount
- [x] Create `modules/poker-session/components/story-row.tsx`
  - Story title, status badge (VOTING NOW / PENDING), 48px height
- [x] Create `modules/poker-session/components/session-lobby.tsx` — desktop + mobile layout
  - Desktop: 60px header bar (#1E2744) + 280px left sidebar + main area (#0F172A) + bottom action bar
  - Mobile: fixed header + vertical participant stack + stories + bottom action bar (thumb zone)
  - Sidebar: "PARTICIPANTS" + participant rows + "STORIES" + story rows
  - Bottom bar: "+ ADD STORY" (magenta) + "REVEAL VOTES" (green, disabled state when no stories)

---

## Step 5 — Voting View (`?state=voting`)

- [ ] Create `modules/poker-session/components/fibonacci-card.tsx`
  - Default: #1A1F3A bg, #64748B border 2px, number #E2E8F0 (48px/900)
  - Hover (desktop): scale 1.05, border → #00FF88
  - Selected: #00FF88 bg, #0F172A text, #00CC6A border 3px, scale 1.1, checkmark top-right
  - Disabled: opacity 0.5, cursor not-allowed
  - `whileTap={{ scale: 0.95 }}` spring (stiffness: 300, damping: 20)
- [ ] Create `modules/poker-session/components/card-deck.tsx`
  - Values: `[0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?']`
  - Grid: 3 cols / 80×80px mobile — 6 cols / 100×100px desktop — 12px gap
  - Stagger entrance animation 50ms per card
- [ ] Create `modules/poker-session/components/voting-view.tsx`
  - Story header: Story ID (#00FF88, 20px/900) + title + `<TimerRing>` + vote count "3/5 voted"
  - Card deck below
  - Integrate into `session.page.tsx` when `state=voting`

---

## Step 6 — Results View (`?state=results`)

- [ ] Create `modules/poker-session/components/results-view.tsx`
  - Summary stats card (#1A1F3A): AVG / CLOSEST / SPREAD (3× 80×80px boxes)
  - Consensus indicator: "UNANIMOUS" (#00FF88) or "CLOSE CONSENSUS" (#FFB800)
  - Vote distribution: horizontal bars, green majority / magenta outliers, animated width 0→full (300ms, 100ms stagger)
  - Individual votes: participant rows + colored vote badge
  - "NEXT STORY" CTA (primary green, full-width mobile / 320px centered desktop)
  - Animation: bars stagger, count-up on average (150ms)

---

## Step 7 — State Pages

- [x] Create `app/session/[id]/loading.tsx` (Next.js loading UI)
  - Full-page #0F172A, centered spinner ring (96px, #00FF88 arc on #1E2744 track) + poker chip emoji
  - "Restoring your session..." + secondary hint text
  - 3 loading dots (cascading opacity pulse, 800ms, 200ms stagger)
- [x] Create `modules/poker-session/components/expired-view.tsx` (shown when `?state=expired`)
  - Centered card (max 480px): hourglass icon + "This session has expired" (24px/900)
  - 15-day description + last activity date badge
  - "CREATE NEW SESSION" button (green, 48px, 320px desktop / full-width mobile)
  - "Back to Home" text link + #FFB800 accent line at card bottom
- [] Create `shared/components/ui/error-toast.tsx`
  - Flush to top edge, translateY -100%→0 (300ms ease-out)
  - #1A1F3A bg, 4px #EF4444 left border, warning icon + message + dismiss X
  - Auto-dismiss progress bar (2px red, 5s linear shrink)

---

## After Each Step

```bash
bun run dev        # visual check in browser
bun run type-check # no TypeScript errors
bun run lint       # Biome passes
```
