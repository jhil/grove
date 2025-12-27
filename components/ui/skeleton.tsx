"use client";

import { cn } from "@/lib/utils";

/**
 * Skeleton component for loading states.
 * Uses Plangrove's organic styling with subtle pulse animation.
 */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-sage-100",
        className
      )}
      {...props}
    />
  );
}

/**
 * Pre-built skeleton for plant cards
 */
export function PlantCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-soft">
      {/* Photo placeholder */}
      <Skeleton className="aspect-square w-full rounded-xl mb-4" />
      {/* Title */}
      <Skeleton className="h-5 w-3/4 mb-2" />
      {/* Subtitle */}
      <Skeleton className="h-4 w-1/2 mb-4" />
      {/* Watering status */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

/**
 * Pre-built skeleton for grove header
 */
export function GroveHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-48" />
    </div>
  );
}
