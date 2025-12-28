/**
 * Google Home Update Groves API Endpoint
 *
 * Updates the list of linked groves for the authenticated user.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { groveIds } = body;

    if (!Array.isArray(groveIds)) {
      return NextResponse.json(
        { error: "groveIds must be an array" },
        { status: 400 }
      );
    }

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

    // Update the linked groves
    const { error } = await supabase
      .from("google_home_links")
      .update({ linked_groves: groveIds })
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to update linked groves:", error);
      return NextResponse.json(
        { error: "Failed to update groves" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update groves endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
