/**
 * Google Home OAuth Token Endpoint
 *
 * Handles OAuth 2.0 token operations for Google Smart Home:
 * 1. Authorization code exchange (grant_type=authorization_code)
 * 2. Token refresh (grant_type=refresh_token)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  exchangeCodeForTokens,
  refreshAccessToken,
} from "@/lib/google-home/oauth";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body as form data (OAuth 2.0 standard)
    const contentType = request.headers.get("content-type") || "";

    let params: URLSearchParams;

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const body = await request.text();
      params = new URLSearchParams(body);
    } else if (contentType.includes("application/json")) {
      // Some implementations send JSON
      const body = await request.json();
      params = new URLSearchParams(body);
    } else {
      return NextResponse.json(
        { error: "invalid_request", error_description: "Unsupported content type" },
        { status: 400 }
      );
    }

    const grantType = params.get("grant_type");
    const clientId = params.get("client_id") || "";
    const clientSecret = params.get("client_secret") || "";

    if (!grantType) {
      return NextResponse.json(
        { error: "invalid_request", error_description: "Missing grant_type" },
        { status: 400 }
      );
    }

    // Handle authorization code exchange
    if (grantType === "authorization_code") {
      const code = params.get("code");
      const redirectUri = params.get("redirect_uri");

      if (!code || !redirectUri) {
        return NextResponse.json(
          {
            error: "invalid_request",
            error_description: "Missing code or redirect_uri",
          },
          { status: 400 }
        );
      }

      const result = await exchangeCodeForTokens(
        code,
        redirectUri,
        clientId,
        clientSecret
      );

      if (!result) {
        return NextResponse.json(
          { error: "invalid_grant", error_description: "Invalid authorization code" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        token_type: "Bearer",
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
        expires_in: result.expiresIn,
      });
    }

    // Handle refresh token
    if (grantType === "refresh_token") {
      const refreshToken = params.get("refresh_token");

      if (!refreshToken) {
        return NextResponse.json(
          { error: "invalid_request", error_description: "Missing refresh_token" },
          { status: 400 }
        );
      }

      const result = await refreshAccessToken(
        refreshToken,
        clientId,
        clientSecret
      );

      if (!result) {
        return NextResponse.json(
          { error: "invalid_grant", error_description: "Invalid refresh token" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        token_type: "Bearer",
        access_token: result.accessToken,
        expires_in: result.expiresIn,
      });
    }

    // Unsupported grant type
    return NextResponse.json(
      {
        error: "unsupported_grant_type",
        error_description: `Grant type '${grantType}' is not supported`,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Token endpoint error:", error);
    return NextResponse.json(
      { error: "server_error", error_description: "Internal server error" },
      { status: 500 }
    );
  }
}
