'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

export interface HostSession {
  id: string;
  name: string;
  hostName: string;
  createdAt: Date;
  storyCount: number;
}

export interface HostSessionsProps {
  sessions: HostSession[];
}

const MAX_VISIBLE = 3;

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const springTransition = { type: 'spring', stiffness: 300, damping: 20 } as const;

function getRelativeDate(createdAt: Date): string {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  return `${diffDays} days ago`;
}

function StoryCountBadge({ count }: { count: number }) {
  return (
    <span className="rounded-full bg-poker-bg-page px-2 py-0.5 text-xs font-medium text-poker-muted">
      {count === 0 ? 'No stories yet' : `${count} ${count === 1 ? 'story' : 'stories'}`}
    </span>
  );
}

function ArrowIcon() {
  return (
    <span className="text-poker-green" aria-hidden="true">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function SessionCard({ session }: { session: HostSession }) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      variants={itemVariants}
      transition={shouldReduce ? { duration: 0 } : springTransition}
      layout
    >
      <Link
        href={`/session/${session.id}`}
        className="group flex items-center gap-3 rounded-xl bg-poker-bg-row px-4 py-3 transition-colors hover:bg-poker-bg-header focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poker-green"
        aria-label={`Rejoin ${session.name}, ${getRelativeDate(session.createdAt)}`}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate text-sm font-semibold text-poker-text">{session.name}</span>
          <div className="flex items-center gap-2">
            <StoryCountBadge count={session.storyCount} />
            <span className="text-xs text-poker-dim">{getRelativeDate(session.createdAt)}</span>
          </div>
        </div>

        <motion.div
          className="shrink-0 opacity-50 transition-opacity group-hover:opacity-100"
          whileHover={shouldReduce ? {} : { x: 3 }}
          transition={springTransition}
        >
          <ArrowIcon />
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function HostSessions({ sessions }: HostSessionsProps) {
  const shouldReduce = useReducedMotion();

  if (sessions.length === 0) return null;

  const visible = sessions.slice(0, MAX_VISIBLE);
  const hasMore = sessions.length > MAX_VISIBLE;

  return (
    <section className="w-full" aria-label="Your previous sessions">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-poker-muted">
          Your Sessions
        </span>
        <div className="h-px flex-1 bg-poker-bg-row" aria-hidden="true" />
      </div>

      <motion.ul
        className="flex flex-col gap-2"
        variants={listVariants}
        initial={shouldReduce ? false : 'hidden'}
        animate={shouldReduce ? false : 'visible'}
        aria-live="polite"
      >
        {visible.map((session) => (
          <li key={session.id}>
            <SessionCard session={session} />
          </li>
        ))}
      </motion.ul>

      {hasMore && (
        <div className="mt-3 text-center">
          <Link
            href="/sessions"
            className="text-xs text-poker-muted underline-offset-4 transition-colors hover:text-poker-dim hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poker-green rounded"
          >
            See all {sessions.length} sessions
          </Link>
        </div>
      )}
    </section>
  );
}
