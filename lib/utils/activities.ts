/**
 * Activity logging utilities for grove changelog.
 * Stores activities in localStorage per grove.
 */

export type ActivityType =
  | "plant_added"
  | "plant_watered"
  | "plant_edited"
  | "plant_removed"
  | "grove_created"
  | "grove_updated";

export interface Activity {
  id: string;
  groveId: string;
  type: ActivityType;
  plantId?: string;
  plantName?: string;
  plantType?: string;
  message: string;
  timestamp: string;
}

const STORAGE_KEY = "grove_activities";

function getStorageKey(groveId: string): string {
  return `${STORAGE_KEY}_${groveId}`;
}

/**
 * Get all activities for a grove.
 */
export function getActivities(groveId: string): Activity[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(getStorageKey(groveId));
    if (!stored) return [];
    return JSON.parse(stored) as Activity[];
  } catch {
    return [];
  }
}

/**
 * Add an activity to a grove's changelog.
 */
export function addActivity(activity: Omit<Activity, "id" | "timestamp">): Activity {
  const newActivity: Activity = {
    ...activity,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
  };

  if (typeof window === "undefined") return newActivity;

  try {
    const existing = getActivities(activity.groveId);
    const updated = [newActivity, ...existing].slice(0, 100); // Keep last 100
    localStorage.setItem(getStorageKey(activity.groveId), JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save activity:", error);
  }

  return newActivity;
}

/**
 * Clear all activities for a grove.
 */
export function clearActivities(groveId: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(getStorageKey(groveId));
  } catch (error) {
    console.error("Failed to clear activities:", error);
  }
}

/**
 * Generate activity message based on type.
 */
export function generateActivityMessage(
  type: ActivityType,
  plantName?: string
): string {
  switch (type) {
    case "plant_added":
      return plantName ? `${plantName} joined the grove` : "A new plant was added";
    case "plant_watered":
      return plantName ? `${plantName} was watered` : "A plant was watered";
    case "plant_edited":
      return plantName ? `${plantName} was updated` : "A plant was updated";
    case "plant_removed":
      return plantName ? `${plantName} left the grove` : "A plant was removed";
    case "grove_created":
      return "Grove was created";
    case "grove_updated":
      return "Grove settings were updated";
    default:
      return "Something happened";
  }
}

/**
 * Format activity timestamp for display.
 */
export function formatActivityTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Get activity icon/emoji based on type.
 */
export function getActivityEmoji(type: ActivityType): string {
  switch (type) {
    case "plant_added":
      return "🌱";
    case "plant_watered":
      return "💧";
    case "plant_edited":
      return "✏️";
    case "plant_removed":
      return "👋";
    case "grove_created":
      return "🏡";
    case "grove_updated":
      return "⚙️";
    default:
      return "📝";
  }
}
