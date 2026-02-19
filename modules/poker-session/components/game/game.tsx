interface GameAreaProps {
  isHost: boolean;
}

export function GameArea({ isHost }: GameAreaProps) {
  return (
    <main className="hidden md:flex flex-1 items-center justify-center">
      <p className="text-poker-muted text-sm">
        {isHost ? 'Select a story to start voting' : 'Waiting for host to start voting...'}
      </p>
    </main>
  );
}
