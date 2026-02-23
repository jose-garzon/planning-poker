'use client';

import { Badge } from '@/shared/components/ui/badge/badge';
import { StatusDot } from '@/shared/components/ui/status-dot/status-dot';
import { TimerRing } from '@/shared/components/ui/timer-ring/timer-ring';
import { cn } from '@/shared/lib/utils/cn';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export interface HostVotingParticipant {
  name: string;
  isHost?: boolean;
  status: 'online' | 'idle' | 'offline';
  voted: boolean;
}

export interface HostVotingViewProps {
  storyId: string;
  storyTitle: string;
  seconds: number;
  totalSeconds: number;
  participants: HostVotingParticipant[];
}

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

const rowVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
} as const;

const rowTransition = { type: 'spring', stiffness: 300, damping: 28 } as const;

const bannerTransition = { type: 'spring', stiffness: 300, damping: 25 } as const;

interface HostVotingParticipantRowProps {
  participant: HostVotingParticipant;
  reducedMotion: boolean;
}

function HostVotingParticipantRow({ participant, reducedMotion }: HostVotingParticipantRowProps) {
  const initials = participant.name.charAt(0).toUpperCase();

  return (
    <motion.div
      variants={reducedMotion ? undefined : rowVariants}
      transition={reducedMotion ? undefined : rowTransition}
      className={cn(
        'h-11 shrink-0 bg-poker-bg-row rounded-lg flex items-center px-3 gap-2 mb-2',
        !participant.voted && 'opacity-70',
      )}
    >
      <StatusDot status={participant.status} />

      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-poker-bg-header shrink-0">
        <span className="text-poker-green text-xs font-bold">{initials}</span>
      </div>

      <span className="text-poker-text text-sm font-medium flex-1 truncate">
        {participant.name}
      </span>

      {participant.isHost && <Badge variant="host">HOST</Badge>}

      {participant.voted && (
        <span className="text-poker-green text-sm font-black shrink-0" aria-label="Voted">
          ✓
        </span>
      )}
    </motion.div>
  );
}

export function HostVotingView({
  storyId,
  storyTitle,
  seconds,
  totalSeconds,
  participants,
}: HostVotingViewProps) {
  const shouldReduce = useReducedMotion() ?? false;

  const waitingParticipants = participants.filter((p) => !(p.isHost || p.voted));
  const votedParticipants = participants.filter((p) => !p.isHost && p.voted);
  const allVoted = waitingParticipants.length === 0 && votedParticipants.length > 0;
  const isUrgent = seconds <= 30;
  const isWarning = seconds > 30 && seconds <= 60;

  function getUrgencyLabel(): string {
    if (allVoted) return 'EVERYONE HAS VOTED';
    if (isUrgent) return 'TIME RUNNING OUT — REVEAL NOW';
    return 'VOTING IN PROGRESS';
  }

  function getUrgencyClass(): string {
    if (allVoted) return 'text-poker-green';
    if (isUrgent) return 'text-poker-error';
    if (isWarning) return 'text-poker-gold';
    return 'text-poker-muted';
  }

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

      {/* All-voted banner */}
      <AnimatePresence>
        {allVoted && (
          <motion.div
            initial={shouldReduce ? { opacity: 0 } : { y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={shouldReduce ? { opacity: 0 } : { y: -8, opacity: 0 }}
            transition={shouldReduce ? { duration: 0 } : bannerTransition}
            className="shrink-0 px-4 py-3 bg-poker-green"
          >
            <p className="text-[11px] font-black uppercase tracking-wide text-center text-poker-bg-page">
              ALL VOTED — TAP REVEAL
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info row */}
      <div className="flex items-center justify-between gap-3 shrink-0 px-4 py-3">
        {isUrgent && !allVoted ? (
          <motion.p
            className={cn(
              'text-[10px] font-black uppercase tracking-wider leading-none truncate',
              getUrgencyClass(),
            )}
            animate={shouldReduce ? undefined : { opacity: [1, 0.5, 1] }}
            transition={
              shouldReduce
                ? undefined
                : { duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
            }
          >
            {getUrgencyLabel()}
          </motion.p>
        ) : (
          <p
            className={cn(
              'text-[10px] font-black uppercase tracking-wider leading-none truncate',
              getUrgencyClass(),
            )}
          >
            {getUrgencyLabel()}
          </p>
        )}
        <p className="text-[11px] font-black text-poker-green shrink-0 whitespace-nowrap leading-none">
          {votedParticipants.length} of {waitingParticipants.length + votedParticipants.length}{' '}
          voted
        </p>
      </div>

      {/* Participant list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <motion.div
          variants={shouldReduce ? undefined : listVariants}
          initial={shouldReduce ? undefined : 'hidden'}
          animate={shouldReduce ? undefined : 'visible'}
        >
          {waitingParticipants.length > 0 && (
            <>
              <p className="text-[10px] font-black uppercase tracking-wider text-poker-muted py-2">
                WAITING ({waitingParticipants.length})
              </p>
              {waitingParticipants.map((participant) => (
                <HostVotingParticipantRow
                  key={participant.name}
                  participant={participant}
                  reducedMotion={shouldReduce}
                />
              ))}
            </>
          )}

          {votedParticipants.length > 0 && (
            <>
              <p className="text-[10px] font-black uppercase tracking-wider text-poker-muted py-2">
                VOTED ({votedParticipants.length})
              </p>
              {votedParticipants.map((participant) => (
                <HostVotingParticipantRow
                  key={participant.name}
                  participant={participant}
                  reducedMotion={shouldReduce}
                />
              ))}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
