import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);
let counter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (type, message, title) => {
      const id = (counter += 1);
      setToasts((current) => [...current, { id, type, message, title }]);
      window.setTimeout(() => dismiss(id), 4200);
      return id;
    },
    [dismiss]
  );

  const toast = useMemo(
    () => ({
      success: (message, title = 'Success') => push('success', message, title),
      error: (message, title = 'Something went wrong') => push('error', message, title),
      info: (message, title = 'Heads up') => push('info', message, title),
      dismiss,
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts" aria-live="polite" aria-atomic="false">
        {toasts.map((item) => (
          <div key={item.id} className={`toast toast--${item.type}`} role="status">
            <span className="toast__icon" aria-hidden="true">
              {item.type === 'success' ? '✓' : item.type === 'error' ? '!' : 'i'}
            </span>
            <span className="toast__message">
              <strong>{item.title}</strong>
              {item.message}
            </span>
            <button
              type="button"
              className="icon-btn"
              style={{ width: 22, height: 22 }}
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
}
