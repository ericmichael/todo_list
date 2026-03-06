import type { ReactNode } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastData {
  id: string;
  message: ReactNode;
  variant: ToastVariant;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <div className={`toast toast-${toast.variant}`} role="status" aria-live="polite">
      <div className="toast-message">{toast.message}</div>
      <button className="toast-dismiss" type="button" onClick={() => onDismiss(toast.id)}>
        Dismiss
      </button>
    </div>
  );
}
