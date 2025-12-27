"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getActivities,
  addActivity,
  generateActivityMessage,
  type Activity,
  type ActivityType,
} from "@/lib/utils/activities";

const STORAGE_KEY = "grove_activities";

/**
 * Hook for managing grove activities/changelog.
 */
export function useActivities(groveId: string) {
  // Use useSyncExternalStore for localStorage sync
  const subscribe = useCallback(
    (callback: () => void) => {
      const handleStorage = (e: StorageEvent) => {
        if (e.key?.startsWith(STORAGE_KEY)) callback();
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    },
    []
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return JSON.stringify([]);
    return JSON.stringify(getActivities(groveId));
  }, [groveId]);

  const getServerSnapshot = useCallback(() => JSON.stringify([]), []);

  const activitiesJson = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const activities = JSON.parse(activitiesJson) as Activity[];
  const isLoading = false;

  // Log a new activity
  const logActivity = useCallback(
    (type: ActivityType, plantName?: string, plantId?: string, plantType?: string) => {
      const activity = addActivity({
        groveId,
        type,
        plantId,
        plantName,
        plantType,
        message: generateActivityMessage(type, plantName),
      });

      // Dispatch storage event to trigger useSyncExternalStore refresh
      window.dispatchEvent(
        new StorageEvent("storage", { key: `${STORAGE_KEY}_${groveId}` })
      );
      return activity;
    },
    [groveId]
  );

  // Convenience methods
  const logPlantAdded = useCallback(
    (plantName: string, plantId: string, plantType: string) => {
      return logActivity("plant_added", plantName, plantId, plantType);
    },
    [logActivity]
  );

  const logPlantWatered = useCallback(
    (plantName: string, plantId: string) => {
      return logActivity("plant_watered", plantName, plantId);
    },
    [logActivity]
  );

  const logPlantEdited = useCallback(
    (plantName: string, plantId: string) => {
      return logActivity("plant_edited", plantName, plantId);
    },
    [logActivity]
  );

  const logPlantRemoved = useCallback(
    (plantName: string, plantId: string) => {
      return logActivity("plant_removed", plantName, plantId);
    },
    [logActivity]
  );

  return {
    activities,
    isLoading,
    logActivity,
    logPlantAdded,
    logPlantWatered,
    logPlantEdited,
    logPlantRemoved,
  };
}
