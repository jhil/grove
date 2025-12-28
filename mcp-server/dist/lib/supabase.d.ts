/**
 * Supabase client for the MCP server
 */
import { SupabaseClient } from "@supabase/supabase-js";
/**
 * Get or create a Supabase client
 */
export declare function getClient(): SupabaseClient;
/**
 * Sign in with email and password
 */
export declare function signIn(email: string, password: string): Promise<{
    success: boolean;
    error?: string;
    userId?: string;
    displayName?: string;
}>;
/**
 * Sign out and clear stored session
 */
export declare function signOut(): Promise<void>;
/**
 * Get current user info
 */
export declare function getCurrentUser(): Promise<{
    userId: string;
    email: string;
    displayName: string | null;
} | null>;
/**
 * Check if the stored session is still valid
 */
export declare function isSessionValid(): Promise<boolean>;
