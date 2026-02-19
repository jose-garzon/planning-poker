'use client';

import { Toast } from '@base-ui-components/react/toast';
import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode, useCallback, useEffect } from 'react';

type ToastType = 'error' | 'success' | 'warning' | 'info';

type IconComponent = () => ReactNode;

function WarningIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <path
        d="M10 2L2 17h16L10 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 10l2.5 2.5 4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

type ToastTypeConfig = {
  borderClass: string;
  colorClass: string;
  bgClass: string;
  Icon: IconComponent;
};

const TYPE_CONFIG: Record<ToastType, ToastTypeConfig> = {
  error: {
    borderClass: 'border-poker-error',
    colorClass: 'text-poker-error',
    bgClass: 'bg-poker-error',
    Icon: WarningIcon,
  },
  warning: {
    borderClass: 'border-poker-gold',
    colorClass: 'text-poker-gold',
    bgClass: 'bg-poker-gold',
    Icon: WarningIcon,
  },
  success: {
    borderClass: 'border-poker-green',
    colorClass: 'text-poker-green',
    bgClass: 'bg-poker-green',
    Icon: CheckIcon,
  },
  info: {
    borderClass: 'border-poker-blue',
    colorClass: 'text-poker-blue',
    bgClass: 'bg-poker-blue',
    Icon: InfoIcon,
  },
};

const DEFAULT_CONFIG = TYPE_CONFIG.info;

function getConfig(type: string | undefined): ToastTypeConfig {
  return TYPE_CONFIG[(type as ToastType) ?? 'info'] ?? DEFAULT_CONFIG;
}

type ToastData = ReturnType<typeof Toast.useToastManager>['toasts'][number];

type ToastItemProps = {
  toast: ToastData;
  index: number;
};

// We bypass Toast.Root entirely because it calls ReactDOM.flushSync() inside a
// useLayoutEffect to measure height — which React 19 forbids. Instead we read
// the toast data object directly and handle dismiss + auto-timeout ourselves.
// Stacking is driven by Framer Motion animate rather than CSS custom properties
// to avoid transform conflicts.
function ToastItem({ toast, index }: ToastItemProps) {
  const { close } = Toast.useToastManager();
  const config = getConfig(toast.type);
  const timeout = toast.timeout ?? 5000;

  // close() marks the toast as 'ending' and cancels its internal timer.
  // We filter 'ending' toasts from the render list so AnimatePresence plays
  // the exit animation. Base UI counts 'ending' toasts as inactive for the limit.
  const dismiss = useCallback(() => close(toast.id), [close, toast.id]);

  useEffect(() => {
    if (!timeout) return;
    const timer = setTimeout(dismiss, timeout);
    return () => clearTimeout(timer);
  }, [timeout, dismiss]);

  return (
    <motion.div
      aria-live="polite"
      aria-atomic="true"
      style={{ gridRow: 1, gridColumn: 1, zIndex: 50 - index }}
      className="overflow-hidden bg-poker-bg-row shadow-lg rounded-none md:rounded-lg"
      initial={{ y: '-100%', opacity: 0 }}
      animate={{
        y: index * 8,
        scale: 1 - index * 0.04,
        opacity: Math.max(1 - index * 0.15, 0.7),
      }}
      exit={{ y: '-100%', opacity: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      layout="position"
    >
      <div className={`border-l-4 ${config.borderClass}`}>
        <div className="flex items-start gap-3 px-4 py-3">
          <span className={config.colorClass}>
            <config.Icon />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {toast.title && (
              <p className="text-sm font-semibold text-poker-text">{toast.title as string}</p>
            )}
            {toast.description && (
              <p className="text-xs text-poker-muted">{toast.description as string}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={dismiss}
            className="-mr-1 shrink-0 p-1 text-lg leading-none text-poker-muted transition-colors hover:text-poker-text"
          >
            ×
          </button>
        </div>
      </div>

      {timeout > 0 && (
        <div
          className={`toast-progress h-0.5 ${config.bgClass}`}
          style={{ animationDuration: `${timeout}ms` }}
        />
      )}
    </motion.div>
  );
}

function ToastViewport() {
  const { toasts } = Toast.useToastManager();
  const visibleToasts = toasts.filter((t) => t.transitionStatus !== 'ending');

  return (
    <Toast.Portal>
      <Toast.Viewport className="toast-viewport fixed inset-x-0 top-0 z-50 outline-none md:left-auto md:right-4 md:top-4 md:w-[360px]">
        <AnimatePresence>
          {visibleToasts.map((toast, i) => (
            <ToastItem key={toast.id} toast={toast} index={i} />
          ))}
        </AnimatePresence>
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider timeout={5000} limit={3}>
      {children}
      <ToastViewport />
    </Toast.Provider>
  );
}
