/**
 * Application constants.
 */

/**
 * Plant types with default watering intervals.
 */
export const PLANT_TYPES = [
  {
    value: "succulent",
    label: "Succulent",
    defaultInterval: 14,
    emoji: "🌵",
  },
  {
    value: "tropical",
    label: "Tropical",
    defaultInterval: 7,
    emoji: "🌴",
  },
  {
    value: "fern",
    label: "Fern",
    defaultInterval: 3,
    emoji: "🌿",
  },
  {
    value: "cactus",
    label: "Cactus",
    defaultInterval: 21,
    emoji: "🌵",
  },
  {
    value: "herb",
    label: "Herb",
    defaultInterval: 2,
    emoji: "🌱",
  },
  {
    value: "flowering",
    label: "Flowering",
    defaultInterval: 4,
    emoji: "🌸",
  },
  {
    value: "tree",
    label: "Tree / Large Plant",
    defaultInterval: 7,
    emoji: "🌳",
  },
  {
    value: "vine",
    label: "Vine / Trailing",
    defaultInterval: 5,
    emoji: "🍃",
  },
  {
    value: "other",
    label: "Other",
    defaultInterval: 7,
    emoji: "🪴",
  },
] as const;

export type PlantType = (typeof PLANT_TYPES)[number]["value"];

/**
 * Get plant type info by value.
 */
export function getPlantType(value: string) {
  return PLANT_TYPES.find((type) => type.value === value) || PLANT_TYPES[8]; // Default to "other"
}

/**
 * Get default watering interval for a plant type.
 */
export function getDefaultInterval(type: string): number {
  const plantType = getPlantType(type);
  return plantType.defaultInterval;
}

/**
 * Watering status colors (Tailwind class names).
 */
export const WATERING_STATUS_COLORS = {
  overdue: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/30",
    icon: "text-destructive",
  },
  "due-today": {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/30",
    icon: "text-warning",
  },
  upcoming: {
    bg: "bg-water-400/10",
    text: "text-water-500",
    border: "border-water-400/30",
    icon: "text-water-500",
  },
  healthy: {
    bg: "bg-sage-100",
    text: "text-sage-600",
    border: "border-sage-200",
    icon: "text-sage-500",
  },
} as const;
