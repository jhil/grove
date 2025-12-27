/**
 * Motion Configuration for Plangrove
 *
 * Design philosophy: Serene, purposeful, unhurried
 * Inspired by: Japanese onsen, national park minimalism, Scandinavian design
 *
 * Key principles:
 * - Ease-out for entrances (decelerate gracefully)
 * - Ease-in-out for continuous animations (smooth, organic)
 * - No bouncy springs - calm, confident movements
 * - Longer durations (0.4-0.8s) for a contemplative feel
 * - Subtle transforms - no dramatic scale changes
 */

import type { Transition, Variants } from "motion/react";

// ============================================================================
// EASING CURVES
// ============================================================================

/**
 * Custom easing curves for sophisticated, serene animations
 */
export const easing = {
  // Smooth deceleration - for elements entering the viewport
  out: [0.22, 1, 0.36, 1] as const,

  // Smooth acceleration and deceleration - for continuous motion
  inOut: [0.42, 0, 0.58, 1] as const,

  // Gentle acceleration - for elements leaving
  in: [0.42, 0, 1, 1] as const,

  // Very smooth, almost linear - for subtle movements
  gentle: [0.25, 0.1, 0.25, 1] as const,

  // Contemplative - slow start, very slow end (like settling water)
  settle: [0.16, 1, 0.3, 1] as const,
} as const;

// ============================================================================
// TRANSITION PRESETS
// ============================================================================

/**
 * Pre-configured transitions for common use cases
 */
export const transition = {
  // Standard entrance - calm, unhurried
  enter: {
    duration: 0.5,
    ease: easing.out,
  } satisfies Transition,

  // Quick but smooth response
  fast: {
    duration: 0.3,
    ease: easing.out,
  } satisfies Transition,

  // Contemplative, slow reveal
  slow: {
    duration: 0.8,
    ease: easing.out,
  } satisfies Transition,

  // For hover/focus states - responsive but not snappy
  interaction: {
    duration: 0.25,
    ease: easing.gentle,
  } satisfies Transition,

  // For continuous ambient animations
  ambient: {
    duration: 8,
    ease: easing.inOut,
    repeat: Infinity,
  } satisfies Transition,

  // Stagger timing for lists
  stagger: {
    staggerChildren: 0.08,
  } satisfies Transition,

  // Page transitions
  page: {
    duration: 0.6,
    ease: easing.settle,
  } satisfies Transition,
} as const;

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Fade up - standard entrance for content blocks
 */
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition.enter,
  },
};

/**
 * Fade in - simple opacity transition
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transition.enter,
  },
};

/**
 * Scale in - subtle scale for modals/dialogs
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transition.enter,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: transition.fast,
  },
};

/**
 * Slide up - for bottom sheets and panels
 */
export const slideUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition.enter,
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: transition.fast,
  },
};

/**
 * Stagger container - for lists and grids
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger item - for children in stagger container
 */
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition.enter,
  },
};

/**
 * Hover lift - subtle elevation on hover (for cards)
 */
export const hoverLift = {
  y: -2,
  transition: transition.interaction,
};

/**
 * Hover subtle - very minimal response
 */
export const hoverSubtle = {
  opacity: 0.8,
  transition: transition.interaction,
};

/**
 * Tap response - subtle feedback
 */
export const tapResponse = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

// ============================================================================
// AMBIENT ANIMATIONS
// ============================================================================

/**
 * Gentle float - for decorative elements
 * Very slow, almost imperceptible
 */
export const gentleFloat: Variants = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 6,
      ease: easing.inOut,
      repeat: Infinity,
    },
  },
};

/**
 * Subtle pulse - for attention without distraction
 */
export const subtlePulse: Variants = {
  animate: {
    opacity: [1, 0.7, 1],
    transition: {
      duration: 3,
      ease: easing.inOut,
      repeat: Infinity,
    },
  },
};

/**
 * Breathe - gentle scale for icons/badges
 */
export const breathe: Variants = {
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 4,
      ease: easing.inOut,
      repeat: Infinity,
    },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a stagger delay based on index
 */
export function staggerDelay(index: number, baseDelay = 0.08): number {
  return index * baseDelay;
}

/**
 * Creates viewport animation props with sensible defaults
 */
export function viewportOnce(margin = "-80px") {
  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin },
  };
}
