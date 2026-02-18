'use client';

import { cn } from '@/shared/lib/utils/cn';
import { Input as BaseInput } from '@base-ui-components/react/input';
import type { ComponentPropsWithoutRef } from 'react';
import { useId } from 'react';

export interface InputProps extends Omit<ComponentPropsWithoutRef<typeof BaseInput>, 'className'> {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
}

export function Input({ label, error, hint, className, id: idProp, ...rest }: InputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const hasError = Boolean(error);
  const parts: string[] = [];
  if (hasError) parts.push(errorId);
  if (hint) parts.push(hintId);
  const describedBy = parts.length > 0 ? parts.join(' ') : undefined;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-poker-muted">
          {label}
        </label>
      )}
      <BaseInput
        id={id}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={cn(
          'h-12 w-full rounded-lg border px-4 text-poker-text transition-all outline-none',
          'bg-poker-bg-header placeholder:text-poker-muted',
          'border-poker-muted',
          'focus:border-poker-green focus:ring-2 focus:ring-poker-green/20',
          hasError && 'border-poker-error focus:border-poker-error focus:ring-poker-error/20',
          className,
        )}
        {...rest}
      />
      {hint && !hasError && (
        <p id={hintId} className="text-xs text-poker-muted">
          {hint}
        </p>
      )}
      {hasError && (
        <p id={errorId} role="alert" className="text-xs text-poker-error">
          {error}
        </p>
      )}
    </div>
  );
}
