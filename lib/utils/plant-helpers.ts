/**
 * Helper functions for plant care calculations and display.
 */

import { getWateringStatus, daysUntilWatering } from "./dates";
import type { Plant } from "@/types/supabase";

/**
 * Calculate the care health score for a grove (0-100).
 * Based on how well plants are being watered.
 */
export function calculateGroveHealth(plants: Plant[]): number {
  if (plants.length === 0) return 100;

  const scores = plants.map((plant) => {
    const status = getWateringStatus(plant.last_watered, plant.watering_interval);

    switch (status) {
      case "healthy":
        return 100;
      case "upcoming":
        return 90;
      case "due-today":
        return 70;
      case "overdue":
        // Score decreases based on how overdue
        const daysOverdue = Math.abs(
          daysUntilWatering(plant.last_watered, plant.watering_interval)
        );
        return Math.max(0, 50 - daysOverdue * 10);
      default:
        return 50;
    }
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * Get a friendly message based on grove health.
 */
export function getHealthMessage(health: number): {
  emoji: string;
  message: string;
  color: string;
} {
  if (health >= 90) {
    return {
      emoji: "🌿",
      message: "Your grove is thriving!",
      color: "text-sage-600",
    };
  }
  if (health >= 70) {
    return {
      emoji: "🌱",
      message: "Looking good! A few plants need attention.",
      color: "text-sage-500",
    };
  }
  if (health >= 50) {
    return {
      emoji: "💧",
      message: "Some plants are thirsty!",
      color: "text-water-500",
    };
  }
  return {
    emoji: "🚨",
    message: "Your plants need water urgently!",
    color: "text-clay-500",
  };
}

/**
 * Sort plants by care priority (most urgent first).
 */
export function sortByCarePriority(plants: Plant[]): Plant[] {
  return [...plants].sort((a, b) => {
    const daysA = daysUntilWatering(a.last_watered, a.watering_interval);
    const daysB = daysUntilWatering(b.last_watered, b.watering_interval);
    return daysA - daysB;
  });
}

/**
 * Get plants that need watering today or are overdue.
 */
export function getPlantsNeedingWater(plants: Plant[]): Plant[] {
  return plants.filter((plant) => {
    const status = getWateringStatus(plant.last_watered, plant.watering_interval);
    return status === "overdue" || status === "due-today";
  });
}

/**
 * Get the next plant that will need watering.
 */
export function getNextPlantToWater(plants: Plant[]): Plant | null {
  if (plants.length === 0) return null;

  const sorted = sortByCarePriority(plants);
  return sorted[0];
}

/**
 * Calculate care streak - consecutive days with all plants watered on time.
 * This is a simplified version that just checks current state.
 * A full implementation would need watering history in the database.
 */
export function getCareStreak(plants: Plant[]): number {
  if (plants.length === 0) return 0;

  // For now, return a streak based on current health
  // Full implementation would track historical watering events
  const health = calculateGroveHealth(plants);

  if (health === 100) return 7; // Perfect care for a week (placeholder)
  if (health >= 90) return 5;
  if (health >= 70) return 3;
  if (health >= 50) return 1;
  return 0;
}

/**
 * Get fun facts about plant care.
 */
export const PLANT_CARE_TIPS = [
  "Most houseplants are killed by overwatering, not underwatering.",
  "Plants grow faster when spoken to - they respond to CO2!",
  "The best time to water plants is in the morning.",
  "Yellowing leaves often indicate overwatering.",
  "Many plants like to dry out slightly between waterings.",
  "Grouping plants together can increase humidity.",
  "Dust on leaves can block photosynthesis - wipe them occasionally!",
  "Most houseplants prefer indirect light over direct sunlight.",
  "Clay pots help prevent overwatering by absorbing excess moisture.",
  "Plants can improve air quality by filtering toxins.",
];

export function getRandomTip(): string {
  return PLANT_CARE_TIPS[Math.floor(Math.random() * PLANT_CARE_TIPS.length)];
}
