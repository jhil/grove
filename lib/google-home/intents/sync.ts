/**
 * SYNC Intent Handler
 *
 * Returns the list of devices (plants) that the user has linked to Google Home.
 * This is called when the user first links their account or requests a device sync.
 */

import { createClient } from "@/lib/supabase/server";
import type { GoogleHomeLink, Grove, Plant } from "@/types/supabase";
import type { SyncResponse, GoogleDevice } from "../types";
import { plantToDevice } from "../devices";

export async function handleSync(
  requestId: string,
  link: GoogleHomeLink
): Promise<SyncResponse> {
  const supabase = await createClient();

  // If no groves are linked, return empty device list
  if (!link.linked_groves || link.linked_groves.length === 0) {
    return {
      requestId,
      payload: {
        agentUserId: link.agent_user_id,
        devices: [],
      },
    };
  }

  // Fetch all linked groves
  const { data: groves, error: grovesError } = await supabase
    .from("groves")
    .select("*")
    .in("id", link.linked_groves)
    .returns<Grove[]>();

  if (grovesError) {
    console.error("Failed to fetch groves:", grovesError);
    return {
      requestId,
      payload: {
        agentUserId: link.agent_user_id,
        devices: [],
        errorCode: "transientError",
        debugString: "Failed to fetch groves",
      },
    };
  }

  if (!groves || groves.length === 0) {
    return {
      requestId,
      payload: {
        agentUserId: link.agent_user_id,
        devices: [],
      },
    };
  }

  // Fetch all plants from linked groves
  const { data: plants, error: plantsError } = await supabase
    .from("plants")
    .select("*")
    .in("grove_id", link.linked_groves)
    .returns<Plant[]>();

  if (plantsError) {
    console.error("Failed to fetch plants:", plantsError);
    return {
      requestId,
      payload: {
        agentUserId: link.agent_user_id,
        devices: [],
        errorCode: "transientError",
        debugString: "Failed to fetch plants",
      },
    };
  }

  if (!plants || plants.length === 0) {
    return {
      requestId,
      payload: {
        agentUserId: link.agent_user_id,
        devices: [],
      },
    };
  }

  // Create a map of grove IDs to groves for quick lookup
  const groveMap = new Map(groves.map((grove) => [grove.id, grove]));

  // Convert plants to Google Home devices
  const devices: GoogleDevice[] = plants
    .map((plant) => {
      const grove = groveMap.get(plant.grove_id);
      if (!grove) {
        console.warn(`Grove not found for plant ${plant.id}`);
        return null;
      }
      return plantToDevice(plant, grove);
    })
    .filter((device): device is GoogleDevice => device !== null);

  return {
    requestId,
    payload: {
      agentUserId: link.agent_user_id,
      devices,
    },
  };
}
