/**
 * Tests for Google Home device conversion utilities.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  plantIdToDeviceId,
  deviceIdToPlantId,
  plantToDevice,
  getPlantDeviceState,
  getOfflineDeviceState,
  getErrorDeviceState,
  getWateredDeviceState,
} from "./devices";
import type { Plant, Grove } from "@/types/supabase";

// Mock the date utilities
vi.mock("@/lib/utils/dates", () => ({
  getWateringStatus: vi.fn(),
  daysUntilWatering: vi.fn(),
}));

import { getWateringStatus, daysUntilWatering } from "@/lib/utils/dates";

const mockGetWateringStatus = vi.mocked(getWateringStatus);
const mockDaysUntilWatering = vi.mocked(daysUntilWatering);

describe("plantIdToDeviceId", () => {
  it("should prefix plant ID with 'plant-'", () => {
    expect(plantIdToDeviceId("abc123")).toBe("plant-abc123");
  });

  it("should handle UUID-style IDs", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    expect(plantIdToDeviceId(uuid)).toBe(`plant-${uuid}`);
  });
});

describe("deviceIdToPlantId", () => {
  it("should extract plant ID from device ID", () => {
    expect(deviceIdToPlantId("plant-abc123")).toBe("abc123");
  });

  it("should handle UUID-style IDs", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    expect(deviceIdToPlantId(`plant-${uuid}`)).toBe(uuid);
  });

  it("should return null for invalid device IDs", () => {
    expect(deviceIdToPlantId("invalid-abc123")).toBeNull();
    expect(deviceIdToPlantId("abc123")).toBeNull();
    expect(deviceIdToPlantId("")).toBeNull();
  });
});

describe("plantToDevice", () => {
  const mockPlant: Plant = {
    id: "plant-123",
    grove_id: "grove-456",
    name: "Fern Fred",
    type: "Boston Fern",
    location: "Living Room",
    watering_interval: 7,
    last_watered: new Date().toISOString(),
    notes: null,
    photo_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockGrove: Grove = {
    id: "grove-456",
    name: "Home Plants",
    slug: "home-plants",
    owner_id: "user-789",
    location: "Main House",
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it("should convert plant to Google device format", () => {
    const device = plantToDevice(mockPlant, mockGrove);

    expect(device.id).toBe("plant-plant-123");
    expect(device.type).toBe("action.devices.types.SPRINKLER");
    expect(device.traits).toContain("action.devices.traits.StartStop");
    expect(device.name.name).toBe("Fern Fred");
    expect(device.willReportState).toBe(false);
  });

  it("should include default names based on plant type", () => {
    const device = plantToDevice(mockPlant, mockGrove);

    expect(device.name.defaultNames).toContain("Boston Fern plant");
    expect(device.name.defaultNames).toContain("Boston Fern");
  });

  it("should generate nicknames for voice recognition", () => {
    const device = plantToDevice(mockPlant, mockGrove);

    // Should include parts of the plant name
    expect(device.name.nicknames).toBeDefined();
    expect(device.name.nicknames).toContain("fern");
    expect(device.name.nicknames).toContain("fred");
    // Should include plant type
    expect(device.name.nicknames).toContain("boston fern");
    // Should include "my [type]" variation
    expect(device.name.nicknames).toContain("my boston fern");
  });

  it("should use plant location as room hint when available", () => {
    const device = plantToDevice(mockPlant, mockGrove);

    expect(device.roomHint).toBe("Living Room");
  });

  it("should fall back to grove location for room hint", () => {
    const plantWithoutLocation = { ...mockPlant, location: null };
    const device = plantToDevice(plantWithoutLocation, mockGrove);

    expect(device.roomHint).toBe("Main House");
  });

  it("should fall back to grove name for room hint", () => {
    const plantWithoutLocation = { ...mockPlant, location: null };
    const groveWithoutLocation = { ...mockGrove, location: null };
    const device = plantToDevice(plantWithoutLocation, groveWithoutLocation);

    expect(device.roomHint).toBe("Home Plants");
  });

  it("should include device info", () => {
    const device = plantToDevice(mockPlant, mockGrove);

    expect(device.deviceInfo).toBeDefined();
    expect(device.deviceInfo?.manufacturer).toBe("Plangrove");
    expect(device.deviceInfo?.model).toBe("Boston Fern");
    expect(device.deviceInfo?.swVersion).toBe("1.0.0");
  });

  it("should include custom data with IDs", () => {
    const device = plantToDevice(mockPlant, mockGrove);

    expect(device.customData).toBeDefined();
    expect(device.customData?.plantId).toBe("plant-123");
    expect(device.customData?.groveId).toBe("grove-456");
    expect(device.customData?.plantType).toBe("Boston Fern");
    expect(device.customData?.groveName).toBe("Home Plants");
  });

  it("should set pausable to false in attributes", () => {
    const device = plantToDevice(mockPlant, mockGrove);

    expect(device.attributes).toBeDefined();
    expect(device.attributes?.pausable).toBe(false);
  });
});

describe("getPlantDeviceState", () => {
  const mockPlant: Plant = {
    id: "plant-123",
    grove_id: "grove-456",
    name: "Test Plant",
    type: "Fern",
    location: null,
    watering_interval: 7,
    last_watered: new Date().toISOString(),
    notes: null,
    photo_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return healthy state with days remaining", () => {
    mockGetWateringStatus.mockReturnValue("healthy");
    mockDaysUntilWatering.mockReturnValue(5);

    const state = getPlantDeviceState(mockPlant);

    expect(state.online).toBe(true);
    expect(state.status).toBe("SUCCESS");
    expect(state.isRunning).toBe(false);
    expect(state.isPaused).toBe(false);
    expect(state.currentRunCycle?.[0].currentCycle).toBe(
      "Next watering in 5 days"
    );
  });

  it("should return recently watered state", () => {
    mockGetWateringStatus.mockReturnValue("healthy");
    mockDaysUntilWatering.mockReturnValue(1);

    const state = getPlantDeviceState(mockPlant);

    expect(state.currentRunCycle?.[0].currentCycle).toBe("Recently watered");
  });

  it("should return due today state", () => {
    mockGetWateringStatus.mockReturnValue("due-today");
    mockDaysUntilWatering.mockReturnValue(0);

    const state = getPlantDeviceState(mockPlant);

    expect(state.currentRunCycle?.[0].currentCycle).toBe(
      "Needs watering today"
    );
  });

  it("should return upcoming state", () => {
    mockGetWateringStatus.mockReturnValue("upcoming");
    mockDaysUntilWatering.mockReturnValue(1);

    const state = getPlantDeviceState(mockPlant);

    expect(state.currentRunCycle?.[0].currentCycle).toBe(
      "Needs watering tomorrow"
    );
  });

  it("should return overdue state with days count", () => {
    mockGetWateringStatus.mockReturnValue("overdue");
    mockDaysUntilWatering.mockReturnValue(-3);

    const state = getPlantDeviceState(mockPlant);

    expect(state.currentRunCycle?.[0].currentCycle).toBe(
      "3 days overdue for watering"
    );
  });

  it("should return singular day for 1 day overdue", () => {
    mockGetWateringStatus.mockReturnValue("overdue");
    mockDaysUntilWatering.mockReturnValue(-1);

    const state = getPlantDeviceState(mockPlant);

    expect(state.currentRunCycle?.[0].currentCycle).toBe(
      "1 day overdue for watering"
    );
  });

  it("should include English language tag", () => {
    mockGetWateringStatus.mockReturnValue("healthy");
    mockDaysUntilWatering.mockReturnValue(5);

    const state = getPlantDeviceState(mockPlant);

    expect(state.currentRunCycle?.[0].lang).toBe("en");
  });
});

describe("getOfflineDeviceState", () => {
  it("should return offline state", () => {
    const state = getOfflineDeviceState();

    expect(state.online).toBe(false);
    expect(state.status).toBe("OFFLINE");
  });
});

describe("getErrorDeviceState", () => {
  it("should return error state with error code", () => {
    const state = getErrorDeviceState("deviceNotFound");

    expect(state.online).toBe(true);
    expect(state.status).toBe("ERROR");
    expect(state.errorCode).toBe("deviceNotFound");
  });
});

describe("getWateredDeviceState", () => {
  it("should return watered state", () => {
    const state = getWateredDeviceState();

    expect(state.online).toBe(true);
    expect(state.status).toBe("SUCCESS");
    expect(state.isRunning).toBe(false);
    expect(state.isPaused).toBe(false);
    expect(state.currentRunCycle?.[0].currentCycle).toBe("Just watered");
    expect(state.currentRunCycle?.[0].lang).toBe("en");
  });
});
