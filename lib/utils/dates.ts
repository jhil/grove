/**
 * Date utilities for watering calculations.
 */

/**
 * Calculate the next watering date based on last watered and interval.
 */
export function calculateNextWatering(
  lastWatered: string | null,
  intervalDays: number
): Date | null {
  if (!lastWatered) {
    // Never watered - needs water now
    return new Date();
  }

  const lastDate = new Date(lastWatered);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return nextDate;
}

/**
 * Calculate days until next watering (negative = overdue).
 */
export function daysUntilWatering(
  lastWatered: string | null,
  intervalDays: number
): number {
  if (!lastWatered) {
    return -1; // Never watered, overdue
  }

  const nextWatering = calculateNextWatering(lastWatered, intervalDays);
  if (!nextWatering) return -1;

  const now = new Date();
  const diffTime = nextWatering.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Watering status based on days until next watering.
 */
export type WateringStatus = "overdue" | "due-today" | "upcoming" | "healthy";

export function getWateringStatus(
  lastWatered: string | null,
  intervalDays: number
): WateringStatus {
  const days = daysUntilWatering(lastWatered, intervalDays);

  if (days < 0) return "overdue";
  if (days === 0) return "due-today";
  if (days <= 1) return "upcoming";
  return "healthy";
}

/**
 * Human-readable watering status text.
 */
export function formatWateringStatus(
  lastWatered: string | null,
  intervalDays: number
): string {
  if (!lastWatered) {
    return "Never watered";
  }

  const days = daysUntilWatering(lastWatered, intervalDays);

  if (days < -1) {
    return `${Math.abs(days)} days overdue`;
  }
  if (days === -1) {
    return "1 day overdue";
  }
  if (days === 0) {
    return "Water today";
  }
  if (days === 1) {
    return "Water tomorrow";
  }
  return `Water in ${days} days`;
}

/**
 * Format when a plant was last watered.
 */
export function formatLastWatered(lastWatered: string | null): string {
  if (!lastWatered) {
    return "Never";
  }

  const date = new Date(lastWatered);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  if (diffDays < 14) {
    return "1 week ago";
  }
  if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  }

  // Format as date for older entries
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
