'use client';

import { StatusDot } from '@/shared/components/ui/status-dot/status-dot';
import { motion } from 'framer-motion';

interface ParticipantRowProps {
  name: string;
  isHost?: boolean;
  status?: 'online' | 'idle' | 'offline';
  voted?: boolean;
}

const rowVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 },
} as const;

const rowTransition = { type: 'spring', stiffness: 300, damping: 28, duration: 0.3 } as const;

export function ParticipantRow({
  name,
  isHost = false,
  status = 'online',
  voted = false,
}: ParticipantRowProps) {
  const initials = name.charAt(0).toUpperCase();

  return (
    <motion.div
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      transition={rowTransition}
      className="h-12 md:h-[52px] shrink-0 bg-poker-bg-row rounded-lg flex items-center px-3 gap-3"
    >
      <StatusDot status={status} />

      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1E2744] shrink-0">
        <span className="text-poker-green text-xs font-bold">{initials}</span>
      </div>

      <span className="text-poker-text text-sm font-medium flex-1 truncate">{name}</span>

      {isHost && (
        <span className="text-[10px] font-bold text-poker-green bg-poker-green/10 rounded px-1.5 py-0.5 shrink-0">
          HOST
        </span>
      )}

      {!isHost && voted && (
        <span className="text-poker-muted text-sm shrink-0" aria-label="Voted">
          ▪
        </span>
      )}
    </motion.div>
  );
}
