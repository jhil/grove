/**
 * Plant Milestones Utilities
 *
 * Track and celebrate plant milestones - birthdays, time with you, and achievements.
 */

import type { Plant } from "@/types/supabase";

export interface Milestone {
  id: string;
  type: "time" | "streak" | "custom";
  label: string;
  description: string;
  emoji: string;
  achieved: boolean;
  achievedAt?: Date;
  progress?: number; // 0-100 for upcoming milestones
}

/**
 * Time-based milestone definitions
 */
const TIME_MILESTONES = [
  { days: 7, id: "1-week", label: "1 Week", description: "First week together", emoji: "🌱" },
  { days: 30, id: "1-month", label: "1 Month", description: "One month of care", emoji: "🌿" },
  { days: 90, id: "3-months", label: "3 Months", description: "Growing strong", emoji: "🌳" },
  { days: 180, id: "6-months", label: "6 Months", description: "Half a year!", emoji: "🎉" },
  { days: 365, id: "1-year", label: "1 Year", description: "Happy plantiversary!", emoji: "🎂" },
  { days: 730, id: "2-years", label: "2 Years", description: "Two years of growth", emoji: "⭐" },
  { days: 1095, id: "3-years", label: "3 Years", description: "Veteran plant parent", emoji: "🏆" },
  { days: 1825, id: "5-years", label: "5 Years", description: "Legendary dedication", emoji: "👑" },
];

/**
 * Streak-based milestone definitions
 */
const STREAK_MILESTONES = [
  { streak: 3, id: "streak-3", label: "3 Streak", description: "Three in a row!", emoji: "🔥" },
  { streak: 7, id: "streak-7", label: "Week Streak", description: "7 consecutive waterings", emoji: "💪" },
  { streak: 10, id: "streak-10", label: "10 Streak", description: "On fire!", emoji: "🌟" },
  { streak: 25, id: "streak-25", label: "25 Streak", description: "Quarter century!", emoji: "💎" },
  { streak: 50, id: "streak-50", label: "50 Streak", description: "Incredible dedication", emoji: "🏅" },
  { streak: 100, id: "streak-100", label: "Century", description: "100 consecutive waterings!", emoji: "🎖️" },
];

/**
 * Calculate days since plant birthday
 */
export function getDaysWithPlant(birthday: string | null): number | null {
  if (!birthday) return null;
  const birthDate = new Date(birthday);
  const now = new Date();
  const diffTime = now.getTime() - birthDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get all milestones for a plant (achieved and upcoming)
 */
export function getPlantMilestones(plant: Plant): Milestone[] {
  const milestones: Milestone[] = [];
  const daysWithPlant = getDaysWithPlant(plant.birthday);
  const streakCount = plant.streak_count ?? 0;
  const bestStreak = plant.best_streak ?? 0;

  // Time milestones
  for (const tm of TIME_MILESTONES) {
    const achieved = daysWithPlant !== null && daysWithPlant >= tm.days;
    const progress = daysWithPlant !== null ? Math.min(100, (daysWithPlant / tm.days) * 100) : 0;

    milestones.push({
      id: tm.id,
      type: "time",
      label: tm.label,
      description: tm.description,
      emoji: tm.emoji,
      achieved,
      achievedAt: achieved && plant.birthday
        ? new Date(new Date(plant.birthday).getTime() + tm.days * 24 * 60 * 60 * 1000)
        : undefined,
      progress: achieved ? 100 : progress,
    });
  }

  // Streak milestones (use best streak to determine achieved)
  for (const sm of STREAK_MILESTONES) {
    const achieved = bestStreak >= sm.streak;
    const progress = Math.min(100, (bestStreak / sm.streak) * 100);

    milestones.push({
      id: sm.id,
      type: "streak",
      label: sm.label,
      description: sm.description,
      emoji: sm.emoji,
      achieved,
      progress: achieved ? 100 : progress,
    });
  }

  return milestones;
}

/**
 * Get achieved milestones only
 */
export function getAchievedMilestones(plant: Plant): Milestone[] {
  return getPlantMilestones(plant).filter((m) => m.achieved);
}

/**
 * Get the next upcoming milestone
 */
export function getNextMilestone(plant: Plant): Milestone | null {
  const milestones = getPlantMilestones(plant);
  return milestones.find((m) => !m.achieved && (m.progress ?? 0) > 0) ?? null;
}

/**
 * Check if a milestone was just achieved (within last day)
 */
export function wasJustAchieved(milestone: Milestone): boolean {
  if (!milestone.achieved || !milestone.achievedAt) return false;
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return milestone.achievedAt > oneDayAgo;
}

/**
 * Get recently achieved milestones (within last 7 days)
 */
export function getRecentMilestones(plant: Plant): Milestone[] {
  const milestones = getAchievedMilestones(plant);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return milestones.filter((m) => m.achievedAt && m.achievedAt > sevenDaysAgo);
}

/**
 * Format plant age for display
 */
export function formatPlantAge(birthday: string | null): string {
  if (!birthday) return "Age unknown";

  const days = getDaysWithPlant(birthday);
  if (days === null) return "Age unknown";

  if (days === 0) return "Today!";
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "1 week" : `${weeks} weeks`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? "1 month" : `${months} months`;
  }

  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);

  if (remainingMonths === 0) {
    return years === 1 ? "1 year" : `${years} years`;
  }

  return `${years}y ${remainingMonths}m`;
}

/**
 * Get milestone badge color based on type and achievement
 */
export function getMilestoneColor(milestone: Milestone): {
  bg: string;
  text: string;
  border: string;
} {
  if (!milestone.achieved) {
    return {
      bg: "bg-gray-100",
      text: "text-gray-500",
      border: "border-gray-200",
    };
  }

  switch (milestone.type) {
    case "time":
      return {
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border-amber-300",
      };
    case "streak":
      return {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-300",
      };
    default:
      return {
        bg: "bg-sage-100",
        text: "text-sage-800",
        border: "border-sage-300",
      };
  }
}

/**
 * Check if today is the plant's birthday (anniversary)
 */
export function isBirthdayToday(birthday: string | null): boolean {
  if (!birthday) return false;

  const birthDate = new Date(birthday);
  const today = new Date();

  return (
    birthDate.getMonth() === today.getMonth() &&
    birthDate.getDate() === today.getDate() &&
    birthDate.getFullYear() !== today.getFullYear() // Not the actual first day
  );
}

/**
 * Get days until next birthday (anniversary)
 */
export function getDaysUntilBirthday(birthday: string | null): number | null {
  if (!birthday) return null;

  const birthDate = new Date(birthday);
  const today = new Date();

  // Get this year's birthday
  let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  // If this year's birthday has passed, use next year
  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }

  const diffTime = nextBirthday.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
