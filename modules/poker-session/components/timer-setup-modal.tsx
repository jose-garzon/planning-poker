'use client';

import { Button } from '@/shared/components/ui/button/button';
import { Modal, ModalBody, ModalHeader } from '@/shared/components/ui/modal';
import { cn } from '@/shared/lib/utils/cn';
import { useState } from 'react';

export interface TimerSetupModalProps {
  open: boolean;
  storyTitle: string;
  onOpenChangeAction: (open: boolean) => void;
  onStartAction: (durationSeconds: number) => void;
}

const DURATION_OPTIONS = [
  { label: '1 min', seconds: 60 },
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
] as const;

export function TimerSetupModal({
  open,
  storyTitle,
  onOpenChangeAction,
  onStartAction,
}: TimerSetupModalProps) {
  const [selectedDuration, setSelectedDuration] = useState(120);

  const handleStart = () => {
    onStartAction(selectedDuration);
    onOpenChangeAction(false);
  };

  return (
    <Modal open={open} onOpenChangeAction={onOpenChangeAction} maxWidth="max-w-[400px]">
      <ModalHeader title="START VOTE" titleClassName="text-poker-green" />

      <ModalBody>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-black tracking-widest text-poker-muted">
            VOTING FOR:
          </span>
          <span className="mt-1 truncate text-sm font-medium text-poker-text">{storyTitle}</span>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-black tracking-widest text-poker-green">
            TIMER DURATION:
          </span>
          <div className="flex gap-3">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.seconds}
                type="button"
                onClick={() => setSelectedDuration(option.seconds)}
                className={cn(
                  'h-12 flex-1 cursor-pointer rounded-[4px] border-2 text-sm font-black transition-colors',
                  selectedDuration === option.seconds
                    ? 'border-poker-green bg-poker-green/10 text-poker-green'
                    : 'border-poker-bg-row bg-poker-bg-row text-poker-muted hover:border-poker-muted hover:text-poker-text',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </ModalBody>

      <Button variant="primary" size="xl" className="w-full rounded-[4px]" onClick={handleStart}>
        START VOTE ▶
      </Button>
    </Modal>
  );
}
