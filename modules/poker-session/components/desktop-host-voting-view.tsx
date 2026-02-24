'use client';

import { StatusDot } from '@/shared/components/ui/status-dot/status-dot';
import { TimerRing } from '@/shared/components/ui/timer-ring/timer-ring';
import { cn } from '@/shared/lib/utils/cn';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export interface DesktopHostVotingParticipant {
  name: string;
  isHost?: boolean;
  status: 'online' | 'idle' | 'offline';
  voted: boolean;
}

export interface DesktopHostVotingViewProps {
  storyId: string;
  storyTitle: string;
  seconds: number;
  totalSeconds: number;
  participants: DesktopHostVotingParticipant[];
}

// Stagger container for participant cards
const sectionVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
} as const;

const participantCardVariants = {
  hidden: { y: 8, opacity: 0 },
  visible: { y: 0, opacity: 1 },
} as const;

const participantCardTransition = { type: 'spring', stiffness: 300, damping: 24 } as const;

const allVotedBannerTransition = { type: 'spring', stiffness: 300, damping: 25 } as const;

interface ParticipantCardProps {
  participant: DesktopHostVotingParticipant;
  reducedMotion: boolean;
}

function ParticipantCard({ participant, reducedMotion }: ParticipantCardProps) {
  return (
    <motion.div
      {...(!reducedMotion
        ? { variants: participantCardVariants, transition: participantCardTransition }
        : {})}
      className={cn(
        'h-12 bg-poker-bg-row rounded-lg px-3 flex items-center gap-2',
        !participant.voted && 'opacity-60',
      )}
    >
      <StatusDot status={participant.status} size={10} />
      <span className="text-sm font-bold text-poker-text truncate flex-1">{participant.name}</span>
      {participant.voted && (
        <span className="text-poker-green text-sm font-black shrink-0" aria-label="Voted">
          ✓
        </span>
      )}
    </motion.div>
  );
}

function getProgressBarClass(allVoted: boolean, isUrgent: boolean, isWarning: boolean): string {
  if (allVoted) return 'bg-poker-green';
  if (isUrgent) return 'bg-poker-error';
  if (isWarning) return 'bg-poker-gold';
  return 'bg-poker-green';
}

function getStatusLabelText(allVoted: boolean, isUrgent: boolean, isWarning: boolean): string {
  if (allVoted) return 'ALL VOTED';
  if (isUrgent) return 'TIME RUNNING OUT';
  if (isWarning) return 'VOTING IN PROGRESS';
  return 'VOTING IN PROGRESS';
}

function getStatusLabelClass(allVoted: boolean, isUrgent: boolean, isWarning: boolean): string {
  if (allVoted) return 'text-poker-green text-base font-black uppercase tracking-widest';
  if (isUrgent) return 'text-poker-error text-base font-black uppercase tracking-widest';
  if (isWarning) return 'text-poker-gold text-sm font-black uppercase tracking-wider';
  return 'text-poker-muted text-sm font-black uppercase tracking-wider';
}

export function DesktopHostVotingView({
  storyId,
  storyTitle,
  seconds,
  totalSeconds,
  participants,
}: DesktopHostVotingViewProps) {
  const shouldReduce = useReducedMotion() ?? false;

  const nonHostParticipants = participants.filter((p) => !p.isHost);
  const votedParticipants = nonHostParticipants.filter((p) => p.voted);
  const waitingParticipants = nonHostParticipants.filter((p) => !p.voted);
  const allVoted = waitingParticipants.length === 0 && nonHostParticipants.length > 0;
  const isUrgent = seconds <= 30;
  const isWarning = seconds > 30 && seconds <= 60;
  const progressPct =
    nonHostParticipants.length > 0
      ? (votedParticipants.length / nonHostParticipants.length) * 100
      : 0;

  const statusLabel = getStatusLabelText(allVoted, isUrgent, isWarning);
  const statusLabelClass = getStatusLabelClass(allVoted, isUrgent, isWarning);
  const progressBarClass = getProgressBarClass(allVoted, isUrgent, isWarning);

  return (
    <div className="flex flex-col h-full w-full bg-poker-bg-page">
      {/* Top bar */}
      <div className="shrink-0 h-16 px-6 flex items-center gap-4 border-b border-poker-bg-row/60">
        {/* Left: story info */}
        <span className="text-base font-black text-poker-green shrink-0">{storyId}</span>
        <p className="text-base font-medium text-poker-text truncate flex-1">{storyTitle}</p>

        {/* Right: timer */}
        <div className="shrink-0">
          <TimerRing seconds={seconds} totalSeconds={totalSeconds} size={44} strokeWidth={3} />
        </div>
      </div>

      {/* Main content — two columns */}
      <div className="flex-1 min-h-0 flex">
        {/* Left column: big timer + vote count */}
        <div className="w-[45%] shrink-0 flex flex-col items-center justify-center gap-6 px-8 border-r border-poker-bg-row/40">
          {/* Big timer */}
          <TimerRing seconds={seconds} totalSeconds={totalSeconds} size={160} strokeWidth={8} />

          {/* Status label */}
          {isUrgent && !allVoted ? (
            <motion.p
              className={statusLabelClass}
              {...(!shouldReduce
                ? {
                    animate: { opacity: [1, 0.5, 1] },
                    transition: {
                      duration: 0.8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                    },
                  }
                : {})}
              aria-live="polite"
            >
              <span aria-hidden="true">⚡ </span>
              {statusLabel}
            </motion.p>
          ) : (
            <p className={statusLabelClass} aria-live="polite">
              {allVoted && <span aria-hidden="true">🎯 </span>}
              {statusLabel}
            </p>
          )}

          {/* Vote count — large display */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  'text-[48px] font-black leading-none',
                  allVoted ? 'text-poker-green' : 'text-poker-text',
                )}
              >
                {votedParticipants.length}
              </span>
              <span className="text-[24px] font-black text-poker-muted leading-none">/</span>
              <span className="text-[24px] font-black text-poker-muted leading-none">
                {nonHostParticipants.length}
              </span>
            </div>
            <p className="text-xs text-poker-muted uppercase tracking-wider">participants voted</p>
          </div>
        </div>

        {/* Right column: progress + participant grid */}
        <div className="flex-1 flex flex-col px-8 py-6 gap-6 min-w-0">
          {/* Progress bar section */}
          <div className="shrink-0 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-poker-muted">
                VOTE PROGRESS
              </span>
              <span className="text-xs font-bold text-poker-green">
                {votedParticipants.length} of {nonHostParticipants.length}
              </span>
            </div>
            <div className="h-3 bg-poker-bg-row rounded-full w-full overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', progressBarClass)}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Participant grid — scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0" aria-live="polite">
            {/* VOTED section */}
            {votedParticipants.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-black uppercase tracking-wider text-poker-green py-2">
                  VOTED ({votedParticipants.length})
                </p>
                <motion.div
                  className="grid grid-cols-2 gap-3"
                  variants={sectionVariants}
                  initial={shouldReduce ? 'visible' : 'hidden'}
                  animate="visible"
                >
                  {votedParticipants.map((p) => (
                    <ParticipantCard key={p.name} participant={p} reducedMotion={shouldReduce} />
                  ))}
                </motion.div>
              </div>
            )}

            {/* WAITING section (hidden when allVoted) */}
            {waitingParticipants.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-black uppercase tracking-wider text-poker-muted py-2">
                  WAITING ({waitingParticipants.length})
                </p>
                <motion.div
                  className="grid grid-cols-2 gap-3"
                  variants={sectionVariants}
                  initial={shouldReduce ? 'visible' : 'hidden'}
                  animate="visible"
                >
                  {waitingParticipants.map((p) => (
                    <ParticipantCard key={p.name} participant={p} reducedMotion={shouldReduce} />
                  ))}
                </motion.div>
              </div>
            )}

            {/* All-voted banner */}
            <AnimatePresence>
              {allVoted && (
                <motion.div
                  initial={shouldReduce ? { opacity: 0 } : { y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={shouldReduce ? { opacity: 0 } : { y: 8, opacity: 0 }}
                  transition={shouldReduce ? { duration: 0 } : allVotedBannerTransition}
                  className="bg-poker-green/10 border border-poker-green/30 rounded-lg px-4 py-3 text-center"
                >
                  <p className="text-poker-green text-sm font-black">
                    <span aria-hidden="true">🎉 </span>
                    Everyone has voted — reveal when ready
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
