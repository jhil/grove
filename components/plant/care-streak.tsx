"use client";

import { motion } from "motion/react";
import { Flame, Sparkles, Leaf, Trophy } from "lucide-react";
import {
  getStreakStatus,
  getStreakEmoji,
  getStreakLabel,
  isStreakAtRisk,
  daysUntilStreakBreaks,
} from "@/lib/utils/streaks";
import type { Plant } from "@/types/supabase";
import { cn } from "@/lib/utils";

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
  const bestStreak = plant.best_streak ?? 0;
  const status = getStreakStatus(streakCount);
  const atRisk = isStreakAtRisk(plant);
  const daysLeft = daysUntilStreakBreaks(plant);

  if (status === "none") {
    return null;
  }

  const Icon = status === "legendary" ? Trophy : status === "strong" ? Flame : Leaf;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        status === "legendary" && "bg-amber-100 text-amber-800",
        status === "strong" && "bg-orange-100 text-orange-800",
        status === "building" && "bg-emerald-100 text-emerald-800",
        status === "starting" && "bg-sage-100 text-sage-800",
        atRisk && "ring-2 ring-terracotta-400 ring-offset-1",
        className
      )}
    >
      <motion.span
        animate={status === "strong" || status === "legendary" ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Icon className="h-3.5 w-3.5" />
      </motion.span>
      <span>{streakCount}</span>
      {showDetails && (
        <span className="text-[10px] opacity-75">
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
  const emoji = getStreakEmoji(streakCount);
  const atRisk = isStreakAtRisk(plant);
  const daysLeft = daysUntilStreakBreaks(plant);

  if (status === "none") {
    return (
      <div className="text-xs text-muted-foreground">
        Water on time to start a streak!
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <CareStreak plant={plant} />
        <span className="text-sm">{label}</span>
        {emoji && <span className="text-sm">{emoji}</span>}
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
          className="text-xs text-terracotta-600 font-medium"
        >
          Water within {daysLeft} day{daysLeft !== 1 ? "s" : ""} to keep your streak!
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
  const emoji = getStreakEmoji(newStreak);
  const milestones = [3, 5, 7, 10, 15, 20, 25, 30];
  const hitMilestone = milestones.includes(newStreak);

  // Only show celebration for milestone achievements
  if (!hitMilestone) {
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm mx-4"
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="text-6xl mb-4"
        >
          {emoji}
        </motion.div>
        <h3 className="text-xl font-bold text-sage-900 mb-2">
          {newStreak} Watering Streak!
        </h3>
        <p className="text-sage-600 mb-4">
          {status === "legendary"
            ? "You're a legendary plant parent!"
            : status === "strong"
            ? "Your plants are thriving!"
            : "Keep up the great care!"}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="px-6 py-2 bg-sage-600 text-white rounded-xl font-medium"
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
