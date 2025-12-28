/**
 * Google Home Status API Endpoint
 *
 * Returns the current Google Home link status for the authenticated user.
 */

import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get Google Home link for this user
    const { data: link, error } = await supabase
      .from("google_home_links")
      .select("linked_groves, created_at, updated_at")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned (not an error, just no link)
      console.error("Failed to fetch Google Home link:", error);
      return NextResponse.json(
        { error: "Failed to fetch status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      link: link || null,
    });
  } catch (error) {
    console.error("Status endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
