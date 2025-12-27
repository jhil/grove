/**
 * Geocoding utility using Nominatim (OpenStreetMap).
 * Free, no API key required. Just respect the usage policy.
 *
 * Usage policy:
 * - Max 1 request per second
 * - Include reasonable User-Agent
 * - Cache results
 */

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
  city?: string;
  state?: string;
  country?: string;
}

/**
 * Geocode a location string (city, state, country) to coordinates.
 * Uses Nominatim (OpenStreetMap) - free, no API key.
 */
export async function geocodeLocation(query: string): Promise<GeocodingResult | null> {
  if (!query.trim()) return null;

  try {
    // Use URLSearchParams to properly encode the query
    const params = new URLSearchParams({
      q: query.trim(),
      format: "json",
      limit: "1",
      addressdetails: "1",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          // Be a good citizen - identify our app
          "User-Agent": "Plangrove/1.0 (plant care app)",
        },
      }
    );

    if (!response.ok) {
      console.error("Geocoding API error:", response.status);
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const result = data[0];
    const address = result.address || {};

    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
      city: address.city || address.town || address.village || address.municipality,
      state: address.state,
      country: address.country,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Format a GeocodingResult for display.
 */
export function formatLocation(result: GeocodingResult): string {
  const parts: string[] = [];

  if (result.city) parts.push(result.city);
  if (result.state) parts.push(result.state);
  if (!result.city && !result.state && result.country) {
    parts.push(result.country);
  }

  return parts.join(", ") || result.displayName.split(",")[0];
}

// Default location (San Francisco)
export const DEFAULT_LOCATION: GeocodingResult = {
  lat: 37.7749,
  lng: -122.4194,
  displayName: "San Francisco, California, USA",
  city: "San Francisco",
  state: "California",
  country: "United States",
};
