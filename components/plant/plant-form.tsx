"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { PhotoUploadButton } from "@/components/plant/plant-photo";
import { NameGenerator } from "@/components/plant/name-generator";
import { WateringRecommendation } from "@/components/plant/watering-recommendation";
import { BurstConfetti } from "@/components/ui/confetti";
import { useCreatePlant, useUpdatePlant } from "@/hooks/use-plants";
import { searchPlants, getPlantById, CATEGORY_INFO, type PlantSpecies } from "@/lib/data/plants";
import { Leaf, Sparkles, Calendar } from "lucide-react";
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
  const [plantId, setPlantId] = useState<string | null>(null); // ID from plant database
  const [type, setType] = useState("other"); // Category
  const [interval, setInterval] = useState(7);
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<string>(""); // Plant birthday for milestones
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get selected plant from database
  const selectedPlant = plantId ? getPlantById(plantId) : null;

  // Search results for combobox
  const plantOptions = useMemo((): ComboboxOption[] => {
    const results = searchPlants(searchQuery, 50);
    return results.map((p) => ({
      value: p.id,
      label: p.commonName,
      description: p.scientificName,
      icon: <span>{p.emoji}</span>,
      group: CATEGORY_INFO[p.category]?.label || p.category,
    }));
  }, [searchQuery]);

  // Get emoji for current selection
  const currentEmoji = selectedPlant?.emoji || CATEGORY_INFO[type as keyof typeof CATEGORY_INFO]?.emoji || "🪴";

  // Reset form when dialog opens/closes or plant changes
  useEffect(() => {
    if (open) {
      if (plant) {
        setName(plant.name);
        setType(plant.type);
        setInterval(plant.watering_interval);
        setNotes(plant.notes || "");
        setPhoto(plant.photo || null);
        setBirthday(plant.birthday ? plant.birthday.split("T")[0] : "");
        // Try to find matching plant in database
        const matchingPlant = getPlantById(plant.type);
        setPlantId(matchingPlant ? plant.type : null);
      } else {
        setName("");
        setPlantId(null);
        setType("other");
        setInterval(7);
        setNotes("");
        setPhoto(null);
        setBirthday("");
      }
      setShowBurst(false);
      setSearchQuery("");
    }
  }, [open, plant]);

  // Update type and interval when plant selection changes
  const handlePlantSelect = (selectedId: string) => {
    setPlantId(selectedId);
    const plantData = getPlantById(selectedId);
    if (plantData) {
      setType(plantData.category);
      if (!isEditing) {
        setInterval(plantData.wateringInterval.ideal);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setIsSubmitting(true);

    // Store plantId if selected from database, otherwise store category
    const typeToStore = plantId || type;

    try {
      // Convert birthday to ISO timestamp if provided
      const birthdayValue = birthday ? new Date(birthday).toISOString() : null;

      if (isEditing && plant) {
        const updates: PlantUpdate = {
          name: name.trim(),
          type: typeToStore,
          watering_interval: interval,
          notes: notes.trim() || null,
          photo: photo,
          birthday: birthdayValue,
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
          type: typeToStore,
          watering_interval: interval,
          notes: notes.trim() || null,
          photo: photo,
          birthday: birthdayValue,
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
            className="w-16 h-16 rounded-full bg-terracotta-100 flex items-center justify-center text-3xl"
            animate={{
              scale: showBurst ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
            key={plantId || type}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {currentEmoji}
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
            aria-required="true"
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
          <Combobox
            value={plantId || ""}
            onValueChange={handlePlantSelect}
            options={plantOptions}
            placeholder="Search for a plant..."
            searchPlaceholder="Type to search 250+ plants..."
            emptyMessage="No plants found. Try a different search."
            onSearch={setSearchQuery}
            allowCustom={false}
            maxHeight={250}
          />
          {selectedPlant && (
            <p className="text-xs text-muted-foreground">
              {selectedPlant.scientificName} - {CATEGORY_INFO[selectedPlant.category]?.label}
            </p>
          )}
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
            selectedPlant={selectedPlant}
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

        {/* Birthday (Optional) */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label
            htmlFor="birthday"
            className="text-sm font-medium text-foreground flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            Plant Birthday{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <Input
            id="birthday"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            disabled={isSubmitting}
            max={new Date().toISOString().split("T")[0]}
          />
          <p className="text-xs text-muted-foreground">
            When you got this plant - unlocks milestones and celebrations!
          </p>
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
