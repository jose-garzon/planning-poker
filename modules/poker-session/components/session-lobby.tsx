'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ParticipantRow } from './participant-row';
import { StoryRow } from './story-row';

interface SessionLobbyProps {
  sessionId: string;
  role: 'host' | 'participant';
}

const MOCK_PARTICIPANTS = [
  { name: 'Alex', isHost: true, status: 'online' as const, voted: false },
  { name: 'Jordan', status: 'online' as const, voted: true },
  { name: 'Sam', status: 'idle' as const, voted: false },
  { name: 'Casey', status: 'online' as const, voted: true },
  { name: 'Riley', status: 'idle' as const, voted: false },
  { name: 'Morgan', status: 'online' as const, voted: true },
  { name: 'Taylor', status: 'offline' as const, voted: false },
  { name: 'Quinn', status: 'online' as const, voted: false },
  { name: 'Drew', status: 'online' as const, voted: true },
  { name: 'Avery', status: 'idle' as const, voted: false },
  { name: 'Blake', status: 'online' as const, voted: true },
  { name: 'Reese', status: 'online' as const, voted: false },
  { name: 'Skyler', status: 'offline' as const, voted: false },
  { name: 'Parker', status: 'online' as const, voted: true },
  { name: 'Finley', status: 'idle' as const, voted: false },
];

const MOCK_STORIES = [
  { title: 'As a user, I can log in with email', status: 'voting' as const },
  { title: 'Password reset flow', status: 'pending' as const },
  { title: 'Profile page', status: 'pending' as const },
  { title: 'Two-factor authentication', status: 'pending' as const },
  { title: 'OAuth with Google and GitHub', status: 'pending' as const },
  { title: 'Session expiry and auto-logout', status: 'pending' as const },
  { title: 'Email verification on sign-up', status: 'pending' as const },
  { title: 'Dashboard overview page', status: 'pending' as const },
  { title: 'User settings and preferences', status: 'pending' as const },
  { title: 'Notification center', status: 'pending' as const },
  { title: 'Dark mode toggle', status: 'pending' as const },
  { title: 'Audit log for admin users', status: 'pending' as const },
  { title: 'Role-based access control', status: 'pending' as const },
  { title: 'CSV export for reports', status: 'pending' as const },
  { title: 'Mobile responsive nav', status: 'pending' as const },
];

const sortedParticipants = [...MOCK_PARTICIPANTS].sort((a, b) => Number(a.voted) - Number(b.voted));

const STORY_ORDER = { voting: 0, pending: 1, done: 2 } as const;
const sortedStories = [...MOCK_STORIES].sort(
  (a, b) => STORY_ORDER[a.status] - STORY_ORDER[b.status],
);

const tapTransition = { type: 'spring', stiffness: 300, damping: 20 } as const;

export function SessionLobby({ sessionId, role }: SessionLobbyProps) {
  const isHost = role === 'host';
  const shouldReduce = useReducedMotion();
  const tapProps = shouldReduce ? {} : { whileTap: { scale: 0.97 }, transition: tapTransition };

  const rightPanelLabel = isHost ? 'STORIES' : 'CURRENT STORY';
  const rightPanelEmpty = isHost ? 'No stories yet' : 'Waiting for host to start voting...';

  return (
    <>
      {/* ── Desktop layout ─────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col h-screen bg-poker-bg-page overflow-hidden">
        {/* Header */}
        <header className="h-[72px] bg-poker-bg-page px-6 flex items-center gap-4 shrink-0">
          {/* Link box */}
          <div className="h-11 bg-poker-bg-header rounded-[4px] px-5 py-3 flex items-center gap-3 flex-1">
            <span className="text-lg font-[Inter]" aria-hidden="true">
              🔗
            </span>
            <span className="text-sm font-bold text-poker-green">poker.app/join/{sessionId}</span>
          </div>

          {/* Copy button */}
          <motion.button
            {...tapProps}
            type="button"
            aria-label="Copy session link"
            className="w-12 h-12 bg-poker-magenta rounded-[4px] flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-poker-green"
          >
            <span className="text-xl font-[Inter]" aria-hidden="true">
              📋
            </span>
          </motion.button>
        </header>

        {/* Content area */}
        <div className="flex-1 flex flex-row overflow-hidden">
          {/* Sidebar: Participants + Stories stacked, each 50% height */}
          <aside className="w-[300px] shrink-0 flex flex-col px-6 pt-5 pb-5 gap-5 bg-poker-bg-page">
            {/* Participants section — 50% height */}
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              <div className="h-11 bg-poker-bg-header rounded-[4px] px-4 py-3 flex items-center gap-2.5 shrink-0">
                <span className="text-[13px] font-black text-poker-green tracking-widest">
                  PARTICIPANTS
                </span>
                <span className="ml-auto text-sm font-black text-poker-text">
                  {MOCK_PARTICIPANTS.length}/8
                </span>
              </div>

              <div
                className="flex-1 bg-poker-bg-header rounded-[4px] p-4 flex flex-col gap-2 overflow-y-auto min-h-0"
                aria-live="polite"
                aria-label="Participant list"
              >
                {sortedParticipants.length === 0 ? (
                  <p className="text-sm font-bold text-poker-muted text-center py-2">
                    Waiting for players...
                  </p>
                ) : (
                  sortedParticipants.map((p) => (
                    <ParticipantRow
                      key={p.name}
                      name={p.name}
                      {...(p.isHost !== undefined && { isHost: p.isHost })}
                      status={p.status}
                      voted={p.voted}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Stories / Current Story section — 50% height */}
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              <div className="h-11 bg-poker-bg-header rounded-[4px] px-4 py-3 flex items-center gap-2.5 shrink-0">
                <span className="text-[13px] font-black text-poker-magenta tracking-widest">
                  {rightPanelLabel}
                </span>
                {isHost && (
                  <span className="ml-auto text-sm font-black text-poker-text">
                    {MOCK_STORIES.length}
                  </span>
                )}
              </div>

              <div className="flex-1 bg-poker-bg-header rounded-[4px] p-4 flex flex-col gap-2 overflow-y-auto min-h-0">
                {sortedStories.length === 0 ? (
                  <p className="text-sm font-bold text-poker-muted text-center py-2">
                    {rightPanelEmpty}
                  </p>
                ) : (
                  sortedStories.map((s) => (
                    <StoryRow key={s.title} title={s.title} status={s.status} />
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Main game area */}
          <main className="flex-1 flex items-center justify-center">
            <p className="text-poker-muted text-sm">
              {isHost ? 'Select a story to start voting' : 'Waiting for host to start voting...'}
            </p>
          </main>
        </div>

        {/* Footer */}
        {isHost ? (
          <footer className="h-14 bg-poker-bg-page px-6 flex items-center gap-4 shrink-0">
            <p className="flex-1 text-[12px] font-bold text-poker-muted">
              <span aria-hidden="true">⏱</span> Session expires in 15 days
            </p>

            <div className="flex items-center gap-3">
              <motion.button
                {...tapProps}
                type="button"
                className="h-10 bg-poker-magenta text-poker-bg-page text-[11px] font-black px-5 py-2.5 rounded-[4px] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-poker-green"
              >
                <span className="font-black text-base leading-none" aria-hidden="true">
                  +
                </span>
                ADD STORY
              </motion.button>

              <motion.button
                {...tapProps}
                type="button"
                className="h-10 bg-poker-green text-poker-bg-page text-[11px] font-black px-5 py-2.5 rounded-[4px] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-poker-green"
              >
                <span aria-hidden="true">▶</span>
                START VOTE
              </motion.button>
            </div>
          </footer>
        ) : (
          <footer className="h-14 bg-poker-bg-page px-6 flex items-center gap-4 shrink-0">
            <p className="flex-1 text-[12px] font-bold text-poker-muted">
              <span aria-hidden="true">⏱</span> Waiting for host to reveal results...
            </p>

            <motion.button
              {...tapProps}
              type="button"
              className="h-10 bg-poker-bg-row text-poker-muted text-[11px] font-black px-5 py-2.5 rounded-[4px] hover:text-poker-text transition-colors focus:outline-none focus:ring-2 focus:ring-poker-green"
            >
              LEAVE SESSION
            </motion.button>
          </footer>
        )}
      </div>

      {/* ── Mobile layout ──────────────────────────────────────────────── */}
      <div className="flex md:hidden flex-col h-screen bg-poker-bg-page overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-poker-bg-page flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-[Inter]" aria-hidden="true">
              🔗
            </span>
            <span className="text-xs text-poker-green font-bold">poker.app/join/{sessionId}</span>
          </div>

          <motion.button
            {...tapProps}
            type="button"
            aria-label="Copy session link"
            className="w-9 h-9 bg-poker-magenta rounded-[4px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-poker-green"
          >
            <span className="text-base font-[Inter]" aria-hidden="true">
              📋
            </span>
          </motion.button>
        </header>

        {/* Content: two 50/50 sections */}
        <div className="flex-1 flex flex-col gap-4 px-4 pb-4 overflow-hidden">
          {/* Participants section */}
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <div className="h-10 bg-poker-bg-header rounded-[4px] px-4 flex items-center gap-2.5 shrink-0">
              <span className="text-base" aria-hidden="true">
                👥
              </span>
              <span className="text-[13px] font-black text-poker-green tracking-widest">
                PARTICIPANTS
              </span>
              <span className="ml-auto text-sm font-black text-poker-text">
                {MOCK_PARTICIPANTS.length}/8
              </span>
            </div>

            <div
              className="flex-1 bg-poker-bg-header rounded-[4px] p-3 flex flex-col gap-2 overflow-y-auto min-h-0"
              aria-live="polite"
              aria-label="Participant list"
            >
              {sortedParticipants.length === 0 ? (
                <p className="text-sm font-bold text-poker-muted text-center py-2">
                  Waiting for players...
                </p>
              ) : (
                sortedParticipants.map((p) => (
                  <ParticipantRow
                    key={p.name}
                    name={p.name}
                    {...(p.isHost !== undefined && { isHost: p.isHost })}
                    status={p.status}
                    voted={p.voted}
                  />
                ))
              )}
            </div>
          </div>

          {/* Stories / Current Story section */}
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <div className="h-10 bg-poker-bg-header rounded-[4px] px-4 flex items-center gap-2.5 shrink-0">
              <span className="text-base" aria-hidden="true">
                📋
              </span>
              <span className="text-[13px] font-black text-poker-magenta tracking-widest">
                {rightPanelLabel}
              </span>
              {isHost && (
                <span className="ml-auto text-sm font-black text-poker-text">
                  {MOCK_STORIES.length}
                </span>
              )}
            </div>

            <div className="flex-1 bg-poker-bg-header rounded-[4px] p-3 flex flex-col gap-2 overflow-y-auto min-h-0">
              {sortedStories.length === 0 ? (
                <p className="text-sm font-bold text-poker-muted text-center py-2">
                  {rightPanelEmpty}
                </p>
              ) : (
                sortedStories.map((s) => (
                  <StoryRow key={s.title} title={s.title} status={s.status} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {isHost ? (
          <footer className="h-14 bg-poker-bg-page px-4 flex items-center gap-2 shrink-0">
            <motion.button
              {...tapProps}
              type="button"
              className="flex-1 h-12 bg-poker-magenta text-poker-bg-page text-[13px] font-black rounded-[4px] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-poker-green"
            >
              <span className="font-black text-base leading-none" aria-hidden="true">
                +
              </span>
              ADD STORY
            </motion.button>

            <motion.button
              {...tapProps}
              type="button"
              className="flex-1 h-12 bg-poker-green text-poker-bg-page text-[13px] font-black rounded-[4px] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-poker-green"
            >
              <span aria-hidden="true">▶</span>
              START VOTE
            </motion.button>
          </footer>
        ) : (
          <footer className="h-14 bg-poker-bg-page px-4 flex items-center gap-3 shrink-0">
            <p className="flex-1 text-xs text-poker-muted font-bold">
              <span aria-hidden="true">⏱</span> Waiting for host to reveal results...
            </p>

            <motion.button
              {...tapProps}
              type="button"
              className="h-10 bg-poker-bg-row text-poker-muted text-[11px] font-black px-5 py-2.5 rounded-[4px] hover:text-poker-text transition-colors focus:outline-none focus:ring-2 focus:ring-poker-green"
            >
              LEAVE
            </motion.button>
          </footer>
        )}
      </div>
    </>
  );
}
