# Planning Poker - Product Specification

**Version**: 1.0
**Last Updated**: 2026-02-16
**Product Owner**: AI Product Owner
**Target Launch**: Sprint 2 (4 weeks)

---

## Executive Summary

Planning Poker is a real-time multiplayer web application for agile development teams to collaboratively estimate user stories using the Fibonacci sequence. The product prioritizes **smooth animations (60fps)**, **real-time synchronization (<50ms latency)**, and **mobile-first design** to create an engaging estimation experience that replaces physical planning poker cards.

### Core Value Proposition
- **Instant Setup**: HOST creates session, shares link, team joins in seconds
- **Real-Time Engagement**: See votes appear live with smooth animations
- **Mobile-First**: Works seamlessly on phones during stand-ups
- **Zero Friction**: No signup, no database, just voting

---

## Success Metrics

### Primary Goals
1. **Engagement**: 80%+ of sessions complete all stories (not abandoned mid-session)
2. **Performance**: <50ms vote sync latency, 60fps animations on mobile devices
3. **Usability**: 90%+ of users successfully vote within first 30 seconds of joining

### Target Users
- **Team Size**: 5-15 participants per session
- **Use Case**: Sprint planning, backlog refinement, story estimation
- **Environment**: Hybrid teams (in-person + remote)

---

## Product Features

### MVP Features (Sprint 1-2)

#### 1. Session Management
- **HOST** creates a session with unique shareable link
- **PARTICIPANTS** join via link (no signup required)
- Session data stored in HOST browser (IndexedDB) for 15 days
- Max 30 participants per session
- Session automatically cleans up after 15 days

#### 2. User Story Management
- **HOST** adds user stories with:
  - Story ID (e.g., "MIC-100")
  - Title
- **HOST** can add/edit/delete stories during active session
- No limit on number of stories per session

#### 3. Voting Flow
- **HOST** initiates voting for one story at a time
- **HOST** sets timer duration before starting vote (e.g., 2 minutes)
- Timer shows countdown to all participants
- When timer expires: voting continues (soft warning only)
- **HOST** manually ends voting by clicking "Reveal Results" button
- **PARTICIPANTS** see Fibonacci sequence cards: [0, 1, 2, 3, 5, 8, 13, "?"]
  - "?" = Skip/Unknown card
- **PARTICIPANTS** can change vote before results revealed
- Voting is hidden until HOST reveals results

#### 4. Results Display
- **Unanimous Vote**: Show celebration animation + score
  - Display: "🎉 Unanimous! Score: 8"
  - Automatically save score to story
  - Move to next story after 2 seconds
- **Non-Unanimous Vote**: Show top 2 most voted options as buttons
  - Display: "Choose final score: [5] [8]"
  - HOST clicks one to set final score
  - If 3-way tie: show top 3 options
  - If all different votes: show top 2 by count (ties broken arbitrarily)
  - After HOST picks: move to next story

#### 5. Real-Time Sync (SSE)
- **PARTICIPANTS** see real-time updates:
  - New participants joining
  - Vote count updates (not individual votes)
  - Results when revealed
  - Next story transition
- **HOST** sees:
  - Participant join/leave events
  - Vote submission confirmations (who voted, not what they voted)
  - Full results when revealed
- Offline support: show "Reconnecting..." banner, auto-retry every 3 seconds
- Optimistic updates: UI updates immediately, syncs in background

#### 6. Session Flow
- Stories display in list view:
  - **Current story**: Large, highlighted, shows voting UI
  - **Previous stories**: Show in "success state" with final score
  - **Upcoming stories**: Grayed out, no score
- No limit on going back to re-vote on previous stories
- Stories persist across page refresh (IndexedDB)

### Post-MVP Features (v2+)
- **Participant Roles** with color coding:
  - HOST configures roles: [lead, product-owner, frontend, backend, qa]
  - PARTICIPANTS pick role when joining
  - Role shown as colored badge next to name
- **Session CRUD**:
  - HOST can view/manage previous sessions
  - Archive old sessions
  - Export results to CSV
- **QR Code Sharing**: Generate QR code for session link

---

## User Roles & Permissions

### HOST
- Creates session
- Adds/edits/deletes user stories
- Initiates voting (sets timer)
- Ends voting manually (reveals results)
- Chooses final score when non-unanimous
- Can delete session
- Owns session data (stored in HOST browser)

### PARTICIPANT
- Joins session via link
- Sees participant list in real-time
- Votes on current story
- Can change vote before results revealed
- Sees results when HOST reveals
- No session management permissions

---

## Technical Architecture

### Data Storage
- **HOST Browser**: IndexedDB stores:
  - Session metadata (ID, created date, participant list)
  - User stories (ID, title, score, status)
  - Vote history per story
- **PARTICIPANT Browser**: localStorage stores:
  - Session connection data (prevents duplicate sessions)
  - Participant ID (UUID)
  - Current session ID
- **Persistence**: 15 days, then auto-cleanup
- **No Backend Database**: All data client-side

### Real-Time Sync (Server-Sent Events)
- **API Route**: `/api/sessions/[sessionId]/stream`
- **Event Types**:
  - `participant-joined`: New participant connected
  - `participant-left`: Participant disconnected
  - `vote-submitted`: Someone voted (count only, not value)
  - `voting-ended`: HOST revealed results
  - `story-updated`: Story score changed
  - `next-story`: Session moved to next story
  - `heartbeat`: Keep-alive every 30 seconds
- **Latency Target**: <50ms from event to all participants
- **Reconnection**: Auto-retry every 3 seconds on disconnect

### API Endpoints

#### POST `/api/sessions`
- **Request**: `{ hostName: string }`
- **Response**: `{ sessionId: string, shareableLink: string }`
- Creates new session, returns link

#### POST `/api/sessions/[sessionId]/join`
- **Request**: `{ participantName: string }`
- **Response**: `{ participantId: string, session: Session }`
- Joins existing session, broadcasts `participant-joined` event

#### POST `/api/sessions/[sessionId]/stories`
- **Request**: `{ storyId: string, title: string }`
- **Response**: `{ story: Story }`
- Adds new story to session

#### POST `/api/sessions/[sessionId]/vote`
- **Request**: `{ participantId: string, storyId: string, vote: string }`
- **Response**: `{ success: true }`
- Casts vote (optimistic update on client)

#### POST `/api/sessions/[sessionId]/reveal`
- **Request**: `{ storyId: string }`
- **Response**: `{ results: VoteResults, unanimous: boolean, topVotes: string[] }`
- Reveals results, broadcasts to all participants

#### GET `/api/sessions/[sessionId]/stream`
- **Response**: SSE stream (text/event-stream)
- Real-time event stream for session

### Data Models

```typescript
interface Session {
  id: string;
  hostId: string;
  hostName: string;
  createdAt: Date;
  expiresAt: Date; // 15 days from creation
  stories: Story[];
  participants: Participant[];
  currentStoryId: string | null;
}

interface Story {
  id: string; // User-provided (e.g., "MIC-100")
  title: string; // Markdown format
  score: string | null; // Fibonacci value or null
  status: 'pending' | 'voting' | 'completed';
  votes: Record<string, string>; // participantId -> vote
  votingStartedAt: Date | null;
  votingEndedAt: Date | null;
}

interface Participant {
  id: string; // UUID
  name: string;
  isHost: boolean;
  joinedAt: Date;
  lastSeenAt: Date;
  isOnline: boolean;
}

interface VoteResults {
  unanimous: boolean;
  voteCounts: Record<string, number>; // vote -> count
  topVotes: string[]; // Top 2-3 votes by count
  participants: Record<string, string>; // participantId -> vote
}
```

---

## User Experience Requirements

### Mobile-First Design
- **Critical**: App must work flawlessly on phones (iOS Safari, Chrome Android)
- **Touch Targets**: Min 44px tap targets for cards
- **Responsive**: Single-column layout on mobile, multi-column on tablet+
- **Gestures**: Swipe to navigate stories (nice-to-have v2)

### Animation Standards (60fps)
- **Card Selection**: Spring animation (scale 1.0 → 1.08 on hover, 0.92 on tap)
- **Vote Reveal**: Staggered fade-in (50ms delay between each participant)
- **Celebration**: Confetti animation on unanimous vote (Framer Motion)
- **Transitions**: Smooth story transitions (slide + fade, <300ms)
- **Performance**: Use `transform` and `opacity` only (GPU accelerated)

### Accessibility
- **Keyboard Navigation**: Tab through cards, Enter to select
- **Screen Reader**: ARIA labels on all interactive elements
- **Color Contrast**: WCAG AA compliance (4.5:1 text, 3:1 UI)
- **Focus Indicators**: Clear focus rings on all buttons/cards

---

## Edge Cases & Error Handling

### Connection Issues
- **Participant disconnects mid-vote**: Vote saved to localStorage, auto-submit on reconnect
- **HOST disconnects**: Session paused, participants see "Waiting for host..." message
- **HOST browser crashes**: HOST can rejoin via link, session resumes from last state (IndexedDB)
- **Network offline**: Show "Offline" banner, queue actions, sync on reconnect

### Data Conflicts
- **Duplicate participant sessions**: Detect via localStorage, show "Already joined from another tab" error
- **Concurrent HOST actions**: Last write wins (IndexedDB transactions)
- **Session expired**: Show "Session expired (15 days)" message, redirect to home

### Voting Edge Cases
- **Timer expires**: Soft warning ("Time's up!"), voting continues until HOST reveals
- **Late joiners**: Can't vote on current story if voting already started, can vote on next story
- **0 votes submitted**: Show "No votes yet" message, HOST can skip story
- **All votes different**: Show top 2 by arbitrary order (e.g., lowest Fibonacci value)

---

## Out of Scope (Deferred to v2+)

### Explicitly NOT Building in MVP
- ❌ User authentication (no login/signup)
- ❌ Persistent backend database
- ❌ Session history CRUD (view/delete previous sessions)
- ❌ Participant roles/colors
- ❌ QR code generation
- ❌ Export to CSV/PDF
- ❌ Session analytics (avg time per story, vote distribution)
- ❌ Custom card decks (only Fibonacci + Skip)
- ❌ Multiple simultaneous sessions per HOST
- ❌ Voice/video chat integration
- ❌ Browser notifications
- ❌ Dark mode

---

## Sprint Breakdown

### Sprint 1 (Week 1-2): Foundation + Session Flow
**Goal**: HOST can create session, PARTICIPANTS can join, see each other in real-time

**Deliverables**:
1. Session creation + shareable link generation
2. Participant join flow
3. Real-time participant list (SSE)
4. Basic UI shell (mobile-first)
5. IndexedDB setup for HOST data persistence

### Sprint 2 (Week 3-4): Voting + Results
**Goal**: Complete end-to-end voting flow with smooth animations

**Deliverables**:
1. User story management (add/edit/delete)
2. Voting UI with Fibonacci cards (60fps animations)
3. Vote submission + real-time sync
4. Results reveal (unanimous vs. non-unanimous)
5. Story progression + score persistence
6. E2E tests for critical paths

---

## Definition of Done

### Sprint Completion Criteria
- ✅ All user stories meet acceptance criteria
- ✅ E2E tests pass for critical user flows
- ✅ 60fps animations on mobile devices (Chrome DevTools profiling)
- ✅ <50ms SSE latency (measured in production-like environment)
- ✅ TypeScript strict mode, no linting errors
- ✅ Deployed to staging environment
- ✅ Product Owner approval

### Launch Criteria (End of Sprint 2)
- ✅ All MVP features implemented
- ✅ E2E tests cover: create → join → vote → results flow
- ✅ Manual testing on iOS Safari + Chrome Android
- ✅ Accessibility audit (keyboard nav, screen reader)
- ✅ Performance: Lighthouse score >90 (mobile)
- ✅ Documentation updated (README, API docs)

---

## Open Questions

### Resolved
- ✅ Session persistence: 15 days in IndexedDB
- ✅ Max participants: 30
- ✅ Timer behavior: Soft warning, voting continues
- ✅ Results tie-breaking: Show top 2-3, HOST picks one
- ✅ Story format: ID + title (markdown)

### To Be Validated in Sprint 1
- 🤔 Is 15-day session expiry too short? (Monitor user feedback)
- 🤔 Should we show vote count before reveal? (Test with users)
- 🤔 Do we need a "Skip story" button for HOST? (Defer to v2 if needed)

---

## References

- **Tech Stack**: See `/home/flanagan/workspace/github.com/jose-garzon/planning-poker/CLAUDE.md`
- **Architecture Docs**: `/home/flanagan/workspace/github.com/jose-garzon/planning-poker/docs/2-architecture/`
- **API Endpoints**: `/home/flanagan/workspace/github.com/jose-garzon/planning-poker/docs/4-api/endpoints.md`
- **Testing Strategy**: `/home/flanagan/workspace/github.com/jose-garzon/planning-poker/docs/3-development/testing.md`
