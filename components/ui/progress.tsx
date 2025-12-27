"use client";

import * as React from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cn } from "@/lib/utils";

/**
 * Progress bar component for Plangrove.
 * Used for watering status indicators.
 */

interface ProgressProps {
  value: number;
  max?: number;
  variant?: "default" | "water" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const variantStyles = {
  default: "bg-sage-500",
  water: "bg-water-500",
  warning: "bg-warning",
  danger: "bg-destructive",
};

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function Progress({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <BaseProgress.Root
      value={value}
      max={max}
      className={cn("w-full", className)}
    >
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <BaseProgress.Track
        className={cn(
          "w-full overflow-hidden rounded-full bg-sage-100",
          sizeStyles[size]
        )}
      >
        <BaseProgress.Indicator
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}

/**
 * Watering progress indicator specifically styled for plant watering status.
 * Shows how close a plant is to needing water.
 */
interface WateringProgressProps {
  daysUntilWatering: number;
  totalInterval: number;
  className?: string;
}

export function WateringProgress({
  daysUntilWatering,
  totalInterval,
  className,
}: WateringProgressProps) {
  // Calculate how "full" the water meter is (100% = just watered, 0% = needs water)
  const percentage = Math.max(0, (daysUntilWatering / totalInterval) * 100);

  // Determine variant based on urgency
  let variant: "water" | "warning" | "danger" = "water";
  if (daysUntilWatering <= 0) {
    variant = "danger";
  } else if (daysUntilWatering <= 1) {
    variant = "warning";
  }

  return (
    <div className={cn("space-y-1", className)}>
      <Progress value={percentage} max={100} variant={variant} size="sm" />
      <p className="text-xs text-muted-foreground">
        {daysUntilWatering <= 0
          ? "Needs water!"
          : daysUntilWatering === 1
          ? "Water tomorrow"
          : `${daysUntilWatering} days until watering`}
      </p>
    </div>
  );
}
