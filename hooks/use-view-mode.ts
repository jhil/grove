"use client";

import { useState, useEffect, useCallback } from "react";

export type ViewMode = "gallery" | "list" | "compact";

const STORAGE_KEY = "grove_view_mode";

/**
 * Hook for managing plant view mode preference.
 * Persists to localStorage.
 */
export function useViewMode(groveId: string) {
  const [viewMode, setViewModeState] = useState<ViewMode>("gallery");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${groveId}`);
    if (stored && isValidViewMode(stored)) {
      setViewModeState(stored as ViewMode);
    }
    setIsLoaded(true);
  }, [groveId]);

  const setViewMode = useCallback(
    (mode: ViewMode) => {
      setViewModeState(mode);
      localStorage.setItem(`${STORAGE_KEY}_${groveId}`, mode);
    },
    [groveId]
  );

  return { viewMode, setViewMode, isLoaded };
}

function isValidViewMode(value: string): value is ViewMode {
  return ["gallery", "list", "compact"].includes(value);
}

/**
 * View mode options for the selector.
 */
export const VIEW_MODE_OPTIONS: { value: ViewMode; label: string; icon: string }[] = [
  { value: "gallery", label: "Gallery", icon: "grid" },
  { value: "list", label: "List", icon: "list" },
  { value: "compact", label: "Compact", icon: "rows" },
];
