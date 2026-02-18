'use client';

import { Toast } from '@base-ui-components/react/toast';
import { AnimatePresence } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

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

function ToastItem({ toast, index }: ToastItemProps) {
  const config = getConfig(toast.type);
  const timeout = toast.timeout ?? 5000;

  const stackStyle: CSSProperties & Record<string, string | number> = {
    gridRow: 1,
    gridColumn: 1,
    '--toast-y': `${index * 8}px`,
    '--toast-scale': `${1 - index * 0.04}`,
    '--toast-opacity': `${Math.max(1 - index * 0.15, 0.7)}`,
    zIndex: 50 - index,
  };

  return (
    <Toast.Root
      toast={toast}
      style={stackStyle}
      className="toast-item overflow-hidden bg-poker-bg-row shadow-lg rounded-none md:rounded-lg"
    >
      <div className={`border-l-4 ${config.borderClass}`}>
        <Toast.Content className="flex items-start gap-3 px-4 py-3">
          <span className={config.colorClass}>
            <config.Icon />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <Toast.Title className="text-sm font-semibold text-poker-text" />
            <Toast.Description className="text-xs text-poker-muted" />
          </div>
          <Toast.Close
            aria-label="Dismiss"
            className="-mr-1 shrink-0 p-1 text-lg leading-none text-poker-muted transition-colors hover:text-poker-text"
          >
            ×
          </Toast.Close>
        </Toast.Content>
      </div>

      {timeout > 0 && (
        <div
          className={`toast-progress h-0.5 ${config.bgClass}`}
          style={{ animationDuration: `${timeout}ms` }}
        />
      )}
    </Toast.Root>
  );
}

function ToastViewport() {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Portal>
      <Toast.Viewport className="toast-viewport fixed inset-x-0 top-0 z-50 outline-none md:left-auto md:right-4 md:top-4 md:w-[360px]">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, i) => (
            <ToastItem key={toast.id} toast={toast} index={i} />
          ))}
        </AnimatePresence>
      </Toast.Viewport>
    </Toast.Portal>
  );
}

const toastManager = Toast.createToastManager();

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider toastManager={toastManager} timeout={5000} limit={3}>
      {children}
      <ToastViewport />
    </Toast.Provider>
  );
}
