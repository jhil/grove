"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, X, ChevronLeft, ChevronRight, Calendar, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { usePhotoUpload } from "@/hooks/use-photo-upload";
import { useToast } from "@/components/ui/toast";
import {
  getPlantPhotos,
  addPlantPhoto,
  deletePlantPhoto,
} from "@/lib/database/plant-photos";
import { cn } from "@/lib/utils";
import type { PlantPhoto, Plant } from "@/types/supabase";

interface GrowthTimelineProps {
  plant: Plant;
  editable?: boolean;
}

/**
 * Plant Growth Timeline - photo diary showing plant growth over time
 */
export function GrowthTimeline({ plant, editable = true }: GrowthTimelineProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [selectedPhoto, setSelectedPhoto] = useState<PlantPhoto | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Fetch photos
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["plant-photos", plant.id],
    queryFn: () => getPlantPhotos(plant.id),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deletePlantPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plant-photos", plant.id] });
      showToast("Photo deleted", "success");
      setSelectedPhoto(null);
    },
    onError: () => {
      showToast("Failed to delete photo", "error");
    },
  });

  const handleDelete = (photoId: string) => {
    if (confirm("Delete this photo from the timeline?")) {
      deleteMutation.mutate(photoId);
    }
  };

  // Navigate between photos
  const currentIndex = selectedPhoto
    ? photos.findIndex((p) => p.id === selectedPhoto.id)
    : -1;

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedPhoto(photos[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < photos.length - 1) {
      setSelectedPhoto(photos[currentIndex + 1]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-32 bg-cream-200 rounded animate-pulse" />
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-20 h-20 bg-cream-200 rounded-lg animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Growth Timeline
          {photos.length > 0 && (
            <span className="text-muted-foreground font-normal">
              ({photos.length} photo{photos.length !== 1 ? "s" : ""})
            </span>
          )}
        </h4>
        {editable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddDialog(true)}
            className="h-7 px-2"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add
          </Button>
        )}
      </div>

      {/* Timeline */}
      {photos.length === 0 ? (
        <div className="text-center py-6 bg-cream-50 rounded-xl border border-dashed border-cream-300">
          <Camera className="w-8 h-8 mx-auto text-cream-400 mb-2" />
          <p className="text-sm text-muted-foreground">
            No photos yet. Add photos to track your plant&apos;s growth!
          </p>
          {editable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddDialog(true)}
              className="mt-2"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add first photo
            </Button>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Horizontal scroll container */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cream-300">
            {photos.map((photo, index) => (
              <motion.button
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedPhoto(photo)}
                className="relative flex-shrink-0 group"
              >
                <img
                  src={photo.photo_url}
                  alt={photo.caption || `Photo ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg ring-2 ring-transparent hover:ring-sage-300 transition-all"
                />
                {/* Date overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-b-lg truncate">
                  {new Date(photo.taken_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Timeline line */}
          {photos.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 h-0.5 bg-cream-200 -z-10 mx-10" />
          )}
        </div>
      )}

      {/* Photo viewer dialog */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Navigation */}
            {currentIndex > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </motion.button>
            )}
            {currentIndex < photos.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </motion.button>
            )}

            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Photo */}
            <motion.div
              key={selectedPhoto.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-[80vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.photo_url}
                alt={selectedPhoto.caption || "Plant photo"}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Photo info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedPhoto.taken_at).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    {selectedPhoto.caption && (
                      <p className="mt-1 text-white/80">{selectedPhoto.caption}</p>
                    )}
                  </div>
                  {editable && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(selectedPhoto.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {/* Progress indicator */}
                <div className="flex gap-1 mt-3 justify-center">
                  {photos.map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-colors",
                        idx === currentIndex ? "bg-white" : "bg-white/30"
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add photo dialog */}
      <AddPhotoDialog
        plant={plant}
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}

interface AddPhotoDialogProps {
  plant: Plant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AddPhotoDialog({ plant, open, onOpenChange }: AddPhotoDialogProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { uploadPhoto, isUploading } = usePhotoUpload();

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [takenAt, setTakenAt] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const url = await uploadPhoto(file, `growth-timeline/${plant.id}`);
        setPhotoUrl(url);
      } catch (error) {
        showToast("Failed to upload photo", "error");
      }
    },
    [uploadPhoto, plant.id, showToast]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) return;

    setIsSubmitting(true);
    try {
      await addPlantPhoto({
        plant_id: plant.id,
        photo_url: photoUrl,
        caption: caption.trim() || null,
        taken_at: new Date(takenAt).toISOString(),
      });

      queryClient.invalidateQueries({ queryKey: ["plant-photos", plant.id] });
      showToast("Photo added to timeline!", "success");
      onOpenChange(false);

      // Reset form
      setPhotoUrl(null);
      setCaption("");
      setTakenAt(new Date().toISOString().split("T")[0]);
    } catch (error) {
      showToast("Failed to add photo", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Growth Photo"
      description={`Add a new photo to ${plant.name}'s growth timeline.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Photo</label>
          {photoUrl ? (
            <div className="relative">
              <img
                src={photoUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setPhotoUrl(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 bg-cream-50 border-2 border-dashed border-cream-300 rounded-lg cursor-pointer hover:bg-cream-100 transition-colors">
              <Camera className="w-10 h-10 text-cream-400 mb-2" />
              <span className="text-sm text-muted-foreground">
                {isUploading ? "Uploading..." : "Click to upload photo"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Date taken */}
        <div className="space-y-2">
          <label htmlFor="taken-at" className="text-sm font-medium">
            Date Taken
          </label>
          <Input
            id="taken-at"
            type="date"
            value={takenAt}
            onChange={(e) => setTakenAt(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Caption */}
        <div className="space-y-2">
          <label htmlFor="caption" className="text-sm font-medium">
            Caption{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <Input
            id="caption"
            type="text"
            placeholder="e.g., New leaf unfurling!"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={200}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!photoUrl || isSubmitting || isUploading}
            className="flex-1"
          >
            {isSubmitting ? "Adding..." : "Add to Timeline"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

/**
 * Compact growth timeline preview for plant cards
 */
export function GrowthTimelinePreview({ plantId }: { plantId: string }) {
  const { data: photos = [] } = useQuery({
    queryKey: ["plant-photos", plantId],
    queryFn: () => getPlantPhotos(plantId),
  });

  if (photos.length === 0) return null;

  // Show first 3 photos
  const previewPhotos = photos.slice(0, 3);
  const remaining = photos.length - 3;

  return (
    <div className="flex items-center gap-1">
      {previewPhotos.map((photo, idx) => (
        <img
          key={photo.id}
          src={photo.photo_url}
          alt=""
          className="w-6 h-6 rounded object-cover ring-1 ring-white"
          style={{ marginLeft: idx > 0 ? -8 : 0 }}
        />
      ))}
      {remaining > 0 && (
        <span className="text-[10px] text-muted-foreground ml-1">
          +{remaining}
        </span>
      )}
    </div>
  );
}
