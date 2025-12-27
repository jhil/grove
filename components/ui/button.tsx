"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Button component with Plangrove's organic styling.
 * Variants: primary (sage), secondary, ghost, accent (terracotta), water
 */

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "water" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-primary text-primary-foreground
    hover:bg-sage-600 active:bg-sage-700
    shadow-soft hover:shadow-lifted
  `,
  secondary: `
    bg-secondary text-secondary-foreground
    hover:bg-sage-200 active:bg-sage-300
    border border-border
  `,
  ghost: `
    bg-transparent text-foreground
    hover:bg-sage-100 active:bg-sage-200
  `,
  accent: `
    bg-accent text-accent-foreground
    hover:bg-terracotta-500 active:bg-terracotta-600
    shadow-soft hover:shadow-lifted
  `,
  water: `
    bg-water-500 text-cream-50
    hover:bg-water-400 active:bg-water-500
    shadow-soft hover:shadow-lifted
  `,
  destructive: `
    bg-destructive text-cream-50
    hover:bg-terracotta-600 active:bg-terracotta-600
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm rounded-md",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-12 px-6 text-base rounded-lg",
  icon: "h-10 w-10 rounded-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2",
          "font-medium transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          // Variant and size
          variantStyles[variant],
          sizeStyles[size],
          // Hover lift effect for elevated buttons
          variant !== "ghost" && "hover-lift",
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
