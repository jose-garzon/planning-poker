'use client';

import { Button } from '@/shared/components/ui/button/button';
import { cn } from '@/shared/lib/utils/cn';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

export interface ResultsParticipantVote {
  name: string;
  isHost?: boolean;
  value: number | '?';
}

export type ResultsVariant = 'unanimous' | 'normal' | 'tie';

export interface DesktopResultsViewProps {
  storyId: string;
  storyTitle: string;
  votes: ResultsParticipantVote[];
  variant: ResultsVariant;
  isHost: boolean;
  onNextStory?: () => void;
  onChoose?: (value: number) => void;
  onRestartVote?: () => void;
}

// Variant definitions defined outside component to avoid recreation on render
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
} as const;

const rowVariants = {
  hidden: { x: -16, opacity: 0 },
  visible: { x: 0, opacity: 1 },
} as const;

const rowTransition = { type: 'spring', stiffness: 300, damping: 28 } as const;

const heroEntranceTransition = { type: 'spring', stiffness: 300, damping: 20 } as const;

const badgeMap: Record<ResultsVariant, { label: string; className: string }> = {
  unanimous: {
    label: 'UNANIMOUS',
    className: 'bg-poker-green text-poker-bg-page text-xs font-black px-2.5 py-1 rounded',
  },
  normal: {
    label: 'RESULTS',
    className: 'bg-poker-bg-header text-poker-muted text-xs font-black px-2.5 py-1 rounded',
  },
  tie: {
    label: 'TIE',
    className: 'bg-poker-gold text-poker-bg-page text-xs font-black px-2.5 py-1 rounded',
  },
};

export function DesktopResultsView({
  storyId,
  storyTitle,
  votes,
  variant,
  isHost,
  onNextStory,
  onChoose,
  onRestartVote,
}: DesktopResultsViewProps) {
  const shouldReduce = useReducedMotion() ?? false;
  const [chosenValue, setChosenValue] = useState<number | null>(null);

  // Numeric stats — copied exactly from mobile ResultsView
  const numericVotes = votes.filter((v) => v.value !== '?').map((v) => v.value as number);
  const avg =
    numericVotes.length > 0
      ? Math.round((numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length) * 10) / 10
      : 0;
  const spread =
    numericVotes.length > 1
      ? `${Math.min(...numericVotes)}–${Math.max(...numericVotes)}`
      : String(numericVotes[0] ?? 0);

  // Vote distribution
  const voteCounts = new Map<number | '?', number>();
  for (const v of votes) {
    voteCounts.set(v.value, (voteCounts.get(v.value) ?? 0) + 1);
  }
  const sortedDistribution = [...voteCounts.entries()].sort((a, b) => b[1] - a[1]);
  const maxCount = sortedDistribution[0]?.[1] ?? 0;

  // Tie detection
  const tiedValues = sortedDistribution
    .filter(([v, c]) => c === maxCount && v !== '?')
    .map(([v]) => v as number);
  const tieOptions = [...tiedValues].sort((a, b) => b - a).slice(0, 2) as [number, number];

  const mostVoted = sortedDistribution[0]?.[0];

  // Participants to show in the vote list (skip host)
  const visibleVotes = votes.filter((v) => !v.isHost);

  const badge = badgeMap[variant];

  function getVoteBadgeClass(value: number | '?'): string {
    if (value === '?') return 'bg-poker-bg-header text-poker-muted';
    if (variant === 'unanimous') return 'bg-poker-green text-poker-bg-page';
    if (variant === 'tie' && (tieOptions as number[]).includes(value)) {
      return 'bg-poker-gold text-poker-bg-page';
    }
    if (value === mostVoted) return 'bg-poker-green text-poker-bg-page';
    return 'bg-poker-secondary text-poker-bg-page';
  }

  function getBarClass(value: number | '?'): string {
    if (variant === 'tie' && (tieOptions as (number | '?')[]).includes(value)) {
      return 'bg-poker-gold';
    }
    if (value === mostVoted) return 'bg-poker-green';
    return 'bg-poker-secondary';
  }

  return (
    <div className="flex flex-col h-full w-full bg-poker-bg-page">
      {/* Top bar */}
      <div className="shrink-0 h-16 px-6 flex items-center gap-4 border-b border-poker-bg-row/60">
        <span className={badge.className}>{badge.label}</span>
        <span className="text-base font-black text-poker-green shrink-0">{storyId}</span>
        <p className="text-base font-medium text-poker-text truncate flex-1">{storyTitle}</p>
      </div>

      {/* Main content — two columns */}
      <div className="flex-1 min-h-0 flex">
        {/* Left column — hero result + stats */}
        <div className="w-[45%] shrink-0 flex flex-col items-center justify-center gap-8 px-10 border-r border-poker-bg-row/40">
          {/* Unanimous hero */}
          {variant === 'unanimous' && (
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={shouldReduce ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={shouldReduce ? { duration: 0 } : heroEntranceTransition}
            >
              <span className="text-[48px] leading-none" aria-hidden="true">
                🎉
              </span>
              <span className="text-[80px] font-black text-poker-green leading-none">
                {votes[0]?.value}
              </span>
              <span className="text-xs font-black text-poker-muted uppercase tracking-widest">
                STORY POINTS
              </span>
            </motion.div>
          )}

          {/* Normal stats column */}
          {variant === 'normal' && (
            <div className="flex flex-col gap-3 w-full max-w-[240px]">
              <div className="bg-poker-bg-row rounded-xl flex items-center justify-between px-5 py-4">
                <span className="text-xs font-black uppercase tracking-wider text-poker-muted">
                  AVG
                </span>
                <span className="text-[32px] font-black text-poker-text leading-none">{avg}</span>
              </div>
              <div className="bg-poker-bg-row rounded-xl flex items-center justify-between px-5 py-4">
                <span className="text-xs font-black uppercase tracking-wider text-poker-green">
                  CLOSEST
                </span>
                <span className="text-[32px] font-black text-poker-text leading-none">
                  {mostVoted}
                </span>
              </div>
              <div className="bg-poker-bg-row rounded-xl flex items-center justify-between px-5 py-4">
                <span className="text-xs font-black uppercase tracking-wider text-poker-secondary">
                  SPREAD
                </span>
                <span className="text-[32px] font-black text-poker-text leading-none">
                  {spread}
                </span>
              </div>
            </div>
          )}

          {/* Tie announcement + host choice cards */}
          {variant === 'tie' && (
            <div className="flex flex-col items-center gap-6 w-full">
              <p className="text-base font-black uppercase tracking-wide text-poker-gold text-center">
                TIE — HOST IS DECIDING
              </p>

              {isHost && tieOptions.length >= 2 && (
                <div className="flex gap-4 w-full max-w-[280px]">
                  {tieOptions.map((opt) => (
                    <motion.button
                      key={opt}
                      type="button"
                      {...(!shouldReduce ? { whileTap: { scale: 0.96 } } : {})}
                      onClick={() => {
                        setChosenValue(opt);
                        onChoose?.(opt);
                      }}
                      className={cn(
                        'flex-1 h-24 rounded-xl flex flex-col items-center justify-center gap-1 border-2 cursor-pointer',
                        chosenValue === opt
                          ? 'border-poker-green bg-poker-bg-header'
                          : 'border-poker-muted bg-poker-bg-row',
                      )}
                    >
                      <span
                        className={cn(
                          'text-[40px] font-black leading-none',
                          chosenValue === opt ? 'text-poker-green' : 'text-poker-text',
                        )}
                      >
                        {opt}
                      </span>
                      <span className="text-xs font-black uppercase text-poker-muted">
                        {voteCounts.get(opt) ?? 0}x VOTES
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column — distribution + vote list */}
        <div className="flex-1 flex flex-col px-8 py-6 gap-6 min-w-0">
          {/* Vote distribution (normal + tie variants only) */}
          {(variant === 'normal' || variant === 'tie') && (
            <div className="shrink-0">
              <p className="text-xs font-black uppercase tracking-wider text-poker-muted mb-3">
                VOTE DISTRIBUTION
              </p>
              {sortedDistribution.map(([value, count], index) => (
                <div className="flex items-center gap-3 mb-2" key={String(value)}>
                  <span className="text-sm font-black text-poker-text w-6 text-right shrink-0">
                    {value}
                  </span>
                  <div className="flex-1 h-3 bg-poker-bg-row rounded-full overflow-hidden">
                    <motion.div
                      className={cn('h-full rounded-full', getBarClass(value))}
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / votes.length) * 100}%` }}
                      transition={
                        shouldReduce
                          ? { duration: 0 }
                          : { duration: 0.6, delay: index * 0.08, ease: 'easeOut' }
                      }
                    />
                  </div>
                  <span className="text-xs text-poker-muted w-6 shrink-0">{count}x</span>
                </div>
              ))}
            </div>
          )}

          {/* Vote list */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <p className="text-xs font-black uppercase tracking-wider text-poker-muted py-2 sticky top-0 bg-poker-bg-page">
              VOTES ({visibleVotes.length})
            </p>
            <motion.div
              {...(!shouldReduce
                ? { variants: listVariants, initial: 'hidden', animate: 'visible' }
                : {})}
            >
              {visibleVotes.map((v) => (
                <motion.div
                  key={v.name}
                  {...(!shouldReduce ? { variants: rowVariants, transition: rowTransition } : {})}
                  className="h-12 bg-poker-bg-row rounded-lg px-4 gap-3 mb-2 flex items-center"
                >
                  <span className="text-base text-poker-text font-medium flex-1 truncate">
                    {v.name}
                  </span>
                  <span
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center text-base font-black shrink-0',
                      getVoteBadgeClass(v.value),
                    )}
                  >
                    {v.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="shrink-0 border-t border-poker-bg-row/60 px-8 py-4">
        {isHost && variant !== 'tie' && (
          <div className="flex gap-3">
            <Button
              variant="ghost"
              type="button"
              className="h-12 px-6 rounded-lg text-sm font-black"
              {...(onRestartVote ? { onClick: onRestartVote } : {})}
            >
              ↺ RESTART
            </Button>
            <Button
              variant="primary"
              type="button"
              className="flex-1 h-12 rounded-lg text-sm font-black"
              {...(onNextStory ? { onClick: onNextStory } : {})}
            >
              ▶ NEXT STORY
            </Button>
          </div>
        )}

        {isHost && variant === 'tie' && (
          <div className="flex gap-3">
            <Button
              variant="ghost"
              type="button"
              className="h-12 px-6 rounded-lg text-sm font-black"
              {...(onRestartVote ? { onClick: onRestartVote } : {})}
            >
              ↺ RESTART
            </Button>
            <Button
              variant={chosenValue !== null ? 'primary' : 'ghost'}
              type="button"
              className="flex-1 h-12 rounded-lg text-sm font-black"
              disabled={chosenValue === null}
              {...(chosenValue !== null && onNextStory ? { onClick: onNextStory } : {})}
            >
              {chosenValue !== null ? `▶ ACCEPT ${chosenValue}` : 'SELECT ABOVE'}
            </Button>
          </div>
        )}

        {!isHost && (
          <div className="h-12 flex items-center justify-center">
            <p
              className="text-sm font-black text-poker-muted uppercase tracking-wider"
              aria-live="polite"
            >
              <span aria-hidden="true">⏳</span> WAITING FOR HOST...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
