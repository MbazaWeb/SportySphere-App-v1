import { useState, useCallback } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    const toast: Toast = { id, message, type };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const ToastContainer = () => (
    <div className="fixed top-0 safe-area-top z-50 left-4 right-4 space-y-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out
            animate-slide-down pointer-events-auto
            ${toast.type === 'success' ? 'bg-green-500' : 
              toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );

  return { showToast, ToastContainer };
};