"use client";

import { useState, useEffect, useCallback } from "react";

export type SortOption = "urgency" | "name-asc" | "name-desc" | "recent" | "type";

const STORAGE_KEY = "grove_sort_option";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "urgency", label: "Urgency" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "recent", label: "Recently Added" },
  { value: "type", label: "Plant Type" },
];

/**
 * Hook for managing plant sort preference.
 * Persists to localStorage.
 */
export function useSortOption(groveId: string) {
  const [sortOption, setSortOptionState] = useState<SortOption>("urgency");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${groveId}`);
    if (stored && isValidSortOption(stored)) {
      setSortOptionState(stored as SortOption);
    }
    setIsLoaded(true);
  }, [groveId]);

  const setSortOption = useCallback(
    (option: SortOption) => {
      setSortOptionState(option);
      localStorage.setItem(`${STORAGE_KEY}_${groveId}`, option);
    },
    [groveId]
  );

  return { sortOption, setSortOption, isLoaded };
}

function isValidSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.map((o) => o.value).includes(value as SortOption);
}
