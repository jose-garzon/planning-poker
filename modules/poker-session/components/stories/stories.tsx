'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { StoryRow } from './story-row';

type Story = {
  title: string;
  status: 'voting' | 'pending' | 'done';
  estimate?: string;
};

interface StoriesPanelProps {
  stories: Story[];
  isHost: boolean;
  label: string;
  emptyText: string;
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
} as const;

export function StoriesPanel({ stories, isHost, label, emptyText }: StoriesPanelProps) {
  const shouldReduce = useReducedMotion();

  return (
    <div className="flex-1 flex flex-col gap-2 md:gap-3 min-h-0">
      <div className="h-10 md:h-11 bg-poker-bg-header rounded-[4px] px-4 py-2.5 md:py-3 flex items-center gap-2.5 shrink-0">
        <span className="text-base md:text-lg" aria-hidden="true">
          📋
        </span>
        <span className="text-[13px] font-black text-poker-magenta tracking-widest">{label}</span>
        {isHost && (
          <span className="ml-auto text-sm font-black text-poker-text">{stories.length}</span>
        )}
      </div>

      <motion.div
        className="flex-1 bg-poker-bg-header rounded-[4px] p-3 md:p-4 flex flex-col gap-2 overflow-y-auto min-h-0"
        variants={listVariants}
        initial={shouldReduce ? 'visible' : 'hidden'}
        animate="visible"
      >
        {stories.length === 0 ? (
          <p className="text-sm font-bold text-poker-muted text-center py-2">{emptyText}</p>
        ) : (
          stories.map((s) => <StoryRow key={s.title} title={s.title} status={s.status} />)
        )}
      </motion.div>
    </div>
  );
}
