"use client";

import {
  getWateringRecommendation,
  isIntervalRecommended,
} from "@/lib/utils/watering-recommendations";
import { cn } from "@/lib/utils";
import { Info, CheckCircle, AlertTriangle } from "lucide-react";

/**
 * Watering recommendation display component.
 */
interface WateringRecommendationProps {
  plantType: string;
  currentInterval?: number;
  onIntervalChange?: (interval: number) => void;
  className?: string;
}

export function WateringRecommendation({
  plantType,
  currentInterval,
  onIntervalChange,
  className,
}: WateringRecommendationProps) {
  const recommendation = getWateringRecommendation(plantType);
  const check = currentInterval
    ? isIntervalRecommended(plantType, currentInterval)
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
