'use client';

import { Button } from '@/shared/components/ui/button/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useHostSessions } from './hooks/use-host-sessions';
import { HostSessions } from './host-sessions';

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const springTransition = { type: 'spring', stiffness: 300, damping: 20 } as const;

export default function HomePage() {
  const status = useHostSessions();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-poker-bg-page to-[#1A2847] px-6 py-16">
      <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-0">
          <motion.h1
            className="text-[48px] font-black leading-none tracking-tight text-poker-green md:text-[84px]"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...springTransition, delay: 0 }}
          >
            PLANNING
          </motion.h1>
          <motion.h1
            className="text-[48px] font-black leading-none tracking-tight text-poker-magenta md:text-[84px]"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...springTransition, delay: 0.05 }}
          >
            POKER
          </motion.h1>
        </div>

        <motion.p
          className="text-[20px] text-poker-text"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
          transition={{ ...springTransition, delay: 0.1 }}
        >
          Estimate together. Ship faster.
        </motion.p>

        <motion.div
          className="flex w-full flex-col items-center gap-4"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          transition={{ ...springTransition, delay: 0.2 }}
        >
          <Link href="/create">
            <Button variant="secondary" size="lg" className="w-full md:w-auto">
              Create Session
            </Button>
          </Link>

          <Link
            href="/join/demo"
            className="text-sm text-poker-muted underline-offset-4 hover:underline"
          >
            or join with a link
          </Link>
        </motion.div>

        {status.kind === 'success' && status.sessions.length > 0 && (
          <motion.div
            className="w-full"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...springTransition, delay: 0.3 }}
          >
            <HostSessions
              sessions={status.sessions.map((s) => ({
                id: s.id,
                name: s.name,
                hostName: s.hostName,
                storyCount: s.stories.length,
                createdAt: s.createdAt,
              }))}
            />
          </motion.div>
        )}
      </div>
    </main>
  );
}
