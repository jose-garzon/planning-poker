# Sprint 1: Foundation + Session Flow

**Duration**: 2 weeks (Week 1-2)
**Goal**: HOST can create session, PARTICIPANTS can join, see each other in real-time

---

## Sprint Goals

1. ✅ Session creation with shareable link generation
2. ✅ Participant join flow with real-time sync
3. ✅ Live participant list visible to all users
4. ✅ Mobile-first UI shell with smooth animations
5. ✅ IndexedDB persistence for HOST session data

---

## User Stories

### Story 1.1: Session Creation Flow

**As a HOST**, I want to create a new Planning Poker session with a shareable link, so that my team can join and start estimating user stories.

#### Acceptance Criteria
- [ ] HOST clicks "Create Session" button on landing page
- [ ] HOST enters their name in a modal/form (required field, min 2 chars)
- [ ] System generates unique session ID (UUID format)
- [ ] System generates shareable link: `{domain}/session/{sessionId}`
- [ ] System stores session in HOST browser IndexedDB with 15-day expiry
- [ ] HOST sees session view with:
  - Session link displayed prominently
  - "Copy Link" button (copies to clipboard, shows "Copied!" toast)
  - Empty participant list (shows only HOST initially)
  - Empty stories list (shows "Add your first story" placeholder)
- [ ] Link copy button shows success feedback (<200ms animation)
- [ ] Session persists across page refresh (IndexedDB)


#### Design Prompt
**Landing Page**:
- Clean, minimal hero section with:
  - App title "Planning Poker" (large, bold)
  - Subtitle: "Estimate user stories together, in real-time"
  - Single CTA button: "Create Session" (large, primary color, centered)
- Mobile: Full-screen hero, button takes 80% width, centered vertically

**Create Session Modal**:
- Simple overlay modal (blur background)
- Title: "What's your name?"
- Input field: Large text input, placeholder "Enter your name"
- Submit button: "Create Session" (disabled until valid input)
- Mobile: Modal takes 90% screen width, large touch targets (min 44px)

**Session View (HOST)**:
- Header:
  - Session link in prominent card at top
  - Copy button next to link (icon + text on desktop, icon only on mobile)
- Main content: Two-column layout on desktop, single column on mobile
  - Left: Participant list (empty state: "Waiting for participants...")
  - Right: Stories list (empty state: "Add your first story" with CTA button)
- Footer: "Session expires in 15 days" (small, muted text)

**Animation Details**:
- Modal fade-in: 200ms ease-out
- Copy button: Scale 1.0 → 0.95 on tap (spring physics)
- Toast notification: Slide-in from top, 150ms ease-out

#### Technical Notes
- Use `crypto.randomUUID()` for session ID generation
- Store in IndexedDB schema:
  ```typescript
  interface SessionRecord {
    id: string;
    hostId: string;
    hostName: string;
    createdAt: number;
    expiresAt: number; // createdAt + 15 days
    stories: Story[];
    participants: Participant[];
  }
  ```
- Service file: `/modules/poker-session/services/sessionService.ts`
- API route: `POST /api/sessions` → returns `{ sessionId, shareableLink }`

---

### Story 1.2: Participant Join Flow

**As a PARTICIPANT**, I want to join a Planning Poker session via a shared link, so that I can vote on user stories with my team.

#### Acceptance Criteria
- [ ] PARTICIPANT opens shareable link in browser
- [ ] System validates session ID exists and is not expired
- [ ] If session invalid: Show "Session not found or expired" error page
- [ ] If session valid: Show join form with:
  - Session info: "Join {hostName}'s session"
  - Input field: "What's your name?" (required, min 2 chars)
  - Submit button: "Join Session"
- [ ] PARTICIPANT submits name
- [ ] System generates unique participant ID (UUID)
- [ ] System stores participant ID in localStorage (prevents duplicate sessions)
- [ ] System checks localStorage for existing participant ID:
  - If duplicate: Show "You're already in this session" error
  - If new: Proceed to session view
- [ ] PARTICIPANT sees session view with:
  - Participant list (shows all participants including self)
  - Empty stories list (if no stories added yet)
  - No session management controls (cannot add/edit stories)
- [ ] Session data persists across page refresh (localStorage)

#### Design Prompt
**Join Page**:
- Simple centered card layout
- Header: "You're invited!" (friendly tone)
- Subheader: "Join {hostName}'s Planning Poker session"
- Large text input: "What's your name?"
- Submit button: "Join Session" (large, primary color)
- Mobile: Card takes 90% width, centered vertically, large touch targets

**Error Page**:
- Centered message: "Session not found or expired"
- Description: "This session may have ended or the link is invalid"
- CTA button: "Create Your Own Session" (links to landing page)

**Session View (PARTICIPANT)**:
- Header: Session name (optional, defaults to "Planning Poker Session")
- Main content: Single column layout (mobile-first)
  - Participant list at top (compact, scrollable if >10 participants)
  - Stories list below (grayed out until voting starts)
- No "Add Story" button (read-only for participants)

**Animation Details**:
- Join form fade-in: 200ms ease-out
- Participant list: New participant slides in from top (150ms)
- Loading state: Subtle spinner on submit button

#### Technical Notes
- Validate session on server before showing join form
- API route: `POST /api/sessions/[sessionId]/join` → returns `{ participantId, session }`
- Store in localStorage:
  ```typescript
  interface ParticipantConnection {
    sessionId: string;
    participantId: string;
    participantName: string;
    joinedAt: number;
  }
  ```
- Prevent duplicate sessions: Check `localStorage.getItem('participant-${sessionId}')`
- Service file: `/modules/poker-session/services/participantService.ts`

---

### Story 1.3: Real-Time Participant List

**As a HOST or PARTICIPANT**, I want to see the list of participants update in real-time when someone joins or leaves, so that I know who's in the session.

#### Acceptance Criteria
- [ ] Participant list displays all connected participants with:
  - Participant name
  - Online status indicator (green dot = online, gray = offline)
  - HOST badge for session creator
- [ ] When new participant joins:
  - Their name appears in list immediately (<50ms latency)
  - All participants see the update via SSE
  - Smooth slide-in animation (150ms)
- [ ] When participant disconnects:
  - Status indicator turns gray (stays in list)
  - After 30 seconds offline: Remove from list with fade-out animation
- [ ] Participant count shown in header: "5 participants"
- [ ] If >10 participants: List becomes scrollable (fixed height)
- [ ] List updates persist across page refresh (IndexedDB for HOST, SSE sync for participants)

#### Design Prompt
**Participant List Component**:
- Card layout with header "Participants (5)"
- Each participant row:
  - Online status dot (8px, green or gray)
  - Name (truncated if >20 chars)
  - HOST badge (if applicable): Small chip, primary color
- Mobile: Compact rows (36px height), scrollable container (max 50vh)
- Desktop: Sidebar layout, larger rows (44px height)

**Online Status Indicator**:
- Green dot: Pulsing animation (subtle, 2s loop)
- Gray dot: Static, no animation
- Transition: Smooth color fade (300ms)

**New Participant Animation**:
- Slide-in from top + fade-in (150ms ease-out)
- Optional: Subtle highlight flash (background color pulse, 500ms)

**Offline/Removed Animation**:
- Fade-out + slide-out to left (200ms ease-in)
- Height collapse: Smooth accordion effect (150ms)

#### Technical Notes
- SSE event types:
  ```typescript
  type ParticipantEvent =
    | { type: 'participant-joined'; participant: Participant }
    | { type: 'participant-left'; participantId: string }
    | { type: 'participant-reconnected'; participantId: string };
  ```
- API route: `GET /api/sessions/[sessionId]/stream` (SSE endpoint)
- Client hook: `/shared/hooks/useSSE.ts`
- Server service: `/modules/poker-session/services/sseService.ts`
- Track online status with heartbeat mechanism:
  - Client sends heartbeat every 10 seconds
  - Server marks offline after 30 seconds no heartbeat
- Use Framer Motion's `AnimatePresence` for list animations

---

### Story 1.4: Mobile-First UI Shell

**As a USER (HOST or PARTICIPANT)**, I want the app to work smoothly on my phone, so that I can participate in Planning Poker sessions from anywhere.

#### Acceptance Criteria
- [ ] All pages responsive on mobile devices (320px - 768px width)
- [ ] Touch targets minimum 44px (iOS/Android accessibility guidelines)
- [ ] Single-column layout on mobile, multi-column on tablet+
- [ ] No horizontal scrolling on any screen size
- [ ] Typography scales appropriately:
  - Mobile: Base 16px, headings 24px-32px
  - Desktop: Base 16px, headings 28px-40px
- [ ] Buttons and cards have smooth tap animations (spring physics, <300ms)
- [ ] Loading states for all async actions (spinner or skeleton)
- [ ] Works on:
  - iOS Safari (iOS 15+)
  - Chrome Android (v100+)
  - Chrome/Firefox/Safari desktop

#### Design Prompt
**Mobile Layout Principles**:
- **Stack vertically**: All content in single column, no side-by-side on mobile
- **Large touch targets**: Buttons min 44px height, cards min 80px
- **Generous spacing**: 16px padding between sections, 8px between items
- **Fixed header**: Session info sticky at top (doesn't scroll away)
- **Bottom actions**: Primary CTAs at bottom (thumb-friendly zone)

**Color Palette** (Suggested):
- Primary: Blue (#3B82F6) - CTAs, HOST badge
- Success: Green (#10B981) - Online status, unanimous vote
- Warning: Yellow (#F59E0B) - Timer warning
- Error: Red (#EF4444) - Errors, offline state
- Neutral: Gray (#6B7280) - Text, borders
- Background: White (#FFFFFF) / Light Gray (#F9FAFB)

**Typography**:
- Font: Inter or System UI (fast loading)
- Headings: Bold (600-700 weight)
- Body: Regular (400 weight)
- Code: Monospace for session IDs

**Spacing System** (Tailwind):
- xs: 4px (gap between icon + text)
- sm: 8px (gap between list items)
- md: 16px (padding in cards)
- lg: 24px (section spacing)
- xl: 32px (page padding)

**Animation Standards**:
- All buttons: `whileTap={{ scale: 0.95 }}` (spring physics)
- Cards: `whileHover={{ scale: 1.02 }}` (desktop only)
- Modals: Fade + scale in (200ms ease-out)
- Lists: Staggered fade-in (50ms delay per item)

#### Technical Notes
- Use Tailwind responsive breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
- Test on real devices (BrowserStack or physical devices)
- Lighthouse score target: >90 on mobile
- Use `framer-motion` for all animations
- Avoid layout shift: Reserve space for dynamic content (e.g., participant list min height)

---

### Story 1.5: IndexedDB Session Persistence

**As a HOST**, I want my session data to persist across page refreshes, so that I don't lose my progress if I accidentally close the browser.

#### Acceptance Criteria
- [ ] HOST session data stored in IndexedDB:
  - Session metadata (ID, created date, expiry)
  - Participant list
  - User stories (when added in Sprint 2)
  - Vote history (when added in Sprint 2)
- [ ] Data persists across:
  - Page refresh (F5)
  - Browser close/reopen (same device)
  - Tab close/reopen
- [ ] Session expires after 15 days:
  - Show "Session expired" message on load
  - Redirect to landing page with option to create new session
- [ ] On session load:
  - If expired: Clean up IndexedDB, show expired message
  - If valid: Restore session state, reconnect SSE stream
- [ ] IndexedDB operations are async and non-blocking (no UI jank)

#### Design Prompt
**Loading State**:
- Show full-page spinner while loading session from IndexedDB
- Message: "Restoring your session..."
- Duration: <500ms for most cases

**Expired Session Page**:
- Centered message: "This session has expired"
- Description: "Sessions are automatically deleted after 15 days"
- CTA button: "Create New Session" (links to landing page)
- Optional: Show last activity date

**Error Handling**:
- If IndexedDB fails (quota exceeded, corrupted data):
  - Show error toast: "Failed to load session. Starting fresh."
  - Create new session instead
  - Log error to console for debugging

#### Technical Notes
- IndexedDB schema:
  ```typescript
  const DB_NAME = 'planning-poker';
  const DB_VERSION = 1;
  const STORE_NAME = 'sessions';

  interface SessionStore {
    id: string; // Primary key
    data: SessionRecord;
    lastUpdated: number;
  }
  ```
- Use `idb` library for Promise-based API (simpler than raw IndexedDB)
- Service file: `/shared/lib/indexedDB.ts`
- Hook: `/modules/poker-session/hooks/useSessionStorage.ts`
- Auto-cleanup on app load: Delete sessions with `expiresAt < Date.now()`
- Handle quota exceeded error: Show warning, suggest clearing old sessions

---

## Sprint 1 Acceptance Criteria

### Functional Requirements
- ✅ HOST can create session and get shareable link
- ✅ PARTICIPANT can join via link
- ✅ Real-time participant list updates (<50ms latency)
- ✅ Session persists across refresh (IndexedDB)
- ✅ Works on mobile devices (iOS Safari, Chrome Android)

### Performance Requirements
- ✅ SSE latency: <50ms (measured with Network tab)
- ✅ Animations: 60fps (verified with Chrome DevTools Performance)
- ✅ IndexedDB operations: <200ms (measured with console.time)
- ✅ Lighthouse score: >90 on mobile

### Code Quality
- ✅ TypeScript strict mode, no linting errors
- ✅ Unit tests for services (session, participant, IndexedDB)
- ✅ E2E test: Create session → Join as participant → See participant list
- ✅ No console errors in production build

---

## Dependencies & Blockers

### External Dependencies
- None (all features self-contained)

### Internal Dependencies
- IndexedDB setup must complete before session creation
- SSE endpoint must be ready before participant join flow

### Potential Blockers
- Browser compatibility issues (iOS Safari IndexedDB quirks)
- SSE connection issues on mobile networks (auto-reconnect should handle)

---

## Testing Plan

### Unit Tests
- Session creation service (sessionService.ts)
- Participant join validation (participantService.ts)
- IndexedDB CRUD operations (indexedDB.ts)
- UUID generation uniqueness

### E2E Tests (Playwright)
1. **Happy Path**: Create session → Copy link → Join as participant → See both in participant list
2. **Expired Session**: Load expired session → See error message
3. **Duplicate Join**: Join same session twice → See "already joined" error
4. **Offline Recovery**: Disconnect → Reconnect → Participant list updates

### Manual Testing
- Test on iOS Safari (real device or BrowserStack)
- Test on Chrome Android (real device)
- Verify animations smooth at 60fps (Chrome DevTools Performance)
- Test IndexedDB quota handling (fill storage, verify graceful error)

---

## Design Assets Needed

### Sprint 1 Deliverables (Design Agent)
1. **Landing Page**: Hero section + "Create Session" CTA
2. **Create Session Modal**: Name input + submit button
3. **Join Page**: Session invite card + name input
4. **Session View (HOST)**: Shareable link card + participant list + stories placeholder
5. **Session View (PARTICIPANT)**: Participant list + stories placeholder
6. **Participant List Component**: Online status dots + HOST badge
7. **Error Pages**: Session not found, session expired, duplicate join
8. **Loading States**: Spinner for async actions, skeleton for list loading

### Design Specifications
- All designs mobile-first (320px base, scale up to 1024px)
- Component library: Use Base UI components from `/llms.txt`
- Color palette, typography, spacing system (defined in Story 1.4)
- Framer Motion animation specs (defined per story)

---

## Open Questions for Sprint 1

### To Resolve Before Development
- 🤔 Should we show a "Session created" success message after creation? (Nice-to-have)
- 🤔 Do we need a "Leave Session" button for participants? (Defer to Sprint 2)
- 🤔 Should HOST be able to rename the session? (Defer to v2)

### To Validate During Sprint
- 🧪 Is 15-day expiry too short? (Monitor user feedback)
- 🧪 Does IndexedDB quota cause issues for heavy users? (Test with large sessions)
