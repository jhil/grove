"use client";

import { useEffect } from "react";
import type { ThemeId } from "@/lib/constants/themes";
import { DEFAULT_THEME, THEMES } from "@/lib/constants/themes";

/**
 * Hook to manage grove color themes
 * Applies theme colors to CSS custom properties for dynamic theming
 */
export function useGroveTheme(themeId?: ThemeId | string | null) {
  const currentTheme = (themeId as ThemeId) || DEFAULT_THEME;

  useEffect(() => {
    const theme = THEMES[currentTheme];
    if (!theme) return;

    // Apply theme colors to document root
    const root = document.documentElement;
    root.style.setProperty("--accent-300", theme.colors[300]);
    root.style.setProperty("--accent-400", theme.colors[400]);
    root.style.setProperty("--accent-500", theme.colors[500]);
    root.style.setProperty("--accent-600", theme.colors[600]);

    // Also update the old terracotta aliases for backwards compatibility
    root.style.setProperty("--terracotta-300", theme.colors[300]);
    root.style.setProperty("--terracotta-400", theme.colors[400]);
    root.style.setProperty("--terracotta-500", theme.colors[500]);
    root.style.setProperty("--terracotta-600", theme.colors[600]);
  }, [currentTheme]);

  return currentTheme;
}

/**
 * Apply a theme to the document
 * Use this outside of React components if needed
 */
export function applyTheme(themeId: ThemeId) {
  const theme = THEMES[themeId];
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty("--accent-300", theme.colors[300]);
  root.style.setProperty("--accent-400", theme.colors[400]);
  root.style.setProperty("--accent-500", theme.colors[500]);
  root.style.setProperty("--accent-600", theme.colors[600]);

  root.style.setProperty("--terracotta-300", theme.colors[300]);
  root.style.setProperty("--terracotta-400", theme.colors[400]);
  root.style.setProperty("--terracotta-500", theme.colors[500]);
  root.style.setProperty("--terracotta-600", theme.colors[600]);
}
