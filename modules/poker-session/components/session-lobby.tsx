'use client';

import { Button } from '@/shared/components/ui/button/button';
import { ParticipantRow } from './participant-row';
import { StoryRow } from './story-row';

interface SessionLobbyProps {
  sessionId: string;
}

const MOCK_PARTICIPANTS = [
  { name: 'Alice', isHost: true, status: 'online' as const, voted: false },
  { name: 'Bob', status: 'online' as const, voted: true },
  { name: 'Carol', status: 'idle' as const, voted: false },
];

const MOCK_STORIES = [
  { title: 'As a user, I can log in with email', status: 'voting' as const },
  { title: 'Password reset flow', status: 'pending' as const },
  { title: 'Profile page', status: 'pending' as const },
];

const SECTION_LABEL_CLASSES =
  'text-[11px] font-bold tracking-widest text-poker-muted uppercase mb-2';

export function SessionLobby({ sessionId }: SessionLobbyProps) {
  const canReveal = MOCK_STORIES.length > 0;

  return (
    <>
      {/* ── Desktop layout ─────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-[60px] bg-poker-bg-header flex items-center justify-between px-6 shrink-0">
          <span className="text-poker-green font-black text-lg">♠ PLANNING POKER</span>

          <span className="bg-poker-bg-row text-poker-text text-sm rounded-full px-3 py-1">
            Session #{sessionId}
          </span>

          <Button variant="ghost" size="sm">
            LEAVE
          </Button>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-[280px] bg-poker-bg-page overflow-y-auto p-4 flex flex-col gap-6 shrink-0">
            {/* Participants */}
            <section>
              <p className={SECTION_LABEL_CLASSES}>Participants</p>
              <div className="flex flex-col gap-2">
                {MOCK_PARTICIPANTS.map((p) => (
                  <ParticipantRow
                    key={p.name}
                    name={p.name}
                    {...(p.isHost !== undefined && { isHost: p.isHost })}
                    status={p.status}
                    voted={p.voted}
                  />
                ))}
              </div>
            </section>

            {/* Stories */}
            <section>
              <p className={SECTION_LABEL_CLASSES}>Stories</p>
              <div className="flex flex-col gap-2">
                {MOCK_STORIES.map((s) => (
                  <StoryRow key={s.title} title={s.title} status={s.status} />
                ))}
              </div>
            </section>
          </aside>

          {/* Main area */}
          <main className="flex-1 bg-poker-bg-page flex items-center justify-center">
            <p className="text-poker-muted text-sm">Waiting for host to start voting...</p>
          </main>
        </div>

        {/* Bottom action bar */}
        <footer className="h-16 bg-poker-bg-header flex items-center justify-end gap-3 px-6 shrink-0">
          <Button variant="secondary" size="sm">
            + ADD STORY
          </Button>
          <Button variant="primary" size="sm" disabled={!canReveal}>
            REVEAL VOTES
          </Button>
        </footer>
      </div>

      {/* ── Mobile layout ──────────────────────────────────────────────── */}
      <div className="flex md:hidden flex-col">
        {/* Fixed header */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-poker-bg-header z-10 flex items-center justify-between px-4">
          <span className="text-poker-green font-black text-sm">♠ PLANNING POKER</span>
          <span className="text-poker-muted text-xs">#{sessionId}</span>
        </header>

        {/* Scrollable body */}
        <div className="pt-14 pb-20 min-h-screen bg-poker-bg-page px-4 py-4 flex flex-col gap-6">
          {/* Participants */}
          <section>
            <p className={SECTION_LABEL_CLASSES}>Participants</p>
            <div className="flex flex-col gap-2">
              {MOCK_PARTICIPANTS.map((p) => (
                <ParticipantRow
                  key={p.name}
                  name={p.name}
                  {...(p.isHost !== undefined && { isHost: p.isHost })}
                  status={p.status}
                  voted={p.voted}
                />
              ))}
            </div>
          </section>

          {/* Stories */}
          <section>
            <p className={SECTION_LABEL_CLASSES}>Stories</p>
            <div className="flex flex-col gap-2">
              {MOCK_STORIES.map((s) => (
                <StoryRow key={s.title} title={s.title} status={s.status} />
              ))}
            </div>
          </section>
        </div>

        {/* Fixed bottom action bar */}
        <footer className="fixed bottom-0 left-0 right-0 h-16 bg-poker-bg-header flex items-center justify-between px-4 gap-3">
          <Button variant="secondary" size="sm">
            + ADD STORY
          </Button>
          <Button variant="primary" size="sm" disabled={!canReveal}>
            REVEAL VOTES
          </Button>
        </footer>
      </div>
    </>
  );
}
