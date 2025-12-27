"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WaterButton } from "@/components/plant/water-button";
import { PlantForm } from "@/components/plant/plant-form";
import { useDeletePlant } from "@/hooks/use-plants";
import { useToast } from "@/components/ui/toast";
import {
  getWateringStatus,
  formatWateringStatus,
  formatLastWatered,
} from "@/lib/utils/dates";
import { getPlantType, WATERING_STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Pencil, Trash2, Droplets } from "lucide-react";
import type { Plant } from "@/types/supabase";

/**
 * Card component for displaying a plant with watering status.
 * Shows plant info, photo, watering status, and actions.
 */
interface PlantCardProps {
  plant: Plant;
  groveId: string;
  onWatered?: () => void;
  onEdited?: () => void;
  onDeleted?: () => void;
}

export function PlantCard({
  plant,
  groveId,
  onWatered,
  onEdited,
  onDeleted,
}: PlantCardProps) {
  const { showToast } = useToast();
  const deletePlant = useDeletePlant();

  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const plantType = getPlantType(plant.type);
  const status = getWateringStatus(plant.last_watered, plant.watering_interval);
  const statusColors = WATERING_STATUS_COLORS[status];
  const statusText = formatWateringStatus(plant.last_watered, plant.watering_interval);
  const lastWateredText = formatLastWatered(plant.last_watered);

  const handleDelete = async () => {
    if (!confirm(`Delete ${plant.name}? This cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePlant.mutateAsync({ id: plant.id, groveId });
      showToast(`${plant.name} deleted`, "success");
      onDeleted?.();
    } catch (error) {
      console.error("Failed to delete plant:", error);
      showToast("Failed to delete plant", "error");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card
        variant="interactive"
        className={cn(
          "relative overflow-hidden",
          status === "overdue" && "ring-2 ring-destructive/30",
          status === "due-today" && "ring-2 ring-warning/30"
        )}
      >
        {/* Plant Photo or Placeholder */}
        <div
          className={cn(
            "h-40 flex items-center justify-center",
            plant.photo ? "bg-cream-100" : "bg-gradient-to-br from-sage-50 to-sage-100"
          )}
        >
          {plant.photo ? (
            <img
              src={plant.photo}
              alt={plant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl">{plantType.emoji}</span>
          )}
        </div>

        {/* Status Badge */}
        <div
          className={cn(
            "absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium",
            statusColors.bg,
            statusColors.text
          )}
        >
          {statusText}
        </div>

        {/* Menu Button */}
        <div className="absolute top-3 left-3">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="h-8 w-8 bg-white/80 hover:bg-white backdrop-blur-sm"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute left-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lifted border border-border/50 py-1 min-w-[140px]">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowEdit(true);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-sage-50 flex items-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleDelete();
                    }}
                    disabled={isDeleting}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Plant Name and Type */}
          <div className="mb-3">
            <h3 className="font-semibold text-foreground truncate">
              {plant.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {plantType.label}
            </p>
          </div>

          {/* Last Watered */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
            <Droplets className="w-3.5 h-3.5" />
            Last watered: {lastWateredText}
          </div>

          {/* Water Button */}
          <WaterButton
            plantId={plant.id}
            plantName={plant.name}
            status={status}
            onWatered={onWatered}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <PlantForm
        groveId={groveId}
        plant={plant}
        open={showEdit}
        onOpenChange={setShowEdit}
        onSuccess={() => {
          setShowEdit(false);
          showToast(`${plant.name} updated!`, "success");
        }}
        onPlantUpdated={() => {
          onEdited?.();
        }}
      />
    </>
  );
}
