"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGrove,
  createGrove,
  updateGrove,
  deleteGrove,
  generateGroveId,
} from "@/lib/database/groves";
import type { Grove, NewGrove, GroveUpdate } from "@/types/supabase";

/**
 * Query key factory for grove queries.
 * Helps with cache invalidation.
 */
export const groveKeys = {
  all: ["groves"] as const,
  detail: (id: string) => ["groves", id] as const,
};

/**
 * Hook to fetch a single grove by ID.
 */
export function useGrove(id: string) {
  return useQuery({
    queryKey: groveKeys.detail(id),
    queryFn: () => getGrove(id),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!id,
  });
}

/**
 * Hook to create a new grove.
 * Automatically generates a unique ID from the name.
 */
export function useCreateGrove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; coverPhoto?: string; location?: string }) => {
      const id = await generateGroveId(data.name);
      const grove: NewGrove = {
        id,
        name: data.name,
        cover_photo: data.coverPhoto || null,
        location: data.location || null,
      };
      return createGrove(grove);
    },
    onSuccess: (data) => {
      // Update the cache with the new grove
      queryClient.setQueryData(groveKeys.detail(data.id), data);
    },
  });
}

/**
 * Hook to update a grove.
 */
export function useUpdateGrove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: GroveUpdate }) =>
      updateGrove(id, updates),
    onSuccess: (data) => {
      // Update the cache
      queryClient.setQueryData(groveKeys.detail(data.id), data);
    },
  });
}

/**
 * Hook to delete a grove.
 */
export function useDeleteGrove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGrove,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: groveKeys.detail(id) });
    },
  });
}
