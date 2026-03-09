export type ToastVariant = 'success' | 'error';

interface ToastProps {
  message: string;
  variant: ToastVariant;
}

export function Toast({ message, variant }: ToastProps) {
  return <div className={`toast toast-${variant}`}>{message}</div>;
}
