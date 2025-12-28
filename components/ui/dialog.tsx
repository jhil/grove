"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/**
 * Dialog component using Base UI with Plangrove styling.
 * Organic, rounded modals with soft backdrop and delightful animations.
 */

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  /** Convenience prop: renders DialogHeader with title */
  title?: string;
  /** Convenience prop: renders DialogHeader with description */
  description?: string;
}

export function Dialog({
  open,
  onOpenChange,
  children,
  title,
  description,
}: DialogProps) {
  // If title/description provided, wrap children with content and header
  const content =
    title || description ? (
      <DialogContent>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    ) : (
      children
    );

  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      {content}
    </BaseDialog.Root>
  );
}

export const DialogTrigger = BaseDialog.Trigger;

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

export function DialogContent({ className, children }: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        className={cn(
          "fixed inset-0 z-50",
          "bg-terracotta-900/25 backdrop-blur-sm",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "duration-200"
        )}
      />
      <BaseDialog.Popup
        className={cn(
          "fixed left-[50%] z-50",
          "w-full max-w-lg translate-x-[-50%]",
          // Position from top instead of center to allow scrolling
          "top-4 sm:top-[50%] sm:translate-y-[-50%]",
          // Max height with scroll
          "max-h-[calc(100vh-2rem)] sm:max-h-[90vh]",
          "overflow-y-auto",
          "bg-card rounded-2xl shadow-lifted",
          "border border-border/50",
          // Safe area padding for iOS
          "p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "duration-200",
          className
        )}
      >
        {children}
        <motion.div
          className="absolute right-4 top-4"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <BaseDialog.Close
            className={cn(
              "rounded-lg p-1.5",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-terracotta-100 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-ring"
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </BaseDialog.Close>
        </motion.div>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

interface DialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function DialogHeader({ className, children }: DialogHeaderProps) {
  return (
    <motion.div
      className={cn("flex flex-col space-y-2 mb-4", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

export function DialogTitle({ className, children }: DialogTitleProps) {
  return (
    <BaseDialog.Title
      className={cn(
        "text-xl font-semibold leading-none tracking-tight",
        className
      )}
    >
      {children}
    </BaseDialog.Title>
  );
}

interface DialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export function DialogDescription({
  className,
  children,
}: DialogDescriptionProps) {
  return (
    <BaseDialog.Description
      className={cn("text-sm text-muted-foreground", className)}
    >
      {children}
    </BaseDialog.Description>
  );
}

interface DialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function DialogFooter({ className, children }: DialogFooterProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export const DialogClose = BaseDialog.Close;
