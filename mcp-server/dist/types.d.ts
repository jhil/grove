/**
 * Shared types for the Plangrove MCP server
 */
export interface Grove {
    id: string;
    name: string;
    cover_photo: string | null;
    created_at: string;
    updated_at: string;
}
export interface Plant {
    id: string;
    grove_id: string;
    name: string;
    type: string;
    watering_interval: number;
    photo: string | null;
    notes: string | null;
    last_watered: string | null;
    created_at: string;
    updated_at: string;
    streak_count: number;
    best_streak: number;
    streak_started_at: string | null;
    birthday: string | null;
}
export interface Profile {
    id: string;
    email: string | null;
    display_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}
export interface WateringEvent {
    id: string;
    plant_id: string;
    grove_id: string;
    user_id: string | null;
    user_name: string | null;
    created_at: string;
}
export interface StoredConfig {
    supabaseUrl: string;
    accessToken: string;
    refreshToken: string;
    userId: string;
    email: string;
    displayName: string | null;
}
