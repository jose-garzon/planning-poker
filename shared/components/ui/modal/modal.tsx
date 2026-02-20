'use client';

import { cn } from '@/shared/lib/utils/cn';
import { Dialog } from '@base-ui-components/react/dialog';
import type { ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}

export function Modal({
  open,
  onOpenChangeAction,
  children,
  className,
  maxWidth = 'max-w-[480px]',
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChangeAction}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            'fixed inset-0 z-50 bg-poker-bg-page/80 backdrop-blur-sm',
            'transition-opacity duration-200',
            'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
          )}
        />
        <Dialog.Popup
          className={cn(
            'fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'mx-4 flex w-full flex-col gap-5 rounded-[4px] bg-poker-bg-header p-6',
            'transition-[transform,opacity] duration-200',
            'data-[starting-style]:scale-96 data-[starting-style]:opacity-0',
            'data-[ending-style]:scale-96 data-[ending-style]:opacity-0',
            maxWidth,
            className,
          )}
        >
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export interface ModalHeaderProps {
  title: string;
  titleClassName?: string;
}

export function ModalHeader({ title, titleClassName }: ModalHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <Dialog.Title
          className={cn(
            'text-[14px] font-black tracking-widest text-poker-magenta',
            titleClassName,
          )}
        >
          {title}
        </Dialog.Title>
        <Dialog.Close
          className={cn(
            'inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg',
            'border border-poker-muted bg-transparent text-poker-text transition-all',
            'hover:border-poker-green hover:text-poker-green',
          )}
          aria-label="Close modal"
        >
          ✕
        </Dialog.Close>
      </div>
      <div className="h-[1px] bg-poker-bg-row" aria-hidden="true" />
    </>
  );
}

export interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return <div className={cn('flex flex-col gap-4', className)}>{children}</div>;
}

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return <div className={cn('flex justify-end gap-3 pt-1', className)}>{children}</div>;
}
