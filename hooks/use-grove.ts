"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGrove,
  createGrove,
  updateGrove,
  deleteGrove,
  generateGroveId,
  getGrovesByOwner,
} from "@/lib/database/groves";
import { useAuth } from "@/hooks/use-auth";
import type { Grove, NewGrove, GroveUpdate } from "@/types/supabase";

/**
 * Query key factory for grove queries.
 * Helps with cache invalidation.
 */
export const groveKeys = {
  all: ["groves"] as const,
  detail: (id: string) => ["groves", id] as const,
  byOwner: (userId: string) => ["groves", "owner", userId] as const,
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
 * Sets the owner_id to the current authenticated user.
 */
export function useCreateGrove() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { name: string; coverPhoto?: string; location?: string }) => {
      // Generate ID synchronously with random suffix
      const id = generateGroveId(data.name);
      // Get current user ID at mutation time via fresh client
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id || null;

      const grove: NewGrove = {
        id,
        name: data.name,
        cover_photo: data.coverPhoto || null,
        location: data.location || null,
        owner_id: currentUserId,
      };
      return createGrove(grove);
    },
    onSuccess: (data) => {
      // Update the cache with the new grove
      queryClient.setQueryData(groveKeys.detail(data.id), data);
      // Invalidate the owner's groves list
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: groveKeys.byOwner(user.id) });
      }
    },
  });
}

/**
 * Hook to fetch groves owned by the current user.
 */
export function useMyOwnedGroves() {
  const { user, isLoading: authLoading } = useAuth();

  return useQuery({
    queryKey: user?.id ? groveKeys.byOwner(user.id) : ["groves", "none"],
    queryFn: () => (user?.id ? getGrovesByOwner(user.id) : Promise.resolve([])),
    staleTime: 60 * 1000, // 1 minute
    enabled: !authLoading && !!user?.id,
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
