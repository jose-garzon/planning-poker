'use client';

import { appDB } from '@/shared/storage/app-db';
import { useState } from 'react';
import { SessionService } from '../services/session-service';

type Status =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; sessionId: string };

export function useCreateSession() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function createSession(hostName: string, sessionName: string): Promise<string> {
    setStatus({ kind: 'loading' });

    try {
      const service = new SessionService(appDB);
      const session = await service.createSession(hostName, sessionName);
      setStatus({ kind: 'success', sessionId: session.id });
      return session.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create session.';
      setStatus({ kind: 'error', message });
      throw err;
    }
  }

  return { createSession, status };
}
