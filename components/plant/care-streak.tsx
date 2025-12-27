"use client";

import { motion } from "motion/react";
import { Flame, Trophy, Sprout, Zap, AlertCircle } from "lucide-react";
import {
  getStreakStatus,
  getStreakLabel,
  isStreakAtRisk,
  daysUntilStreakBreaks,
} from "@/lib/utils/streaks";
import type { Plant } from "@/types/supabase";
import { cn } from "@/lib/utils";
import { transition } from "@/lib/motion";

interface CareStreakProps {
  plant: Plant;
  showDetails?: boolean;
  className?: string;
}

/**
 * Care Streak Badge - displays the current watering streak for a plant
 */
export function CareStreak({ plant, showDetails = false, className }: CareStreakProps) {
  const streakCount = plant.streak_count ?? 0;
  const status = getStreakStatus(streakCount);
  const atRisk = isStreakAtRisk(plant);
  const daysLeft = daysUntilStreakBreaks(plant);

  if (status === "none") {
    return null;
  }

  const Icon = status === "legendary" ? Trophy : status === "strong" ? Flame : Sprout;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition.fast}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
        status === "legendary" && "bg-amber-50 text-amber-700 border border-amber-200",
        status === "strong" && "bg-orange-50 text-orange-700 border border-orange-200",
        status === "building" && "bg-emerald-50 text-emerald-700 border border-emerald-200",
        status === "starting" && "bg-sage-50 text-sage-700 border border-sage-200",
        atRisk && "ring-1 ring-terracotta-300",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{streakCount}</span>
      {showDetails && (
        <span className="text-[10px] opacity-70">
          {atRisk && daysLeft !== null ? `${daysLeft}d left` : "streak"}
        </span>
      )}
    </motion.div>
  );
}

/**
 * Care Streak Summary - displays streak details for a plant card
 */
export function CareStreakSummary({ plant }: { plant: Plant }) {
  const streakCount = plant.streak_count ?? 0;
  const bestStreak = plant.best_streak ?? 0;
  const status = getStreakStatus(streakCount);
  const label = getStreakLabel(streakCount);
  const atRisk = isStreakAtRisk(plant);
  const daysLeft = daysUntilStreakBreaks(plant);

  if (status === "none") {
    return (
      <div className="text-xs text-muted-foreground">
        Water on time to start a streak
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <CareStreak plant={plant} />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      {bestStreak > streakCount && (
        <div className="text-xs text-muted-foreground">
          Best streak: {bestStreak} waterings
        </div>
      )}
      {atRisk && daysLeft !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition.fast}
          className="flex items-center gap-1.5 text-xs text-terracotta-600"
        >
          <AlertCircle className="h-3 w-3" />
          Water within {daysLeft} day{daysLeft !== 1 ? "s" : ""} to keep your streak
        </motion.div>
      )}
    </div>
  );
}

/**
 * Streak Celebration - animated celebration when streak increases
 */
export function StreakCelebration({
  previousStreak,
  newStreak,
  onComplete,
}: {
  previousStreak: number;
  newStreak: number;
  onComplete?: () => void;
}) {
  const status = getStreakStatus(newStreak);
  const milestones = [3, 5, 7, 10, 15, 20, 25, 30];
  const hitMilestone = milestones.includes(newStreak);

  // Only show celebration for milestone achievements
  if (!hitMilestone) {
    return null;
  }

  const Icon = status === "legendary" ? Trophy : status === "strong" ? Flame : Zap;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition.fast}
      onClick={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={transition.enter}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl p-8 shadow-elevated text-center max-w-sm mx-4 border border-border/50"
      >
        <div className="w-16 h-16 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600 mx-auto mb-4">
          <Icon className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-2">
          {newStreak} Watering Streak
        </h3>
        <p className="text-muted-foreground mb-6">
          {status === "legendary"
            ? "You're a legendary plant parent"
            : status === "strong"
            ? "Your plants are thriving"
            : "Keep up the great care"}
        </p>

        <button
          onClick={onComplete}
          className="px-6 py-2 bg-sage-600 text-white rounded-lg font-medium transition-colors hover:bg-sage-700"
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
}
