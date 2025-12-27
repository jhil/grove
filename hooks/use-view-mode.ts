"use client";

import { useCallback, useSyncExternalStore } from "react";

export type ViewMode = "gallery" | "list" | "compact";

const STORAGE_KEY = "grove_view_mode";

function isValidViewMode(value: string): value is ViewMode {
  return ["gallery", "list", "compact"].includes(value);
}

/**
 * Hook for managing plant view mode preference.
 * Persists to localStorage using useSyncExternalStore for proper hydration.
 */
export function useViewMode(groveId: string) {
  const storageKey = `${STORAGE_KEY}_${groveId}`;

  // Use useSyncExternalStore for localStorage to avoid hydration issues
  const subscribe = useCallback(
    (callback: () => void) => {
      const handleStorage = (e: StorageEvent) => {
        if (e.key === storageKey) callback();
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    },
    [storageKey]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return "gallery";
    const stored = localStorage.getItem(storageKey);
    return stored && isValidViewMode(stored) ? stored : "gallery";
  }, [storageKey]);

  const getServerSnapshot = useCallback(() => "gallery" as ViewMode, []);

  const viewMode = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  ) as ViewMode;

  const setViewMode = useCallback(
    (mode: ViewMode) => {
      localStorage.setItem(storageKey, mode);
      // Dispatch storage event to trigger re-render
      window.dispatchEvent(new StorageEvent("storage", { key: storageKey }));
    },
    [storageKey]
  );

  return { viewMode, setViewMode, isLoaded: true };
}

/**
 * View mode options for the selector.
 */
export const VIEW_MODE_OPTIONS: { value: ViewMode; label: string; icon: string }[] = [
  { value: "gallery", label: "Gallery", icon: "grid" },
  { value: "list", label: "List", icon: "list" },
  { value: "compact", label: "Compact", icon: "rows" },
];
