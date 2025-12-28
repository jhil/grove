import { createClient } from "@/lib/supabase/client";
import type { Grove, NewGrove, GroveUpdate } from "@/types/supabase";

/**
 * Database operations for groves.
 * All operations use the browser Supabase client.
 */

/**
 * Fetch a single grove by ID
 */
export async function getGrove(id: string): Promise<Grove | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("groves")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    throw new Error(error.message);
  }

  return data as Grove;
}

/**
 * Create a new grove
 */
export async function createGrove(grove: NewGrove): Promise<Grove> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("groves")
    .insert(grove)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Grove;
}

/**
 * Update a grove
 */
export async function updateGrove(
  id: string,
  updates: GroveUpdate
): Promise<Grove> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("groves")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Grove;
}

/**
 * Delete a grove (also deletes all plants via cascade)
 */
export async function deleteGrove(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("groves").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Generate a slug from a grove name.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 40);
}

/**
 * Generate a unique grove ID from a name.
 * Tries the clean slug first, only adds suffix if taken.
 */
export async function generateGroveId(name: string): Promise<string> {
  const slug = generateSlug(name);

  // Try the clean slug first
  if (await isGroveIdAvailable(slug)) {
    return slug;
  }

  // If taken, add a random suffix
  const random = Math.random().toString(36).substring(2, 6);
  return `${slug}-${random}`;
}

/**
 * Check if a grove ID is available
 */
export async function isGroveIdAvailable(id: string): Promise<boolean> {
  const grove = await getGrove(id);
  return grove === null;
}
