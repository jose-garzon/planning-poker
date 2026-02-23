'use client';

import { Button } from '@/shared/components/ui/button/button';
import { useReducedMotion } from 'framer-motion';
import type { GameState } from '../game/game';

interface LobbyFooterProps {
  isHost: boolean;
  state?: GameState;
  allVoted?: boolean;
  onAddStory?: () => void;
  onStartVote?: () => void;
  onReveal?: () => void;
}

export function LobbyFooter({
  isHost,
  state,
  allVoted,
  onAddStory,
  onStartVote,
  onReveal,
}: LobbyFooterProps) {
  const shouldReduce = useReducedMotion();

  if (isHost && state === 'voting') {
    return (
      <footer className="h-14 bg-poker-bg-page px-4 md:px-6 flex items-center gap-2 md:gap-4 shrink-0">
        <p className="hidden md:block flex-1 text-[12px] font-bold text-poker-muted">
          <span aria-hidden="true">⏱</span> Session expires in 15 days
        </p>
        <Button
          variant={allVoted ? 'primary' : 'ghost'}
          type="button"
          layout
          className="flex-1 md:flex-none h-10 rounded-[4px] text-[13px] md:text-[11px] font-black px-4 md:px-5"
          onClick={onReveal}
          {...(shouldReduce ? { whileTap: {} } : {})}
        >
          <span aria-hidden="true">▶</span>
          REVEAL RESULTS
        </Button>
      </footer>
    );
  }

  if (isHost) {
    return (
      <footer className="h-14 bg-poker-bg-page px-4 md:px-6 flex items-center gap-2 md:gap-4 shrink-0">
        <p className="hidden md:block flex-1 text-[12px] font-bold text-poker-muted">
          <span aria-hidden="true">⏱</span> Session expires in 15 days
        </p>

        <div className="flex flex-1 md:flex-none items-center gap-2 md:gap-3">
          <Button
            variant="secondary"
            type="button"
            className="flex-1 md:flex-none h-10 rounded-[4px] text-[13px] md:text-[11px] font-black px-4 md:px-5"
            onClick={onAddStory}
            {...(shouldReduce ? { whileTap: {} } : {})}
          >
            <span className="font-black text-base leading-none" aria-hidden="true">
              +
            </span>
            ADD STORY
          </Button>

          <Button
            variant="primary"
            type="button"
            className="flex-1 md:flex-none h-10 rounded-[4px] text-[13px] md:text-[11px] font-black px-4 md:px-5"
            onClick={onStartVote}
            {...(shouldReduce ? { whileTap: {} } : {})}
          >
            <span aria-hidden="true">▶</span>
            START VOTE
          </Button>
        </div>
      </footer>
    );
  }

  return (
    <footer className="h-14 bg-poker-bg-page px-4 md:px-6 flex items-center gap-3 md:gap-4 shrink-0">
      <p className="flex-1 text-xs md:text-[12px] font-bold text-poker-muted">
        <span aria-hidden="true">⏱</span> Waiting for host to reveal results...
      </p>

      <Button
        variant="subtle"
        type="button"
        className="h-9 md:h-10 rounded-[4px] text-[11px] font-black px-4 md:px-5"
        {...(shouldReduce ? { whileTap: {} } : {})}
      >
        LEAVE
      </Button>
    </footer>
  );
}
