'use client';

import { SessionLobby } from './components/session-lobby';

interface SessionPageProps {
  id: string;
  state?: string;
}

const placeholderClasses =
  'min-h-screen bg-poker-bg-page flex items-center justify-center text-poker-muted';

export default function SessionPage({ id, state }: SessionPageProps) {
  if (state === 'voting') {
    return <div className={placeholderClasses}>Voting view (coming soon)</div>;
  }

  if (state === 'results') {
    return <div className={placeholderClasses}>Results view (coming soon)</div>;
  }

  if (state === 'expired') {
    return <div className={placeholderClasses}>Session expired</div>;
  }

  return <SessionLobby sessionId={id} />;
}
