/**
 * Request Sync functionality for Google Home.
 *
 * Notifies Google Home when device list changes (plants added/removed/renamed)
 * so that users see updated devices in the Google Home app.
 *
 * Requires a Google Cloud service account with the HomeGraph API scope.
 * See docs/GOOGLE_HOME.md for setup instructions.
 */

import { createClient } from "@/lib/supabase/server";
import type { GoogleHomeLink } from "@/types/supabase";
import { logFulfillment } from "./logging";

// Service account credentials from environment
const GOOGLE_SERVICE_ACCOUNT = process.env.GOOGLE_HOME_SERVICE_ACCOUNT;

// HomeGraph API endpoint
const HOMEGRAPH_ENDPOINT =
  "https://homegraph.googleapis.com/v1/devices:requestSync";

// OAuth token endpoint
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

// HomeGraph scope
const HOMEGRAPH_SCOPE = "https://www.googleapis.com/auth/homegraph";

interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
}

/**
 * Check if Request Sync is configured.
 */
export function isRequestSyncConfigured(): boolean {
  return !!GOOGLE_SERVICE_ACCOUNT;
}

/**
 * Parse service account credentials from environment.
 */
function getServiceAccountCredentials(): ServiceAccountCredentials | null {
  if (!GOOGLE_SERVICE_ACCOUNT) {
    return null;
  }

  try {
    return JSON.parse(GOOGLE_SERVICE_ACCOUNT) as ServiceAccountCredentials;
  } catch (error) {
    logFulfillment("error", "Failed to parse service account credentials", {
      error: String(error),
    });
    return null;
  }
}

/**
 * Create a JWT for service account authentication.
 */
async function createServiceAccountJwt(
  credentials: ServiceAccountCredentials
): Promise<string> {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    sub: credentials.client_email,
    aud: GOOGLE_TOKEN_ENDPOINT,
    iat: now,
    exp: now + 3600, // 1 hour
    scope: HOMEGRAPH_SCOPE,
  };

  // Encode header and payload
  const encodedHeader = btoa(JSON.stringify(header))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // Import the private key and sign
  const privateKey = credentials.private_key.replace(/\\n/g, "\n");
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToBinary(privateKey),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signatureInput)
  );

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${signatureInput}.${encodedSignature}`;
}

/**
 * Convert PEM to binary for crypto.subtle.
 */
function pemToBinary(pem: string): ArrayBuffer {
  const lines = pem.split("\n");
  const base64 = lines
    .filter((line) => !line.startsWith("-----"))
    .join("");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Get an access token using the service account JWT.
 */
async function getAccessToken(
  credentials: ServiceAccountCredentials
): Promise<string | null> {
  try {
    const jwt = await createServiceAccountJwt(credentials);

    const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      logFulfillment("error", "Failed to get access token", { error });
      return null;
    }

    const data = (await response.json()) as { access_token: string };
    return data.access_token;
  } catch (error) {
    logFulfillment("error", "Error getting access token", {
      error: String(error),
    });
    return null;
  }
}

/**
 * Request a SYNC for a specific user.
 */
export async function requestSync(agentUserId: string): Promise<boolean> {
  const credentials = getServiceAccountCredentials();
  if (!credentials) {
    logFulfillment("warn", "Request Sync skipped - not configured", {
      agentUserId,
    });
    return false;
  }

  const accessToken = await getAccessToken(credentials);
  if (!accessToken) {
    return false;
  }

  try {
    const response = await fetch(HOMEGRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentUserId,
        async: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      logFulfillment("error", "Request Sync failed", {
        agentUserId,
        status: response.status,
        error,
      });
      return false;
    }

    logFulfillment("info", "Request Sync succeeded", { agentUserId });
    return true;
  } catch (error) {
    logFulfillment("error", "Request Sync error", {
      agentUserId,
      error: String(error),
    });
    return false;
  }
}

/**
 * Request a SYNC for a user by their Plangrove user ID.
 * Looks up their Google Home link to get the agentUserId.
 */
export async function requestSyncForUser(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: link, error } = await supabase
    .from("google_home_links")
    .select("agent_user_id")
    .eq("user_id", userId)
    .single<Pick<GoogleHomeLink, "agent_user_id">>();

  if (error || !link) {
    // User not linked to Google Home - not an error
    logFulfillment("debug", "Request Sync skipped - user not linked", {
      userId,
    });
    return false;
  }

  return requestSync(link.agent_user_id);
}

/**
 * Request a SYNC for all users linked to a specific grove.
 * Used when a plant in the grove is added/removed/renamed.
 */
export async function requestSyncForGrove(groveId: string): Promise<void> {
  if (!isRequestSyncConfigured()) {
    logFulfillment("debug", "Request Sync skipped - not configured", {
      groveId,
    });
    return;
  }

  const supabase = await createClient();

  // Find all users who have this grove linked
  const { data: links, error } = await supabase
    .from("google_home_links")
    .select("agent_user_id, linked_groves")
    .contains("linked_groves", [groveId]);

  if (error) {
    logFulfillment("error", "Failed to find linked users for grove", {
      groveId,
      error: error.message,
    });
    return;
  }

  if (!links || links.length === 0) {
    logFulfillment("debug", "No users have this grove linked", { groveId });
    return;
  }

  // Request sync for each linked user
  logFulfillment("info", "Requesting sync for grove users", {
    groveId,
    userCount: links.length,
  });

  await Promise.all(
    links.map((link) =>
      requestSync(link.agent_user_id).catch((error) => {
        logFulfillment("error", "Failed to sync user", {
          agentUserId: link.agent_user_id,
          error: String(error),
        });
      })
    )
  );
}
