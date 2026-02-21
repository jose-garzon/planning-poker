'use client';

import { motion } from 'framer-motion';

type Status = 'online' | 'idle' | 'offline';

export interface StatusDotProps {
  status: Status;
  size?: number;
}

const classMap: Record<Status, string> = {
  online: 'bg-poker-green',
  idle: 'bg-poker-gold',
  offline: 'bg-poker-muted',
};

const onlineAnimation = { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] };
const onlineTransition = {
  duration: 1.2,
  repeat: Number.POSITIVE_INFINITY,
  ease: 'easeInOut',
} as const;
const staticAnimation = { scale: 1, opacity: 1 } as const;

export function StatusDot({ status, size = 12 }: StatusDotProps) {
  const isOnline = status === 'online';

  return (
    <motion.span
      className={classMap[status]}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-block',
        flexShrink: 0,
      }}
      animate={isOnline ? onlineAnimation : staticAnimation}
      {...(isOnline ? { transition: onlineTransition } : {})}
      aria-label={status}
      role="img"
    />
  );
}
