'use client';

import { useCreateSession } from '@/modules/poker-session/hooks/use-create-session';
import { Button } from '@/shared/components/ui/button/button';
import { Input } from '@/shared/components/ui/input/input';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

const backLinkVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const cardSpring = { type: 'spring', stiffness: 300, damping: 25 } as const;
const fieldEase = { duration: 0.25, ease: 'easeOut' } as const;
const buttonSpring = { type: 'spring', stiffness: 400, damping: 15 } as const;

export default function CreateSessionPage() {
  const shouldReduce = useReducedMotion();
  const [hostName, setHostName] = useState('');
  const [sessionName, setSessionName] = useState('');
  const { createSession, status } = useCreateSession();
  const router = useRouter();

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (hostName.trim() === '' || sessionName.trim() === '') return;
    const id = await createSession(hostName.trim(), sessionName.trim());
    router.push(`/session/${id}?role=host`);
  }

  const cardInitial = shouldReduce ? { opacity: 0, scale: 1 } : cardVariants.hidden;
  const fieldInitial = shouldReduce ? { opacity: 0, y: 0 } : fieldVariants.hidden;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-poker-bg-page to-[#1A2847] px-4 py-12">
      <motion.div
        className="flex w-full max-w-[520px] flex-col items-center gap-6 rounded-[4px] bg-poker-bg-page px-6 py-10 md:px-14 md:py-12"
        variants={cardVariants}
        initial={cardInitial}
        animate="visible"
        transition={shouldReduce ? { duration: 0 } : cardSpring}
      >
        <motion.div
          className="w-full"
          variants={backLinkVariants}
          initial={fieldInitial}
          animate="visible"
          transition={shouldReduce ? { duration: 0 } : { ...fieldEase, delay: 0.05 }}
        >
          <Link
            href="/"
            className="text-xs font-bold text-poker-muted transition-colors hover:text-poker-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poker-green"
          >
            &larr; Back
          </Link>
        </motion.div>

        <h1 className="text-[28px] font-black text-poker-magenta md:text-[32px]">PLAYER SETUP</h1>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
          <motion.div
            variants={fieldVariants}
            initial={fieldInitial}
            animate="visible"
            transition={shouldReduce ? { duration: 0 } : { ...fieldEase, delay: 0.15 }}
          >
            <Input
              id="player-name"
              label="YOUR NAME:"
              type="text"
              maxLength={20}
              autoComplete="name"
              placeholder="Enter your name..."
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              containerClassName="flex flex-col gap-2 focus-within:[&_label]:text-poker-green"
              labelClassName="text-[12px] font-black tracking-widest text-poker-green transition-colors"
              className="h-14 rounded-[4px] focus:ring-2 focus:ring-poker-green focus:border-transparent border-transparent"
            />
          </motion.div>
          <motion.div
            variants={fieldVariants}
            initial={fieldInitial}
            animate="visible"
            transition={shouldReduce ? { duration: 0 } : { ...fieldEase, delay: 0.25 }}
          >
            <Input
              id="session-name"
              label="SESSION NAME:"
              type="text"
              maxLength={20}
              placeholder="e.g. Sprint 42 Planning"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              containerClassName="flex flex-col gap-2 focus-within:[&_label]:text-poker-green"
              labelClassName="text-[12px] font-black tracking-widest text-poker-green transition-colors"
              className="h-14 rounded-[4px] focus:ring-2 focus:ring-poker-green focus:border-transparent border-transparent"
            />
          </motion.div>

          <motion.div
            variants={fieldVariants}
            initial={fieldInitial}
            animate="visible"
            transition={shouldReduce ? { duration: 0 } : { ...fieldEase, delay: 0.35 }}
          >
            <Button
              type="submit"
              variant="primary"
              size="xl"
              loading={status.kind === 'loading'}
              whileTap={shouldReduce ? {} : { scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={buttonSpring}
              className="rounded-[4px] w-full transition-[filter] focus-visible:ring-offset-2 focus-visible:ring-offset-poker-bg-page"
            >
              [ START GAME ]
            </Button>
          </motion.div>
        </form>

        <p className="text-center text-[10px] font-semibold text-poker-muted">
          Max 20 characters &bull; Alphanumeric only
        </p>

        <div className="h-[2px] w-full rounded-[1px] bg-poker-green" aria-hidden="true" />
      </motion.div>
    </main>
  );
}
