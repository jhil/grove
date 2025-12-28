"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Cloud, Sun, CloudRain, Snowflake, CloudFog, Wind, Droplets, MapPin, Settings, Check, Loader2 } from "lucide-react";
import { geocodeLocation, formatLocation, DEFAULT_LOCATION, type GeocodingResult } from "@/lib/utils/geocoding";

/**
 * Minimal weather widget for groves.
 * Uses Open-Meteo API (free, no API key required).
 * Supports user-specified location via Nominatim geocoding.
 */

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  description: string;
}

interface WeatherWidgetProps {
  className?: string;
}

// Weather code to condition mapping (Open-Meteo WMO codes)
const weatherConditions: Record<number, { condition: string; description: string }> = {
  0: { condition: "clear", description: "Clear sky" },
  1: { condition: "clear", description: "Mainly clear" },
  2: { condition: "cloudy", description: "Partly cloudy" },
  3: { condition: "cloudy", description: "Overcast" },
  45: { condition: "fog", description: "Fog" },
  48: { condition: "fog", description: "Depositing rime fog" },
  51: { condition: "rain", description: "Light drizzle" },
  53: { condition: "rain", description: "Moderate drizzle" },
  55: { condition: "rain", description: "Dense drizzle" },
  61: { condition: "rain", description: "Slight rain" },
  63: { condition: "rain", description: "Moderate rain" },
  65: { condition: "rain", description: "Heavy rain" },
  71: { condition: "snow", description: "Slight snow" },
  73: { condition: "snow", description: "Moderate snow" },
  75: { condition: "snow", description: "Heavy snow" },
  80: { condition: "rain", description: "Rain showers" },
  81: { condition: "rain", description: "Moderate showers" },
  82: { condition: "rain", description: "Violent showers" },
  95: { condition: "storm", description: "Thunderstorm" },
};

const weatherIcons: Record<string, React.ReactNode> = {
  clear: <Sun className="w-5 h-5 text-terracotta-400" />,
  cloudy: <Cloud className="w-5 h-5 text-terracotta-400" />,
  rain: <CloudRain className="w-5 h-5 text-water-500" />,
  snow: <Snowflake className="w-5 h-5 text-water-400" />,
  fog: <CloudFog className="w-5 h-5 text-terracotta-300" />,
  storm: <Wind className="w-5 h-5 text-terracotta-500" />,
};

// Local storage key for weather location
const WEATHER_LOCATION_KEY = "plangrove-weather-location";

function getStoredLocation(): GeocodingResult | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(WEATHER_LOCATION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function storeLocation(location: GeocodingResult | null) {
  if (typeof window === "undefined") return;
  try {
    if (location) {
      localStorage.setItem(WEATHER_LOCATION_KEY, JSON.stringify(location));
    } else {
      localStorage.removeItem(WEATHER_LOCATION_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function WeatherWidget({ className }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<GeocodingResult | null>(null);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  // Load stored location on mount
  useEffect(() => {
    const stored = getStoredLocation();
    setLocation(stored);
  }, []);

  // Fetch weather when location changes
  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);

        const coords = location || DEFAULT_LOCATION;

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=fahrenheit`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather");
        }

        const data = await response.json();
        const weatherCode = data.current.weather_code;
        const condition = weatherConditions[weatherCode] || {
          condition: "clear",
          description: "Unknown",
        };

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          condition: condition.condition,
          humidity: data.current.relative_humidity_2m,
          description: condition.description,
        });
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Unable to load weather");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [location]);

  // Handle location search
  const handleLocationSearch = useCallback(async () => {
    if (!locationQuery.trim()) return;

    setGeocoding(true);
    setGeocodeError(null);

    try {
      const result = await geocodeLocation(locationQuery);
      if (result) {
        setLocation(result);
        storeLocation(result);
        setShowLocationInput(false);
        setLocationQuery("");
      } else {
        setGeocodeError("Location not found. Try adding state/country.");
      }
    } catch {
      setGeocodeError("Failed to find location. Please try again.");
    } finally {
      setGeocoding(false);
    }
  }, [locationQuery]);

  // Handle enter key in location input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLocationSearch();
    } else if (e.key === "Escape") {
      setShowLocationInput(false);
      setLocationQuery("");
      setGeocodeError(null);
    }
  };

  const displayLocation = location ? formatLocation(location) : "San Francisco, CA";

  if (loading && !weather) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-14 bg-terracotta-50 rounded-xl" />
      </div>
    );
  }

  if (error || !weather) {
    return null; // Fail silently - weather is optional
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 bg-cream-100 rounded-xl"
        )}
      >
        {weatherIcons[weather.condition] || weatherIcons.clear}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-foreground">
              {weather.temperature}°F
            </span>
            <span className="text-sm text-muted-foreground truncate">
              {weather.description}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowLocationInput(!showLocationInput)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <MapPin className="w-3 h-3" />
            {displayLocation}
            <Settings className="w-3 h-3 ml-1" />
          </button>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Droplets className="w-3.5 h-3.5" />
          {weather.humidity}%
        </div>
      </div>

      {/* Location Input */}
      {showLocationInput && (
        <div className="px-4 py-3 bg-cream-50 rounded-xl border border-border/50 space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Set your location
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="City, State or City, Country"
              className={cn(
                "flex-1 h-9 px-3 rounded-lg",
                "bg-white text-foreground",
                "border border-border",
                "text-sm placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              )}
              autoFocus
            />
            <button
              type="button"
              onClick={handleLocationSearch}
              disabled={geocoding || !locationQuery.trim()}
              className={cn(
                "h-9 px-3 rounded-lg",
                "bg-terracotta-500 text-white",
                "text-sm font-medium",
                "hover:bg-terracotta-600 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center gap-1"
              )}
            >
              {geocoding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </button>
          </div>
          {geocodeError && (
            <p className="text-xs text-destructive">{geocodeError}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Examples: &quot;Portland, Oregon&quot; or &quot;London, UK&quot;
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Compact weather indicator.
 * Uses stored location preference.
 */
export function WeatherIndicator() {
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(
    null
  );

  useEffect(() => {
    async function fetchWeather() {
      try {
        const storedLocation = getStoredLocation();
        const coords = storedLocation || DEFAULT_LOCATION;

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`
        );
        const data = await response.json();
        const condition =
          weatherConditions[data.current.weather_code]?.condition || "clear";
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          condition,
        });
      } catch {
        // Fail silently
      }
    }

    fetchWeather();
  }, []);

  if (!weather) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      {weatherIcons[weather.condition]}
      <span>{weather.temp}°</span>
    </div>
  );
}
