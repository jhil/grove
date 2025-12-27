"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
import { CareStreak } from "@/components/plant/care-streak";
import { PlantAge } from "@/components/plant/plant-milestones";

/**
 * Card component for displaying a plant with watering status.
 * Features delightful animations and interactions.
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
  const [isHovered, setIsHovered] = useState(false);

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
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
              "h-40 flex items-center justify-center relative overflow-hidden",
              plant.photo ? "bg-cream-100" : "bg-gradient-to-br from-sage-50 to-sage-100"
            )}
          >
            {plant.photo ? (
              <motion.img
                src={plant.photo}
                alt={plant.name}
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <motion.span
                className="text-5xl"
                animate={{
                  scale: isHovered ? 1.15 : 1,
                  rotate: isHovered ? [0, -5, 5, 0] : 0,
                }}
                transition={{ duration: 0.4 }}
              >
                {plantType.emoji}
              </motion.span>
            )}

            {/* Gradient overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Status Badge */}
          <motion.div
            className={cn(
              "absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium",
              statusColors.bg,
              statusColors.text
            )}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.1 }}
          >
            {statusText}
          </motion.div>

          {/* Menu Button */}
          <div className="absolute top-3 left-3">
            <div className="relative">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMenu(!showMenu)}
                  className="h-8 w-8 bg-white/80 hover:bg-white backdrop-blur-sm"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </motion.div>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <motion.div
                      className="absolute left-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lifted border border-border/50 py-1 min-w-[140px]"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <motion.button
                        onClick={() => {
                          setShowMenu(false);
                          setShowEdit(true);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-sage-50 flex items-center gap-2"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setShowMenu(false);
                          handleDelete();
                        }}
                        disabled={isDeleting}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </motion.button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <CardContent className="p-4">
            {/* Plant Name and Type */}
            <div className="mb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <motion.h3
                    className="font-semibold text-foreground truncate"
                    animate={{ color: isHovered ? "var(--sage-600)" : "var(--foreground)" }}
                    transition={{ duration: 0.2 }}
                  >
                    {plant.name}
                  </motion.h3>
                  <p className="text-sm text-muted-foreground">
                    {plantType.label}
                  </p>
                </div>
                {/* Badges */}
                <div className="flex flex-col items-end gap-1">
                  <CareStreak plant={plant} showDetails />
                  <PlantAge plant={plant} />
                </div>
              </div>
            </div>

            {/* Last Watered */}
            <motion.div
              className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: isHovered ? [0, 15, -15, 0] : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Droplets className="w-3.5 h-3.5" />
              </motion.div>
              Last watered: {lastWateredText}
            </motion.div>

            {/* Water Button */}
            <WaterButton
              plantId={plant.id}
              groveId={groveId}
              plantName={plant.name}
              status={status}
              onWatered={onWatered}
            />
          </CardContent>
        </Card>
      </motion.div>

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
