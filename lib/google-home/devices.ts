/**
 * Device conversion utilities for Google Smart Home.
 *
 * Converts Plangrove plants to Google Smart Home device format.
 */

import type { Plant, Grove } from "@/types/supabase";
import type { GoogleDevice, DeviceState } from "./types";
import { getWateringStatus, daysUntilWatering } from "@/lib/utils/dates";
import {
  GOOGLE_DEVICE_TYPE,
  GOOGLE_TRAITS,
  DEVICE_MANUFACTURER,
  DEVICE_MODEL,
  DEVICE_SW_VERSION,
} from "./constants";

/**
 * Generate a Google Home device ID from a plant ID.
 */
export function plantIdToDeviceId(plantId: string): string {
  return `plant-${plantId}`;
}

/**
 * Extract plant ID from a Google Home device ID.
 */
export function deviceIdToPlantId(deviceId: string): string | null {
  if (!deviceId.startsWith("plant-")) {
    return null;
  }
  return deviceId.slice(6);
}

/**
 * Convert a Plangrove plant to a Google Smart Home device.
 */
export function plantToDevice(plant: Plant, grove: Grove): GoogleDevice {
  // Generate nicknames from plant name
  const nicknames: string[] = [];
  const nameParts = plant.name.split(" ");
  if (nameParts.length > 1) {
    // Add first word as nickname (e.g., "Fern" from "Fern Fred")
    nicknames.push(nameParts[0]);
    // Add last word as nickname (e.g., "Fred" from "Fern Fred")
    nicknames.push(nameParts[nameParts.length - 1]);
  }

  return {
    id: plantIdToDeviceId(plant.id),
    type: GOOGLE_DEVICE_TYPE,
    traits: [...GOOGLE_TRAITS],
    name: {
      name: plant.name,
      nicknames: nicknames.length > 0 ? nicknames : undefined,
    },
    willReportState: false,
    roomHint: plant.location || grove.location || grove.name,
    deviceInfo: {
      manufacturer: DEVICE_MANUFACTURER,
      model: DEVICE_MODEL,
      swVersion: DEVICE_SW_VERSION,
    },
    attributes: {
      pausable: false,
    },
    customData: {
      plantId: plant.id,
      groveId: plant.grove_id,
    },
  };
}

/**
 * Get the current state of a plant as a Google Home device state.
 */
export function getPlantDeviceState(plant: Plant): DeviceState {
  const status = getWateringStatus(plant.last_watered, plant.watering_interval);
  const daysRemaining = daysUntilWatering(
    plant.last_watered,
    plant.watering_interval
  );

  // Map watering status to device state
  // isRunning is false (not currently being watered)
  // We use currentRunCycle to convey the watering status message
  let statusMessage: string;
  switch (status) {
    case "overdue":
      statusMessage =
        daysRemaining < -1
          ? `${Math.abs(daysRemaining)} days overdue for watering`
          : "1 day overdue for watering";
      break;
    case "due-today":
      statusMessage = "Needs watering today";
      break;
    case "upcoming":
      statusMessage = "Needs watering tomorrow";
      break;
    case "healthy":
    default:
      statusMessage =
        daysRemaining > 1
          ? `Next watering in ${daysRemaining} days`
          : "Recently watered";
      break;
  }

  return {
    online: true,
    status: "SUCCESS",
    isRunning: false,
    isPaused: false,
    currentRunCycle: [
      {
        currentCycle: statusMessage,
        lang: "en",
      },
    ],
    currentTotalRemainingTime: 0,
    currentCycleRemainingTime: 0,
  };
}

/**
 * Get an offline device state.
 */
export function getOfflineDeviceState(): DeviceState {
  return {
    online: false,
    status: "OFFLINE",
  };
}

/**
 * Get an error device state.
 */
export function getErrorDeviceState(errorCode: string): DeviceState {
  return {
    online: true,
    status: "ERROR",
    errorCode,
  };
}

/**
 * Get device state after watering (for EXECUTE response).
 */
export function getWateredDeviceState(): DeviceState {
  return {
    online: true,
    status: "SUCCESS",
    isRunning: false,
    isPaused: false,
    currentRunCycle: [
      {
        currentCycle: "Just watered",
        lang: "en",
      },
    ],
    currentTotalRemainingTime: 0,
    currentCycleRemainingTime: 0,
  };
}
