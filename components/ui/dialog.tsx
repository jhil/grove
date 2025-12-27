"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/**
 * Dialog component using Base UI with Plangrove styling.
 * Organic, rounded modals with soft backdrop.
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

export function DialogContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        className={cn(
          "fixed inset-0 z-50",
          "bg-sage-900/20 backdrop-blur-sm",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        )}
      />
      <BaseDialog.Popup
        className={cn(
          "fixed left-[50%] top-[50%] z-50",
          "w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
          "bg-card rounded-2xl shadow-lifted",
          "border border-border/50",
          "p-6",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "duration-200",
          className
        )}
        {...props}
      >
        {children}
        <BaseDialog.Close
          className={cn(
            "absolute right-4 top-4",
            "rounded-lg p-1.5",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-sage-100 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </BaseDialog.Close>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-2 mb-4", className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <BaseDialog.Title
      className={cn(
        "text-xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <BaseDialog.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6",
        className
      )}
      {...props}
    />
  );
}

export const DialogClose = BaseDialog.Close;
