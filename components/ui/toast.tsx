"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

/**
 * Toast notification system for Plangrove.
 * Uses a simple context-based approach with organic styling.
 */

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  /**
   * Convenience method for showing a toast.
   * @param title - The toast message
   * @param type - The toast type (default: "info")
   */
  showToast: (title: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = React.useCallback(
    (title: string, type: ToastType = "info") => {
      addToast({ title, type });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-sage-500" />,
  error: <AlertCircle className="h-5 w-5 text-destructive" />,
  warning: <AlertCircle className="h-5 w-5 text-warning" />,
  info: <Info className="h-5 w-5 text-water-500" />,
};

const typeStyles: Record<ToastType, string> = {
  success: "border-l-4 border-l-sage-500",
  error: "border-l-4 border-l-destructive",
  warning: "border-l-4 border-l-warning",
  info: "border-l-4 border-l-water-500",
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "bg-card rounded-xl shadow-lifted",
            "border border-border/50",
            "p-4",
            "flex items-start gap-3",
            "animate-in slide-in-from-right-full fade-in duration-300",
            typeStyles[toast.type]
          )}
        >
          <div className="flex-shrink-0 mt-0.5">
            {icons[toast.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {toast.title}
            </p>
            {toast.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className={cn(
              "flex-shrink-0 rounded-lg p-1",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-sage-100 transition-colors"
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * Convenience functions for common toast types
 */
export function toast(toast: Omit<Toast, "id">) {
  // This will be called from components that have access to the context
  // For now, this is a placeholder - the actual implementation uses useToast()
  console.warn("toast() called outside of ToastProvider context");
}
