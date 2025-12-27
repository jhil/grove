"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getActivities,
  addActivity,
  generateActivityMessage,
  type Activity,
  type ActivityType,
} from "@/lib/utils/activities";

/**
 * Hook for managing grove activities/changelog.
 */
export function useActivities(groveId: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load activities on mount
  useEffect(() => {
    setIsLoading(true);
    const loaded = getActivities(groveId);
    setActivities(loaded);
    setIsLoading(false);
  }, [groveId]);

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

      setActivities((prev) => [activity, ...prev].slice(0, 100));
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
