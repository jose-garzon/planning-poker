'use client';

import { Toast } from '@base-ui-components/react/toast';

interface ToastOptions {
  title: string;
  description?: string;
  timeout?: number;
}

export function useToast() {
  const { add, close, update } = Toast.useToastManager();

  return {
    error: (opts: ToastOptions) => add({ ...opts, type: 'error', priority: 'high' }),
    success: (opts: ToastOptions) => add({ ...opts, type: 'success' }),
    warning: (opts: ToastOptions) => add({ ...opts, type: 'warning', priority: 'high' }),
    info: (opts: ToastOptions) => add({ ...opts, type: 'info' }),
    close,
    update,
  };
}
