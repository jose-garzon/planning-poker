'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface LobbyFooterProps {
  isHost: boolean;
}

const tapTransition = { type: 'spring', stiffness: 300, damping: 20 } as const;

export function LobbyFooter({ isHost }: LobbyFooterProps) {
  const shouldReduce = useReducedMotion();
  const tapProps = shouldReduce ? {} : { whileTap: { scale: 0.97 }, transition: tapTransition };

  if (isHost) {
    return (
      <footer className="h-14 bg-poker-bg-page px-4 md:px-6 flex items-center gap-2 md:gap-4 shrink-0">
        <p className="hidden md:block flex-1 text-[12px] font-bold text-poker-muted">
          <span aria-hidden="true">⏱</span> Session expires in 15 days
        </p>

        <div className="flex flex-1 md:flex-none items-center gap-2 md:gap-3">
          <motion.button
            {...tapProps}
            type="button"
            className="flex-1 md:flex-none h-10 bg-poker-magenta text-poker-bg-page text-[13px] md:text-[11px] font-black px-4 md:px-5 rounded-[4px] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-poker-green"
          >
            <span className="font-black text-base leading-none" aria-hidden="true">
              +
            </span>
            ADD STORY
          </motion.button>

          <motion.button
            {...tapProps}
            type="button"
            className="flex-1 md:flex-none h-10 bg-poker-green text-poker-bg-page text-[13px] md:text-[11px] font-black px-4 md:px-5 rounded-[4px] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-poker-green"
          >
            <span aria-hidden="true">▶</span>
            START VOTE
          </motion.button>
        </div>
      </footer>
    );
  }

  return (
    <footer className="h-14 bg-poker-bg-page px-4 md:px-6 flex items-center gap-3 md:gap-4 shrink-0">
      <p className="flex-1 text-xs md:text-[12px] font-bold text-poker-muted">
        <span aria-hidden="true">⏱</span> Waiting for host to reveal results...
      </p>

      <motion.button
        {...tapProps}
        type="button"
        className="h-9 md:h-10 bg-poker-bg-row text-poker-muted text-[11px] font-black px-4 md:px-5 rounded-[4px] hover:text-poker-text transition-colors focus:outline-none focus:ring-2 focus:ring-poker-green"
      >
        LEAVE
      </motion.button>
    </footer>
  );
}
