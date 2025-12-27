"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Saved grove info stored in localStorage.
 * Minimal info to allow quick access without fetching from DB.
 */
export interface SavedGrove {
  id: string;
  name: string;
  lastVisited: string;
}

const STORAGE_KEY = "plangrove_my_groves";
const MAX_GROVES = 20;

/**
 * Get groves from localStorage sorted by last visited.
 */
function getGrovesFromStorage(): SavedGrove[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as SavedGrove[];
      return parsed.sort(
        (a, b) => new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime()
      );
    }
  } catch (error) {
    console.error("Failed to load saved groves:", error);
  }
  return [];
}

/**
 * Hook for managing user's saved groves in localStorage.
 * Allows users to quickly access groves they've created or visited.
 */
export function useMyGroves() {
  // Use useSyncExternalStore for localStorage sync
  const subscribe = useCallback((callback: () => void) => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) callback();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const getSnapshot = useCallback(() => {
    return JSON.stringify(getGrovesFromStorage());
  }, []);

  const getServerSnapshot = useCallback(() => JSON.stringify([]), []);

  const grovesJson = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const groves = JSON.parse(grovesJson) as SavedGrove[];
  const isLoaded = true;

  /**
   * Dispatch storage event to trigger useSyncExternalStore refresh.
   */
  const dispatchUpdate = useCallback(() => {
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  }, []);

  /**
   * Save or update a grove in the user's list.
   * Updates lastVisited timestamp if grove already exists.
   */
  const saveGrove = useCallback((grove: { id: string; name: string }) => {
    const current = getGrovesFromStorage();
    const now = new Date().toISOString();
    const existingIndex = current.findIndex((g) => g.id === grove.id);

    let updated: SavedGrove[];
    if (existingIndex >= 0) {
      // Update existing grove
      updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        name: grove.name,
        lastVisited: now,
      };
    } else {
      // Add new grove
      const newGrove: SavedGrove = {
        id: grove.id,
        name: grove.name,
        lastVisited: now,
      };
      updated = [newGrove, ...current];
    }

    // Keep only the most recent groves
    if (updated.length > MAX_GROVES) {
      updated = updated.slice(0, MAX_GROVES);
    }

    // Sort by last visited
    updated.sort(
      (a, b) => new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime()
    );

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      dispatchUpdate();
    } catch (error) {
      console.error("Failed to save groves:", error);
    }
  }, [dispatchUpdate]);

  /**
   * Remove a grove from the user's list.
   */
  const removeGrove = useCallback((groveId: string) => {
    const current = getGrovesFromStorage();
    const updated = current.filter((g) => g.id !== groveId);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      dispatchUpdate();
    } catch (error) {
      console.error("Failed to save groves:", error);
    }
  }, [dispatchUpdate]);

  /**
   * Update the name of a saved grove.
   */
  const updateGroveName = useCallback((groveId: string, newName: string) => {
    const current = getGrovesFromStorage();
    const updated = current.map((g) =>
      g.id === groveId ? { ...g, name: newName } : g
    );
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      dispatchUpdate();
    } catch (error) {
      console.error("Failed to save groves:", error);
    }
  }, [dispatchUpdate]);

  return {
    groves,
    isLoaded,
    saveGrove,
    removeGrove,
    updateGroveName,
    hasGroves: groves.length > 0,
  };
}
