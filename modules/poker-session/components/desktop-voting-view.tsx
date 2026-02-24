'use client';

import { StatusDot } from '@/shared/components/ui/status-dot/status-dot';
import { TimerRing } from '@/shared/components/ui/timer-ring/timer-ring';
import { cn } from '@/shared/lib/utils/cn';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FibonacciCard } from './fibonacci-card';

export interface DesktopVotingParticipant {
  name: string;
  isHost?: boolean;
  status: 'online' | 'idle' | 'offline';
  voted: boolean;
}

export interface DesktopParticipantVotingViewProps {
  storyId: string;
  storyTitle: string;
  seconds: number;
  totalSeconds: number;
  votedCount: number;
  totalCount: number;
  participants: DesktopVotingParticipant[];
  selectedValue?: number | '?' | undefined;
  onSelect?: ((value: number | '?') => void) | undefined;
}

const CARD_VALUES: (number | '?')[] = [1, 2, 3, 5, 8, 13, '?'];

// Stagger container — entrance only
const handContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
} as const;

const cardEntranceVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1 },
} as const;

const cardEntranceTransition = { type: 'spring', stiffness: 300, damping: 24 } as const;

const liftTransition = { type: 'spring', stiffness: 400, damping: 22 } as const;

const chipContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
} as const;

const chipVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
} as const;

const chipTransition = { type: 'spring', stiffness: 300, damping: 24 } as const;

export function DesktopParticipantVotingView({
  storyId,
  storyTitle,
  seconds,
  totalSeconds,
  votedCount,
  totalCount,
  participants,
  selectedValue,
  onSelect,
}: DesktopParticipantVotingViewProps) {
  const shouldReduce = useReducedMotion() ?? false;
  const hasVoted = selectedValue !== undefined;
  const isUrgent = seconds <= 30;

  const nonHostParticipants = participants.filter((p) => !p.isHost);
  const votedTeammates = nonHostParticipants.filter((p) => p.voted);
  const waitingTeammates = nonHostParticipants.filter((p) => !p.voted);

  return (
    <div className="flex flex-col h-full w-full bg-poker-bg-page">
      {/* Top bar */}
      <div className="shrink-0 h-16 px-6 flex items-center gap-4 border-b border-poker-bg-row/60">
        <span
          className="text-xs font-black text-poker-secondary bg-poker-secondary/10 px-2.5 py-1 rounded-full border border-poker-secondary/30 shrink-0"
          aria-label="Voting in progress"
        >
          ● VOTING
        </span>
        <span className="text-base font-black text-poker-green shrink-0">{storyId}</span>
        <p className="text-base font-medium text-poker-text truncate flex-1">{storyTitle}</p>
        <div className="shrink-0 flex items-center gap-4">
          <span className="text-sm font-bold text-poker-muted whitespace-nowrap">
            {votedCount} of {totalCount} voted
          </span>
          <TimerRing seconds={seconds} totalSeconds={totalSeconds} size={44} strokeWidth={3} />
        </div>
      </div>

      {/* Context area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 flex flex-col gap-6">
        {/* Story hero */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-poker-text leading-snug">{storyTitle}</h2>
          <span className="text-base font-black text-poker-green">{storyId}</span>
        </div>

        {/* Vote status row */}
        <AnimatePresence mode="wait">
          {hasVoted ? (
            <motion.div
              key="voted"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <span className="text-sm font-black uppercase tracking-wider text-poker-muted">
                YOUR VOTE
              </span>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-poker-green text-poker-bg-page text-[18px] font-black">
                {selectedValue}
              </span>
              <span className="text-sm text-poker-muted">tap a card to change</span>
            </motion.div>
          ) : (
            <motion.p
              key="prompt"
              initial={{ opacity: 0, y: 4 }}
              animate={isUrgent && !shouldReduce ? { opacity: [1, 0.5, 1] } : { opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={
                isUrgent && !shouldReduce
                  ? { duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
                  : { duration: 0.2 }
              }
              className={cn(
                'text-base font-black uppercase tracking-wider',
                isUrgent ? 'text-poker-error' : 'text-poker-muted',
              )}
            >
              {isUrgent ? '⚡ VOTE NOW — TIME IS RUNNING OUT' : 'CHOOSE A CARD BELOW'}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Teammate grid */}
        {nonHostParticipants.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-poker-muted">
                TEAMMATES
              </span>
              <span className="text-xs font-bold text-poker-green">
                {votedTeammates.length} voted
              </span>
              <span className="text-poker-bg-row text-xs" aria-hidden="true">
                ·
              </span>
              <span className="text-xs font-bold text-poker-muted">
                {waitingTeammates.length} waiting
              </span>
            </div>

            <motion.div
              className="flex flex-wrap gap-2.5"
              aria-live="polite"
              aria-label="Teammate voting status"
              {...(!shouldReduce && {
                variants: chipContainerVariants,
                initial: 'hidden',
                animate: 'visible',
              })}
            >
              {nonHostParticipants.map((p) => (
                <motion.div
                  key={p.name}
                  {...(!shouldReduce && {
                    variants: chipVariants,
                    transition: chipTransition,
                  })}
                  className={cn(
                    'flex items-center gap-2 h-10 px-4 rounded-lg border text-sm font-medium transition-colors',
                    p.voted
                      ? 'bg-poker-green/10 border-poker-green/30 text-poker-green'
                      : 'bg-poker-bg-row border-poker-bg-row text-poker-muted opacity-70',
                  )}
                >
                  <StatusDot status={p.status} size={8} />
                  <span className="max-w-[120px] truncate">{p.name}</span>
                  {p.voted && (
                    <span
                      className="text-poker-green text-sm font-black"
                      aria-label="voted"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Poker hand */}
      <div className="shrink-0 h-[200px] border-t border-poker-bg-row/60 flex items-end justify-center px-8 pb-8 pt-3">
        <motion.div
          className="flex items-end gap-3"
          {...(!shouldReduce && {
            variants: handContainerVariants,
            initial: 'hidden',
            animate: 'visible',
          })}
        >
          {CARD_VALUES.map((v) => (
            // Outer: entrance stagger
            <motion.div
              key={String(v)}
              {...(!shouldReduce && {
                variants: cardEntranceVariants,
                transition: cardEntranceTransition,
              })}
            >
              {/* Inner: lift on select / hover */}
              <motion.div
                className="relative cursor-pointer"
                style={{ width: 80 }}
                animate={{ y: selectedValue === v ? -28 : 0 }}
                {...(!shouldReduce
                  ? {
                      whileHover: { y: selectedValue === v ? -28 : -10 },
                      transition: liftTransition,
                    }
                  : { transition: { duration: 0 } })}
                onClick={() => onSelect?.(v)}
              >
                {/* Glow ring behind selected card */}
                <AnimatePresence>
                  {selectedValue === v && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute -inset-1.5 rounded-xl bg-poker-green/25 blur-md -z-10"
                      aria-hidden="true"
                    />
                  )}
                </AnimatePresence>
                {/* Card */}
                <div className="h-[140px] w-full">
                  <FibonacciCard
                    value={v}
                    selected={selectedValue === v}
                    onClick={() => onSelect?.(v)}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
