"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Confetti celebration component with plant-themed particles.
 * Features leaves, water drops, and sparkles for a nature-inspired celebration.
 */

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  rotation: number;
  type: "leaf" | "drop" | "sparkle" | "circle";
  duration: number;
  delay: number;
}

interface ConfettiProps {
  /** Whether confetti is currently active */
  active: boolean;
  /** Duration in milliseconds before confetti disappears */
  duration?: number;
  /** Number of confetti pieces */
  count?: number;
  /** Callback when confetti animation completes */
  onComplete?: () => void;
}

const COLORS = [
  "var(--sage-400)",
  "var(--sage-500)",
  "var(--terracotta-400)",
  "var(--water-400)",
  "var(--warning)",
  "var(--sage-300)",
  "var(--terracotta-300)",
];

// Generate deterministic pieces based on index
function createPieces(count: number): ConfettiPiece[] {
  const types: ConfettiPiece["type"][] = ["leaf", "drop", "sparkle", "circle"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: ((i * 37) % 100), // Deterministic spread
    color: COLORS[i % COLORS.length],
    size: 8 + (i % 5) * 3,
    rotation: (i * 47) % 360,
    type: types[i % types.length],
    duration: 2 + (i % 3),
    delay: (i % 10) * 0.05,
  }));
}

export function Confetti({
  active,
  duration = 3000,
  count = 50,
  onComplete,
}: ConfettiProps) {
  // Track activation count to generate fresh pieces
  const [activationKey, setActivationKey] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const wasActiveRef = useRef(false);

  // Generate pieces based on activation key
  const pieces = createPieces(count);

  // Handle visibility based on active state change
  useEffect(() => {
    if (active && !wasActiveRef.current) {
      wasActiveRef.current = true;
      // Schedule state updates to avoid synchronous effect warning
      queueMicrotask(() => {
        setActivationKey((k) => k + 1);
        setIsVisible(true);
      });

      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
    if (!active) {
      wasActiveRef.current = false;
    }
  }, [active, duration, onComplete]);

  // Prevent unused variable warning
  void activationKey;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute"
            style={{
              left: `${piece.x}%`,
              top: -20,
            }}
            initial={{
              y: -20,
              opacity: 1,
              rotate: piece.rotation,
              scale: 0,
            }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [1, 1, 0],
              rotate: piece.rotation + 720,
              scale: [0, 1, 1, 0.5],
              x: Math.sin(piece.id) * 100,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: "easeOut",
            }}
          >
            <ConfettiShape
              type={piece.type}
              color={piece.color}
              size={piece.size}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ConfettiShapeProps {
  type: ConfettiPiece["type"];
  color: string;
  size: number;
}

function ConfettiShape({ type, color, size }: ConfettiShapeProps) {
  switch (type) {
    case "leaf":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={color}
          className="drop-shadow-sm"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3c3.53.64 7.72-2.12 9.38-5.15.76-1.38 1.75-4.26.61-6.55z" />
        </svg>
      );
    case "drop":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={color}
          className="drop-shadow-sm"
        >
          <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
        </svg>
      );
    case "sparkle":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={color}
          className="drop-shadow-sm"
        >
          <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
        </svg>
      );
    case "circle":
    default:
      return (
        <div
          className="rounded-full drop-shadow-sm"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
          }}
        />
      );
  }
}

/**
 * Hook for triggering confetti celebrations
 */
export function useConfetti() {
  const [isActive, setIsActive] = useState(false);

  const celebrate = useCallback(() => {
    setIsActive(true);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
  }, []);

  return {
    isActive,
    celebrate,
    reset,
    Confetti: (props: Omit<ConfettiProps, "active">) => (
      <Confetti {...props} active={isActive} onComplete={reset} />
    ),
  };
}

/**
 * Burst confetti effect - smaller, more focused celebration
 */
interface BurstConfettiProps {
  /** Whether burst is active */
  active: boolean;
  /** Center X position (0-100 percentage) */
  x?: number;
  /** Center Y position (0-100 percentage) */
  y?: number;
  /** Number of particles */
  count?: number;
}

// Generate deterministic burst particles
function createBurstParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (i / count) * Math.PI * 2 + (i % 3) * 0.15,
    distance: 50 + (i % 5) * 20,
    color: COLORS[i % COLORS.length],
    size: 4 + (i % 4) * 2,
  }));
}

export function BurstConfetti({
  active,
  x = 50,
  y = 50,
  count = 20,
}: BurstConfettiProps) {
  // Track activations for fresh particles
  const [activationKey, setActivationKey] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const wasActiveRef = useRef(false);

  // Generate particles (deterministic based on count)
  const particles = createBurstParticles(count);

  // Handle visibility based on active state change
  useEffect(() => {
    if (active && !wasActiveRef.current) {
      wasActiveRef.current = true;
      // Schedule state updates to avoid synchronous effect warning
      queueMicrotask(() => {
        setActivationKey((k) => k + 1);
        setIsVisible(true);
      });
      const timer = setTimeout(() => setIsVisible(false), 1000);
      return () => clearTimeout(timer);
    }
    if (!active) {
      wasActiveRef.current = false;
    }
  }, [active]);

  // Prevent unused variable warning
  void activationKey;

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[100]"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            opacity: 1,
          }}
          animate={{
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
