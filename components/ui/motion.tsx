"use client";

import { motion, type MotionProps, AnimatePresence } from "motion/react";
import { forwardRef } from "react";
import {
  fadeUp,
  fadeIn,
  scaleIn,
  staggerItem,
  hoverLift,
  tapResponse,
  transition,
  easing,
} from "@/lib/motion";

/**
 * Animated components using Motion library.
 * Design philosophy: Serene, purposeful, unhurried.
 */

// ============================================================================
// ENTRANCE ANIMATIONS
// ============================================================================

/**
 * Fade in from below - standard entrance for content
 */
export const FadeInUp = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & MotionProps
>(({ children, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial="hidden"
    animate="visible"
    variants={fadeUp}
    {...props}
  >
    {children}
  </motion.div>
));
FadeInUp.displayName = "FadeInUp";

/**
 * Simple fade in - for subtle appearances
 */
export const FadeIn = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & MotionProps
>(({ children, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial="hidden"
    animate="visible"
    variants={fadeIn}
    {...props}
  >
    {children}
  </motion.div>
));
FadeIn.displayName = "FadeIn";

/**
 * Scale in - subtle scale for dialogs and modals
 */
export const ScaleIn = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & MotionProps
>(({ children, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={scaleIn}
    {...props}
  >
    {children}
  </motion.div>
));
ScaleIn.displayName = "ScaleIn";

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Container for staggered children animations
 */
export function StaggerContainer({
  children,
  className,
  delay = 0.08,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: delay,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Item for use inside StaggerContainer
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

// ============================================================================
// INTERACTIVE ANIMATIONS
// ============================================================================

interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Subtle lift on hover - for cards
 */
export function HoverLift({ children, className }: HoverLiftProps) {
  return (
    <motion.div
      className={className}
      whileHover={hoverLift}
      transition={transition.interaction}
    >
      {children}
    </motion.div>
  );
}

interface TapScaleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Subtle scale feedback on tap/click
 */
export function TapScale({ children, className }: TapScaleProps) {
  return (
    <motion.div
      className={className}
      whileTap={tapResponse}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// AMBIENT ANIMATIONS
// ============================================================================

interface PulseProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

/**
 * Subtle pulse for attention - gentle, not distracting
 */
export function Pulse({ children, active = true, className }: PulseProps) {
  return (
    <motion.div
      className={className}
      animate={
        active
          ? { opacity: [1, 0.7, 1] }
          : {}
      }
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: easing.inOut,
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// SPECIAL EFFECTS
// ============================================================================

/**
 * Water drop effect for watering action
 */
export const WaterDrop = motion.div;

export const waterDropVariants = {
  initial: { scale: 0.8, y: 0, opacity: 1 },
  animate: {
    scale: [0.8, 1.2, 1.6],
    y: [0, 30, 60],
    opacity: [1, 0.6, 0],
  },
};

export const waterDropTransition = {
  duration: 0.8,
  ease: easing.out,
};

/**
 * Success checkmark with path animation
 */
export const SuccessCheck = ({ className }: { className?: string }) => (
  <motion.svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={transition.fast}
  >
    <motion.path
      d="M5 12l5 5L19 7"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, ease: easing.out, delay: 0.1 }}
    />
  </motion.svg>
);

// ============================================================================
// VIEWPORT ANIMATIONS
// ============================================================================

interface ViewportFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Fade in when entering viewport - for scroll-triggered reveals
 */
export function ViewportFade({ children, className, delay = 0 }: ViewportFadeProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        ...transition.enter,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

// Re-export AnimatePresence for convenience
export { AnimatePresence };
