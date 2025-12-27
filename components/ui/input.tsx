"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input component with Plangrove's organic styling.
 * Soft, rounded inputs with warm focus states.
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          // Base styles
          "flex h-11 w-full rounded-lg px-4 py-2",
          "bg-cream-100 text-foreground",
          "border border-border",
          "text-sm placeholder:text-muted-foreground",
          // Focus styles
          "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          "focus:border-primary focus:bg-cream-50",
          // Disabled styles
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Error state
          error && "border-destructive focus:ring-destructive",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

/**
 * Label component for form inputs
 */
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium text-foreground leading-none",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";

/**
 * Textarea component
 */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          // Base styles
          "flex min-h-[100px] w-full rounded-lg px-4 py-3",
          "bg-cream-100 text-foreground",
          "border border-border",
          "text-sm placeholder:text-muted-foreground",
          // Focus styles
          "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          "focus:border-primary focus:bg-cream-50",
          // Disabled styles
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Resize
          "resize-none",
          // Error state
          error && "border-destructive focus:ring-destructive",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
