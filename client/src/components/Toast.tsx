import { useCallback, useState, type ReactNode } from 'react';
import { ToastContext, type ToastKind } from './toast-context';

interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, kind }]);
    window.setTimeout(() => dismissToast(id), 3500);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            className={`toast toast-${toast.kind}`}
            key={toast.id}
            role={toast.kind === 'error' ? 'alert' : 'status'}
          >
            <span className="toast-message">{toast.message}</span>
            <button
              type="button"
              className="toast-dismiss-button"
              onClick={() => dismissToast(toast.id)}
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  );
}
