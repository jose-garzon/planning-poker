# Planning Poker - Sprint Summary & Roadmap

**Created**: 2026-02-16
**Status**: Ready for Development
**Timeline**: 2 sprints (4 weeks)

---

## Executive Summary

Planning Poker is a real-time multiplayer estimation tool for agile teams. This document summarizes the 2-sprint MVP plan with 10 user stories ready for implementation.

### Key Deliverables
- **Sprint 1 (Week 1-2)**: Session creation, participant join, real-time sync, mobile UI
- **Sprint 2 (Week 3-4)**: Story management, voting flow, results reveal, score persistence

### Success Criteria
- ✅ 80%+ of sessions complete all stories (not abandoned)
- ✅ <50ms SSE latency for vote sync
- ✅ 60fps animations on mobile devices (iOS Safari, Chrome Android)
- ✅ Works seamlessly on phones (44px touch targets, responsive design)

---

## Sprint 1: Foundation + Session Flow

**Goal**: HOST can create session, PARTICIPANTS can join, see each other in real-time

### User Stories (GitHub Issues)

| # | User Story | Status | Priority |
|---|------------|--------|----------|
| [#1](https://github.com/jose-garzon/planning-poker/issues/1) | As a HOST, I want to create a session with a shareable link | 📋 Ready | P0 |
| [#2](https://github.com/jose-garzon/planning-poker/issues/2) | As a PARTICIPANT, I want to join via a shared link | 📋 Ready | P0 |
| [#3](https://github.com/jose-garzon/planning-poker/issues/3) | As a USER, I want to see the participant list update in real-time | 📋 Ready | P0 |
| [#4](https://github.com/jose-garzon/planning-poker/issues/4) | As a USER, I want the app to work smoothly on my phone | 📋 Ready | P0 |
| [#5](https://github.com/jose-garzon/planning-poker/issues/5) | As a HOST, I want session data to persist across refreshes | 📋 Ready | P0 |

### Key Features
- ✅ Session creation with unique link (UUID-based)
- ✅ Participant join with duplicate detection (localStorage)
- ✅ Real-time participant list with online status (SSE, <50ms latency)
- ✅ Mobile-first UI (44px touch targets, responsive layouts)
- ✅ IndexedDB persistence (15-day expiry)

### Technical Highlights
- **API Routes**: `POST /api/sessions`, `POST /api/sessions/[id]/join`, `GET /api/sessions/[id]/stream` (SSE)
- **Data Storage**: HOST (IndexedDB), PARTICIPANT (localStorage)
- **Real-Time**: Server-Sent Events with heartbeat (10s client, 30s server timeout)
- **Modules**: `/modules/poker-session/` (page module), `/shared/` (hooks, utils)

### Definition of Done
- [ ] E2E test: Create session → Join as participant → See participant list
- [ ] Lighthouse mobile score: >90
- [ ] Animations at 60fps (Chrome DevTools Performance)
- [ ] Works on iOS Safari 15+ and Chrome Android 100+

---

## Sprint 2: Voting + Results

**Goal**: Complete end-to-end voting flow with smooth animations and real-time sync

### User Stories (GitHub Issues)

| # | User Story | Status | Priority |
|---|------------|--------|----------|
| [#6](https://github.com/jose-garzon/planning-poker/issues/6) | As a HOST, I want to add/edit/delete user stories | 📋 Ready | P0 |
| [#7](https://github.com/jose-garzon/planning-poker/issues/7) | As a PARTICIPANT, I want to select Fibonacci cards to vote | 📋 Ready | P0 |
| [#8](https://github.com/jose-garzon/planning-poker/issues/8) | As a HOST, I want to start voting with a timer | 📋 Ready | P0 |
| [#9](https://github.com/jose-garzon/planning-poker/issues/9) | As a HOST, I want to reveal results (unanimous vs non-unanimous) | 📋 Ready | P0 |
| [#10](https://github.com/jose-garzon/planning-poker/issues/10) | As a USER, I want to see story progression with scores | 📋 Ready | P0 |

### Key Features
- ✅ Story management: Add (ID + title), edit, delete (with confirmation)
- ✅ Voting UI: Fibonacci deck [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, "?"]
- ✅ Timer: Soft warning (voting continues after expiry), HOST manually reveals
- ✅ Results:
  - **Unanimous**: Confetti + auto-save + 2s auto-advance
  - **Non-unanimous**: Vote distribution + HOST picks from top 2-3 options
- ✅ Story progression: Auto-scroll to next story, re-vote option, "All Done" celebration

### Technical Highlights
- **API Routes**:
  - Stories: `POST/PATCH/DELETE /api/sessions/[id]/stories/[storyId]`
  - Voting: `POST /api/sessions/[id]/stories/[storyId]/start-voting`, `POST /api/sessions/[id]/vote`
  - Results: `POST /api/sessions/[id]/stories/[storyId]/reveal`, `POST .../set-score`
- **SSE Events**: `story-added/updated/deleted`, `voting-started`, `vote-submitted`, `voting-ended`, `score-set`
- **Animations**: Card tap (spring physics), confetti (`canvas-confetti` library), results stagger
- **Modules**: `/modules/voting/` (feature module), `/modules/poker-session/` (story management)

### Definition of Done
- [ ] E2E test: Create → Add story → Vote → Reveal → Next story
- [ ] E2E test: Unanimous vote → Confetti → Auto-advance
- [ ] E2E test: Non-unanimous → HOST selects score → Advance
- [ ] 60fps animations (verified on real mobile devices)
- [ ] <50ms SSE latency (measured with Network tab)
- [ ] IndexedDB persistence: Scores survive refresh

---

## Post-MVP (v2+) - Deferred Features

### Nice-to-Have Features
- ❌ Participant roles with colors (lead, product-owner, frontend, backend, qa)
- ❌ Session CRUD (view/delete previous sessions)
- ❌ QR code for session sharing
- ❌ Export results to CSV
- ❌ Custom card decks (only Fibonacci in MVP)
- ❌ Dark mode
- ❌ Voice/video chat integration
- ❌ Browser notifications

### Why Deferred?
These features don't directly impact core voting experience or MVP launch timeline. They can be added post-launch based on user feedback.

---

## Technical Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (60fps target)
- **State**: Zustand (lightweight)
- **Real-Time**: Server-Sent Events (SSE)
- **Storage**: IndexedDB (HOST), localStorage (PARTICIPANT)
- **Testing**: Vitest (unit), Playwright (E2E)
- **Package Manager**: Bun (REQUIRED)

### Folder Structure
```
modules/
  poker-session/               # Page module
    poker-session.page.tsx     # Entry point
    components/                # Session UI components
    services/                  # Session, participant, story services
    hooks/                     # useSessionStorage, useSessionSync
    types/                     # Session, Participant, Story types

  voting/                      # Feature module
    voting-deck.component.tsx  # Entry point
    components/                # Card, results components
    services/                  # Voting, results services
    hooks/                     # useVoting (Zustand store)
    types/                     # Vote, VoteResults types

  shared/
    components/                # Reusable UI (button, modal)
    hooks/                     # useSSE, useIndexedDB
    lib/                       # indexedDB.ts, fibonacci.ts, utils

app/
  api/
    sessions/                  # Session API routes
      [sessionId]/
        stream/route.ts        # SSE endpoint
        join/route.ts
        stories/route.ts
        vote/route.ts
        reveal/route.ts
```

### Data Flow
1. **Session Creation**: HOST → IndexedDB → SSE broadcast
2. **Participant Join**: PARTICIPANT → localStorage → SSE broadcast → All see update
3. **Vote Submission**: PARTICIPANT → Optimistic UI update → POST → SSE broadcast → Vote count update
4. **Results Reveal**: HOST → POST → Calculate results → SSE broadcast → Show results (unanimous/non-unanimous)
5. **Score Persistence**: HOST picks score → IndexedDB → SSE broadcast → Story completed

---

## Performance Targets

### Critical Metrics
- **SSE Latency**: <50ms from event to all participants
- **Animations**: 60fps on mobile devices (iPhone 12+, Android mid-range)
- **Bundle Size**: <500kb (Framer Motion + Zustand ~60kb)
- **Lighthouse**: >90 mobile score
- **IndexedDB Ops**: <200ms for reads/writes

### How to Measure
- SSE latency: Chrome DevTools Network tab (measure event timestamp delta)
- Animations: Chrome DevTools Performance tab (verify no dropped frames)
- Lighthouse: Run on real device or BrowserStack

---

## Testing Strategy

### Unit Tests (Vitest)
- Session creation, participant join validation
- Vote submission logic, results calculation
- IndexedDB CRUD operations
- Story management (add/edit/delete)

### E2E Tests (Playwright)
**Sprint 1**:
- Create session → Copy link → Join as participant → See both in list
- Expired session → Error message
- Duplicate join → Error message

**Sprint 2**:
- Full voting flow: Create → Add story → Start voting → Vote → Reveal → Next story
- Unanimous vote → Confetti → Auto-advance
- Non-unanimous → HOST picks score
- Re-vote on completed story
- All stories done → "All Done" celebration

### Manual Testing
- Test on iOS Safari (real device or BrowserStack)
- Test on Chrome Android (real device)
- Verify animations smooth at 60fps
- Test offline → online recovery

---

## Risk & Mitigation

### Identified Risks
1. **SSE Latency on Mobile Networks**
   - Mitigation: Auto-reconnect every 3s, optimistic updates, offline banner
2. **Timer Sync Drift**
   - Mitigation: Client-side countdown, sync on load, soft warning only
3. **IndexedDB Quota Exceeded**
   - Mitigation: 15-day auto-cleanup, warn at 90 stories, graceful error handling
4. **Animation Performance on Low-End Devices**
   - Mitigation: Use `transform` + `opacity` only, profile on real devices, disable complex animations if needed

### Assumptions
- Users have modern browsers (iOS 15+, Chrome 100+)
- Sessions typically have <30 stories (soft limit: 100)
- Teams are 5-15 participants (max: 30)

---

## Deployment Plan

### Sprint 1 Deployment (End of Week 2)
- Deploy to staging environment
- Smoke test: Create session, join as participant
- Share with internal team for feedback

### Sprint 2 Deployment (End of Week 4 - MVP Launch)
- Full E2E test suite passes
- Manual QA on iOS Safari + Chrome Android
- Lighthouse score >90
- Deploy to production
- Monitor real-time latency and error rates

---

## Next Steps

### Immediate Actions
1. **Developers**: Pick up Sprint 1 issues (#1-#5)
2. **Design Agent**: Create UI designs based on design prompts in each issue
3. **Product Owner**: Monitor Sprint 1 progress, answer clarifying questions

### Sprint 1 Kickoff Checklist
- [ ] Developers review `/specs/sprint-1-foundation.md`
- [ ] Design Agent reviews design prompts in issues #1-#5
- [ ] Set up development environment (Bun, Next.js 15, IndexedDB testing)
- [ ] Create initial folder structure (`/modules/poker-session/`, `/modules/voting/`, `/shared/`)
- [ ] Set up SSE endpoint skeleton (`/api/sessions/[sessionId]/stream`)

### Sprint 2 Kickoff (After Sprint 1 Complete)
- [ ] Sprint 1 retrospective
- [ ] Validate Sprint 1 learnings (timer sync, SSE latency)
- [ ] Developers review `/specs/sprint-2-voting.md`
- [ ] Design Agent creates voting UI designs (Fibonacci cards, results screens)

---

## Documentation Links

- **Product Spec**: `/specs/planning-poker-overview.md`
- **Sprint 1 Details**: `/specs/sprint-1-foundation.md`
- **Sprint 2 Details**: `/specs/sprint-2-voting.md`
- **Tech Guide**: `/CLAUDE.md`
- **Architecture Docs**: `/docs/2-architecture/`
- **API Endpoints**: `/docs/4-api/endpoints.md`
- **GitHub Issues**: [Sprint 1 (#1-#5)](https://github.com/jose-garzon/planning-poker/issues?q=is%3Aissue+label%3Asprint-1), [Sprint 2 (#6-#10)](https://github.com/jose-garzon/planning-poker/issues?q=is%3Aissue+label%3Asprint-2)

---

## Contact & Questions

For questions or clarifications:
- **Product Owner**: AI Product Owner (this agent)
- **Spec Documents**: All questions answered in `/specs/` directory
- **Technical Questions**: Refer to `/CLAUDE.md` and `/docs/`

**Ready to start Sprint 1!** 🚀
