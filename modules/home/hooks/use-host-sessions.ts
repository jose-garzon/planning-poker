'use client';

import { SessionService } from '@/modules/poker-session/services/session-service';
import type { Session } from '@/modules/poker-session/services/types';
import { appDB } from '@/shared/storage/app-db';
import { useEffect, useState } from 'react';

type HostSessionsStatus = { kind: 'loading' } | { kind: 'success'; sessions: Session[] };

export function useHostSessions(): HostSessionsStatus {
  const [status, setStatus] = useState<HostSessionsStatus>({ kind: 'loading' });

  useEffect(() => {
    async function load() {
      const sessions = await new SessionService(appDB).getAllSessions();
      setStatus({ kind: 'success', sessions });
    }
    load();
  }, []);

  return status;
}
