/**
 * Google Smart Home Fulfillment Webhook
 *
 * This endpoint handles all Smart Home intents from Google:
 * - SYNC: Returns list of devices (plants)
 * - QUERY: Returns current state of devices
 * - EXECUTE: Executes commands on devices (e.g., water plant)
 * - DISCONNECT: Handles account unlinking
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateAccessTokenFromHeader } from "@/lib/google-home/oauth";
import { INTENTS } from "@/lib/google-home/constants";
import type {
  SmartHomeRequest,
  QueryRequest,
  ExecuteRequest,
} from "@/lib/google-home/types";
import {
  handleSync,
  handleQuery,
  handleExecute,
  handleDisconnect,
} from "@/lib/google-home/intents";

export async function POST(request: NextRequest) {
  try {
    // Validate authorization
    const authHeader = request.headers.get("authorization");
    const authResult = await validateAccessTokenFromHeader(authHeader);

    if (!authResult) {
      return NextResponse.json(
        {
          requestId: "",
          payload: {
            errorCode: "authExpired",
            debugString: "Invalid or expired access token",
          },
        },
        { status: 401 }
      );
    }

    const { userId, link } = authResult;

    // Parse request body
    const body: SmartHomeRequest = await request.json();
    const { requestId, inputs } = body;

    if (!requestId || !inputs || inputs.length === 0) {
      return NextResponse.json(
        {
          requestId: requestId || "",
          payload: {
            errorCode: "protocolError",
            debugString: "Invalid request format",
          },
        },
        { status: 400 }
      );
    }

    const intent = inputs[0].intent;

    // Route to appropriate handler
    switch (intent) {
      case INTENTS.SYNC: {
        const response = await handleSync(requestId, link);
        return NextResponse.json(response);
      }

      case INTENTS.QUERY: {
        const response = await handleQuery(
          requestId,
          body as QueryRequest,
          link
        );
        return NextResponse.json(response);
      }

      case INTENTS.EXECUTE: {
        const response = await handleExecute(
          requestId,
          body as ExecuteRequest,
          link,
          userId
        );
        return NextResponse.json(response);
      }

      case INTENTS.DISCONNECT: {
        const response = await handleDisconnect(requestId, userId);
        return NextResponse.json(response);
      }

      default: {
        console.error(`Unknown intent: ${intent}`);
        return NextResponse.json(
          {
            requestId,
            payload: {
              errorCode: "notSupported",
              debugString: `Unknown intent: ${intent}`,
            },
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error("Fulfillment error:", error);
    return NextResponse.json(
      {
        requestId: "",
        payload: {
          errorCode: "unknownError",
          debugString: "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}
