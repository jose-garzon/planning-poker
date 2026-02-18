'use client';

import { cn } from '@/shared/lib/utils/cn';
import { type HTMLMotionProps, motion } from 'framer-motion';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-poker-green text-poker-bg-page hover:brightness-110',
  secondary: 'bg-poker-magenta text-poker-text hover:brightness-110',
  ghost:
    'bg-transparent text-poker-text border border-poker-muted hover:border-poker-green hover:text-poker-green',
  danger: 'bg-poker-error text-poker-text hover:brightness-110',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm font-bold',
  lg: 'h-[52px] px-6 text-base font-bold',
};

const tapAnimation = { scale: 0.95 } as const;
const springTransition = { type: 'spring', stiffness: 300, damping: 20 } as const;

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  leftIcon,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled ?? loading;

  return (
    <motion.button
      type={type}
      {...(!isDisabled && { whileTap: tapAnimation })}
      transition={springTransition}
      disabled={isDisabled}
      aria-busy={loading}
      {...rest}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-bold transition-all',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
    </motion.button>
  );
}
