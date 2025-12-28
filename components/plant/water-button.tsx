"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { useWaterPlant } from "@/hooks/use-plants";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Droplets, Check, Sparkles } from "lucide-react";
import type { WateringStatus } from "@/lib/utils/dates";

/**
 * Water button with delightful visual feedback and animations.
 * Shows water splash effect and celebration on successful watering.
 */
interface WaterButtonProps {
  plantId: string;
  groveId: string;
  plantName: string;
  status: WateringStatus;
  onWatered?: () => void;
}

export function WaterButton({
  plantId,
  groveId,
  plantName,
  status,
  onWatered,
}: WaterButtonProps) {
  const { showToast } = useToast();
  const { user, profile } = useAuth();
  const waterPlant = useWaterPlant();

  const [justWatered, setJustWatered] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  // Precomputed droplet positions (static, deterministic for consistency)
  const dropletPositions = [
    { x: 45, y: 0 },
    { x: 32, y: 32 },
    { x: 0, y: 48 },
    { x: -32, y: 35 },
    { x: -50, y: 0 },
    { x: -35, y: -35 },
    { x: 0, y: -45 },
    { x: 38, y: -38 },
  ];

  const handleWater = async () => {
    try {
      const userInfo = user && profile
        ? { userId: user.id, userName: profile.display_name || profile.email || "Someone" }
        : undefined;

      await waterPlant.mutateAsync({
        plantId,
        groveId,
        userInfo,
      });

      // Trigger splash animation
      setShowSplash(true);
      setJustWatered(true);
      showToast(`${plantName} watered!`, "success");
      onWatered?.();

      // Reset animations
      setTimeout(() => setShowSplash(false), 1000);
      setTimeout(() => setJustWatered(false), 3000);
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

  const isUrgent = status === "overdue" || status === "due-today";

  return (
    <div className="relative">
      {/* Water splash particles */}
      <AnimatePresence>
        {showSplash && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {/* Center splash */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="w-8 h-8 rounded-full bg-water-400/30" />
            </motion.div>

            {/* Water droplets */}
            {dropletPositions.map((pos, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-water-400"
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: pos.x,
                  y: pos.y,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.02,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Sparkles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute text-water-400"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  rotate: [0, 180],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + i * 0.05,
                }}
              >
                <Sparkles className="w-3 h-3" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant={getVariant()}
          className={cn(
            "w-full gap-2 relative overflow-hidden",
            justWatered && "bg-terracotta-100 text-terracotta-700 border-terracotta-200",
          )}
          onClick={handleWater}
          disabled={waterPlant.isPending || justWatered}
          aria-label={justWatered ? `${plantName} was just watered` : `Water ${plantName}`}
          aria-busy={waterPlant.isPending}
        >
          {/* Urgent status pulse effect */}
          {isUrgent && !justWatered && !waterPlant.isPending && (
            <motion.div
              className="absolute inset-0 bg-water-400/20 rounded-lg"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          <AnimatePresence mode="wait">
            {justWatered ? (
              <motion.div
                key="watered"
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Check className="w-4 h-4" />
                </motion.div>
                Watered!
              </motion.div>
            ) : waterPlant.isPending ? (
              <motion.div
                key="pending"
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Droplets className="w-4 h-4" />
                </motion.div>
                Watering...
              </motion.div>
            ) : (
              <motion.div
                key="default"
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <motion.div
                  animate={isUrgent ? { y: [0, -2, 0] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Droplets className="w-4 h-4" />
                </motion.div>
                Water Now
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  );
}
