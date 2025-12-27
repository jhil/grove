"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePhotoUpload } from "@/hooks/use-photo-upload";
import { getPlantType } from "@/lib/constants";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Plant photo component with upload functionality.
 * Shows either the plant photo or a placeholder with the plant type emoji.
 */
interface PlantPhotoProps {
  photo?: string | null;
  plantType: string;
  plantName: string;
  editable?: boolean;
  onPhotoChange?: (url: string | null) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PlantPhoto({
  photo,
  plantType,
  plantName,
  editable = false,
  onPhotoChange,
  size = "md",
  className,
}: PlantPhotoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhoto, isUploading, progress } = usePhotoUpload();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const typeInfo = getPlantType(plantType);

  const sizeClasses = {
    sm: "h-24 w-24",
    md: "h-40 w-full",
    lg: "h-64 w-full",
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      const url = await uploadPhoto(file);
      onPhotoChange?.(url);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Failed to upload photo:", error);
      setPreviewUrl(null);
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = () => {
    onPhotoChange?.(null);
  };

  const displayPhoto = previewUrl || photo;

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      {/* Photo or Placeholder */}
      {displayPhoto ? (
        <img
          src={displayPhoto}
          alt={plantName}
          className={cn(
            "w-full h-full object-cover",
            isUploading && "opacity-50"
          )}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center">
          <span className={cn("text-5xl", size === "lg" && "text-7xl")}>
            {typeInfo.emoji}
          </span>
        </div>
      )}

      {/* Upload Progress Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-white text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-sm font-medium">{progress}%</p>
          </div>
        </div>
      )}

      {/* Editable Controls */}
      {editable && !isUploading && (
        <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors group">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                {photo ? (
                  <>
                    <Camera className="w-4 h-4" />
                    Change
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload
                  </>
                )}
              </Button>
              {photo && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemovePhoto}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

/**
 * Compact photo upload button for forms.
 */
interface PhotoUploadButtonProps {
  photo?: string | null;
  plantType: string;
  onPhotoChange: (url: string | null) => void;
}

export function PhotoUploadButton({
  photo,
  plantType,
  onPhotoChange,
}: PhotoUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhoto, isUploading, progress } = usePhotoUpload();

  const typeInfo = getPlantType(plantType);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadPhoto(file);
      onPhotoChange(url);
    } catch (error) {
      console.error("Failed to upload photo:", error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Preview */}
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
        {photo ? (
          <img src={photo} alt="Plant" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center">
            <span className="text-2xl">{typeInfo.emoji}</span>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex-1">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading... {progress}%
            </>
          ) : photo ? (
            <>
              <Camera className="w-4 h-4" />
              Change Photo
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Add Photo
            </>
          )}
        </Button>

        {photo && !isUploading && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onPhotoChange(null)}
            className="ml-2 text-destructive hover:text-destructive"
          >
            Remove
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
