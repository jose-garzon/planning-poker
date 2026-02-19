'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface LobbyHeaderProps {
  sessionId: string;
}

const tapTransition = { type: 'spring', stiffness: 300, damping: 20 } as const;

export function LobbyHeader({ sessionId }: LobbyHeaderProps) {
  const shouldReduce = useReducedMotion();
  const tapProps = shouldReduce ? {} : { whileTap: { scale: 0.97 }, transition: tapTransition };

  return (
    <header className="h-14 md:h-[72px] bg-poker-bg-page px-4 md:px-6 flex items-center gap-3 md:gap-4 shrink-0">
      <div className="h-9 md:h-11 bg-poker-bg-header rounded-[4px] px-4 md:px-5 flex items-center gap-2 md:gap-3 flex-1">
        <span className="text-base md:text-lg font-[Inter]" aria-hidden="true">
          🔗
        </span>
        <span className="text-xs md:text-sm font-bold text-poker-green">
          poker.app/join/{sessionId}
        </span>
      </div>

      <motion.button
        {...tapProps}
        type="button"
        aria-label="Copy session link"
        className="w-9 h-9 md:w-12 md:h-12 bg-poker-magenta rounded-[4px] flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-poker-green"
      >
        <span className="text-base md:text-xl font-[Inter]" aria-hidden="true">
          📋
        </span>
      </motion.button>
    </header>
  );
}
