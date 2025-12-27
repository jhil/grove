"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWaterPlant } from "@/hooks/use-plants";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Droplets, Check } from "lucide-react";
import type { WateringStatus } from "@/lib/utils/dates";

/**
 * Water button with visual feedback and optimistic updates.
 * Shows different states based on watering urgency.
 */
interface WaterButtonProps {
  plantId: string;
  plantName: string;
  status: WateringStatus;
  onWatered?: () => void;
}

export function WaterButton({
  plantId,
  plantName,
  status,
  onWatered,
}: WaterButtonProps) {
  const { showToast } = useToast();
  const waterPlant = useWaterPlant();

  const [justWatered, setJustWatered] = useState(false);

  const handleWater = async () => {
    try {
      await waterPlant.mutateAsync(plantId);
      setJustWatered(true);
      showToast(`${plantName} watered!`, "success");
      onWatered?.();

      // Reset the "just watered" state after animation
      setTimeout(() => setJustWatered(false), 2000);
    } catch (error) {
      console.error("Failed to water plant:", error);
      showToast("Failed to water plant", "error");
    }
  };

  // Determine button variant based on status
  const getVariant = (): "water" | "primary" | "secondary" => {
    if (justWatered) return "secondary";
    if (status === "overdue" || status === "due-today") return "water";
    return "secondary";
  };

  return (
    <Button
      variant={getVariant()}
      className={cn(
        "w-full gap-2",
        justWatered && "bg-sage-100 text-sage-700",
        // Pulse animation for urgent plants
        (status === "overdue" || status === "due-today") &&
          !justWatered &&
          "animate-pulse-subtle"
      )}
      onClick={handleWater}
      disabled={waterPlant.isPending || justWatered}
    >
      {justWatered ? (
        <>
          <Check className="w-4 h-4" />
          Watered!
        </>
      ) : waterPlant.isPending ? (
        <>
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          Watering...
        </>
      ) : (
        <>
          <Droplets className="w-4 h-4" />
          Water Now
        </>
      )}
    </Button>
  );
}
