'use client';

import { ExpiredView } from './components/expired-view';
import { SessionLobby } from './components/session-lobby';

interface SessionPageProps {
  id: string;
  state?: string | undefined;
  role?: string | undefined;
}

const placeholderClasses =
  'min-h-screen bg-poker-bg-page flex items-center justify-center text-poker-muted';

export default function SessionPage({ id, state, role }: SessionPageProps) {
  if (state === 'voting') {
    return <div className={placeholderClasses}>Voting view (coming soon)</div>;
  }

  if (state === 'results') {
    return <div className={placeholderClasses}>Results view (coming soon)</div>;
  }

  if (state === 'expired') {
    return <ExpiredView />;
  }

  return <SessionLobby sessionId={id} role={role === 'host' ? 'host' : 'participant'} />;
}
