import { createClient } from "@/lib/supabase/client";
import type { WateringEvent, Plant } from "@/types/supabase";

/**
 * Analytics database operations for groves.
 * Provides aggregated statistics and historical data for care patterns.
 */

export interface DailyWateringStats {
  date: string;
  count: number;
}

export interface GroveAnalytics {
  totalWaterings: number;
  totalPlants: number;
  averageStreak: number;
  bestStreak: number;
  careConsistency: number; // 0-100 percentage
  mostCaredPlant: { name: string; waterings: number } | null;
  leastCaredPlant: { name: string; daysSinceWatered: number } | null;
}

/**
 * Get watering events for the last N days grouped by date
 */
export async function getWateringHistory(
  groveId: string,
  days: number = 30
): Promise<DailyWateringStats[]> {
  const supabase = createClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("watering_events")
    .select("created_at")
    .eq("grove_id", groveId)
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch watering history:", error);
    return [];
  }

  // Group by date
  const grouped = (data ?? []).reduce<Record<string, number>>((acc, event) => {
    const date = new Date(event.created_at).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Fill in missing dates with 0
  const result: DailyWateringStats[] = [];
  const currentDate = new Date(startDate);
  const endDate = new Date();

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    result.push({
      date: dateStr,
      count: grouped[dateStr] || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

/**
 * Get watering count per plant for a grove
 */
export async function getWateringsPerPlant(
  groveId: string
): Promise<Map<string, number>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("watering_events")
    .select("plant_id")
    .eq("grove_id", groveId);

  if (error) {
    console.error("Failed to fetch waterings per plant:", error);
    return new Map();
  }

  const counts = new Map<string, number>();
  for (const event of data ?? []) {
    const current = counts.get(event.plant_id) || 0;
    counts.set(event.plant_id, current + 1);
  }

  return counts;
}

/**
 * Calculate comprehensive grove analytics
 */
export async function getGroveAnalytics(
  groveId: string,
  plants: Plant[]
): Promise<GroveAnalytics> {
  const wateringsPerPlant = await getWateringsPerPlant(groveId);

  // Total waterings
  let totalWaterings = 0;
  wateringsPerPlant.forEach((count) => {
    totalWaterings += count;
  });

  // Average and best streak
  let totalStreak = 0;
  let bestStreak = 0;
  let plantsWithStreaks = 0;

  for (const plant of plants) {
    if (plant.streak_count > 0) {
      totalStreak += plant.streak_count;
      plantsWithStreaks++;
    }
    if (plant.best_streak > bestStreak) {
      bestStreak = plant.best_streak;
    }
  }

  const averageStreak =
    plantsWithStreaks > 0 ? Math.round(totalStreak / plantsWithStreaks) : 0;

  // Care consistency (% of plants that were watered on time)
  const now = new Date();
  let onTimePlants = 0;
  for (const plant of plants) {
    if (plant.last_watered) {
      const lastWatered = new Date(plant.last_watered);
      const daysSince = Math.floor(
        (now.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24)
      );
      // Consider on-time if watered within interval + 1 day grace
      if (daysSince <= plant.watering_interval + 1) {
        onTimePlants++;
      }
    }
  }
  const careConsistency =
    plants.length > 0 ? Math.round((onTimePlants / plants.length) * 100) : 0;

  // Most cared plant
  let mostCaredPlant: GroveAnalytics["mostCaredPlant"] = null;
  let maxWaterings = 0;
  for (const plant of plants) {
    const count = wateringsPerPlant.get(plant.id) || 0;
    if (count > maxWaterings) {
      maxWaterings = count;
      mostCaredPlant = { name: plant.name, waterings: count };
    }
  }

  // Least cared plant (most days since watered)
  let leastCaredPlant: GroveAnalytics["leastCaredPlant"] = null;
  let maxDaysSince = 0;
  for (const plant of plants) {
    if (plant.last_watered) {
      const lastWatered = new Date(plant.last_watered);
      const daysSince = Math.floor(
        (now.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSince > maxDaysSince) {
        maxDaysSince = daysSince;
        leastCaredPlant = { name: plant.name, daysSinceWatered: daysSince };
      }
    } else {
      // Never watered
      leastCaredPlant = { name: plant.name, daysSinceWatered: -1 };
      maxDaysSince = Infinity;
    }
  }

  return {
    totalWaterings,
    totalPlants: plants.length,
    averageStreak,
    bestStreak,
    careConsistency,
    mostCaredPlant: maxWaterings > 0 ? mostCaredPlant : null,
    leastCaredPlant,
  };
}

/**
 * Get weekly watering summary (for the past 4 weeks)
 */
export async function getWeeklySummary(
  groveId: string
): Promise<{ week: number; count: number; label: string }[]> {
  const history = await getWateringHistory(groveId, 28);

  const weeks: { week: number; count: number; label: string }[] = [];
  const today = new Date();

  for (let w = 3; w >= 0; w--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (w + 1) * 7);
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() - w * 7);

    const weekStartStr = weekStart.toISOString().split("T")[0];
    const weekEndStr = weekEnd.toISOString().split("T")[0];

    const count = history.reduce((sum, day) => {
      if (day.date >= weekStartStr && day.date < weekEndStr) {
        return sum + day.count;
      }
      return sum;
    }, 0);

    const label = w === 0 ? "This week" : w === 1 ? "Last week" : `${w + 1} weeks ago`;

    weeks.push({ week: 3 - w, count, label });
  }

  return weeks;
}
