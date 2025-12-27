/**
 * Supabase Database Types
 *
 * This file defines the TypeScript types for our Supabase database.
 * In a production setup, this would be auto-generated using:
 * npx supabase gen types typescript --local > types/supabase.ts
 *
 * For now, we define them manually to match our schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
  public: {
    Tables: {
      groves: {
        Row: {
          id: string;
          name: string;
          cover_photo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          cover_photo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          cover_photo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      plants: {
        Row: {
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
          // Care Streaks
          streak_count: number;
          best_streak: number;
          streak_started_at: string | null;
          // Plant Milestones
          birthday: string | null;
        };
        Insert: {
          id?: string;
          grove_id: string;
          name: string;
          type: string;
          watering_interval: number;
          photo?: string | null;
          notes?: string | null;
          last_watered?: string | null;
          created_at?: string;
          updated_at?: string;
          // Care Streaks
          streak_count?: number;
          best_streak?: number;
          streak_started_at?: string | null;
          // Plant Milestones
          birthday?: string | null;
        };
        Update: {
          id?: string;
          grove_id?: string;
          name?: string;
          type?: string;
          watering_interval?: number;
          photo?: string | null;
          notes?: string | null;
          last_watered?: string | null;
          created_at?: string;
          updated_at?: string;
          // Care Streaks
          streak_count?: number;
          best_streak?: number;
          streak_started_at?: string | null;
          // Plant Milestones
          birthday?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "plants_grove_id_fkey";
            columns: ["grove_id"];
            isOneToOne: false;
            referencedRelation: "groves";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      watering_events: {
        Row: {
          id: string;
          plant_id: string;
          grove_id: string;
          user_id: string | null;
          user_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plant_id: string;
          grove_id: string;
          user_id?: string | null;
          user_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          plant_id?: string;
          grove_id?: string;
          user_id?: string | null;
          user_name?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "watering_events_plant_id_fkey";
            columns: ["plant_id"];
            isOneToOne: false;
            referencedRelation: "plants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "watering_events_grove_id_fkey";
            columns: ["grove_id"];
            isOneToOne: false;
            referencedRelation: "groves";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "watering_events_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/**
 * Convenience types for easier usage
 */
export type Grove = Database["public"]["Tables"]["groves"]["Row"];
export type NewGrove = Database["public"]["Tables"]["groves"]["Insert"];
export type GroveUpdate = Database["public"]["Tables"]["groves"]["Update"];

export type Plant = Database["public"]["Tables"]["plants"]["Row"];
export type NewPlant = Database["public"]["Tables"]["plants"]["Insert"];
export type PlantUpdate = Database["public"]["Tables"]["plants"]["Update"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type NewProfile = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type WateringEvent = Database["public"]["Tables"]["watering_events"]["Row"];
export type NewWateringEvent = Database["public"]["Tables"]["watering_events"]["Insert"];
