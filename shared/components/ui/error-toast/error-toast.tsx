'use client';

import { motion } from 'framer-motion';

interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
  duration?: number;
}

const slideVariants = {
  hidden: { y: '-100%' },
  visible: { y: 0 },
  exit: { y: '-100%' },
};

const slideTransition = { duration: 0.3, ease: 'easeOut' } as const;

export function ErrorToast({ message, onDismiss, duration = 5000 }: ErrorToastProps) {
  return (
    <motion.div
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={slideTransition}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-poker-bg-row border-l-4 border-[#EF4444] flex items-center gap-3 px-4 py-3 shadow-lg">
          {/* Warning icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M10 2L2 17h16L10 2z"
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M10 8v4" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="14.5" r="0.75" fill="#EF4444" />
          </svg>

          {/* Message */}
          <p className="text-poker-text text-sm flex-1">{message}</p>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            type="button"
            className="text-poker-muted hover:text-poker-text text-lg leading-none p-1 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Auto-dismiss progress bar */}
        <motion.div
          className="h-0.5 bg-[#EF4444]"
          style={{ transformOrigin: 'left' }}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          onAnimationComplete={onDismiss}
        />
      </div>
    </motion.div>
  );
}
