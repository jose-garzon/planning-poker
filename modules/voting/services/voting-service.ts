import type { Session, Story } from '@/modules/poker-session/services/types';
import type { DBStorage } from '@/shared/storage/db-storage';

export interface VoteResults {
  unanimous: boolean;
  voteCounts: Record<string, number>;
  topVotes: string[];
  allVotes: Record<string, string>;
}

// Fibonacci order used for tie-breaking in topVotes calculation.
// '?' is excluded from voteCounts and topVotes entirely.
const FIBONACCI_ORDER = ['0', '1', '2', '3', '5', '8', '13', '?'];

function fibonacciIndex(value: string): number {
  const index = FIBONACCI_ORDER.indexOf(value);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function calculateVoteResults(votes: Record<string, string>): VoteResults {
  const allVotes = votes;

  // Count votes, excluding '?'
  const voteCounts: Record<string, number> = {};
  for (const vote of Object.values(votes)) {
    if (vote === '?') continue;
    voteCounts[vote] = (voteCounts[vote] ?? 0) + 1;
  }

  const nonQuestionVotes = Object.values(votes).filter((v) => v !== '?');

  // Unanimous when all non-'?' voters picked the same value and at least 1 exists
  const uniqueNonQuestionValues = new Set(nonQuestionVotes);
  const unanimous = nonQuestionVotes.length > 0 && uniqueNonQuestionValues.size === 1;

  // Sort entries by count descending, then by Fibonacci index ascending for ties
  const sortedEntries = Object.entries(voteCounts).sort(([aVal, aCount], [bVal, bCount]) => {
    if (bCount !== aCount) return bCount - aCount;
    return fibonacciIndex(aVal) - fibonacciIndex(bVal);
  });

  // Normally return top 2 values; expand to top 3 if entries [1] and [2] share the same count
  // (i.e. there is a 3-way tie for second place — all three are equally useful for the host).
  const topVotes: string[] = [];
  const [first, second, third] = sortedEntries;

  if (first !== undefined) {
    topVotes.push(first[0]);

    if (second !== undefined) {
      topVotes.push(second[0]);

      // Check for 3-way tie at second place: entry[2] has the same count as entry[1]
      if (third !== undefined && third[1] === second[1]) {
        topVotes.push(third[0]);
      }
    }
  }

  return { unanimous, voteCounts, topVotes, allVotes };
}

export class VotingService {
  private readonly STORE = 'sessions';

  constructor(private readonly db: DBStorage) {}

  async startVoting(
    sessionId: string,
    storyId: string,
    timerDuration: number | null,
  ): Promise<Story> {
    await this.db.open();

    const session = await this.db.get<Session>(this.STORE, sessionId);
    if (session === undefined) {
      throw new Error(`VotingService: Session "${sessionId}" not found.`);
    }

    const story = session.stories.find((s) => s.id === storyId);
    if (story === undefined) {
      throw new Error(`VotingService: Story "${storyId}" not found in session "${sessionId}".`);
    }

    if (story.status === 'voting') {
      throw new Error(
        `VotingService: Story "${storyId}" in session "${sessionId}" is already in voting status.`,
      );
    }

    story.status = 'voting';
    story.votingStartedAt = new Date();
    story.votes = {};

    session.currentStoryId = storyId;

    // timerDuration is accepted for future SSE-layer use; not persisted
    void timerDuration;

    await this.db.set(this.STORE, session);

    return story;
  }

  async submitVote(
    sessionId: string,
    storyId: string,
    participantId: string,
    vote: string,
  ): Promise<void> {
    await this.db.open();

    const session = await this.db.get<Session>(this.STORE, sessionId);
    if (session === undefined) {
      throw new Error(`VotingService: Session "${sessionId}" not found.`);
    }

    const story = session.stories.find((s) => s.id === storyId);
    if (story === undefined) {
      throw new Error(`VotingService: Story "${storyId}" not found in session "${sessionId}".`);
    }

    if (story.status !== 'voting') {
      throw new Error(
        `VotingService: Voting is not active for story "${storyId}" in session "${sessionId}". Current status: "${story.status}".`,
      );
    }

    story.votes[participantId] = vote;

    await this.db.set(this.STORE, session);
  }

  async revealResults(sessionId: string, storyId: string): Promise<VoteResults> {
    await this.db.open();

    const session = await this.db.get<Session>(this.STORE, sessionId);
    if (session === undefined) {
      throw new Error(`VotingService: Session "${sessionId}" not found.`);
    }

    const story = session.stories.find((s) => s.id === storyId);
    if (story === undefined) {
      throw new Error(`VotingService: Story "${storyId}" not found in session "${sessionId}".`);
    }

    if (story.status !== 'voting') {
      throw new Error(
        `VotingService: Cannot reveal results for story "${storyId}" in session "${sessionId}". Current status: "${story.status}".`,
      );
    }

    story.status = 'completed';
    story.votingEndedAt = new Date();

    const results = calculateVoteResults(story.votes);

    await this.db.set(this.STORE, session);

    return results;
  }

  async setScore(sessionId: string, storyId: string, score: string): Promise<Story> {
    await this.db.open();

    const session = await this.db.get<Session>(this.STORE, sessionId);
    if (session === undefined) {
      throw new Error(`VotingService: Session "${sessionId}" not found.`);
    }

    const story = session.stories.find((s) => s.id === storyId);
    if (story === undefined) {
      throw new Error(`VotingService: Story "${storyId}" not found in session "${sessionId}".`);
    }

    story.score = score;
    story.status = 'completed';

    // Advance currentStoryId to the next pending story, or null if none remain
    const nextPending = session.stories.find((s) => s.id !== storyId && s.status === 'pending');
    session.currentStoryId = nextPending?.id ?? null;

    await this.db.set(this.STORE, session);

    return story;
  }

  async clearScore(sessionId: string, storyId: string): Promise<Story> {
    await this.db.open();

    const session = await this.db.get<Session>(this.STORE, sessionId);
    if (session === undefined) {
      throw new Error(`VotingService: Session "${sessionId}" not found.`);
    }

    const story = session.stories.find((s) => s.id === storyId);
    if (story === undefined) {
      throw new Error(`VotingService: Story "${storyId}" not found in session "${sessionId}".`);
    }

    story.score = null;
    story.status = 'pending';
    story.votes = {};
    story.votingStartedAt = null;
    story.votingEndedAt = null;

    await this.db.set(this.STORE, session);

    return story;
  }
}
