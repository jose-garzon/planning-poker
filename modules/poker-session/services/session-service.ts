import type { DBStorage } from '@/shared/storage/db-storage';
import type { Participant, Session } from './types';

const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

export class SessionService {
  private readonly STORE = 'sessions';

  constructor(private readonly db: DBStorage) {}

  async createSession(hostName: string, sessionName: string): Promise<Session> {
    await this.db.open();

    const hostId = crypto.randomUUID();
    const now = new Date();

    const host: Participant = {
      id: hostId,
      name: hostName,
      role: 'host',
      joinedAt: now,
      lastSeenAt: now,
      isOnline: true,
    };

    const session: Session = {
      id: crypto.randomUUID(),
      hostId,
      hostName,
      name: sessionName,
      createdAt: now,
      expiresAt: new Date(now.getTime() + FIFTEEN_DAYS_MS),
      stories: [],
      participants: [host],
      currentStoryId: null,
    };

    await this.db.set(this.STORE, session);
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    await this.db.open();

    const session = await this.db.get<Session>(this.STORE, sessionId);
    if (session === undefined) {
      return undefined;
    }

    if (new Date(session.expiresAt) < new Date()) {
      await this.db.delete(this.STORE, sessionId);
      return undefined;
    }

    return session;
  }

  async getAllSessions(): Promise<Session[]> {
    await this.db.open();

    const all = await this.db.getAll<Session>(this.STORE);
    const now = new Date();
    const active: Session[] = [];

    for (const session of all) {
      if (new Date(session.expiresAt) < now) {
        await this.db.delete(this.STORE, session.id);
      } else {
        active.push(session);
      }
    }

    return active;
  }

  async addParticipant(
    sessionId: string,
    participantName: string,
  ): Promise<{ session: Session; participant: Participant }> {
    await this.db.open();

    const session = await this.getSession(sessionId);
    if (session === undefined) {
      throw new Error(`SessionService: Session "${sessionId}" not found.`);
    }

    const now = new Date();
    const participant: Participant = {
      id: crypto.randomUUID(),
      name: participantName,
      role: 'participant',
      joinedAt: now,
      lastSeenAt: now,
      isOnline: true,
    };

    session.participants.push(participant);
    await this.db.set(this.STORE, session);

    return { session, participant };
  }

  async updateParticipantPresence(
    sessionId: string,
    participantId: string,
    isOnline: boolean,
  ): Promise<void> {
    await this.db.open();

    const session = await this.getSession(sessionId);
    if (session === undefined) {
      throw new Error(`SessionService: Session "${sessionId}" not found.`);
    }

    const participant = session.participants.find((p) => p.id === participantId);
    if (participant === undefined) {
      throw new Error(
        `SessionService: Participant "${participantId}" not found in session "${sessionId}".`,
      );
    }

    participant.isOnline = isOnline;
    participant.lastSeenAt = new Date();

    await this.db.set(this.STORE, session);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.db.open();
    await this.db.delete(this.STORE, sessionId);
  }

  async deleteExpiredSessions(): Promise<void> {
    await this.db.open();

    const all = await this.db.getAll<Session>(this.STORE);
    const now = new Date();

    for (const session of all) {
      if (new Date(session.expiresAt) < now) {
        await this.db.delete(this.STORE, session.id);
      }
    }
  }
}
