'use client';

import { motion } from 'framer-motion';

const dotAnimate = {
  opacity: [0.2, 1, 0.2],
  scale: [0.8, 1, 0.8],
};

const dots = [0, 1, 2];

export default function SessionLoading() {
  return (
    <div className="min-h-screen bg-poker-bg-page flex flex-col items-center justify-center gap-6">
      {/* Spinner ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
      >
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
          <circle cx="48" cy="48" r="40" stroke="#1E2744" strokeWidth="6" fill="none" />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="#00FF88"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="62.8 188.5"
            strokeDashoffset="0"
          />
          <text x="48" y="55" textAnchor="middle" fill="#00FF88" fontSize="20" fontWeight="bold">
            ♠
          </text>
        </svg>
      </motion.div>

      {/* Primary message */}
      <p className="text-poker-text text-lg font-semibold">Restoring your session...</p>

      {/* Secondary hint */}
      <p className="text-poker-muted text-sm">Hang tight while we sync your session data</p>

      {/* Loading dots */}
      <div className="flex gap-2">
        {dots.map((index) => (
          <motion.span
            key={index}
            className="w-2 h-2 rounded-full bg-poker-green inline-block"
            animate={dotAnimate}
            transition={{
              duration: 0.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
