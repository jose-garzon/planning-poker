'use client';

import { Button } from '@/shared/components/ui/button/button';
import { Input } from '@/shared/components/ui/input/input';
import { motion } from 'framer-motion';

interface JoinPageProps {
  id: string;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
} as const;

export default function JoinPage({ id }: JoinPageProps) {
  return (
    <main className="min-h-screen bg-poker-bg-page flex items-center justify-center p-4">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-[420px] bg-poker-bg-header rounded-2xl p-8 overflow-hidden"
      >
        <div className="flex flex-col items-center gap-6">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="32" r="30" stroke="#00FF88" strokeWidth="2" fill="#1A1F3A" />
            <circle cx="32" cy="32" r="22" stroke="#00FF88" strokeWidth="1.5" fill="none" />
            <circle cx="32" cy="32" r="10" fill="#00FF88" opacity="0.15" />
            <text x="32" y="37" textAnchor="middle" fill="#00FF88" fontSize="14" fontWeight="bold">
              ♠
            </text>
          </svg>

          <h1 className="text-poker-green text-[28px] font-black text-center">
            You&apos;re invited!
          </h1>

          <span className="bg-poker-bg-row text-poker-magenta text-sm font-medium rounded-full px-4 py-1.5">
            Session #{id}
          </span>

          <div className="w-full">
            <Input
              label="Your name"
              placeholder="e.g. Alice"
              hint="This is how teammates will see you"
              className="h-[52px]"
            />
          </div>

          <Button variant="primary" size="lg" className="w-full">
            JOIN SESSION
          </Button>

          <p className="text-xs text-poker-muted text-center">No account needed</p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-poker-green rounded-b-2xl" />
      </motion.div>
    </main>
  );
}
