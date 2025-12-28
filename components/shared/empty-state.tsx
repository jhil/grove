"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

/**
 * Empty state component for when there's no content.
 * Used for empty plant lists, no search results, etc.
 * Features delightful animations to encourage action.
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative background circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-8 left-1/4 w-24 h-24 bg-terracotta-100 rounded-full blur-2xl opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 10, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-12 right-1/4 w-32 h-32 bg-clay-200/30 rounded-full blur-2xl opacity-40"
          animate={{
            scale: [1, 1.15, 1],
            y: [0, -8, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {icon && (
        <motion.div
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-terracotta-50 to-terracotta-100 flex items-center justify-center mb-6 text-terracotta-500 shadow-soft"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        >
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-terracotta-200"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Icon with gentle animation */}
          <motion.div
            animate={{
              y: [0, -3, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {icon}
          </motion.div>

          {/* Sparkle decorations */}
          <motion.div
            className="absolute -top-1 -right-1 text-clay-400"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </motion.div>
      )}

      <motion.h3
        className="text-xl font-semibold text-foreground mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>

      {description && (
        <motion.p
          className="text-muted-foreground max-w-sm mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {description}
        </motion.p>
      )}

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
