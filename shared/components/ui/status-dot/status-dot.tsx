'use client';

import { motion } from 'framer-motion';

type Status = 'online' | 'idle' | 'offline';

export interface StatusDotProps {
  status: Status;
  size?: number;
}

const colorMap: Record<Status, string> = {
  online: '#00FF88',
  idle: '#FFB800',
  offline: '#64748B',
};

const onlineAnimation = { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] };
const onlineTransition = {
  duration: 1.2,
  repeat: Number.POSITIVE_INFINITY,
  ease: 'easeInOut',
} as const;
const staticAnimation = { scale: 1, opacity: 1 } as const;

export function StatusDot({ status, size = 12 }: StatusDotProps) {
  const color = colorMap[status];
  const isOnline = status === 'online';

  return (
    <motion.span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-block',
        backgroundColor: color,
        flexShrink: 0,
      }}
      animate={isOnline ? onlineAnimation : staticAnimation}
      {...(isOnline ? { transition: onlineTransition } : {})}
      aria-label={status}
      role="img"
    />
  );
}
