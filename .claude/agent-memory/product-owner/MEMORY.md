# Product Owner Memory - Planning Poker Project

## Project Context
- **Product**: Real-time Planning Poker web app for agile teams (5-15 participants)
- **Timeline**: 2 sprints (4 weeks total), MVP launch at end of Sprint 2
- **Success Metrics**: 80%+ session completion rate, <50ms SSE latency, 60fps animations on mobile
- **Tech Stack**: Next.js 15, TypeScript strict, SSE for real-time, IndexedDB for HOST persistence
- **Critical Requirements**: Mobile-first (iOS Safari + Chrome Android), smooth animations, no signup/login

## Sprint Breakdown (Approved)
### Sprint 1 (Week 1-2): Foundation + Session Flow
- Session creation with shareable link
- Participant join flow
- Real-time participant list (SSE)
- Mobile-first UI shell
- IndexedDB persistence for HOST

### Sprint 2 (Week 3-4): Voting + Results
- User story management (add/edit/delete)
- Voting UI with Fibonacci cards [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, "?"]
- Vote submission + real-time sync
- Results reveal (unanimous celebration vs. HOST selection for non-unanimous)
- Story progression + score persistence

## User Story Pattern
Each user story includes:
1. **Clear acceptance criteria** (testable, specific, checklist format)
2. **Design prompt** for design agent (mobile-first, animations, color palette, layout)
3. **Technical notes** (API routes, IndexedDB schema, service files, SSE events)
4. **Links** to spec docs and architecture docs

## Key Design Decisions
- **Session Data**: HOST owns session (IndexedDB), PARTICIPANTS get real-time sync (SSE + localStorage for connection data)
- **Persistence**: 15 days auto-expiry, no backend database
- **Timer**: Soft warning only (voting continues after expiry), HOST manually reveals results
- **Results**:
  - Unanimous → Confetti + auto-save + 2s auto-advance
  - Non-unanimous → Show top 2-3 votes, HOST picks final score
- **Mobile-First**: 44px touch targets, single-column layout, spring animations on all interactions

## Documentation Files Created
- `/specs/planning-poker-overview.md` - Complete product spec
- `/specs/sprint-1-foundation.md` - Sprint 1 user stories (5 stories)
- `/specs/sprint-2-voting.md` - Sprint 2 user stories (5 stories)
- GitHub Issues: #1-#10 (all user stories created)

## Open Questions for Validation
- Is 15-day session expiry too short? (Monitor user feedback in Sprint 1)
- Should we show vote count before reveal? (Test with users in Sprint 2)
- Is 2-second auto-advance too fast? (Monitor feedback in Sprint 2)

## References for Future Work
- CLAUDE.md: Tech conventions, architecture patterns, folder structure
- /docs/: Architecture docs, API endpoints, testing strategy
- /llms.txt: Base UI component library for design agent
