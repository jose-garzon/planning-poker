'use client';

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ExpiredView } from './components/expired-view';
import type { GameState } from './components/game/game';
import { SessionLobby } from './components/session-lobby';
import { useSessionGuard } from './hooks/use-session-guard';

interface SessionPageProps {
  id: string;
  state?: GameState | 'expired' | undefined;
  role?: string | undefined;
}

function SessionContent({ id, state, role }: SessionPageProps) {
  const session = useSessionGuard(id);

  if (session === undefined) notFound();

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

export default function SessionPage(props: SessionPageProps) {
  return (
    <Suspense fallback={null}>
      <SessionContent {...props} />
    </Suspense>
  );
}
