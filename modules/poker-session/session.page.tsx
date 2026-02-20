'use client';

import { ExpiredView } from './components/expired-view';
import type { GameState } from './components/game/game';
import { SessionLobby } from './components/session-lobby';

interface SessionPageProps {
  id: string;
  state?: GameState | 'expired' | undefined;
  role?: string | undefined;
}

export default function SessionPage({ id, state, role }: SessionPageProps) {
  if (state === 'expired') {
    return <ExpiredView />;
  }

  return (
    <SessionLobby
      sessionId={id}
      role={role === 'host' ? 'host' : 'participant'}
      state={state as GameState | undefined}
    />
  );
}
