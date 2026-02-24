import { DesktopHostVotingView } from '../desktop-host-voting-view';
import { DesktopParticipantVotingView } from '../desktop-voting-view';
import type { DesktopVotingParticipant } from '../desktop-voting-view';

export type GameState = 'voting' | 'timeup' | 'unanimous-results' | 'results' | 'voted';

export interface VotingParticipant {
  name: string;
  isHost?: boolean;
  status: 'online' | 'idle' | 'offline';
  voted: boolean;
}

interface GameAreaProps {
  isHost: boolean;
  state?: GameState | undefined;
  // Voting data (passed through when state === 'voting')
  storyId?: string;
  storyTitle?: string;
  seconds?: number;
  totalSeconds?: number;
  votedCount?: number;
  totalCount?: number;
  participants?: VotingParticipant[];
  selectedValue?: number | '?' | undefined;
  onSelect?: ((value: number | '?') => void) | undefined;
}

function getGameLabel(state: GameState | undefined, isHost: boolean): string {
  if (state === undefined) {
    return isHost ? 'Select a story to start voting' : 'Waiting for host to start voting...';
  }
  if (state === 'voting') {
    return isHost ? 'Voting in progress...' : 'Cast your vote';
  }
  if (state === 'timeup') {
    return isHost ? "Time's up — revealing results" : "Time's up";
  }
  if (state === 'unanimous-results') {
    return isHost ? 'Unanimous vote! 🎉' : 'Unanimous! 🎉';
  }
  if (state === 'results') {
    return 'Results are in';
  }
  if (state === 'voted') {
    return isHost ? '' : 'Vote submitted ✓';
  }
  return '';
}

export function GameArea({
  isHost,
  state,
  storyId = 'US-42',
  storyTitle = 'As a user, I can log in with email',
  seconds = 75,
  totalSeconds = 120,
  votedCount = 0,
  totalCount = 0,
  participants = [],
  selectedValue,
  onSelect,
}: GameAreaProps) {
  if (state === 'voting') {
    if (isHost) {
      return (
        <main className="hidden md:flex flex-1 overflow-hidden">
          <DesktopHostVotingView
            storyId={storyId}
            storyTitle={storyTitle}
            seconds={seconds}
            totalSeconds={totalSeconds}
            participants={participants}
          />
        </main>
      );
    }
    return (
      <main className="hidden md:flex flex-1 overflow-hidden">
        <DesktopParticipantVotingView
          storyId={storyId}
          storyTitle={storyTitle}
          seconds={seconds}
          totalSeconds={totalSeconds}
          votedCount={votedCount}
          totalCount={totalCount}
          participants={participants as DesktopVotingParticipant[]}
          {...(selectedValue !== undefined ? { selectedValue } : {})}
          {...(onSelect !== undefined ? { onSelect } : {})}
        />
      </main>
    );
  }

  const label = getGameLabel(state, isHost);
  return (
    <main className="hidden md:flex flex-1 items-center justify-center">
      {label && <p className="text-poker-muted text-sm">{label}</p>}
    </main>
  );
}
