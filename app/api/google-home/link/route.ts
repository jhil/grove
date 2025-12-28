/**
 * Google Home Link API Endpoint
 *
 * Handles the grove selection and auth code generation during account linking.
 * Called by the consent page after user selects groves.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";
import {
  generateAuthCode,
  updateLinkedGroves,
  isValidRedirectUri,
} from "@/lib/google-home/oauth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { groveIds, redirectUri, state } = body;

    // Validate required fields
    if (
      !groveIds ||
      !Array.isArray(groveIds) ||
      groveIds.length === 0 ||
      !redirectUri ||
      !state
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate redirect URI
    if (!isValidRedirectUri(redirectUri)) {
      return NextResponse.json(
        { error: "Invalid redirect URI" },
        { status: 400 }
      );
    }

    // Create Supabase client and check authentication
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

    // Verify user owns the selected groves (or they are public)
    // For now, we trust the selection since groves are public

    // Store or update linked groves in database
    // First check if link already exists
    const { data: existingLink } = await supabase
      .from("google_home_links")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existingLink) {
      // Update existing link with new groves
      const success = await updateLinkedGroves(user.id, groveIds);
      if (!success) {
        return NextResponse.json(
          { error: "Failed to update linked groves" },
          { status: 500 }
        );
      }
    } else {
      // Create new link with groves
      const agentUserId = `plangrove-${user.id}`;
      const { error } = await supabase.from("google_home_links").insert({
        user_id: user.id,
        agent_user_id: agentUserId,
        access_token: "", // Will be populated during token exchange
        refresh_token: "",
        token_expires_at: new Date().toISOString(),
        linked_groves: groveIds,
      });

      if (error) {
        console.error("Failed to create Google Home link:", error);
        return NextResponse.json(
          { error: "Failed to create link" },
          { status: 500 }
        );
      }
    }

    // Generate authorization code
    const code = await generateAuthCode(user.id, redirectUri);

    // Build redirect URL with code and state
    const redirectUrl = new URL(redirectUri);
    redirectUrl.searchParams.set("code", code);
    redirectUrl.searchParams.set("state", state);

    return NextResponse.json({
      success: true,
      redirectUrl: redirectUrl.toString(),
    });
  } catch (error) {
    console.error("Link endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
