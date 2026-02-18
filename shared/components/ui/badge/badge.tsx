import { cn } from '@/shared/lib/utils/cn';
import type { ReactNode } from 'react';

type BadgeVariant = 'host' | 'vote-count' | 'status';

export interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  host: 'bg-poker-magenta text-poker-text text-xs font-black px-2 py-0.5 rounded uppercase tracking-wide',
  'vote-count':
    'bg-poker-bg-header text-poker-green text-xs font-bold px-2 py-0.5 rounded-full border border-poker-green/30',
  status: 'bg-poker-bg-row text-poker-muted text-xs px-2 py-0.5 rounded',
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center', variantClasses[variant])}>{children}</span>
  );
}
