"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info, Sparkles } from "lucide-react";

/**
 * Toast notification system for Plangrove.
 * Features delightful animations and organic styling.
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

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
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
  success: "border-l-4 border-l-sage-500 bg-sage-50/80",
  error: "border-l-4 border-l-destructive bg-destructive/5",
  warning: "border-l-4 border-l-warning bg-warning/5",
  info: "border-l-4 border-l-water-500 bg-water-400/5",
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 1,
            }}
            className="pointer-events-auto"
          >
            <ToastItem toast={toast} onRemove={onRemove} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [progress, setProgress] = React.useState(100);
  const isUrgent = toast.type === "error" || toast.type === "warning";

  React.useEffect(() => {
    const startTime = Date.now();
    const duration = 4000;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  return (
    <div
      role="alert"
      aria-live={isUrgent ? "assertive" : "polite"}
      aria-atomic="true"
      className={cn(
        "relative overflow-hidden",
        "bg-card/95 backdrop-blur-sm rounded-xl shadow-lifted",
        "border border-border/50",
        "p-4",
        "flex items-start gap-3",
        typeStyles[toast.type]
      )}
    >
      {/* Icon with animation */}
      <motion.div
        className="flex-shrink-0 mt-0.5"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
      >
        {toast.type === "success" && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {icons[toast.type]}
          </motion.div>
        )}
        {toast.type !== "success" && icons[toast.type]}
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <motion.p
          className="text-sm font-medium text-foreground"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {toast.title}
        </motion.p>
        {toast.description && (
          <motion.p
            className="text-sm text-muted-foreground mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {toast.description}
          </motion.p>
        )}
      </div>

      {/* Close button */}
      <motion.button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        className={cn(
          "flex-shrink-0 rounded-lg p-1",
          "text-muted-foreground hover:text-foreground",
          "hover:bg-sage-100 transition-colors"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="h-4 w-4" />
      </motion.button>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-current opacity-20"
        initial={{ width: "100%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />

      {/* Success sparkles */}
      {toast.type === "success" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sage-400"
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + (i % 2) * 40}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.1,
              }}
            >
              <Sparkles className="w-3 h-3" />
            </motion.div>
          ))}
        </div>
      )}
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
