# Sprint 2: Voting + Results

**Duration**: 2 weeks (Week 3-4)
**Goal**: Complete end-to-end voting flow with smooth animations and real-time sync

---

## Sprint Goals

1. ✅ User story management (add/edit/delete by HOST)
2. ✅ Voting UI with Fibonacci cards (60fps animations)
3. ✅ Vote submission with optimistic updates + SSE sync
4. ✅ Results reveal (unanimous celebration vs. non-unanimous selection)
5. ✅ Story progression with score persistence

---

## User Stories

### Story 2.1: User Story Management (HOST)

**As a HOST**, I want to add, edit, and delete user stories in my session, so that my team can vote on the work we need to estimate.

#### Acceptance Criteria
- [ ] HOST sees "Add Story" button in session view
- [ ] Clicking "Add Story" opens inline form (no modal) with:
  - Story ID input (e.g., "MIC-100", required, max 20 chars)
  - Title input (plain text, required, max 200 chars)
  - "Save" and "Cancel" buttons
- [ ] After saving:
  - Story appears in list immediately (optimistic update)
  - Story syncs to IndexedDB
  - All participants see new story via SSE (<50ms latency)
- [ ] HOST can edit existing story:
  - Click "Edit" icon on story card
  - Inline form appears with current values
  - Save updates story everywhere (IndexedDB + SSE broadcast)
- [ ] HOST can delete story:
  - Click "Delete" icon on story card
  - Show confirmation dialog: "Delete {storyId}?"
  - On confirm: Remove from list with fade-out animation (200ms)
  - Broadcast deletion to all participants
- [ ] Stories display in order added (chronological)
- [ ] Max 100 stories per session (soft limit, warn at 90)
- [ ] No limit enforced in MVP (can add as many as IndexedDB allows)

#### Design Prompt
**Story List Component**:
- Card-based layout, one card per story
- Each card shows:
  - Story ID (bold, monospace font)
  - Title (regular text, truncated if >100 chars)
  - Status badge: "Pending" | "Voting" | "Completed"
  - Score (if completed): Large number, primary color
  - Edit/Delete icons (HOST only, small, top-right corner)
- Mobile: Single column, full-width cards
- Desktop: Grid layout (2 columns), cards 400px width

**Add Story Form**:
- Inline form at top of story list (pushes existing stories down)
- Two input fields stacked vertically:
  - Story ID: Smaller input, placeholder "e.g., MIC-100"
  - Title: Larger textarea, placeholder "Describe the user story"
- Action buttons below inputs:
  - "Save" (primary, enabled when both fields valid)
  - "Cancel" (secondary, resets form)
- Mobile: Full-width inputs, 44px height
- Desktop: Inputs 400px width, 40px height

**Edit Form**:
- Same layout as Add form, but appears in place of story card (smooth swap animation)
- Pre-filled with existing values
- Cancel restores original card (no changes)

**Delete Confirmation Dialog**:
- Small modal overlay (center screen)
- Title: "Delete story?"
- Body: "Are you sure you want to delete {storyId}? This cannot be undone."
- Buttons:
  - "Delete" (red, destructive style)
  - "Cancel" (gray, secondary)

**Animation Details**:
- Add form: Slide down from top (200ms ease-out)
- New story card: Fade in + slide up from bottom (150ms)
- Edit form: Cross-fade with card (200ms)
- Delete: Fade out + scale down (200ms), then height collapse (150ms)

#### Technical Notes
- API endpoints:
  - `POST /api/sessions/[sessionId]/stories` → Add story
  - `PATCH /api/sessions/[sessionId]/stories/[storyId]` → Edit story
  - `DELETE /api/sessions/[sessionId]/stories/[storyId]` → Delete story
- SSE events:
  - `story-added`: Broadcast new story to all participants
  - `story-updated`: Broadcast edits
  - `story-deleted`: Broadcast deletion
- IndexedDB: Update `session.stories` array on each change
- Service: `/modules/poker-session/services/storyService.ts`
- Component: `/modules/poker-session/components/story-list/`

---

### Story 2.2: Voting UI with Fibonacci Cards

**As a PARTICIPANT**, I want to select a Fibonacci card to cast my vote, so that I can estimate the complexity of the current user story.

#### Acceptance Criteria
- [ ] When HOST starts voting (Story 2.3), PARTICIPANTS see:
  - Current story details (ID + title) at top
  - Fibonacci card deck: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, "?"]
  - Timer countdown (if set by HOST)
  - Vote count: "3/5 voted" (shows who voted, not what they voted)
- [ ] Each card is a tappable button with:
  - Large number/symbol (48px font size)
  - Clear selected state (primary color, scale 1.1)
  - Smooth animations (60fps):
    - Hover: Scale 1.05 (desktop only)
    - Tap: Scale 0.95 → 1.0 spring animation
    - Selected: Scale 1.0 → 1.1 + color change (300ms ease-out)
- [ ] Tapping a card:
  - Selects card immediately (optimistic update)
  - Deselects previous card (if any)
  - Sends vote to server (background, non-blocking)
  - Updates vote count for all participants via SSE
- [ ] PARTICIPANT can change vote:
  - Tap different card → updates selection smoothly
  - Only latest vote counts (server overwrites previous)
- [ ] Cards are keyboard accessible:
  - Tab to focus card, Enter/Space to select
  - Arrow keys to navigate between cards
  - Clear focus ring on active card
- [ ] "?" (Skip) card explained:
  - Tooltip on hover: "Skip this story or vote later"
  - Counts as "no estimate" (not a valid Fibonacci number)

#### Design Prompt
**Voting Section Layout**:
- Header:
  - Story card (highlighted, larger than in list view)
    - Story ID (bold, 20px)
    - Title (16px, multiline if needed)
  - Timer (if active): Circular progress ring, time remaining in center
  - Vote count: "3/5 voted" below timer
- Card deck:
  - Grid layout: 4 cards per row on mobile, 6 per row on desktop
  - Each card: Square (80px × 80px on mobile, 100px × 100px on desktop)
  - Generous gaps: 12px between cards

**Card Design**:
- Default state:
  - White background, gray border (2px)
  - Number in center (48px, bold)
  - Subtle shadow (elevation 1)
- Hover state (desktop):
  - Scale: 1.05
  - Shadow: Elevation 2 (more prominent)
  - Border color: Primary color (preview selection)
- Selected state:
  - Background: Primary color (blue)
  - Text: White
  - Scale: 1.1
  - Border: 3px solid, darker blue
  - Optional: Checkmark icon in top-right corner
- Disabled state (after vote revealed):
  - Opacity: 0.5
  - Cursor: not-allowed

**Timer Component**:
- Circular progress ring (SVG, 80px diameter)
- Time remaining in center (24px, bold)
- Color transitions:
  - >60s: Green
  - 30-60s: Yellow
  - <30s: Red (pulsing animation)
- When expired: Show "Time's up!" message, timer stops at 0

**Vote Count Display**:
- Text: "3/5 voted"
- Icon: Checkmark next to participant name in list (shows who voted)
- Update in real-time as votes come in

**Animation Details**:
- Card tap: Spring animation (stiffness: 300, damping: 20)
- Selection transition: Scale + color change (300ms ease-out)
- Vote count update: Number increment animation (count-up effect, 150ms)

#### Technical Notes
- Fibonacci values constant: `/shared/lib/fibonacci.ts`
  ```typescript
  export const FIBONACCI_CARDS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?'] as const;
  export type FibonacciValue = typeof FIBONACCI_CARDS[number];
  ```
- Component: `/modules/voting/components/card-selector/`
- Hook: `/modules/voting/hooks/useVoting.ts` (Zustand store + optimistic updates)
- SSE event: `vote-submitted` → Update vote count (not individual votes)

---

### Story 2.3: Vote Submission & Real-Time Sync

**As a HOST**, I want to start voting on a story with a timer, so that my team can estimate together within a time limit.

#### Acceptance Criteria
- [ ] HOST sees "Start Voting" button next to each pending story
- [ ] Clicking "Start Voting" opens timer setup modal:
  - Timer duration input (dropdown or number input, default 2 minutes)
  - Options: 1 min, 2 min, 3 min, 5 min, 10 min, No timer
  - "Start" button (primary, large)
  - "Cancel" button
- [ ] After clicking "Start":
  - Modal closes
  - Story status changes to "Voting"
  - Timer countdown begins (all participants see it)
  - Voting UI appears for all participants (Story 2.2)
  - HOST sees live vote count: "3/5 voted"
  - HOST cannot add/edit/delete stories during voting (buttons disabled)
- [ ] Timer behavior:
  - Counts down to 0 in real-time (all participants synced)
  - When reaches 0: Show soft warning ("Time's up!"), voting continues
  - HOST can still manually end voting at any time
- [ ] HOST sees "Reveal Results" button (always enabled, even if 0 votes)
- [ ] Vote submission (PARTICIPANT):
  - Optimistic update: Card selected immediately in UI
  - Background POST to `/api/sessions/[sessionId]/vote`
  - If success: Vote confirmed, SSE broadcasts to all
  - If failure: Show error toast, revert selection, allow retry
- [ ] Real-time sync:
  - When PARTICIPANT votes: All users see vote count increment (<50ms latency)
  - SSE event includes: `participantId` (not vote value, hidden until reveal)
  - Participant list shows checkmark next to voters

#### Design Prompt
**Start Voting Button**:
- Primary button, positioned on story card (HOST view only)
- Text: "Start Voting"
- Icon: Play icon (▶) before text
- Mobile: Full-width within card, 44px height
- Desktop: Inline button, 40px height

**Timer Setup Modal**:
- Centered overlay modal (medium size)
- Title: "Set voting timer"
- Timer options:
  - Radio buttons (vertical stack on mobile, horizontal on desktop)
  - Options: [1, 2, 3, 5, 10, "No timer"]
  - Default selected: 2 minutes
- Start button: Large, full-width (mobile) or centered (desktop)

**Voting Status (HOST View)**:
- Story card changes appearance:
  - Border: Animated gradient (pulsing effect, indicates active voting)
  - Badge: "VOTING" (top-left, bright color)
  - Vote count: Large text, prominent position
  - Timer: Circular progress (if timer set)
- Participant list: Checkmarks next to voters (green icon)

**Reveal Results Button**:
- Large CTA button at bottom of voting section
- Text: "Reveal Results"
- Enabled always (even if 0 votes)
- Color: Success green (indicates completion)
- Animation: Subtle pulse (draws attention)

**Error Handling**:
- Vote submission failure toast:
  - Message: "Failed to submit vote. Retrying..."
  - Auto-dismiss after 3 seconds
  - Background retry (exponential backoff: 1s, 2s, 4s)

**Animation Details**:
- Modal: Fade + scale in (200ms ease-out)
- Voting started: Story card border animation (smooth gradient rotation, 3s loop)
- Vote count: Count-up animation when incremented (150ms)
- Reveal button: Pulse animation (scale 1.0 → 1.02 → 1.0, 2s loop)

#### Technical Notes
- API endpoints:
  - `POST /api/sessions/[sessionId]/stories/[storyId]/start-voting` → Start timer, broadcast
  - `POST /api/sessions/[sessionId]/vote` → Submit vote
    ```typescript
    {
      participantId: string;
      storyId: string;
      vote: FibonacciValue;
    }
    ```
- SSE events:
  - `voting-started`: Broadcast timer duration, story ID
  - `vote-submitted`: Broadcast participant ID (not vote value)
  - Timer sync: Client-side countdown, synced on load
- Service: `/modules/voting/services/votingService.ts`
- Hook: `/modules/voting/hooks/useVoting.ts` (optimistic updates, retry logic)

---

### Story 2.4: Results Reveal (Unanimous & Non-Unanimous)

**As a HOST**, I want to reveal voting results and see if the vote was unanimous, so that I can finalize the story score or facilitate discussion.

#### Acceptance Criteria
- [ ] When HOST clicks "Reveal Results":
  - Voting UI disappears for all participants
  - Results screen appears with smooth transition (300ms fade)
  - Story status changes to "Completed" (or "Pending" if re-voting)
- [ ] **Unanimous Vote** (all participants voted same value):
  - Show celebration screen:
    - Large score display (e.g., "8", 72px font)
    - Message: "🎉 Unanimous!"
    - Confetti animation (falls from top, 2 seconds)
    - Participant list with all votes visible (all same value)
  - Score automatically saved to story
  - After 2 seconds: Auto-advance to next story (or show "All done!" if last story)
- [ ] **Non-Unanimous Vote** (multiple different values):
  - Show vote distribution:
    - Bar chart or card layout showing vote counts per value
    - Example: "5 → 3 votes", "8 → 2 votes"
    - Participant list with votes visible next to names
  - Highlight top 2 most-voted options as large buttons:
    - Example: [5] [8] buttons (primary color, large)
    - If 3-way tie: Show all 3 options
    - If all votes different: Show top 2 by count (ties broken by lowest Fibonacci value)
  - HOST clicks one button to select final score
  - Selected score saved to story
  - Advance to next story (same 2-second auto-advance as unanimous)
- [ ] **Edge Cases**:
  - 0 votes submitted: Show "No votes submitted" message, HOST can skip or re-vote
  - Only "?" votes: Treat as "no estimate," HOST can skip or re-vote
  - Mix of numbers + "?": Ignore "?" in calculations, use only numeric votes
- [ ] All participants see results in real-time (SSE broadcast)
- [ ] Results persist: Refresh page shows completed stories with scores

#### Design Prompt
**Unanimous Results Screen**:
- Centered layout (mobile & desktop)
- Score display:
  - Huge number (72px, bold, primary color)
  - "🎉 Unanimous!" message above score (32px)
  - Confetti animation: Colorful particles fall from top (Framer Motion or CSS animation)
- Participant list below:
  - Compact rows: Name + vote (all same value)
  - Optional: Small checkmark icons next to each
- Auto-advance countdown: "Next story in 2..." (small, bottom)

**Non-Unanimous Results Screen**:
- Vote distribution section (top):
  - Bar chart or card grid showing vote counts
  - Example layout:
    ```
    [5] 3 votes ████████████ (60%)
    [8] 2 votes ████████     (40%)
    ```
  - Sorted by vote count (descending)
- Selection buttons (middle):
  - Large buttons for top 2 options
  - Text: "Choose final score:"
  - Button size: 120px × 120px (mobile), 150px × 150px (desktop)
  - Hover: Scale 1.05
  - Tap: Scale 0.95 → Save score + advance
- Participant list (bottom):
  - Show all votes: "Alice → 5", "Bob → 8"
  - Sorted by vote value (ascending)

**No Votes Screen**:
- Centered message: "No votes submitted"
- Description: "Start voting again or skip this story"
- Buttons:
  - "Vote Again" (primary)
  - "Skip Story" (secondary)

**Animation Details**:
- Results reveal: Fade-in (300ms) + slide up (200ms)
- Confetti: Falls from top over 2 seconds (use `canvas-confetti` library or Framer Motion)
- Score selection: Button tap → Scale animation → Fade-out to next story (400ms total)
- Auto-advance: Countdown timer visible (subtle, non-intrusive)

#### Technical Notes
- API endpoints:
  - `POST /api/sessions/[sessionId]/stories/[storyId]/reveal` → Reveal results
    - Returns: `{ unanimous: boolean, voteCounts: Record<string, number>, topVotes: string[], participants: Record<string, string> }`
  - `POST /api/sessions/[sessionId]/stories/[storyId]/set-score` → HOST picks final score (non-unanimous case)
- SSE events:
  - `voting-ended`: Broadcast results to all participants
  - `score-set`: Broadcast final score when HOST selects
- Confetti library: `canvas-confetti` (lightweight, ~10kb)
- Service: `/modules/voting/services/resultsService.ts`
- Component: `/modules/voting/components/vote-results/`

---

### Story 2.5: Story Progression & Score Persistence

**As a HOST or PARTICIPANT**, I want to see completed stories with their scores and progress through all stories in order, so that I can track estimation progress.

#### Acceptance Criteria
- [ ] Story list shows 3 states:
  - **Completed**: Story ID + title + score (green badge, large score)
  - **Voting**: Story ID + title + "VOTING" badge (animated)
  - **Pending**: Story ID + title + "Pending" badge (gray)
- [ ] After voting completes (score saved):
  - Story moves to "Completed" state
  - Score displayed prominently on story card (48px, primary color)
  - Auto-scroll to next pending story (smooth scroll, 400ms)
  - Next story becomes "current" (highlighted)
- [ ] HOST can re-vote on completed stories:
  - Click "Vote Again" button on completed story card
  - Clears previous score (asks for confirmation)
  - Restarts voting flow (same as Story 2.3)
- [ ] When all stories completed:
  - Show "All Done!" celebration message
  - Summary card:
    - Total stories estimated: X
    - Average score: Y (calculated from numeric votes only)
    - Session duration: Z minutes
  - Option to add more stories or end session
- [ ] Scores persist in IndexedDB:
  - Refresh page: All scores visible
  - HOST browser crash: Scores restored on rejoin
- [ ] Participants see scores in real-time (SSE sync)
- [ ] Story order never changes (chronological, by creation time)

#### Design Prompt
**Story List States**:
- **Completed Card**:
  - Score badge: Large circle (64px diameter), primary color background
  - Score value: White text, 32px, centered in badge
  - Story info: ID + title, gray text (indicates done)
  - "Vote Again" button: Small, secondary style, bottom-right
  - Position: Moves to top of list (optional) or stays in chronological order

- **Voting Card** (Current):
  - Border: Animated gradient (pulsing effect)
  - Badge: "VOTING" (top-left, bright color)
  - Voting UI embedded in card (Fibonacci cards shown inline)
  - Timer: Visible at top of card

- **Pending Card**:
  - Gray border, muted colors
  - Badge: "Pending" (gray)
  - No interaction (locked until previous story completes)

**Auto-Scroll Behavior**:
- After score saved: Smooth scroll to next pending story (400ms ease-out)
- Scroll target: Top of next story card aligned with viewport top (minus 80px padding)

**All Done Celebration**:
- Centered card (full screen on mobile, 600px width on desktop)
- Title: "🎉 All stories estimated!"
- Summary stats:
  - "Estimated X stories" (large, bold)
  - "Average score: Y" (if applicable)
  - "Session duration: Z minutes"
- Buttons:
  - "Add More Stories" (primary, opens add story form)
  - "End Session" (secondary, shows end session confirmation)

**Vote Again Confirmation**:
- Small modal: "Re-vote on {storyId}?"
- Message: "This will clear the previous score. Continue?"
- Buttons: "Yes, Vote Again" (destructive), "Cancel"

**Animation Details**:
- Score reveal: Scale in (0.8 → 1.0) + fade-in (300ms)
- Auto-scroll: Smooth scroll with easing (400ms)
- All Done: Confetti + fade-in (500ms)

#### Technical Notes
- IndexedDB schema update:
  ```typescript
  interface Story {
    id: string;
    title: string;
    score: string | null; // Fibonacci value or null
    status: 'pending' | 'voting' | 'completed';
    votes: Record<string, string>; // participantId -> vote
    completedAt: number | null; // Timestamp
  }
  ```
- API endpoint:
  - `POST /api/sessions/[sessionId]/stories/[storyId]/clear-score` → Re-vote
- SSE event:
  - `story-completed`: Broadcast score, triggers auto-scroll for all
- Calculate average score: Filter out "?" and null, average numeric values
- Service: `/modules/poker-session/services/storyService.ts`
- Component: `/modules/poker-session/components/story-list/`

---

## Sprint 2 Acceptance Criteria

### Functional Requirements
- ✅ HOST can add/edit/delete user stories
- ✅ HOST can start voting with timer
- ✅ PARTICIPANTS can select Fibonacci cards (smooth animations)
- ✅ Votes sync in real-time (<50ms latency)
- ✅ Results reveal with unanimous celebration or HOST selection
- ✅ Scores persist across refresh (IndexedDB)
- ✅ Auto-advance to next story after voting

### Performance Requirements
- ✅ 60fps animations on mobile (card tap, results reveal, confetti)
- ✅ SSE latency: <50ms (vote count updates)
- ✅ IndexedDB write: <200ms (score persistence)
- ✅ Lighthouse score: >90 on mobile

### Code Quality
- ✅ TypeScript strict mode, no linting errors
- ✅ Unit tests for voting logic, results calculation, score persistence
- ✅ E2E test: Full flow (create → add story → vote → reveal → next story)
- ✅ No console errors in production build

---

## Dependencies & Blockers

### External Dependencies
- `canvas-confetti` library for celebration animation (optional, can use CSS if needed)

### Internal Dependencies
- Sprint 1 completion: Session creation, participant join, SSE infrastructure
- IndexedDB schema must support stories + votes

### Potential Blockers
- Timer synchronization across participants (SSE latency could cause drift)
- Confetti animation performance on low-end mobile devices
- IndexedDB quota for sessions with many stories (>100)

---

## Testing Plan

### Unit Tests
- Story CRUD operations (storyService.ts)
- Vote submission logic (votingService.ts)
- Results calculation (unanimous detection, top-vote selection)
- Score persistence (IndexedDB writes)

### E2E Tests (Playwright)
1. **Full Voting Flow**:
   - HOST creates session → Adds story → Starts voting
   - PARTICIPANT joins → Votes → Results revealed
   - Score saved → Next story auto-advance
2. **Unanimous Vote**:
   - All participants vote same value → Confetti animation → Auto-advance
3. **Non-Unanimous Vote**:
   - Participants vote different values → HOST selects final score → Advance
4. **Re-Vote**:
   - Complete story → Vote Again → Clear score → Re-vote
5. **Edge Cases**:
   - 0 votes → No votes screen → Skip or re-vote
   - All "?" votes → No estimate message

### Manual Testing
- Test animations at 60fps (Chrome DevTools Performance)
- Verify timer sync across multiple browser tabs (open as HOST + PARTICIPANT)
- Test IndexedDB persistence: Vote → Refresh → Scores still visible
- Test on iOS Safari + Chrome Android (real devices)

---

## Design Assets Needed

### Sprint 2 Deliverables (Design Agent)
1. **Story List Component**: Add/Edit/Delete forms, card states (pending/voting/completed)
2. **Fibonacci Card Deck**: 12 cards with animations (hover/tap/selected states)
3. **Timer Component**: Circular progress ring with countdown
4. **Voting Section**: Story card + timer + vote count + card deck
5. **Results Screens**: Unanimous (confetti) + Non-Unanimous (vote distribution + selection)
6. **All Done Celebration**: Summary stats + CTA buttons
7. **Confirmation Dialogs**: Delete story, Vote Again, End Session

### Animation Specifications
- Card tap: Spring (stiffness 300, damping 20)
- Confetti: 2-second fall animation (canvas-confetti library)
- Results reveal: Staggered fade-in (50ms delay per participant row)
- Auto-scroll: Smooth scroll with ease-out (400ms)

---

## Open Questions for Sprint 2

### To Resolve Before Development
- 🤔 Should we allow PARTICIPANTS to vote on multiple stories at once (async voting)? (Defer to v2)
- 🤔 Should timer be optional per story, or global setting? (Per story for MVP)
- 🤔 Do we need a "Pause voting" button for HOST? (Defer to v2 if needed)

### To Validate During Sprint
- 🧪 Is confetti animation too distracting? (Test with users, make optional in v2)
- 🧪 Is 2-second auto-advance too fast? (Monitor feedback, adjust if needed)
- 🧪 Does timer drift cause issues on slow networks? (Test with throttled connections)
