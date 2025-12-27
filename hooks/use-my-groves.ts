"use client";

import { useState, useEffect, useCallback } from "react";

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
 * Hook for managing user's saved groves in localStorage.
 * Allows users to quickly access groves they've created or visited.
 */
export function useMyGroves() {
  const [groves, setGroves] = useState<SavedGrove[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load groves from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedGrove[];
        // Sort by last visited (most recent first)
        const sorted = parsed.sort(
          (a, b) => new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime()
        );
        setGroves(sorted);
      }
    } catch (error) {
      console.error("Failed to load saved groves:", error);
    }
    setIsLoaded(true);
  }, []);

  /**
   * Save or update a grove in the user's list.
   * Updates lastVisited timestamp if grove already exists.
   */
  const saveGrove = useCallback((grove: { id: string; name: string }) => {
    setGroves((current) => {
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
      } catch (error) {
        console.error("Failed to save groves:", error);
      }

      return updated;
    });
  }, []);

  /**
   * Remove a grove from the user's list.
   */
  const removeGrove = useCallback((groveId: string) => {
    setGroves((current) => {
      const updated = current.filter((g) => g.id !== groveId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save groves:", error);
      }
      return updated;
    });
  }, []);

  /**
   * Update the name of a saved grove.
   */
  const updateGroveName = useCallback((groveId: string, newName: string) => {
    setGroves((current) => {
      const updated = current.map((g) =>
        g.id === groveId ? { ...g, name: newName } : g
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save groves:", error);
      }
      return updated;
    });
  }, []);

  return {
    groves,
    isLoaded,
    saveGrove,
    removeGrove,
    updateGroveName,
    hasGroves: groves.length > 0,
  };
}
