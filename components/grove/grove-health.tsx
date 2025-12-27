"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  calculateGroveHealth,
  getHealthMessage,
  getPlantsNeedingWater,
  getRandomTip,
} from "@/lib/utils/plant-helpers";
import { useWaterPlant } from "@/hooks/use-plants";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Droplets, Sparkles, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";
import type { Plant } from "@/types/supabase";

/**
 * Grove health indicator with overall score.
 */
interface GroveHealthProps {
  plants: Plant[];
}

export function GroveHealth({ plants }: GroveHealthProps) {
  const health = calculateGroveHealth(plants);
  const { emoji, message, color } = getHealthMessage(health);

  return (
    <Card className="border-0 overflow-hidden">
      <CardContent
        className={cn(
          "p-6",
          health >= 90
            ? "bg-gradient-to-r from-sage-50 to-sage-100"
            : health >= 70
            ? "bg-gradient-to-r from-sage-50 to-cream-100"
            : health >= 50
            ? "bg-gradient-to-r from-water-400/10 to-cream-100"
            : "bg-gradient-to-r from-terracotta-400/10 to-cream-100"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">{emoji}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className={cn("font-medium", color)}>{message}</p>
              <span className="text-2xl font-bold text-foreground">{health}%</span>
            </div>
            <Progress value={health} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Quick water action for plants that need attention.
 */
interface QuickWaterProps {
  plants: Plant[];
  groveId: string;
}

export function QuickWater({ plants, groveId }: QuickWaterProps) {
  const { showToast } = useToast();
  const { user, profile } = useAuth();
  const waterPlant = useWaterPlant();

  const plantsNeedingWater = getPlantsNeedingWater(plants);

  if (plantsNeedingWater.length === 0) return null;

  const handleWaterAll = async () => {
    try {
      const userInfo = user && profile
        ? { userId: user.id, userName: profile.display_name || profile.email || "Someone" }
        : undefined;

      // Water all plants that need it
      await Promise.all(
        plantsNeedingWater.map((plant) =>
          waterPlant.mutateAsync({
            plantId: plant.id,
            groveId,
            userInfo,
          })
        )
      );
      showToast(
        `Watered ${plantsNeedingWater.length} plant${
          plantsNeedingWater.length !== 1 ? "s" : ""
        }!`,
        "success"
      );
    } catch (error) {
      console.error("Failed to water plants:", error);
      showToast("Failed to water some plants", "error");
    }
  };

  return (
    <Card variant="elevated" className="border-terracotta-300/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-terracotta-400/10 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-terracotta-500" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {plantsNeedingWater.length} plant
                {plantsNeedingWater.length !== 1 ? "s" : ""} need water
              </p>
              <p className="text-sm text-muted-foreground">
                {plantsNeedingWater
                  .slice(0, 2)
                  .map((p) => p.name)
                  .join(", ")}
                {plantsNeedingWater.length > 2 &&
                  ` +${plantsNeedingWater.length - 2} more`}
              </p>
            </div>
          </div>
          <Button
            variant="water"
            size="sm"
            onClick={handleWaterAll}
            disabled={waterPlant.isPending}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Water All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Daily plant care tip.
 */
export function PlantCareTip() {
  const [tip, setTip] = useState("");

  useEffect(() => {
    setTip(getRandomTip());
  }, []);

  if (!tip) return null;

  return (
    <div className="flex items-start gap-3 p-4 bg-cream-100 rounded-xl">
      <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
        <Lightbulb className="w-4 h-4 text-sage-500" />
      </div>
      <div>
        <p className="text-xs font-medium text-sage-500 uppercase tracking-wider mb-1">
          Plant Care Tip
        </p>
        <p className="text-sm text-muted-foreground">{tip}</p>
      </div>
    </div>
  );
}
