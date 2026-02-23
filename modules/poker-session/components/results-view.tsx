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

export interface ResultsViewProps {
  storyId: string;
  storyTitle: string;
  votes: ResultsParticipantVote[];
  variant: ResultsVariant;
  isHost: boolean;
  onNextStory?: () => void;
  onChoose?: (value: number) => void;
  onRestartVote?: () => void;
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
} as const;

const rowVariants = {
  hidden: { x: -16, opacity: 0 },
  visible: { x: 0, opacity: 1 },
} as const;

const rowTransition = { type: 'spring', stiffness: 300, damping: 28 } as const;

export function ResultsView({
  storyId,
  storyTitle,
  votes,
  variant,
  isHost,
  onNextStory,
  onChoose,
  onRestartVote,
}: ResultsViewProps) {
  const shouldReduce = useReducedMotion() ?? false;
  const [chosenValue, setChosenValue] = useState<number | null>(null);

  // Numeric stats
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

  // Variant badge
  const badgeMap: Record<ResultsVariant, { label: string; className: string }> = {
    unanimous: {
      label: 'UNANIMOUS',
      className: 'bg-poker-green text-poker-bg-page text-[10px] font-black px-2 py-1 rounded',
    },
    normal: {
      label: 'RESULTS',
      className: 'bg-poker-bg-header text-poker-muted text-[10px] font-black px-2 py-1 rounded',
    },
    tie: {
      label: 'TIE',
      className: 'bg-poker-gold text-poker-bg-page text-[10px] font-black px-2 py-1 rounded',
    },
  };

  const badge = badgeMap[variant];

  // Participants to show in the vote list (skip host)
  const visibleVotes = votes.filter((v) => !v.isHost);

  function getVoteBadgeClass(value: number | '?'): string {
    if (value === '?') return 'bg-poker-bg-header text-poker-muted';
    if (variant === 'unanimous') return 'bg-poker-green text-poker-bg-page';
    if (variant === 'tie' && (tieOptions as number[]).includes(value)) {
      return 'bg-poker-gold text-poker-bg-page';
    }
    if (value === mostVoted) return 'bg-poker-green text-poker-bg-page';
    return 'bg-poker-secondary text-poker-bg-page';
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* 1. Header Row */}
      <div className="shrink-0 px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className="text-[20px] font-black text-poker-green leading-tight">{storyId}</span>
          <p className="text-sm text-poker-text line-clamp-1 leading-snug">{storyTitle}</p>
        </div>
        <span className={badge.className}>{badge.label}</span>
      </div>

      {/* 2. Variant Hero Section */}
      {variant === 'unanimous' && (
        <motion.div
          {...(!shouldReduce && {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { type: 'spring', stiffness: 300, damping: 20 },
          })}
          {...(shouldReduce && {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0 },
          })}
          className="shrink-0 bg-poker-green px-4 py-4 flex flex-col items-center gap-1"
        >
          <p
            className="text-[10px] font-black uppercase tracking-widest text-poker-bg-page opacity-70"
            aria-hidden="true"
          >
            🎉 everyone agreed
          </p>
          <p className="text-[48px] font-black text-poker-bg-page leading-none">
            {votes[0]?.value}
          </p>
          <p className="text-[11px] font-black text-poker-bg-page opacity-70">STORY POINTS</p>
        </motion.div>
      )}

      {variant === 'normal' && (
        <div className="shrink-0 px-4 py-3 flex gap-2">
          <div className="flex-1 bg-poker-bg-row rounded-lg flex flex-col items-center justify-center py-3 gap-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-poker-muted">
              AVG
            </span>
            <span className="text-[22px] font-black text-poker-text">{avg}</span>
          </div>
          <div className="flex-1 bg-poker-bg-row rounded-lg flex flex-col items-center justify-center py-3 gap-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-poker-green">
              CLOSEST
            </span>
            <span className="text-[22px] font-black text-poker-text">{mostVoted}</span>
          </div>
          <div className="flex-1 bg-poker-bg-row rounded-lg flex flex-col items-center justify-center py-3 gap-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-poker-secondary">
              SPREAD
            </span>
            <span className="text-[22px] font-black text-poker-text">{spread}</span>
          </div>
        </div>
      )}

      {variant === 'tie' && (
        <div className="shrink-0 bg-poker-gold px-4 py-3">
          <p className="text-[11px] font-black uppercase tracking-wide text-center text-poker-bg-page">
            TIE — HOST IS DECIDING
          </p>
        </div>
      )}

      {/* 3. Distribution Bars (normal + tie variants only) */}
      {(variant === 'normal' || variant === 'tie') && (
        <div className="shrink-0 px-4 py-2">
          <p className="text-[10px] font-black uppercase tracking-wider text-poker-muted mb-2">
            VOTE DISTRIBUTION
          </p>
          {sortedDistribution.map(([value, count], index) => (
            <div className="flex items-center gap-2 mb-1" key={String(value)}>
              <span className="text-[11px] font-black text-poker-text w-5 text-right shrink-0">
                {value}
              </span>
              <div className="flex-1 h-2 bg-poker-bg-row rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    variant === 'tie' && (tieOptions as (number | '?')[]).includes(value)
                      ? 'bg-poker-gold'
                      : value === mostVoted
                        ? 'bg-poker-green'
                        : 'bg-poker-secondary',
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / votes.length) * 100}%` }}
                  {...(!shouldReduce && {
                    transition: { duration: 0.6, delay: index * 0.08, ease: 'easeOut' },
                  })}
                  {...(shouldReduce && {
                    transition: { duration: 0 },
                  })}
                />
              </div>
              <span className="text-[10px] text-poker-muted w-4 shrink-0">{count}x</span>
            </div>
          ))}
        </div>
      )}

      {/* 4. Host Tie-Choice Cards */}
      {variant === 'tie' && isHost && tieOptions.length >= 2 && (
        <div className="shrink-0 px-4 pb-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-poker-muted mb-2">
            CHOOSE A VALUE
          </p>
          <div className="flex gap-3">
            {tieOptions.map((opt) => (
              <motion.button
                key={opt}
                type="button"
                {...(!shouldReduce && { whileTap: { scale: 0.96 } })}
                onClick={() => {
                  setChosenValue(opt);
                  onChoose?.(opt);
                }}
                className={cn(
                  'flex-1 h-16 rounded-lg flex flex-col items-center justify-center gap-0.5 border cursor-pointer',
                  chosenValue === opt
                    ? 'border-2 border-poker-green bg-poker-bg-header'
                    : 'border-poker-muted bg-poker-bg-row',
                )}
              >
                <span
                  className={cn(
                    'text-[28px] font-black',
                    chosenValue === opt ? 'text-poker-green' : 'text-poker-text',
                  )}
                >
                  {opt}
                </span>
                <span className="text-[9px] font-black uppercase text-poker-muted">
                  {voteCounts.get(opt) ?? 0}x VOTES
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Vote List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-poker-muted py-2 sticky top-0 bg-poker-bg-page">
          VOTES ({visibleVotes.length})
        </p>
        <motion.div
          {...(!shouldReduce && {
            variants: listVariants,
            initial: 'hidden',
            animate: 'visible',
          })}
        >
          {visibleVotes.map((v) => (
            <motion.div
              key={v.name}
              {...(!shouldReduce && {
                variants: rowVariants,
                transition: rowTransition,
              })}
              className="h-11 bg-poker-bg-row rounded-lg px-3 gap-2 mb-2 flex items-center"
            >
              <span className="text-sm text-poker-text font-medium flex-1 truncate">{v.name}</span>
              <span
                className={cn(
                  'w-8 h-8 rounded flex items-center justify-center text-[14px] font-black shrink-0',
                  getVoteBadgeClass(v.value),
                )}
              >
                {v.value}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 6. Bottom CTA */}
      <div className="shrink-0 px-4 pb-4">
        {isHost && variant !== 'tie' && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              type="button"
              className="h-11 rounded-[4px] text-[13px] font-black px-4"
              {...(onRestartVote ? { onClick: onRestartVote } : {})}
            >
              ↺ RESTART
            </Button>
            <Button
              variant="primary"
              type="button"
              className="flex-1 h-11 rounded-[4px] text-[13px] font-black"
              {...(onNextStory ? { onClick: onNextStory } : {})}
            >
              ▶ NEXT STORY
            </Button>
          </div>
        )}

        {isHost && variant === 'tie' && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              type="button"
              className="h-11 rounded-[4px] text-[13px] font-black px-4"
              {...(onRestartVote ? { onClick: onRestartVote } : {})}
            >
              ↺ RESTART
            </Button>
            <Button
              variant={chosenValue !== null ? 'primary' : 'ghost'}
              type="button"
              className="flex-1 h-11 rounded-[4px] text-[13px] font-black"
              disabled={chosenValue === null}
              {...(chosenValue !== null && onNextStory ? { onClick: onNextStory } : {})}
            >
              {chosenValue !== null ? `▶ ACCEPT ${chosenValue}` : 'SELECT ABOVE'}
            </Button>
          </div>
        )}

        {!isHost && (
          <div className="h-11 flex items-center justify-center">
            <p
              className="text-[11px] font-black text-poker-muted uppercase tracking-wider"
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
