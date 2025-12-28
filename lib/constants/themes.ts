/**
 * Grove color theme definitions
 * Each theme has cute plant-inspired names with corresponding OKLCH color values
 */

export type ThemeId = "clay" | "soil" | "stem" | "lilac" | "droplet" | "coral";

export interface ThemeColors {
  300: string;
  400: string;
  500: string;
  600: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  emoji: string;
  colors: ThemeColors;
}

export const THEMES: Record<ThemeId, Theme> = {
  clay: {
    id: "clay",
    name: "Clay",
    description: "Warm orange-brown like terracotta pottery",
    emoji: "🏺",
    colors: {
      300: "oklch(0.82 0.10 50)",
      400: "oklch(0.73 0.14 45)",
      500: "oklch(0.65 0.16 40)",
      600: "oklch(0.57 0.16 38)",
    },
  },
  soil: {
    id: "soil",
    name: "Soil",
    description: "Deep earthy brown like rich garden soil",
    emoji: "🌍",
    colors: {
      300: "oklch(0.70 0.08 35)",
      400: "oklch(0.58 0.10 32)",
      500: "oklch(0.48 0.11 30)",
      600: "oklch(0.38 0.09 28)",
    },
  },
  stem: {
    id: "stem",
    name: "Stem",
    description: "Deeper green accent alongside sage",
    emoji: "🌿",
    colors: {
      300: "oklch(0.72 0.08 140)",
      400: "oklch(0.60 0.10 135)",
      500: "oklch(0.50 0.12 130)",
      600: "oklch(0.40 0.10 128)",
    },
  },
  lilac: {
    id: "lilac",
    name: "Lilac",
    description: "Soft purple for a whimsical touch",
    emoji: "💜",
    colors: {
      300: "oklch(0.78 0.08 300)",
      400: "oklch(0.68 0.11 295)",
      500: "oklch(0.58 0.13 290)",
      600: "oklch(0.48 0.11 285)",
    },
  },
  droplet: {
    id: "droplet",
    name: "Droplet",
    description: "Deeper blue like water droplets",
    emoji: "💧",
    colors: {
      300: "oklch(0.68 0.10 210)",
      400: "oklch(0.58 0.13 215)",
      500: "oklch(0.50 0.14 220)",
      600: "oklch(0.40 0.12 225)",
    },
  },
  coral: {
    id: "coral",
    name: "Coral",
    description: "Warm coral and pink for variety",
    emoji: "🪸",
    colors: {
      300: "oklch(0.76 0.12 20)",
      400: "oklch(0.65 0.15 18)",
      500: "oklch(0.55 0.16 15)",
      600: "oklch(0.45 0.14 12)",
    },
  },
};

export const THEME_IDS = Object.keys(THEMES) as ThemeId[];

export const DEFAULT_THEME: ThemeId = "clay";

/**
 * Get a theme by ID
 */
export function getTheme(id: ThemeId): Theme {
  return THEMES[id] || THEMES[DEFAULT_THEME];
}

/**
 * Get all themes as an array
 */
export function getAllThemes(): Theme[] {
  return THEME_IDS.map((id) => THEMES[id]);
}
