/**
 * OAuth 2.0 utilities for Google Home integration.
 *
 * Handles authorization codes, access tokens, and refresh tokens
 * for the Google Smart Home account linking flow.
 */

import { createClient } from "@/lib/supabase/server";
import type { GoogleHomeLink, NewGoogleAuthCode, GoogleAuthCode } from "@/types/supabase";
import {
  AUTH_CODE_EXPIRY_MINUTES,
  ACCESS_TOKEN_EXPIRY_HOURS,
  GOOGLE_HOME_JWT_SECRET,
  GOOGLE_HOME_CLIENT_ID,
  GOOGLE_HOME_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_PATTERN,
} from "./constants";

/**
 * Generate a cryptographically secure random string.
 */
function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

/**
 * Generate HMAC-SHA256 signature for a token payload.
 */
async function signPayload(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(GOOGLE_HOME_JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Verify HMAC-SHA256 signature.
 */
async function verifySignature(
  payload: string,
  signature: string
): Promise<boolean> {
  const expectedSignature = await signPayload(payload);
  return signature === expectedSignature;
}

/**
 * Generate a short-lived authorization code.
 */
export async function generateAuthCode(
  userId: string,
  redirectUri: string
): Promise<string> {
  const supabase = await createClient();
  const code = generateRandomString(32);
  const expiresAt = new Date(
    Date.now() + AUTH_CODE_EXPIRY_MINUTES * 60 * 1000
  ).toISOString();

  const authCode: NewGoogleAuthCode = {
    code,
    user_id: userId,
    redirect_uri: redirectUri,
    expires_at: expiresAt,
    used: false,
  };

  const { error } = await supabase.from("google_auth_codes").insert(authCode);

  if (error) {
    console.error("Failed to create auth code:", error);
    throw new Error("Failed to generate authorization code");
  }

  return code;
}

/**
 * Validate an authorization code and mark it as used.
 * Returns the user ID if valid, null otherwise.
 */
export async function validateAuthCode(
  code: string,
  redirectUri: string
): Promise<{ userId: string } | null> {
  const supabase = await createClient();

  // Find the code
  const { data: authCode, error } = await supabase
    .from("google_auth_codes")
    .select("*")
    .eq("code", code)
    .eq("used", false)
    .single<GoogleAuthCode>();

  if (error || !authCode) {
    console.error("Auth code not found or already used");
    return null;
  }

  // Check expiry
  if (new Date(authCode.expires_at) < new Date()) {
    console.error("Auth code expired");
    return null;
  }

  // Check redirect URI matches
  if (authCode.redirect_uri !== redirectUri) {
    console.error("Redirect URI mismatch");
    return null;
  }

  // Mark as used
  await supabase
    .from("google_auth_codes")
    .update({ used: true })
    .eq("id", authCode.id);

  return { userId: authCode.user_id };
}

/**
 * Token payload structure.
 */
interface TokenPayload {
  userId: string;
  agentUserId: string;
  type: "access" | "refresh";
  exp: number;
}

/**
 * Generate an access token.
 */
export async function generateAccessToken(
  userId: string,
  agentUserId: string
): Promise<string> {
  const exp = Math.floor(
    Date.now() / 1000 + ACCESS_TOKEN_EXPIRY_HOURS * 60 * 60
  );
  const payload: TokenPayload = {
    userId,
    agentUserId,
    type: "access",
    exp,
  };
  const payloadStr = JSON.stringify(payload);
  const encoded = btoa(payloadStr)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  const signature = await signPayload(payloadStr);
  return `${encoded}.${signature}`;
}

/**
 * Generate a refresh token.
 */
export async function generateRefreshToken(
  userId: string,
  agentUserId: string
): Promise<string> {
  // Refresh tokens don't expire (but can be revoked by unlinking)
  const exp = Math.floor(Date.now() / 1000 + 365 * 24 * 60 * 60);
  const payload: TokenPayload = {
    userId,
    agentUserId,
    type: "refresh",
    exp,
  };
  const payloadStr = JSON.stringify(payload);
  const encoded = btoa(payloadStr)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  const signature = await signPayload(payloadStr);
  return `${encoded}.${signature}`;
}

/**
 * Validate an access or refresh token.
 * Returns the token payload if valid, null otherwise.
 */
export async function validateToken(
  token: string,
  expectedType: "access" | "refresh"
): Promise<TokenPayload | null> {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) {
      return null;
    }

    // Decode payload
    const payloadStr = atob(
      encoded.replace(/-/g, "+").replace(/_/g, "/") +
        "=".repeat((4 - (encoded.length % 4)) % 4)
    );

    // Verify signature
    const isValid = await verifySignature(payloadStr, signature);
    if (!isValid) {
      console.error("Token signature invalid");
      return null;
    }

    const payload = JSON.parse(payloadStr) as TokenPayload;

    // Check token type
    if (payload.type !== expectedType) {
      console.error(`Expected ${expectedType} token, got ${payload.type}`);
      return null;
    }

    // Check expiry
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      console.error("Token expired");
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}

/**
 * Exchange an authorization code for tokens.
 */
export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string,
  clientId: string,
  clientSecret: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  agentUserId: string;
} | null> {
  // Validate client credentials
  if (clientId !== GOOGLE_HOME_CLIENT_ID) {
    console.error("Invalid client ID");
    return null;
  }
  if (clientSecret !== GOOGLE_HOME_CLIENT_SECRET) {
    console.error("Invalid client secret");
    return null;
  }

  // Validate authorization code
  const result = await validateAuthCode(code, redirectUri);
  if (!result) {
    return null;
  }

  const { userId } = result;

  // Generate a stable agent user ID for this user
  const agentUserId = `plangrove-${userId}`;

  // Generate tokens
  const accessToken = await generateAccessToken(userId, agentUserId);
  const refreshToken = await generateRefreshToken(userId, agentUserId);
  const expiresIn = ACCESS_TOKEN_EXPIRY_HOURS * 60 * 60;
  const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  // Store or update the link in database
  const supabase = await createClient();
  const { error } = await supabase.from("google_home_links").upsert(
    {
      user_id: userId,
      agent_user_id: agentUserId,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires_at: tokenExpiresAt,
      linked_groves: [], // Will be updated when user selects groves
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Failed to store tokens:", error);
    return null;
  }

  return { accessToken, refreshToken, expiresIn, agentUserId };
}

/**
 * Refresh an access token using a refresh token.
 */
export async function refreshAccessToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<{
  accessToken: string;
  expiresIn: number;
} | null> {
  // Validate client credentials
  if (clientId !== GOOGLE_HOME_CLIENT_ID) {
    console.error("Invalid client ID");
    return null;
  }
  if (clientSecret !== GOOGLE_HOME_CLIENT_SECRET) {
    console.error("Invalid client secret");
    return null;
  }

  // Validate refresh token
  const payload = await validateToken(refreshToken, "refresh");
  if (!payload) {
    return null;
  }

  // Check that the link still exists in database
  const supabase = await createClient();
  const { data: link, error } = await supabase
    .from("google_home_links")
    .select("*")
    .eq("user_id", payload.userId)
    .single<GoogleHomeLink>();

  if (error || !link) {
    console.error("User has been unlinked");
    return null;
  }

  // Generate new access token
  const accessToken = await generateAccessToken(
    payload.userId,
    payload.agentUserId
  );
  const expiresIn = ACCESS_TOKEN_EXPIRY_HOURS * 60 * 60;
  const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  // Update stored access token
  await supabase
    .from("google_home_links")
    .update({
      access_token: accessToken,
      token_expires_at: tokenExpiresAt,
    })
    .eq("user_id", payload.userId);

  return { accessToken, expiresIn };
}

/**
 * Validate an access token from the Authorization header.
 * Used by the fulfillment endpoint to authenticate requests.
 */
export async function validateAccessTokenFromHeader(
  authHeader: string | null
): Promise<{ userId: string; agentUserId: string; link: GoogleHomeLink } | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Missing or invalid Authorization header");
    return null;
  }

  const token = authHeader.slice(7);
  const payload = await validateToken(token, "access");
  if (!payload) {
    return null;
  }

  // Verify link still exists
  const supabase = await createClient();
  const { data: link, error } = await supabase
    .from("google_home_links")
    .select("*")
    .eq("user_id", payload.userId)
    .single<GoogleHomeLink>();

  if (error || !link) {
    console.error("User link not found");
    return null;
  }

  return {
    userId: payload.userId,
    agentUserId: payload.agentUserId,
    link,
  };
}

/**
 * Validate OAuth redirect URI.
 */
export function isValidRedirectUri(redirectUri: string): boolean {
  return GOOGLE_OAUTH_REDIRECT_PATTERN.test(redirectUri);
}

/**
 * Validate client ID.
 */
export function isValidClientId(clientId: string): boolean {
  return clientId === GOOGLE_HOME_CLIENT_ID;
}

/**
 * Unlink a user's Google Home account.
 */
export async function unlinkGoogleHome(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("google_home_links")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to unlink Google Home:", error);
    return false;
  }

  return true;
}

/**
 * Get a user's Google Home link.
 */
export async function getGoogleHomeLink(
  userId: string
): Promise<GoogleHomeLink | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("google_home_links")
    .select("*")
    .eq("user_id", userId)
    .single<GoogleHomeLink>();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Update linked groves for a user.
 */
export async function updateLinkedGroves(
  userId: string,
  groveIds: string[]
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("google_home_links")
    .update({ linked_groves: groveIds })
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to update linked groves:", error);
    return false;
  }

  return true;
}
