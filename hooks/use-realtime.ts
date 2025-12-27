"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { plantKeys } from "@/hooks/use-plants";
import { groveKeys } from "@/hooks/use-grove";

/**
 * Hook for subscribing to real-time plant updates in a grove.
 * Automatically invalidates queries when changes occur.
 */
export function useRealtimePlants(groveId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!groveId) return;

    const supabase = createClient();

    // Subscribe to changes on the plants table for this grove
    const channel = supabase
      .channel(`plants:${groveId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "plants",
          filter: `grove_id=eq.${groveId}`,
        },
        (payload) => {
          console.log("Plant change received:", payload.eventType);

          // Invalidate the plants query to refetch data
          queryClient.invalidateQueries({
            queryKey: plantKeys.byGrove(groveId),
          });
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [groveId, queryClient]);
}

/**
 * Hook for subscribing to real-time grove updates.
 * Useful for detecting when grove metadata changes.
 */
export function useRealtimeGrove(groveId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!groveId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`grove:${groveId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "groves",
          filter: `id=eq.${groveId}`,
        },
        (payload) => {
          console.log("Grove change received:", payload.eventType);

          // Invalidate the grove query
          queryClient.invalidateQueries({
            queryKey: groveKeys.detail(groveId),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groveId, queryClient]);
}

/**
 * Combined hook for subscribing to all real-time updates for a grove.
 */
export function useRealtimeSync(groveId: string) {
  useRealtimeGrove(groveId);
  useRealtimePlants(groveId);
}
