"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Cloud, Sun, CloudRain, Snowflake, CloudFog, Wind, Droplets } from "lucide-react";

/**
 * Minimal weather widget for groves.
 * Uses Open-Meteo API (free, no API key required).
 */

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  description: string;
}

interface WeatherWidgetProps {
  location?: string; // City, ST format
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
  cloudy: <Cloud className="w-5 h-5 text-sage-400" />,
  rain: <CloudRain className="w-5 h-5 text-water-500" />,
  snow: <Snowflake className="w-5 h-5 text-water-400" />,
  fog: <CloudFog className="w-5 h-5 text-sage-300" />,
  storm: <Wind className="w-5 h-5 text-sage-500" />,
};

// Default coordinates for demo (San Francisco)
const DEFAULT_LAT = 37.7749;
const DEFAULT_LNG = -122.4194;

export function WeatherWidget({ location, className }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);

        // Use default coordinates for now
        // In production, you'd geocode the location string
        const lat = DEFAULT_LAT;
        const lng = DEFAULT_LNG;

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=fahrenheit`
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

  if (loading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-14 bg-sage-50 rounded-xl" />
      </div>
    );
  }

  if (error || !weather) {
    return null; // Fail silently - weather is optional
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 bg-cream-100 rounded-xl",
        className
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
      </div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Droplets className="w-3.5 h-3.5" />
        {weather.humidity}%
      </div>
    </div>
  );
}

/**
 * Compact weather indicator.
 */
export function WeatherIndicator() {
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(
    null
  );

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${DEFAULT_LAT}&longitude=${DEFAULT_LNG}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`
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
