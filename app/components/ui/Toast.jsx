"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/app/lib/utils";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ message, type = "info", duration = 5000 }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onClose }) {
  const config = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-success shrink-0" />,
      className: "border-success/30 bg-success/10",
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-destructive shrink-0" />,
      className: "border-destructive/30 bg-destructive/10",
    },
    info: {
      icon: <Info className="w-5 h-5 text-accent shrink-0" />,
      className: "border-accent/30 bg-accent/10",
    },
  };

  const { icon, className } = config[toast.type] || config.info;

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg",
        "glass-strong animate-slide-in",
        className
      )}
      role="alert"
    >
      {icon}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
