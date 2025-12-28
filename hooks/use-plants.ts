"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPlantsByGrove,
  createPlant,
  updatePlant,
  waterPlant,
  deletePlant,
} from "@/lib/database/plants";
import type { Plant, NewPlant, PlantUpdate } from "@/types/supabase";

/**
 * Query key factory for plant queries.
 */
export const plantKeys = {
  all: ["plants"] as const,
  byGrove: (groveId: string) => ["plants", "grove", groveId] as const,
  detail: (id: string) => ["plants", id] as const,
};

/**
 * Hook to fetch all plants in a grove.
 */
export function usePlants(groveId: string) {
  return useQuery({
    queryKey: plantKeys.byGrove(groveId),
    queryFn: async () => {
      if (!groveId) return [];
      return getPlantsByGrove(groveId);
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!groveId,
    retry: 2,
    refetchOnMount: true,
  });
}

/**
 * Hook to create a new plant.
 */
export function useCreatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlant,
    onSuccess: (data) => {
      // Invalidate the plants list for this grove
      queryClient.invalidateQueries({
        queryKey: plantKeys.byGrove(data.grove_id),
      });
    },
  });
}

/**
 * Hook to update a plant.
 */
export function useUpdatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: PlantUpdate }) =>
      updatePlant(id, updates),
    onSuccess: (data) => {
      // Update the specific plant in cache
      queryClient.setQueryData(plantKeys.detail(data.id), data);
      // Invalidate the list
      queryClient.invalidateQueries({
        queryKey: plantKeys.byGrove(data.grove_id),
      });
    },
  });
}

/**
 * Hook to water a plant.
 * Uses optimistic updates for instant feedback.
 */
export function useWaterPlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      plantId,
      groveId,
      userInfo,
    }: {
      plantId: string;
      groveId: string;
      userInfo?: { userId: string; userName: string };
    }) => waterPlant(plantId, groveId, userInfo),
    onMutate: async ({ plantId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: plantKeys.all });

      // Snapshot the previous value
      const previousPlants = queryClient.getQueriesData({
        queryKey: plantKeys.all,
      });

      // Optimistically update the plant
      queryClient.setQueriesData(
        { queryKey: plantKeys.all },
        (old: Plant[] | undefined) => {
          if (!old) return old;
          return old.map((plant) =>
            plant.id === plantId
              ? { ...plant, last_watered: new Date().toISOString() }
              : plant
          );
        }
      );

      // Return context with the snapshotted value
      return { previousPlants };
    },
    onError: (_err, _vars, context) => {
      // Roll back on error
      if (context?.previousPlants) {
        context.previousPlants.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (data) => {
      // Refetch after error or success
      if (data) {
        queryClient.invalidateQueries({
          queryKey: plantKeys.byGrove(data.grove_id),
        });
      }
    },
  });
}

/**
 * Hook to delete a plant.
 */
export function useDeletePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, groveId }: { id: string; groveId: string }) => {
      await deletePlant(id);
      return { id, groveId };
    },
    onSuccess: (data) => {
      // Remove from cache and invalidate list
      queryClient.removeQueries({ queryKey: plantKeys.detail(data.id) });
      queryClient.invalidateQueries({
        queryKey: plantKeys.byGrove(data.groveId),
      });
    },
  });
}
