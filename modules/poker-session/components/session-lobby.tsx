'use client';

import { LobbyFooter } from './footer/footer';
import { GameArea } from './game/game';
import { LobbyHeader } from './header/header';
import { ParticipantsPanel } from './participants/participants';
import { StoriesPanel } from './stories/stories';

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

export function SessionLobby({ sessionId, role }: SessionLobbyProps) {
  const isHost = role === 'host';
  const storiesLabel = isHost ? 'STORIES' : 'CURRENT STORY';
  const storiesEmpty = isHost ? 'No stories yet' : 'Waiting for host to start voting...';

  return (
    <div className="flex flex-col h-screen bg-poker-bg-page overflow-hidden">
      <LobbyHeader sessionId={sessionId} />

      <div className="flex-1 flex overflow-hidden">
        <aside className="flex flex-col w-full md:w-[300px] shrink-0 px-4 md:px-6 pt-4 md:pt-5 pb-4 md:pb-5 gap-4 md:gap-5">
          <ParticipantsPanel participants={sortedParticipants} total={MOCK_PARTICIPANTS.length} />
          <StoriesPanel
            stories={sortedStories}
            isHost={isHost}
            label={storiesLabel}
            emptyText={storiesEmpty}
          />
        </aside>

        <GameArea isHost={isHost} />
      </div>

      <LobbyFooter isHost={isHost} />
    </div>
  );
}
