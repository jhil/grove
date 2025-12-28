/**
 * Google Home OAuth Authorization Endpoint
 *
 * Handles the OAuth 2.0 authorization flow for Google Smart Home account linking.
 * When a user tries to link their Plangrove account in Google Home, they are
 * redirected here to authenticate and authorize the connection.
 *
 * Flow:
 * 1. Google redirects user here with client_id, redirect_uri, state
 * 2. We check if user is authenticated
 * 3. If not, redirect to login page with return URL
 * 4. If yes, redirect to consent page to select groves
 * 5. After consent, redirect back to Google with authorization code
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";
import {
  generateAuthCode,
  isValidClientId,
  isValidRedirectUri,
} from "@/lib/google-home/oauth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  // Extract OAuth parameters
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");
  const responseType = searchParams.get("response_type");

  // Validate required parameters
  if (!clientId || !redirectUri || !state) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  // Validate response type
  if (responseType !== "code") {
    return NextResponse.json(
      { error: "Invalid response_type, must be 'code'" },
      { status: 400 }
    );
  }

  // Validate client ID
  if (!isValidClientId(clientId)) {
    return NextResponse.json({ error: "Invalid client_id" }, { status: 400 });
  }

  // Validate redirect URI
  if (!isValidRedirectUri(redirectUri)) {
    return NextResponse.json(
      { error: "Invalid redirect_uri" },
      { status: 400 }
    );
  }

  // Create Supabase client to check authentication
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

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // User not authenticated - redirect to login page
    // Store the OAuth params so we can resume after login
    const oauthParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
      response_type: responseType || "code",
    });
    const returnUrl = `/api/google-home/auth?${oauthParams.toString()}`;
    const loginUrl = `/login?next=${encodeURIComponent(returnUrl)}&google_home=true`;

    return NextResponse.redirect(`${origin}${loginUrl}`);
  }

  // User is authenticated
  // Check if they already have a Google Home link with groves selected
  const { data: existingLink } = await supabase
    .from("google_home_links")
    .select("linked_groves")
    .eq("user_id", user.id)
    .single();

  // If user has linked groves, generate auth code and redirect immediately
  // Otherwise, redirect to consent page to select groves
  if (existingLink && existingLink.linked_groves.length > 0) {
    // Generate authorization code
    try {
      const code = await generateAuthCode(user.id, redirectUri);

      // Redirect to Google with the code
      const redirectUrl = new URL(redirectUri);
      redirectUrl.searchParams.set("code", code);
      redirectUrl.searchParams.set("state", state);

      return NextResponse.redirect(redirectUrl.toString());
    } catch (error) {
      console.error("Failed to generate auth code:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  // Redirect to consent page to select groves
  const consentUrl = new URL(`${origin}/google-home/link`);
  consentUrl.searchParams.set("client_id", clientId);
  consentUrl.searchParams.set("redirect_uri", redirectUri);
  consentUrl.searchParams.set("state", state);

  return NextResponse.redirect(consentUrl.toString());
}
