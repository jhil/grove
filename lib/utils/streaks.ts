/**
 * Care Streak Utilities
 *
 * A streak is maintained when plants are watered within their care window.
 * The window is from 0 to watering_interval days after last watered.
 * If a plant becomes overdue (past interval) and is watered, streak resets to 1.
 */

import type { Plant } from "@/types/supabase";

/**
 * Calculate if a plant was watered on time (within care window)
 */
export function wasWateredOnTime(
  lastWatered: string | null,
  wateringInterval: number
): boolean {
  if (!lastWatered) return false;

  const lastWateredDate = new Date(lastWatered);
  const now = new Date();
  const daysSinceWatered = Math.floor(
    (now.getTime() - lastWateredDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // On time if watered within the interval (with 1 day grace)
  return daysSinceWatered <= wateringInterval + 1;
}

/**
 * Calculate streak updates when watering a plant
 * Returns the new streak values to save to the database
 */
export function calculateStreakUpdate(
  plant: Plant,
  currentTime: Date = new Date()
): {
  streak_count: number;
  best_streak: number;
  streak_started_at: string | null;
} {
  const { last_watered, watering_interval, streak_count, best_streak, streak_started_at } = plant;

  // If never watered before, this is the first watering - start streak at 1
  if (!last_watered) {
    return {
      streak_count: 1,
      best_streak: Math.max(best_streak ?? 0, 1),
      streak_started_at: currentTime.toISOString(),
    };
  }

  const lastWateredDate = new Date(last_watered);
  const daysSinceWatered = Math.floor(
    (currentTime.getTime() - lastWateredDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Check if watering was on time (within interval + 1 day grace period)
  const wasOnTime = daysSinceWatered <= watering_interval + 1;

  if (wasOnTime) {
    // Streak continues - increment
    const newStreak = (streak_count ?? 0) + 1;
    return {
      streak_count: newStreak,
      best_streak: Math.max(best_streak ?? 0, newStreak),
      streak_started_at: streak_started_at ?? currentTime.toISOString(),
    };
  } else {
    // Streak broken - reset to 1
    return {
      streak_count: 1,
      best_streak: best_streak ?? 0,
      streak_started_at: currentTime.toISOString(),
    };
  }
}

/**
 * Get streak status for display
 */
export type StreakStatus = "none" | "starting" | "building" | "strong" | "legendary";

export function getStreakStatus(streakCount: number): StreakStatus {
  if (streakCount <= 0) return "none";
  if (streakCount === 1) return "starting";
  if (streakCount < 5) return "building";
  if (streakCount < 10) return "strong";
  return "legendary";
}

/**
 * Get streak emoji based on status
 */
export function getStreakEmoji(streakCount: number): string {
  const status = getStreakStatus(streakCount);
  switch (status) {
    case "none":
      return "";
    case "starting":
      return "🌱";
    case "building":
      return "🌿";
    case "strong":
      return "🔥";
    case "legendary":
      return "⭐";
  }
}

/**
 * Get streak label for display
 */
export function getStreakLabel(streakCount: number): string {
  const status = getStreakStatus(streakCount);
  switch (status) {
    case "none":
      return "No streak";
    case "starting":
      return "Streak started!";
    case "building":
      return `${streakCount} waterings streak`;
    case "strong":
      return `${streakCount} waterings - on fire!`;
    case "legendary":
      return `${streakCount} waterings - legendary!`;
  }
}

/**
 * Check if streak is at risk (plant is close to or past due)
 */
export function isStreakAtRisk(plant: Plant): boolean {
  if (!plant.last_watered || (plant.streak_count ?? 0) <= 0) return false;

  const lastWateredDate = new Date(plant.last_watered);
  const now = new Date();
  const daysSinceWatered = Math.floor(
    (now.getTime() - lastWateredDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // At risk if within 1 day of losing streak
  return daysSinceWatered >= plant.watering_interval - 1;
}

/**
 * Calculate days until streak breaks
 */
export function daysUntilStreakBreaks(plant: Plant): number | null {
  if (!plant.last_watered || (plant.streak_count ?? 0) <= 0) return null;

  const lastWateredDate = new Date(plant.last_watered);
  const now = new Date();
  const daysSinceWatered = Math.floor(
    (now.getTime() - lastWateredDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Streak breaks after interval + 1 grace day
  const daysUntilBreak = plant.watering_interval + 1 - daysSinceWatered;
  return Math.max(0, daysUntilBreak);
}
