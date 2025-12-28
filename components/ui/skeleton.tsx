"use client";

import { cn } from "@/lib/utils";

/**
 * Skeleton component for loading states.
 * Uses Plangrove's organic styling with delightful shimmer animation.
 */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use shimmer animation instead of pulse */
  shimmer?: boolean;
}

export function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-terracotta-100 relative overflow-hidden",
        !shimmer && "animate-pulse",
        className
      )}
      {...props}
    >
      {shimmer && (
        <div
          className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{
            animationDuration: '1.5s',
            animationIterationCount: 'infinite',
          }}
        />
      )}
    </div>
  );
}

/**
 * Pre-built skeleton for plant cards with staggered shimmer effect
 */
export function PlantCardSkeleton({ index = 0 }: { index?: number }) {
  const delay = index * 100;

  return (
    <div
      className="rounded-2xl bg-card border border-border/50 p-5 shadow-soft animate-fade-in"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards'
      }}
    >
      {/* Photo placeholder */}
      <div className="relative aspect-square w-full rounded-xl mb-4 bg-gradient-to-br from-terracotta-50 to-terracotta-100 overflow-hidden">
        <div
          className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"
          style={{
            animationDuration: '1.5s',
            animationIterationCount: 'infinite',
            animationDelay: `${delay}ms`,
          }}
        />
        {/* Plant emoji placeholder that pulses */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl opacity-20 animate-pulse">
            🌱
          </div>
        </div>
      </div>

      {/* Title */}
      <Skeleton
        className="h-5 w-3/4 mb-2"
        style={{ animationDelay: `${delay + 50}ms` } as React.CSSProperties}
      />

      {/* Subtitle */}
      <Skeleton
        className="h-4 w-1/2 mb-4"
        style={{ animationDelay: `${delay + 100}ms` } as React.CSSProperties}
      />

      {/* Watering status */}
      <div className="flex items-center gap-2">
        <Skeleton
          className="h-8 w-8 rounded-full"
          style={{ animationDelay: `${delay + 150}ms` } as React.CSSProperties}
        />
        <Skeleton
          className="h-4 w-24"
          style={{ animationDelay: `${delay + 200}ms` } as React.CSSProperties}
        />
      </div>

      {/* Water button placeholder */}
      <Skeleton
        className="h-10 w-full mt-4 rounded-lg"
        style={{ animationDelay: `${delay + 250}ms` } as React.CSSProperties}
      />
    </div>
  );
}

/**
 * Pre-built skeleton for grove header with organic animation
 */
export function GroveHeaderSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Grove title */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" style={{ animationDelay: '50ms' } as React.CSSProperties} />
          <Skeleton className="h-4 w-32" style={{ animationDelay: '100ms' } as React.CSSProperties} />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mt-4">
        <Skeleton className="h-16 w-24 rounded-xl" style={{ animationDelay: '150ms' } as React.CSSProperties} />
        <Skeleton className="h-16 w-24 rounded-xl" style={{ animationDelay: '200ms' } as React.CSSProperties} />
        <Skeleton className="h-16 w-24 rounded-xl" style={{ animationDelay: '250ms' } as React.CSSProperties} />
      </div>
    </div>
  );
}

/**
 * Grid of plant card skeletons for loading states
 */
export function PlantGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PlantCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

/**
 * Full page loading skeleton for grove page
 */
export function GrovePageSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <GroveHeaderSkeleton />
      <PlantGridSkeleton count={6} />
    </div>
  );
}

/**
 * Shop product card skeleton
 */
export function ProductCardSkeleton({ index = 0 }: { index?: number }) {
  const delay = index * 75;

  return (
    <div
      className="rounded-2xl bg-card border border-border/50 overflow-hidden shadow-soft animate-fade-in"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards'
      }}
    >
      {/* Product image */}
      <div className="relative aspect-square bg-gradient-to-br from-cream-100 to-cream-200 overflow-hidden">
        <div
          className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"
          style={{
            animationDuration: '1.5s',
            animationIterationCount: 'infinite',
            animationDelay: `${delay}ms`,
          }}
        />
      </div>

      <div className="p-4 space-y-3">
        {/* Product name */}
        <Skeleton
          className="h-5 w-4/5"
          style={{ animationDelay: `${delay + 50}ms` } as React.CSSProperties}
        />

        {/* Price */}
        <Skeleton
          className="h-6 w-20"
          style={{ animationDelay: `${delay + 100}ms` } as React.CSSProperties}
        />

        {/* Description */}
        <div className="space-y-1">
          <Skeleton
            className="h-3 w-full"
            style={{ animationDelay: `${delay + 150}ms` } as React.CSSProperties}
          />
          <Skeleton
            className="h-3 w-3/4"
            style={{ animationDelay: `${delay + 200}ms` } as React.CSSProperties}
          />
        </div>

        {/* Button */}
        <Skeleton
          className="h-9 w-full rounded-lg mt-2"
          style={{ animationDelay: `${delay + 250}ms` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

/**
 * Shop page loading skeleton
 */
export function ShopGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
