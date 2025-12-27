"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Leaf, Droplets, Users, Link, ArrowRight, Check } from "lucide-react";
import { transition } from "@/lib/motion";

interface OnboardingStep {
  icon: typeof Leaf;
  title: string;
  description: string;
}

const STEPS: OnboardingStep[] = [
  {
    icon: Leaf,
    title: "Create a Grove",
    description: "A grove is your shared plant space. Name it, add your plants, and watch them thrive together.",
  },
  {
    icon: Droplets,
    title: "Track Watering",
    description: "Each plant has its own schedule. See when it needs water and mark it done with one tap.",
  },
  {
    icon: Users,
    title: "Care Together",
    description: "Share your grove with roommates, colleagues, or friends. Everyone can water and track plants.",
  },
  {
    icon: Link,
    title: "Share the Link",
    description: "Just share the link — no accounts needed. Anyone with the link can join.",
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
    <div className={cn("max-w-lg mx-auto text-center", className)}>
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {STEPS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === currentStep
                ? "w-8 bg-sage-500"
                : index < currentStep
                ? "w-1.5 bg-sage-400"
                : "w-1.5 bg-sage-200"
            )}
            style={{
              transitionDuration: "400ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={transition.enter}
          className="space-y-6"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition.enter, delay: 0.1 }}
            className="w-16 h-16 mx-auto rounded-xl bg-sage-100 flex items-center justify-center"
          >
            <Icon className="w-8 h-8 text-sage-600" />
          </motion.div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-foreground tracking-editorial">
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
          className="w-full max-w-xs group"
        >
          {isLastStep ? (
            <>
              Get Started
              <Check className="w-4 h-4 ml-1" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition.fast}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={transition.enter}
        className="relative bg-white rounded-xl p-8 max-w-lg w-full shadow-elevated border border-border/50"
      >
        <OnboardingFlow onComplete={() => onOpenChange(false)} />
      </motion.div>
    </div>
  );
}
