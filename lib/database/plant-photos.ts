import { createClient } from "@/lib/supabase/client";
import type { PlantPhoto, NewPlantPhoto } from "@/types/supabase";

/**
 * Database operations for plant photos (growth timeline).
 */

/**
 * Fetch all photos for a plant, ordered by taken_at date
 */
export async function getPlantPhotos(plantId: string): Promise<PlantPhoto[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("plant_photos")
    .select("*")
    .eq("plant_id", plantId)
    .order("taken_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch plant photos:", error);
    return [];
  }

  return (data ?? []) as PlantPhoto[];
}

/**
 * Add a new photo to a plant's growth timeline
 */
export async function addPlantPhoto(photo: NewPlantPhoto): Promise<PlantPhoto | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("plant_photos")
    .insert(photo)
    .select()
    .single();

  if (error) {
    console.error("Failed to add plant photo:", error);
    return null;
  }

  return data as PlantPhoto;
}

/**
 * Delete a photo from the timeline
 */
export async function deletePlantPhoto(photoId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("plant_photos")
    .delete()
    .eq("id", photoId);

  if (error) {
    console.error("Failed to delete plant photo:", error);
    return false;
  }

  return true;
}

/**
 * Update photo caption
 */
export async function updatePhotoCaption(
  photoId: string,
  caption: string
): Promise<PlantPhoto | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("plant_photos")
    .update({ caption })
    .eq("id", photoId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update photo caption:", error);
    return null;
  }

  return data as PlantPhoto;
}

/**
 * Get photo count for a plant
 */
export async function getPhotoCount(plantId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("plant_photos")
    .select("*", { count: "exact", head: true })
    .eq("plant_id", plantId);

  if (error) {
    console.error("Failed to get photo count:", error);
    return 0;
  }

  return count ?? 0;
}
