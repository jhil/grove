"use client";

import { motion } from "motion/react";
import { Calendar, Award, Trophy, Gift, Star, Clock } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { transition } from "@/lib/motion";

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition.fast}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
        isToday
          ? "bg-amber-50 text-amber-700 border border-amber-200"
          : "bg-cream-100 text-foreground border border-border/50",
        className
      )}
    >
      <Calendar className="h-3 w-3" />
      <span>{isToday ? "Happy Birthday!" : age}</span>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition.fast}
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-md border font-medium",
        colors.bg,
        colors.text,
        colors.border,
        size === "sm" && "px-1.5 py-0.5 text-[10px]",
        size === "md" && "px-2 py-1 text-xs",
        size === "lg" && "px-2.5 py-1.5 text-sm",
        !milestone.achieved && "opacity-40"
      )}
      title={milestone.description}
    >
      <MilestoneIcon type={milestone.type} className={cn(
        size === "sm" && "h-2.5 w-2.5",
        size === "md" && "h-3 w-3",
        size === "lg" && "h-3.5 w-3.5"
      )} />
      <span>{milestone.label}</span>
      {showProgress && !milestone.achieved && milestone.progress !== undefined && (
        <span className="text-[10px] opacity-60">
          ({Math.round(milestone.progress)}%)
        </span>
      )}
    </motion.div>
  );
}

function MilestoneIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case "week":
    case "month":
    case "season":
    case "year":
      return <Clock className={className} />;
    default:
      return <Star className={className} />;
  }
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
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Next: {next.label}</span>
        <span className="font-medium text-foreground">{Math.round(next.progress)}%</span>
      </div>
      <div className="h-1 bg-terracotta-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-terracotta-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${next.progress}%` }}
          transition={{ ...transition.slow, delay: 0.2 }}
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
            transition={transition.fast}
            className="flex items-center gap-1.5 text-xs text-amber-600"
          >
            <Gift className="h-3 w-3" />
            Birthday in {daysUntilBirthday} day{daysUntilBirthday !== 1 ? "s" : ""}
          </motion.div>
        )}
      </div>

      {/* Achievement count */}
      <div className="flex items-center gap-2 text-sm">
        <Trophy className="h-4 w-4 text-amber-500" />
        <span className="font-medium text-foreground">{achieved.length}</span>
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
      transition={transition.fast}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onComplete}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={transition.enter}
        className="bg-white rounded-xl p-8 shadow-elevated text-center max-w-sm mx-4 border border-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mx-auto mb-4">
          <Award className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-1">
          Milestone Achieved
        </h3>

        <p className="text-lg font-medium text-terracotta-700 mb-1">
          {milestone.label}
        </p>
        <p className="text-muted-foreground mb-6">
          {milestone.description}
        </p>

        <button
          onClick={onComplete}
          className="px-6 py-2 bg-terracotta-600 text-white rounded-lg font-medium transition-colors hover:bg-terracotta-700"
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
}
