'use client';

import { Button } from '@/shared/components/ui/button/button';
import { useReducedMotion } from 'framer-motion';
interface LobbyHeaderProps {
  sessionId: string;
  sessionName: string;
}

export function LobbyHeader({ sessionId, sessionName }: LobbyHeaderProps) {
  const shouldReduce = useReducedMotion();
  const joinLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/join/${sessionId}`;

  function handleCopy() {
    navigator.clipboard.writeText(joinLink);
  }

  return (
    <header className="h-14 md:h-[72px] bg-poker-bg-page px-4 md:px-6 flex items-center gap-3 md:gap-4 shrink-0">
      <span className="text-sm md:text-base font-black text-poker-text truncate max-w-[160px] md:max-w-xs shrink-0">
        {sessionName}
      </span>

      <div className="h-9 md:h-11 bg-poker-bg-header rounded-[4px] px-4 md:px-5 flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <span className="text-base md:text-lg font-[Inter]" aria-hidden="true">
          🔗
        </span>
        <span className="text-xs md:text-sm font-bold text-poker-green truncate">{joinLink}</span>
      </div>

      <Button
        variant="secondary"
        type="button"
        aria-label="Copy session link"
        className="w-9 h-9 md:w-12 md:h-12 rounded-[4px] p-0 shrink-0"
        onClick={handleCopy}
        {...(shouldReduce ? { whileTap: {} } : {})}
      >
        <span className="text-base md:text-xl font-[Inter]" aria-hidden="true">
          📋
        </span>
      </Button>
    </header>
  );
}
