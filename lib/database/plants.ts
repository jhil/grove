import { createClient } from "@/lib/supabase/client";
import type { Plant, NewPlant, PlantUpdate, WateringEvent, NewWateringEvent } from "@/types/supabase";
import { calculateStreakUpdate } from "@/lib/utils/streaks";

/**
 * Database operations for plants.
 * All operations use the browser Supabase client.
 */

/**
 * Fetch all plants in a grove
 */
export async function getPlantsByGrove(groveId: string): Promise<Plant[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("grove_id", groveId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Plant[];
}

/**
 * Fetch a single plant by ID
 */
export async function getPlant(id: string): Promise<Plant | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(error.message);
  }

  return data as Plant;
}

/**
 * Create a new plant
 */
export async function createPlant(plant: NewPlant): Promise<Plant> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("plants")
    .insert(plant)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Plant;
}

/**
 * Update a plant
 */
export async function updatePlant(
  id: string,
  updates: PlantUpdate
): Promise<Plant> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("plants")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Plant;
}

/**
 * Water a plant (update last_watered timestamp), update streak, and record who did it
 */
export async function waterPlant(
  id: string,
  groveId: string,
  userInfo?: { userId: string; userName: string }
): Promise<Plant> {
  const supabase = createClient();
  const now = new Date();
  const nowIso = now.toISOString();

  // First, get the current plant to calculate streak
  const currentPlant = await getPlant(id);
  if (!currentPlant) {
    throw new Error("Plant not found");
  }

  // Calculate streak updates
  const streakUpdate = calculateStreakUpdate(currentPlant, now);

  // Update the plant's last_watered timestamp and streak
  const plant = await updatePlant(id, {
    last_watered: nowIso,
    streak_count: streakUpdate.streak_count,
    best_streak: streakUpdate.best_streak,
    streak_started_at: streakUpdate.streak_started_at,
  });

  // Record the watering event (if user is authenticated)
  try {
    await supabase.from("watering_events").insert({
      plant_id: id,
      grove_id: groveId,
      user_id: userInfo?.userId || null,
      user_name: userInfo?.userName || null,
      created_at: nowIso,
    } as NewWateringEvent);
  } catch (error) {
    // Don't fail the watering if event logging fails
    console.error("Failed to record watering event:", error);
  }

  return plant;
}

/**
 * Get watering events for a grove
 */
export async function getWateringEvents(groveId: string, limit = 20): Promise<WateringEvent[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("watering_events")
    .select("*")
    .eq("grove_id", groveId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch watering events:", error);
    return [];
  }

  return (data ?? []) as WateringEvent[];
}

/**
 * Delete a plant
 */
export async function deletePlant(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("plants").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
