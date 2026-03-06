import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Toast, type ToastData, type ToastVariant } from '../components/Toast.tsx';

interface ToastContextValue {
  toasts: ToastData[];
  addToast: (message: ToastData['message'], options?: { variant?: ToastVariant }) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

const TOAST_DURATION = 3000;

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (message: ToastData['message'], options?: { variant?: ToastVariant }) => {
      const toast: ToastData = {
        id: crypto.randomUUID(),
        message,
        variant: options?.variant ?? 'info',
      };
      setToasts((prev) => [...prev, toast]);
      const timeout = window.setTimeout(() => {
        removeToast(toast.id);
      }, TOAST_DURATION);
      timers.current.set(toast.id, timeout);
      return toast.id;
    },
    [removeToast],
  );

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
  }, []);

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
