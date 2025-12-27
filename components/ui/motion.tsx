"use client";

import { motion, type MotionProps } from "motion/react";
import { forwardRef } from "react";

/**
 * Animated components using Motion library.
 * Provides delightful micro-interactions throughout the app.
 */

// Fade in from bottom animation for cards and content
export const FadeInUp = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & MotionProps
>(({ children, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    {...props}
  >
    {children}
  </motion.div>
));
FadeInUp.displayName = "FadeInUp";

// Scale in animation for pop effects
export const ScaleIn = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & MotionProps
>(({ children, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    {...props}
  >
    {children}
  </motion.div>
));
ScaleIn.displayName = "ScaleIn";

// Stagger children animation for lists
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.05,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger item for use inside StaggerContainer
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

// Pulse animation for attention
interface PulseProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function Pulse({ children, active = true, className }: PulseProps) {
  return (
    <motion.div
      className={className}
      animate={
        active
          ? {
              scale: [1, 1.02, 1],
            }
          : {}
      }
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Water drop animation for watering action
export const WaterDrop = motion.div;

export const waterDropVariants = {
  initial: { scale: 0, y: 0, opacity: 1 },
  animate: {
    scale: [0, 1.5, 2],
    y: [0, 50, 100],
    opacity: [1, 0.8, 0],
  },
};

// Hover lift animation
interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
}

export function HoverLift({ children, className }: HoverLiftProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

// Tap scale animation for buttons
interface TapScaleProps {
  children: React.ReactNode;
  className?: string;
}

export function TapScale({ children, className }: TapScaleProps) {
  return (
    <motion.div
      className={className}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

// Success checkmark animation
export const SuccessCheck = ({ className }: { className?: string }) => (
  <motion.svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <motion.path d="M5 12l5 5L19 7" />
  </motion.svg>
);
