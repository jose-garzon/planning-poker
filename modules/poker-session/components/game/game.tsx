export type GameState = 'voting' | 'timeup' | 'unanimous-results' | 'results' | 'voted';

interface GameAreaProps {
  isHost: boolean;
  state?: GameState | undefined;
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

export function GameArea({ isHost, state }: GameAreaProps) {
  const label = getGameLabel(state, isHost);

  return (
    <main className="hidden md:flex flex-1 items-center justify-center">
      {label && <p className="text-poker-muted text-sm">{label}</p>}
    </main>
  );
}
