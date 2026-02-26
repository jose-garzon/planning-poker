'use client';

import { appDB } from '@/shared/storage/app-db';
import { use } from 'react';
import { SessionService } from '../services/session-service';
import type { Session } from '../services/types';

const cache = new Map<string, Promise<Session | undefined>>();

async function fetchSession(sessionId: string): Promise<Session | undefined> {
  if (typeof window === 'undefined') {
    return;
  }
  return new SessionService(appDB).getSession(sessionId);
}

function getSessionPromise(sessionId: string): Promise<Session | undefined> {
  if (!cache.has(sessionId)) {
    cache.set(sessionId, fetchSession(sessionId));
  }
  return cache.get(sessionId) as Promise<Session | undefined>;
}

export function useSessionGuard(sessionId: string): Session | undefined {
  return use(getSessionPromise(sessionId));
}
