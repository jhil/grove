/**
 * DISCONNECT Intent Handler
 *
 * Handles unlinking of the user's Google Home account.
 * This is called when the user unlinks their Plangrove account from Google Home.
 */

import { unlinkGoogleHome } from "../oauth";
import type { DisconnectResponse } from "../types";

export async function handleDisconnect(
  requestId: string,
  userId: string
): Promise<DisconnectResponse> {
  // Delete the Google Home link from database
  const success = await unlinkGoogleHome(userId);

  if (!success) {
    console.error("Failed to unlink Google Home for user:", userId);
    // Still return success to Google - the user has requested unlinking
  }

  return {
    requestId,
    payload: {},
  };
}
