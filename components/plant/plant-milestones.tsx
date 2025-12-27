"use client";

import { motion, AnimatePresence } from "motion/react";
import { Calendar, Award, Trophy, Gift, Sparkles } from "lucide-react";
import {
  getPlantMilestones,
  getAchievedMilestones,
  getNextMilestone,
  formatPlantAge,
  getMilestoneColor,
  isBirthdayToday,
  getDaysUntilBirthday,
  type Milestone,
} from "@/lib/utils/milestones";
import type { Plant } from "@/types/supabase";
import { cn } from "@/lib/utils/cn";

interface PlantAgeProps {
  plant: Plant;
  className?: string;
}

/**
 * Plant Age Badge - shows how long you've had the plant
 */
export function PlantAge({ plant, className }: PlantAgeProps) {
  if (!plant.birthday) {
    return null;
  }

  const age = formatPlantAge(plant.birthday);
  const isToday = isBirthdayToday(plant.birthday);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        isToday
          ? "bg-amber-100 text-amber-800 ring-2 ring-amber-400"
          : "bg-cream-100 text-cream-800",
        className
      )}
    >
      <Calendar className="h-3 w-3" />
      <span>{isToday ? "Happy Birthday!" : age}</span>
      {isToday && (
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          🎂
        </motion.span>
      )}
    </motion.div>
  );
}

interface MilestoneBadgeProps {
  milestone: Milestone;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
}

/**
 * Individual Milestone Badge
 */
export function MilestoneBadge({ milestone, size = "md", showProgress = false }: MilestoneBadgeProps) {
  const colors = getMilestoneColor(milestone);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "relative inline-flex items-center gap-1 rounded-full border font-medium",
        colors.bg,
        colors.text,
        colors.border,
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-1 text-xs",
        size === "lg" && "px-3 py-1.5 text-sm",
        !milestone.achieved && "opacity-50"
      )}
      title={milestone.description}
    >
      <span>{milestone.emoji}</span>
      <span>{milestone.label}</span>
      {showProgress && !milestone.achieved && milestone.progress !== undefined && (
        <span className="text-[10px] opacity-75">
          ({Math.round(milestone.progress)}%)
        </span>
      )}
    </motion.div>
  );
}

interface MilestoneListProps {
  plant: Plant;
  showAll?: boolean;
  maxDisplay?: number;
}

/**
 * List of achieved milestones for a plant
 */
export function MilestoneList({ plant, showAll = false, maxDisplay = 3 }: MilestoneListProps) {
  const achieved = getAchievedMilestones(plant);
  const next = getNextMilestone(plant);

  if (achieved.length === 0 && !next) {
    return (
      <div className="text-xs text-muted-foreground">
        Set a birthday to track milestones
      </div>
    );
  }

  const displayMilestones = showAll ? achieved : achieved.slice(0, maxDisplay);
  const remaining = achieved.length - displayMilestones.length;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {displayMilestones.map((milestone) => (
          <MilestoneBadge key={milestone.id} milestone={milestone} size="sm" />
        ))}
        {remaining > 0 && (
          <span className="px-2 py-0.5 text-[10px] text-muted-foreground">
            +{remaining} more
          </span>
        )}
      </div>
      {next && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <span>Next:</span>
          <MilestoneBadge milestone={next} size="sm" showProgress />
        </div>
      )}
    </div>
  );
}

interface MilestoneProgressProps {
  plant: Plant;
}

/**
 * Visual progress toward next milestone
 */
export function MilestoneProgress({ plant }: MilestoneProgressProps) {
  const next = getNextMilestone(plant);

  if (!next || next.progress === undefined) {
    return null;
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Next: {next.emoji} {next.label}</span>
        <span className="font-medium">{Math.round(next.progress)}%</span>
      </div>
      <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-sage-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${next.progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

interface PlantMilestonesSummaryProps {
  plant: Plant;
}

/**
 * Complete milestones summary for plant detail view
 */
export function PlantMilestonesSummary({ plant }: PlantMilestonesSummaryProps) {
  const achieved = getAchievedMilestones(plant);
  const allMilestones = getPlantMilestones(plant);
  const daysUntilBirthday = getDaysUntilBirthday(plant.birthday);

  return (
    <div className="space-y-4">
      {/* Age and Birthday */}
      <div className="flex items-center justify-between">
        <PlantAge plant={plant} />
        {daysUntilBirthday !== null && daysUntilBirthday > 0 && daysUntilBirthday <= 30 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1 text-xs text-amber-600"
          >
            <Gift className="h-3 w-3" />
            Birthday in {daysUntilBirthday} day{daysUntilBirthday !== 1 ? "s" : ""}!
          </motion.div>
        )}
      </div>

      {/* Achievement count */}
      <div className="flex items-center gap-2 text-sm">
        <Trophy className="h-4 w-4 text-amber-500" />
        <span className="font-medium">{achieved.length}</span>
        <span className="text-muted-foreground">
          of {allMilestones.length} milestones achieved
        </span>
      </div>

      {/* Milestone badges */}
      <div className="flex flex-wrap gap-2">
        {allMilestones.map((milestone) => (
          <MilestoneBadge
            key={milestone.id}
            milestone={milestone}
            size="sm"
          />
        ))}
      </div>

      {/* Progress to next */}
      <MilestoneProgress plant={plant} />
    </div>
  );
}

interface MilestoneCelebrationProps {
  milestone: Milestone;
  onComplete?: () => void;
}

/**
 * Celebration modal when a new milestone is achieved
 */
export function MilestoneCelebration({ milestone, onComplete }: MilestoneCelebrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
        className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="text-6xl mb-4"
        >
          {milestone.emoji}
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="h-5 w-5 text-amber-500" />
          <h3 className="text-xl font-bold text-sage-900">
            Milestone Achieved!
          </h3>
        </div>

        <p className="text-lg font-medium text-sage-700 mb-1">
          {milestone.label}
        </p>
        <p className="text-sage-600 mb-6">
          {milestone.description}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="px-6 py-2 bg-sage-600 text-white rounded-xl font-medium inline-flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Celebrate!
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
