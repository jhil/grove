"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { PhotoUploadButton } from "@/components/plant/plant-photo";
import { NameGenerator } from "@/components/plant/name-generator";
import { WateringRecommendation } from "@/components/plant/watering-recommendation";
import { BurstConfetti } from "@/components/ui/confetti";
import { useCreatePlant, useUpdatePlant } from "@/hooks/use-plants";
import { PLANT_TYPES, getDefaultInterval, getPlantType } from "@/lib/constants";
import { Leaf, Sparkles } from "lucide-react";
import type { Plant, NewPlant, PlantUpdate } from "@/types/supabase";

/**
 * Form dialog for creating or editing a plant.
 * Handles both add and edit modes with delightful animations.
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
  const [showBurst, setShowBurst] = useState(false);

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
      setShowBurst(false);
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
        setShowBurst(true);
        setTimeout(() => {
          onPlantUpdated?.(updatedPlant);
          onSuccess?.();
        }, 300);
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
        setShowBurst(true);
        setTimeout(() => {
          onPlantCreated?.(createdPlant);
          onSuccess?.();
        }, 300);
      }
    } catch (error) {
      console.error("Failed to save plant:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const plantType = getPlantType(type);

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
      {/* Burst confetti on success */}
      <BurstConfetti active={showBurst} x={50} y={30} count={25} />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Plant preview icon */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        >
          <motion.div
            className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center text-3xl"
            animate={{
              scale: showBurst ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
            key={type}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {plantType.emoji}
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Plant Name */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
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
        </motion.div>

        {/* Plant Type */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
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
        </motion.div>

        {/* Watering Interval */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
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
        </motion.div>

        {/* Photo Upload */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="text-sm font-medium text-foreground">
            Photo{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <PhotoUploadButton
            photo={photo}
            plantType={type}
            onPhotoChange={setPhoto}
          />
        </motion.div>

        {/* Notes (Optional) */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
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
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex gap-3 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="w-full"
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="w-full"
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.span
                    key="submitting"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Leaf className="w-4 h-4" />
                    </motion.div>
                    {isEditing ? "Saving..." : "Adding..."}
                  </motion.span>
                ) : showBurst ? (
                  <motion.span
                    key="success"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    {isEditing ? "Saved!" : "Added!"}
                  </motion.span>
                ) : (
                  <motion.span
                    key="default"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Leaf className="w-4 h-4" />
                    {isEditing ? "Save Changes" : "Add Plant"}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </Dialog>
  );
}
