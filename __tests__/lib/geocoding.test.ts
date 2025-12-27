import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  geocodeLocation,
  formatLocation,
  DEFAULT_LOCATION,
  type GeocodingResult,
} from "@/lib/utils/geocoding";

describe("Geocoding Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DEFAULT_LOCATION", () => {
    it("has San Francisco coordinates", () => {
      expect(DEFAULT_LOCATION.lat).toBeCloseTo(37.7749, 2);
      expect(DEFAULT_LOCATION.lng).toBeCloseTo(-122.4194, 2);
      expect(DEFAULT_LOCATION.city).toBe("San Francisco");
    });
  });

  describe("formatLocation", () => {
    it("formats city and state", () => {
      const location: GeocodingResult = {
        lat: 40.7128,
        lng: -74.006,
        displayName: "New York, NY, USA",
        city: "New York",
        state: "New York",
        country: "United States",
      };
      expect(formatLocation(location)).toBe("New York, New York");
    });

    it("formats city only when no state", () => {
      const location: GeocodingResult = {
        lat: 51.5074,
        lng: -0.1278,
        displayName: "London, UK",
        city: "London",
        country: "United Kingdom",
      };
      expect(formatLocation(location)).toBe("London");
    });

    it("formats country when no city or state", () => {
      const location: GeocodingResult = {
        lat: 0,
        lng: 0,
        displayName: "France",
        country: "France",
      };
      expect(formatLocation(location)).toBe("France");
    });

    it("falls back to displayName when nothing else available", () => {
      const location: GeocodingResult = {
        lat: 0,
        lng: 0,
        displayName: "Some Random Place, Earth",
      };
      expect(formatLocation(location)).toBe("Some Random Place");
    });
  });

  describe("geocodeLocation", () => {
    it("returns null for empty query", async () => {
      const result = await geocodeLocation("");
      expect(result).toBeNull();
    });

    it("returns null for whitespace-only query", async () => {
      const result = await geocodeLocation("   ");
      expect(result).toBeNull();
    });

    it("calls Nominatim API with correct URL", async () => {
      const mockResponse = [
        {
          lat: "40.7128",
          lon: "-74.006",
          display_name: "New York, NY, USA",
          address: {
            city: "New York",
            state: "New York",
            country: "United States",
          },
        },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await geocodeLocation("New York");

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const calledUrl = vi.mocked(global.fetch).mock.calls[0][0] as string;
      expect(calledUrl).toContain("nominatim.openstreetmap.org");
      expect(calledUrl).toContain("q=New+York");
    });

    it("parses successful response correctly", async () => {
      const mockResponse = [
        {
          lat: "40.7128",
          lon: "-74.006",
          display_name: "New York, NY, USA",
          address: {
            city: "New York",
            state: "New York",
            country: "United States",
          },
        },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await geocodeLocation("New York");

      expect(result).toBeDefined();
      expect(result?.lat).toBeCloseTo(40.7128, 2);
      expect(result?.lng).toBeCloseTo(-74.006, 2);
      expect(result?.city).toBe("New York");
      expect(result?.state).toBe("New York");
    });

    it("returns null when API returns empty array", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      const result = await geocodeLocation("xyznonexistent");
      expect(result).toBeNull();
    });

    it("returns null when API returns error", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const result = await geocodeLocation("New York");
      expect(result).toBeNull();
    });

    it("returns null when fetch throws", async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network error"));

      const result = await geocodeLocation("New York");
      expect(result).toBeNull();
    });
  });
});
