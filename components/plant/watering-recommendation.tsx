"use client";

import {
  getWateringRecommendation,
  isIntervalRecommended,
} from "@/lib/utils/watering-recommendations";
import { cn } from "@/lib/utils";
import { Info, CheckCircle, AlertTriangle, Droplets } from "lucide-react";
import type { PlantSpecies } from "@/lib/data/plants";

/**
 * Watering recommendation display component.
 * Uses plant database data when available for accurate recommendations.
 */
interface WateringRecommendationProps {
  plantType: string;
  selectedPlant?: PlantSpecies | null;
  currentInterval?: number;
  onIntervalChange?: (interval: number) => void;
  className?: string;
}

export function WateringRecommendation({
  plantType,
  selectedPlant,
  currentInterval,
  onIntervalChange,
  className,
}: WateringRecommendationProps) {
  // Use plant database data if available, otherwise fall back to generic recommendations
  const recommendation = selectedPlant
    ? {
        min: selectedPlant.wateringInterval.min,
        ideal: selectedPlant.wateringInterval.ideal,
        max: selectedPlant.wateringInterval.max,
        tips: getWateringTipsForPlant(selectedPlant),
      }
    : getWateringRecommendation(plantType);

  // Check if current interval is within recommended range
  const check = currentInterval
    ? selectedPlant
      ? {
          isRecommended:
            currentInterval >= selectedPlant.wateringInterval.min &&
            currentInterval <= selectedPlant.wateringInterval.max,
          suggestion:
            currentInterval < selectedPlant.wateringInterval.min
              ? `${selectedPlant.commonName} prefers less frequent watering. Try ${selectedPlant.wateringInterval.ideal} days.`
              : `${selectedPlant.commonName} may need more frequent watering. Try ${selectedPlant.wateringInterval.ideal} days.`,
        }
      : isIntervalRecommended(plantType, currentInterval)
    : null;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Recommendation Info */}
      <div className="flex items-start gap-2 text-sm">
        <Info className="w-4 h-4 text-water-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-muted-foreground">
            Recommended: every{" "}
            <button
              type="button"
              onClick={() => onIntervalChange?.(recommendation.ideal)}
              className="font-medium text-water-600 hover:underline"
            >
              {recommendation.ideal} days
            </button>{" "}
            <span className="text-muted-foreground/60">
              (range: {recommendation.min}-{recommendation.max} days)
            </span>
          </p>
        </div>
      </div>

      {/* Current interval feedback */}
      {check && (
        <div
          className={cn(
            "flex items-start gap-2 text-sm px-3 py-2 rounded-lg",
            check.isRecommended
              ? "bg-sage-50 text-sage-700"
              : "bg-terracotta-400/10 text-terracotta-600"
          )}
        >
          {check.isRecommended ? (
            <>
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Looks good! This is within the recommended range.</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{check.suggestion}</span>
            </>
          )}
        </div>
      )}

      {/* Quick tip */}
      {recommendation.tips[0] && (
        <p className="text-xs text-muted-foreground pl-6">
          Tip: {recommendation.tips[0]}
        </p>
      )}
    </div>
  );
}

/**
 * Compact tip display for plant cards.
 */
interface PlantCareTipProps {
  plantType: string;
}

export function PlantCareTip({ plantType }: PlantCareTipProps) {
  const recommendation = getWateringRecommendation(plantType);

  // Use the first tip for consistency (deterministic)
  const tip = recommendation.tips[0];

  return (
    <p className="text-xs text-muted-foreground italic">
      {tip}
    </p>
  );
}

/**
 * Generate watering tips based on plant database data.
 */
function getWateringTipsForPlant(plant: PlantSpecies): string[] {
  const tips: string[] = [];

  // Sunlight tip
  if (plant.sunlight === "low") {
    tips.push(`${plant.commonName} does well in low light conditions.`);
  } else if (plant.sunlight === "high") {
    tips.push(`${plant.commonName} needs bright, direct sunlight.`);
  } else {
    tips.push(`${plant.commonName} prefers indirect or filtered light.`);
  }

  // Humidity tip
  if (plant.humidity === "high") {
    tips.push("Mist regularly or use a humidity tray for best results.");
  } else if (plant.humidity === "low") {
    tips.push("Tolerates dry air well - perfect for heated/AC spaces.");
  }

  // Difficulty tip
  if (plant.difficulty === "easy") {
    tips.push("Great for beginners - very forgiving of occasional neglect.");
  } else if (plant.difficulty === "expert") {
    tips.push("Requires consistent care - best for experienced plant parents.");
  }

  // Category-specific tips
  if (plant.category === "succulent" || plant.category === "cactus") {
    tips.push("Let soil dry completely between waterings to prevent root rot.");
  } else if (plant.category === "fern") {
    tips.push("Keep soil consistently moist but never soggy.");
  } else if (plant.category === "tropical") {
    tips.push("Water when top inch of soil feels dry.");
  }

  return tips;
}
