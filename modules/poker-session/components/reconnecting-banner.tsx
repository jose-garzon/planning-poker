'use client';

import { AnimatePresence, motion } from 'framer-motion';

export interface ReconnectingBannerProps {
  visible: boolean;
  retryIn: number;
}

export function ReconnectingBanner({ visible, retryIn }: ReconnectingBannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-14 inset-x-0 z-50 md:top-[72px]"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-center gap-3 bg-poker-magenta px-4 py-2">
            <motion.span
              className="text-sm text-poker-bg-page"
              animate={{ rotate: 360 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: 'linear' }}
              aria-hidden="true"
            >
              ⟳
            </motion.span>
            <span className="text-xs font-black text-poker-bg-page">
              Connection lost — reconnecting...
            </span>
            <span className="text-xs font-black text-poker-bg-page/70">{retryIn}s</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
