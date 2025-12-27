"use client";

import { PlantCard } from "@/components/plant/plant-card";
import { daysUntilWatering } from "@/lib/utils/dates";
import type { Plant } from "@/types/supabase";

/**
 * Grid layout for displaying plants.
 * Sorts plants by watering urgency (overdue first).
 */
interface PlantGridProps {
  plants: Plant[];
  groveId: string;
  onPlantWatered?: (plant: Plant) => void;
  onPlantEdited?: (plant: Plant) => void;
  onPlantDeleted?: (plant: Plant) => void;
}

export function PlantGrid({
  plants,
  groveId,
  onPlantWatered,
  onPlantEdited,
  onPlantDeleted,
}: PlantGridProps) {
  // Sort plants by watering urgency
  const sortedPlants = [...plants].sort((a, b) => {
    const daysA = daysUntilWatering(a.last_watered, a.watering_interval);
    const daysB = daysUntilWatering(b.last_watered, b.watering_interval);
    return daysA - daysB; // Most urgent (negative/smallest) first
  });

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
