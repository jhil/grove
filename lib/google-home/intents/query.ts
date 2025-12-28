/**
 * QUERY Intent Handler
 *
 * Returns the current state of requested devices (plants).
 * This is called when the user asks about their plants' status.
 */

import { createClient } from "@/lib/supabase/server";
import type { GoogleHomeLink, Plant } from "@/types/supabase";
import type { QueryRequest, QueryResponse, DeviceState } from "../types";
import {
  deviceIdToPlantId,
  getPlantDeviceState,
  getErrorDeviceState,
} from "../devices";

export async function handleQuery(
  requestId: string,
  request: QueryRequest,
  link: GoogleHomeLink
): Promise<QueryResponse> {
  const supabase = await createClient();

  // Extract device IDs from request
  const requestedDevices = request.inputs[0].payload.devices;

  // Build response object
  const deviceStates: Record<string, DeviceState> = {};

  // Extract plant IDs from device IDs
  const plantIds: string[] = [];
  const deviceIdToPlantIdMap = new Map<string, string>();

  for (const device of requestedDevices) {
    const plantId = deviceIdToPlantId(device.id);
    if (plantId) {
      plantIds.push(plantId);
      deviceIdToPlantIdMap.set(device.id, plantId);
    } else {
      // Invalid device ID
      deviceStates[device.id] = getErrorDeviceState("deviceNotFound");
    }
  }

  if (plantIds.length === 0) {
    return {
      requestId,
      payload: {
        devices: deviceStates,
      },
    };
  }

  // Fetch plants from database
  const { data: plants, error } = await supabase
    .from("plants")
    .select("*")
    .in("id", plantIds)
    .returns<Plant[]>();

  if (error) {
    console.error("Failed to fetch plants:", error);
    // Return error state for all devices
    for (const device of requestedDevices) {
      deviceStates[device.id] = getErrorDeviceState("transientError");
    }
    return {
      requestId,
      payload: {
        devices: deviceStates,
      },
    };
  }

  // Create a map of plant IDs to plants
  const plantMap = new Map(plants?.map((plant) => [plant.id, plant]) || []);

  // Build response for each device
  for (const device of requestedDevices) {
    const plantId = deviceIdToPlantIdMap.get(device.id);

    if (!plantId) {
      // Already handled above with deviceNotFound
      continue;
    }

    const plant = plantMap.get(plantId);

    if (!plant) {
      deviceStates[device.id] = getErrorDeviceState("deviceNotFound");
      continue;
    }

    // Check if plant's grove is linked
    if (!link.linked_groves.includes(plant.grove_id)) {
      deviceStates[device.id] = getErrorDeviceState("deviceNotFound");
      continue;
    }

    // Get plant state
    deviceStates[device.id] = getPlantDeviceState(plant);
  }

  return {
    requestId,
    payload: {
      devices: deviceStates,
    },
  };
}
