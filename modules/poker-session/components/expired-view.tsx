'use client';

import { Button } from '@/shared/components/ui/button/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const cardTransition = { duration: 0.2, ease: 'easeOut' } as const;

export function ExpiredView() {
  return (
    <div className="min-h-screen bg-poker-bg-page flex items-center justify-center p-4">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={cardTransition}
        className="w-full max-w-[480px] bg-poker-bg-header rounded-2xl p-8 relative overflow-hidden flex flex-col items-center gap-6 text-center"
      >
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-poker-gold rounded-b-2xl" />

        {/* Hourglass icon */}
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="30" fill="#1A1F3A" stroke="#FFB800" strokeWidth="2" />
          <text x="32" y="40" textAnchor="middle" fontSize="24" fill="#FFB800">
            ⏳
          </text>
        </svg>

        {/* Heading */}
        <h1 className="text-poker-text text-[24px] font-black">This session has expired</h1>

        {/* Description */}
        <p className="text-poker-muted text-sm leading-relaxed">
          Planning Poker sessions expire after 15 days of inactivity. Your votes and stories are no
          longer available.
        </p>

        {/* Last activity badge */}
        <span className="bg-poker-bg-row text-poker-muted text-xs rounded-full px-4 py-1.5">
          Last activity: 15 days ago
        </span>

        {/* CTA button */}
        <Button variant="primary" size="lg" className="w-full md:w-[320px]">
          CREATE NEW SESSION
        </Button>

        {/* Back to home link */}
        <Link
          href="/"
          className="text-sm text-poker-muted hover:text-poker-text underline-offset-4 hover:underline transition-colors"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
