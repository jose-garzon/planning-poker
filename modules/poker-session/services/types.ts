export type ParticipantRole = 'host' | 'participant';

export interface Participant {
  id: string;
  name: string;
  role: ParticipantRole;
  joinedAt: Date;
  lastSeenAt: Date;
  isOnline: boolean;
}

export interface Story {
  id: string;
  title: string;
  score: string | null;
  status: 'pending' | 'voting' | 'completed';
  votes: Record<string, string>; // participantId -> vote value
  votingStartedAt: Date | null;
  votingEndedAt: Date | null;
}

export interface Session {
  id: string;
  hostId: string;
  hostName: string;
  createdAt: Date;
  expiresAt: Date;
  stories: Story[];
  participants: Participant[];
  currentStoryId: string | null;
}
