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
 * Generate smart nicknames for voice recognition.
 * Creates variations that users might naturally say.
 */
function generateNicknames(plantName: string, plantType: string): string[] {
  const nicknames: string[] = [];
  const nameParts = plantName.toLowerCase().split(" ");
  const typeParts = plantType.toLowerCase().split(" ");

  // Add each word from the plant name as a nickname
  for (const part of nameParts) {
    if (part.length > 2 && !nicknames.includes(part)) {
      nicknames.push(part);
    }
  }

  // Add plant type variations (e.g., "fern", "snake plant")
  if (!nicknames.includes(plantType.toLowerCase())) {
    nicknames.push(plantType.toLowerCase());
  }

  // Add "my [type]" variation for single plants of a type
  nicknames.push(`my ${plantType.toLowerCase()}`);

  // Add "the [name]" variation
  if (nameParts.length === 1) {
    nicknames.push(`the ${nameParts[0]}`);
  }

  // Common variations: remove common suffixes/prefixes
  const commonWords = ["plant", "tree", "the", "my", "a"];
  for (const part of typeParts) {
    if (!commonWords.includes(part) && part.length > 2 && !nicknames.includes(part)) {
      nicknames.push(part);
    }
  }

  // Limit to 10 nicknames (Google's limit)
  return nicknames.slice(0, 10);
}

/**
 * Convert a Plangrove plant to a Google Smart Home device.
 */
export function plantToDevice(plant: Plant, grove: Grove): GoogleDevice {
  const nicknames = generateNicknames(plant.name, plant.type);

  // Create a descriptive default name that works well with voice
  const defaultName = plant.name;

  return {
    id: plantIdToDeviceId(plant.id),
    type: GOOGLE_DEVICE_TYPE,
    traits: [...GOOGLE_TRAITS],
    name: {
      name: defaultName,
      defaultNames: [`${plant.type} plant`, plant.type],
      nicknames: nicknames.length > 0 ? nicknames : undefined,
    },
    willReportState: false,
    roomHint: plant.location || grove.location || grove.name,
    deviceInfo: {
      manufacturer: DEVICE_MANUFACTURER,
      model: plant.type, // Use plant type as model
      swVersion: DEVICE_SW_VERSION,
    },
    attributes: {
      pausable: false,
    },
    customData: {
      plantId: plant.id,
      groveId: plant.grove_id,
      plantType: plant.type,
      groveName: grove.name,
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
