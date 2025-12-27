"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Leaf, Droplets, Users, Share2, ArrowRight, Check } from "lucide-react";

interface OnboardingStep {
  icon: typeof Leaf;
  title: string;
  description: string;
  color: string;
}

const STEPS: OnboardingStep[] = [
  {
    icon: Leaf,
    title: "Create a Grove",
    description: "A grove is your shared plant space. Name it, add your plants, and watch them thrive together.",
    color: "text-sage-500",
  },
  {
    icon: Droplets,
    title: "Track Watering",
    description: "Each plant has its own schedule. We'll remind you when it's time to water.",
    color: "text-water-500",
  },
  {
    icon: Users,
    title: "Care Together",
    description: "Share your grove with roommates, colleagues, or friends. Everyone can water and track plants.",
    color: "text-terracotta-500",
  },
  {
    icon: Share2,
    title: "Share the Link",
    description: "Just share the link — no accounts needed. Anyone with the link can join in.",
    color: "text-sage-600",
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
  className?: string;
}

export function OnboardingFlow({ onComplete, className }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === STEPS.length - 1;
  const step = STEPS[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div
      className={cn(
        "max-w-lg mx-auto text-center",
        className
      )}
    >
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentStep
                ? "w-8 bg-sage-500"
                : index < currentStep
                ? "bg-sage-400"
                : "bg-sage-200"
            )}
          />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className={cn(
              "w-20 h-20 mx-auto rounded-3xl flex items-center justify-center",
              "bg-gradient-to-br from-sage-50 to-sage-100",
              "shadow-soft"
            )}
          >
            <Icon className={cn("w-10 h-10", step.color)} />
          </motion.div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-foreground">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
            {step.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full max-w-xs gap-2"
        >
          {isLastStep ? (
            <>
              Get Started
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        {!isLastStep && (
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip intro
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Compact onboarding modal for returning users who want a refresher.
 */
interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-lifted"
      >
        <OnboardingFlow onComplete={() => onOpenChange(false)} />
      </motion.div>
    </div>
  );
}
