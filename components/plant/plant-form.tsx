"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { PhotoUploadButton } from "@/components/plant/plant-photo";
import { NameGenerator } from "@/components/plant/name-generator";
import { WateringRecommendation } from "@/components/plant/watering-recommendation";
import { useCreatePlant, useUpdatePlant } from "@/hooks/use-plants";
import { PLANT_TYPES, getDefaultInterval } from "@/lib/constants";
import { Leaf } from "lucide-react";
import type { Plant, NewPlant, PlantUpdate } from "@/types/supabase";

/**
 * Form dialog for creating or editing a plant.
 * Handles both add and edit modes.
 */
interface PlantFormProps {
  groveId: string;
  plant?: Plant; // If provided, edit mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onPlantCreated?: (plant: Plant) => void;
  onPlantUpdated?: (plant: Plant) => void;
}

export function PlantForm({
  groveId,
  plant,
  open,
  onOpenChange,
  onSuccess,
  onPlantCreated,
  onPlantUpdated,
}: PlantFormProps) {
  const createPlant = useCreatePlant();
  const updatePlant = useUpdatePlant();

  const isEditing = !!plant;

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState("other");
  const [interval, setInterval] = useState(7);
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or plant changes
  useEffect(() => {
    if (open) {
      if (plant) {
        setName(plant.name);
        setType(plant.type);
        setInterval(plant.watering_interval);
        setNotes(plant.notes || "");
        setPhoto(plant.photo || null);
      } else {
        setName("");
        setType("other");
        setInterval(7);
        setNotes("");
        setPhoto(null);
      }
    }
  }, [open, plant]);

  // Update interval when type changes (only for new plants)
  const handleTypeChange = (newType: string) => {
    setType(newType);
    if (!isEditing) {
      setInterval(getDefaultInterval(newType));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      if (isEditing && plant) {
        const updates: PlantUpdate = {
          name: name.trim(),
          type,
          watering_interval: interval,
          notes: notes.trim() || null,
          photo: photo,
        };
        const updatedPlant = await updatePlant.mutateAsync({ id: plant.id, updates });
        onPlantUpdated?.(updatedPlant);
      } else {
        const newPlant: NewPlant = {
          grove_id: groveId,
          name: name.trim(),
          type,
          watering_interval: interval,
          notes: notes.trim() || null,
          photo: photo,
        };
        const createdPlant = await createPlant.mutateAsync(newPlant);
        onPlantCreated?.(createdPlant);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to save plant:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Plant" : "Add New Plant"}
      description={
        isEditing
          ? "Update your plant's information."
          : "Add a new plant to your grove."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Plant Name */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="plant-name"
              className="text-sm font-medium text-foreground"
            >
              Plant Name
            </label>
            <NameGenerator plantType={type} onSelect={setName} />
          </div>
          <Input
            id="plant-name"
            type="text"
            placeholder="e.g., Fernie, Office Ficus, Kitchen Herbs"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            autoFocus
            maxLength={50}
          />
        </div>

        {/* Plant Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Plant Type
          </label>
          <Select
            value={type}
            onValueChange={handleTypeChange}
            placeholder="Select a type..."
          >
            {PLANT_TYPES.map((plantType) => (
              <SelectItem key={plantType.value} value={plantType.value}>
                <span className="flex items-center gap-2">
                  <span>{plantType.emoji}</span>
                  <span>{plantType.label}</span>
                </span>
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Watering Interval */}
        <div className="space-y-3">
          <label
            htmlFor="interval"
            className="text-sm font-medium text-foreground"
          >
            Watering Interval
          </label>
          <div className="flex items-center gap-3">
            <Input
              id="interval"
              type="number"
              min={1}
              max={60}
              value={interval}
              onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
              disabled={isSubmitting}
              className="w-24"
            />
            <span className="text-muted-foreground">days</span>
          </div>
          <WateringRecommendation
            plantType={type}
            currentInterval={interval}
            onIntervalChange={setInterval}
          />
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Photo{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <PhotoUploadButton
            photo={photo}
            plantType={type}
            onPhotoChange={setPhoto}
          />
        </div>

        {/* Notes (Optional) */}
        <div className="space-y-2">
          <label
            htmlFor="notes"
            className="text-sm font-medium text-foreground"
          >
            Notes{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <Input
            id="notes"
            type="text"
            placeholder="e.g., Near window, likes humidity"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSubmitting}
            maxLength={200}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isEditing ? "Saving..." : "Adding..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                {isEditing ? "Save Changes" : "Add Plant"}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
