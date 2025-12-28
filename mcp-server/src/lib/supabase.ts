/**
 * Supabase client for the MCP server
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { loadConfig, saveConfig } from "./config.js";

// Plangrove's public Supabase URL and anon key
const SUPABASE_URL = "https://oxiaglsxmepbvlfzzzrc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94aWFnbHN4bWVwYnZsZnp6enJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MTIzNTUsImV4cCI6MjA4MjM4ODM1NX0.ygTMaPwY6zm5lQ9TwbGtn8Qa6qIqQte2griQirzqe1A";

let supabaseClient: SupabaseClient | null = null;

/**
 * Get or create a Supabase client
 */
export function getClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const config = loadConfig();

  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  });

  // If we have stored tokens, set the session
  if (config) {
    supabaseClient.auth.setSession({
      access_token: config.accessToken,
      refresh_token: config.refreshToken,
    });
  }

  return supabaseClient;
}

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; userId?: string; displayName?: string }> {
  const client = getClient();

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.session || !data.user) {
    return { success: false, error: "No session returned" };
  }

  // Fetch profile
  const { data: profile } = await client
    .from("profiles")
    .select("display_name")
    .eq("id", data.user.id)
    .single();

  // Store the session
  saveConfig({
    supabaseUrl: SUPABASE_URL,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    userId: data.user.id,
    email: data.user.email || email,
    displayName: profile?.display_name || null,
  });

  return {
    success: true,
    userId: data.user.id,
    displayName: profile?.display_name || undefined,
  };
}

/**
 * Sign out and clear stored session
 */
export async function signOut(): Promise<void> {
  const client = getClient();
  await client.auth.signOut();
  supabaseClient = null;
}

/**
 * Get current user info
 */
export async function getCurrentUser(): Promise<{
  userId: string;
  email: string;
  displayName: string | null;
} | null> {
  const config = loadConfig();
  if (!config) {
    return null;
  }

  return {
    userId: config.userId,
    email: config.email,
    displayName: config.displayName,
  };
}

/**
 * Check if the stored session is still valid
 */
export async function isSessionValid(): Promise<boolean> {
  const config = loadConfig();
  if (!config) {
    return false;
  }

  const client = getClient();
  const { data } = await client.auth.getUser();
  return data.user !== null;
}
