'use client';

import { TimerRing } from '@/shared/components/ui/timer-ring/timer-ring';
import { cn } from '@/shared/lib/utils/cn';
import { CardDeck } from './card-deck';

export interface VotingViewProps {
  storyId: string;
  storyTitle: string;
  seconds: number;
  totalSeconds: number;
  votedCount: number;
  totalCount: number;
  selectedValue?: number | '?' | undefined;
  onSelect?: ((value: number | '?') => void) | undefined;
}

function getInstruction(hasVoted: boolean, isUrgent: boolean): string {
  if (isUrgent) return 'VOTE NOW — TIME IS RUNNING OUT';
  if (hasVoted) return 'TAP A CARD TO CHANGE VOTE';
  return 'TAP A CARD TO VOTE';
}

export function VotingView({
  storyId,
  storyTitle,
  seconds,
  totalSeconds,
  votedCount,
  totalCount,
  selectedValue,
  onSelect,
}: VotingViewProps) {
  const hasVoted = selectedValue !== undefined;
  const isUrgent = seconds <= 30;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Story header row */}
      <div className="flex items-start justify-between gap-3 shrink-0 px-4 pt-4 pb-4">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span className="text-[20px] font-black text-poker-green leading-tight">{storyId}</span>
          <p className="text-sm text-poker-text line-clamp-2 leading-snug">{storyTitle}</p>
        </div>
        <div className="shrink-0">
          <TimerRing seconds={seconds} totalSeconds={totalSeconds} size={72} strokeWidth={5} />
        </div>
      </div>

      {/* Voted banner — always rendered (invisible when not voted) to avoid layout shift */}
      <div className={cn('shrink-0 px-4 py-3 bg-poker-green', !hasVoted && 'invisible')}>
        <p className="text-[11px] font-black uppercase tracking-wide text-center text-poker-bg-page">
          Your vote: {selectedValue} — tap another to change
        </p>
      </div>

      {/* Info row: instruction (left) + vote count (right) */}
      <div className="flex items-center justify-between gap-3 shrink-0 px-4 py-3">
        <p
          className={cn(
            'text-[10px] font-black uppercase tracking-wider leading-none truncate',
            isUrgent ? 'text-poker-error' : 'text-poker-muted',
          )}
        >
          {getInstruction(hasVoted, isUrgent)}
        </p>
        <p className="text-[11px] font-black text-poker-green shrink-0 whitespace-nowrap leading-none">
          {votedCount} of {totalCount} voted
        </p>
      </div>

      {/* Card deck — fills remaining height */}
      <div className="flex-1 min-h-0 px-4 pb-4 pt-3">
        <CardDeck selectedValue={selectedValue} onSelect={onSelect} />
      </div>
    </div>
  );
}
