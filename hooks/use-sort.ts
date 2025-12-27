"use client";

import { useCallback, useSyncExternalStore } from "react";

export type SortOption = "urgency" | "name-asc" | "name-desc" | "recent" | "type";

const STORAGE_KEY = "grove_sort_option";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "urgency", label: "Urgency" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "recent", label: "Recently Added" },
  { value: "type", label: "Plant Type" },
];

function isValidSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.map((o) => o.value).includes(value as SortOption);
}

/**
 * Hook for managing plant sort preference.
 * Persists to localStorage using useSyncExternalStore for proper hydration.
 */
export function useSortOption(groveId: string) {
  const storageKey = `${STORAGE_KEY}_${groveId}`;

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
    if (typeof window === "undefined") return "urgency";
    const stored = localStorage.getItem(storageKey);
    return stored && isValidSortOption(stored) ? stored : "urgency";
  }, [storageKey]);

  const getServerSnapshot = useCallback(() => "urgency" as SortOption, []);

  const sortOption = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  ) as SortOption;

  const setSortOption = useCallback(
    (option: SortOption) => {
      localStorage.setItem(storageKey, option);
      window.dispatchEvent(new StorageEvent("storage", { key: storageKey }));
    },
    [storageKey]
  );

  return { sortOption, setSortOption, isLoaded: true };
}
