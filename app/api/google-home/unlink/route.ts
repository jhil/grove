/**
 * Google Home Unlink Endpoint
 *
 * Allows users to disconnect their Plangrove account from Google Home
 * from within the app (rather than from Google Home app).
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { unlinkGoogleHome } from "@/lib/google-home/oauth";

export async function POST() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Unlink from Google Home
    const success = await unlinkGoogleHome(user.id);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to unlink from Google Home" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully disconnected from Google Home",
    });
  } catch (error) {
    console.error("Unlink error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
