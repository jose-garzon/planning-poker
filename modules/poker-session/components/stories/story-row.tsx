'use client';

import { Badge } from '@/shared/components/ui/badge/badge';
import { motion } from 'framer-motion';

type StoryStatus = 'voting' | 'pending' | 'done';

interface StoryRowProps {
  title: string;
  status: StoryStatus;
  estimate?: string;
}

const rowVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
} as const;

const rowTransition = { type: 'spring', stiffness: 300, damping: 28 } as const;

export function StoryRow({ title, status, estimate }: StoryRowProps) {
  return (
    <motion.div
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      transition={rowTransition}
      className="h-12 shrink-0 flex items-center px-3 gap-3 rounded-lg bg-poker-bg-row"
    >
      <span className="text-poker-text text-sm flex-1 truncate">{title}</span>

      {status === 'done' ? (
        <span className="text-poker-text text-sm font-bold shrink-0">{estimate}</span>
      ) : (
        <Badge variant={status}>{status === 'voting' ? 'VOTING NOW' : 'PENDING'}</Badge>
      )}
    </motion.div>
  );
}
