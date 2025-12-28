import { createClient } from "@/lib/supabase/client";
import type { Grove, NewGrove, GroveUpdate } from "@/types/supabase";

/**
 * Database operations for groves.
 * All operations use the browser Supabase client.
 */

/**
 * Fetch all groves owned by a user
 */
export async function getGrovesByOwner(userId: string): Promise<Grove[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("groves")
    .select("*")
    .eq("owner_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Grove[];
}

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
 * Always includes a random suffix to guarantee uniqueness without database checks.
 */
export function generateGroveId(name: string): string {
  const slug = generateSlug(name);
  const random = Math.random().toString(36).substring(2, 6);
  return `${slug}-${random}`;
}
