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
