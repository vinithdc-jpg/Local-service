"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

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
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function Toast({ toast, onClose }) {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const bgColors = {
        success: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
        error: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
        info: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    };

    return (
        <div
            className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg animate-slide-in ${bgColors[toast.type] || bgColors.info
                }`}
        >
            {icons[toast.type] || icons.info}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
