"use client";

import { PlantCard } from "@/components/plant/plant-card";
import { WaterButton } from "@/components/plant/water-button";
import { daysUntilWatering, getWateringStatus, formatLastWatered, formatWateringStatus } from "@/lib/utils/dates";
import { getPlantType, WATERING_STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Droplets, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useDeletePlant } from "@/hooks/use-plants";
import { useToast } from "@/components/ui/toast";
import { PlantForm } from "@/components/plant/plant-form";
import type { Plant } from "@/types/supabase";
import type { ViewMode } from "@/hooks/use-view-mode";
import type { SortOption } from "@/hooks/use-sort";

/**
 * Unified plant views component.
 * Renders plants in gallery, list, or compact mode.
 */
interface PlantViewsProps {
  plants: Plant[];
  groveId: string;
  viewMode: ViewMode;
  sortOption?: SortOption;
  onPlantWatered?: (plant: Plant) => void;
  onPlantEdited?: (plant: Plant) => void;
  onPlantDeleted?: (plant: Plant) => void;
}

export function PlantViews({
  plants,
  groveId,
  viewMode,
  sortOption = "urgency",
  onPlantWatered,
  onPlantEdited,
  onPlantDeleted,
}: PlantViewsProps) {
  // Sort plants based on selected option
  const sortedPlants = useMemo(() => {
    return [...plants].sort((a, b) => {
      switch (sortOption) {
        case "urgency":
          return daysUntilWatering(a.last_watered, a.watering_interval) -
                 daysUntilWatering(b.last_watered, b.watering_interval);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "recent":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });
  }, [plants, sortOption]);

  if (viewMode === "gallery") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPlants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            groveId={groveId}
            onWatered={() => onPlantWatered?.(plant)}
            onEdited={() => onPlantEdited?.(plant)}
            onDeleted={() => onPlantDeleted?.(plant)}
          />
        ))}
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {sortedPlants.map((plant) => (
          <PlantListItem
            key={plant.id}
            plant={plant}
            groveId={groveId}
            onWatered={() => onPlantWatered?.(plant)}
            onEdited={() => onPlantEdited?.(plant)}
            onDeleted={() => onPlantDeleted?.(plant)}
          />
        ))}
      </div>
    );
  }

  // Compact view
  return (
    <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden divide-y divide-cream-100">
      {sortedPlants.map((plant) => (
        <PlantCompactItem
          key={plant.id}
          plant={plant}
          groveId={groveId}
          onWatered={() => onPlantWatered?.(plant)}
          onEdited={() => onPlantEdited?.(plant)}
          onDeleted={() => onPlantDeleted?.(plant)}
        />
      ))}
    </div>
  );
}

/**
 * List view item - horizontal card with more details.
 */
interface PlantListItemProps {
  plant: Plant;
  groveId: string;
  onWatered?: () => void;
  onEdited?: () => void;
  onDeleted?: () => void;
}

function PlantListItem({
  plant,
  groveId,
  onWatered,
  onEdited,
  onDeleted,
}: PlantListItemProps) {
  const { showToast } = useToast();
  const deletePlant = useDeletePlant();
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const plantType = getPlantType(plant.type);
  const status = getWateringStatus(plant.last_watered, plant.watering_interval);
  const statusColors = WATERING_STATUS_COLORS[status];
  const statusText = formatWateringStatus(plant.last_watered, plant.watering_interval);

  const handleDelete = async () => {
    if (!confirm(`Delete ${plant.name}?`)) return;
    try {
      await deletePlant.mutateAsync({ id: plant.id, groveId });
      showToast(`${plant.name} deleted`, "success");
      onDeleted?.();
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  return (
    <>
      <div
        className={cn(
          "bg-white rounded-2xl border border-cream-200 p-4 flex items-center gap-4 transition-all hover:shadow-soft",
          status === "overdue" && "ring-2 ring-destructive/20",
          status === "due-today" && "ring-2 ring-warning/20"
        )}
      >
        {/* Photo or Emoji */}
        <div
          className={cn(
            "w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden",
            plant.photo ? "bg-cream-100" : "bg-gradient-to-br from-sage-50 to-sage-100"
          )}
        >
          {plant.photo ? (
            <img src={plant.photo} alt={plant.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">{plantType.emoji}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">{plant.name}</h3>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                statusColors.bg,
                statusColors.text
              )}
            >
              {statusText}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {plantType.label} · Every {plant.watering_interval} days
          </p>
          {plant.notes && (
            <p className="text-xs text-muted-foreground/70 mt-1 truncate">{plant.notes}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <WaterButton plantId={plant.id} plantName={plant.name} status={status} onWatered={onWatered} />

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-xl hover:bg-cream-100 text-sage-400 hover:text-sage-600 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lifted border border-border/50 py-1 min-w-[120px]">
                  <button
                    onClick={() => { setShowMenu(false); setShowEdit(true); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-sage-50 flex items-center gap-2"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => { setShowMenu(false); handleDelete(); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <PlantForm
        groveId={groveId}
        plant={plant}
        open={showEdit}
        onOpenChange={setShowEdit}
        onSuccess={() => { setShowEdit(false); showToast(`${plant.name} updated!`, "success"); }}
        onPlantUpdated={onEdited}
      />
    </>
  );
}

/**
 * Compact view item - minimal row.
 */
interface PlantCompactItemProps {
  plant: Plant;
  groveId: string;
  onWatered?: () => void;
  onEdited?: () => void;
  onDeleted?: () => void;
}

function PlantCompactItem({
  plant,
  groveId,
  onWatered,
  onEdited,
  onDeleted,
}: PlantCompactItemProps) {
  const { showToast } = useToast();
  const deletePlant = useDeletePlant();
  const [showEdit, setShowEdit] = useState(false);

  const plantType = getPlantType(plant.type);
  const status = getWateringStatus(plant.last_watered, plant.watering_interval);
  const statusColors = WATERING_STATUS_COLORS[status];
  const lastWatered = formatLastWatered(plant.last_watered);

  const handleDelete = async () => {
    if (!confirm(`Delete ${plant.name}?`)) return;
    try {
      await deletePlant.mutateAsync({ id: plant.id, groveId });
      showToast(`${plant.name} deleted`, "success");
      onDeleted?.();
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  return (
    <>
      <div
        className={cn(
          "px-4 py-3 flex items-center gap-3 hover:bg-cream-50/50 transition-colors",
          status === "overdue" && "bg-destructive/5",
          status === "due-today" && "bg-warning/5"
        )}
      >
        {/* Emoji */}
        <span className="text-lg">{plantType.emoji}</span>

        {/* Name */}
        <span className="font-medium text-foreground flex-1 truncate">{plant.name}</span>

        {/* Status dot */}
        <span
          className={cn(
            "w-2 h-2 rounded-full flex-shrink-0",
            status === "overdue" && "bg-destructive",
            status === "due-today" && "bg-warning",
            status === "upcoming" && "bg-terracotta-400",
            status === "healthy" && "bg-sage-500"
          )}
          title={formatWateringStatus(plant.last_watered, plant.watering_interval)}
        />

        {/* Last watered */}
        <span className="text-xs text-muted-foreground hidden sm:inline">{lastWatered}</span>

        {/* Quick water */}
        <button
          onClick={() => {
            // Quick inline water
            import("@/lib/database/plants").then(({ waterPlant }) => {
              waterPlant(plant.id).then(() => {
                showToast(`${plant.name} watered!`, "success");
                onWatered?.();
              });
            });
          }}
          className="p-1.5 rounded-lg hover:bg-water-500/20 text-water-500 transition-colors"
          title="Water now"
        >
          <Droplets className="w-4 h-4" />
        </button>

        {/* Edit */}
        <button
          onClick={() => setShowEdit(true)}
          className="p-1.5 rounded-lg hover:bg-sage-100 text-sage-400 transition-colors"
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive/60 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <PlantForm
        groveId={groveId}
        plant={plant}
        open={showEdit}
        onOpenChange={setShowEdit}
        onSuccess={() => { setShowEdit(false); showToast(`${plant.name} updated!`, "success"); }}
        onPlantUpdated={onEdited}
      />
    </>
  );
}
