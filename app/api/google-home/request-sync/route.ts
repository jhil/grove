/**
 * Google Home Request Sync Endpoint
 *
 * Triggers a SYNC request to Google Home to refresh the device list.
 * Called after plant add/remove/rename operations.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  requestSyncForGrove,
  isRequestSyncConfigured,
} from "@/lib/google-home/request-sync";
import { logFulfillment } from "@/lib/google-home/logging";

export async function POST(request: Request) {
  try {
    // Check if Request Sync is configured
    if (!isRequestSyncConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message: "Request Sync not configured",
          hint: "Set GOOGLE_HOME_SERVICE_ACCOUNT environment variable",
        },
        { status: 501 }
      );
    }

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

    // Parse request body
    const body = await request.json();
    const { groveId } = body as { groveId?: string };

    if (!groveId) {
      return NextResponse.json(
        { error: "groveId is required" },
        { status: 400 }
      );
    }

    // Verify grove exists
    const { data: grove, error: groveError } = await supabase
      .from("groves")
      .select("id")
      .eq("id", groveId)
      .single();

    if (groveError || !grove) {
      return NextResponse.json(
        { error: "Grove not found" },
        { status: 404 }
      );
    }

    logFulfillment("info", "Request Sync triggered", {
      groveId,
      userId: user.id,
    });

    // Trigger sync for all users linked to this grove
    await requestSyncForGrove(groveId);

    return NextResponse.json({
      success: true,
      message: "Sync request sent to Google Home",
    });
  } catch (error) {
    logFulfillment("error", "Request Sync endpoint error", {
      error: String(error),
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
