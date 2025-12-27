"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Hook for uploading photos to Supabase Storage.
 * Handles compression, upload, and returns public URL.
 */

interface UsePhotoUploadOptions {
  bucket?: string;
  maxSizeKB?: number;
  maxWidth?: number;
  maxHeight?: number;
}

interface UsePhotoUploadReturn {
  uploadPhoto: (file: File, path?: string) => Promise<string>;
  isUploading: boolean;
  error: Error | null;
  progress: number;
}

export function usePhotoUpload(
  options: UsePhotoUploadOptions = {}
): UsePhotoUploadReturn {
  const {
    bucket = "plant-photos",
    maxSizeKB = 500,
    maxWidth = 1200,
    maxHeight = 1200,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  /**
   * Compress an image to reduce file size.
   */
  const compressImage = useCallback(
    async (file: File): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Start with high quality and reduce until under max size
          let quality = 0.9;
          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Failed to compress image"));
                  return;
                }

                // If still too large and quality > 0.1, try again with lower quality
                if (blob.size > maxSizeKB * 1024 && quality > 0.1) {
                  quality -= 0.1;
                  tryCompress();
                } else {
                  resolve(blob);
                }
              },
              "image/jpeg",
              quality
            );
          };

          tryCompress();
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
      });
    },
    [maxSizeKB, maxWidth, maxHeight]
  );

  /**
   * Upload a photo to Supabase Storage.
   */
  const uploadPhoto = useCallback(
    async (file: File, customPath?: string): Promise<string> => {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        const supabase = createClient();

        // Compress the image
        setProgress(10);
        const compressedBlob = await compressImage(file);
        setProgress(30);

        // Generate a unique path
        const ext = "jpg"; // Always use jpg after compression
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const path = customPath || `${timestamp}-${random}.${ext}`;

        setProgress(50);

        // Upload to Supabase
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, compressedBlob, {
            contentType: "image/jpeg",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        setProgress(80);

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(data.path);

        setProgress(100);
        return publicUrl;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Upload failed");
        setError(error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, compressImage]
  );

  return {
    uploadPhoto,
    isUploading,
    error,
    progress,
  };
}

/**
 * Delete a photo from Supabase Storage.
 */
export async function deletePhoto(
  url: string,
  bucket: string = "plant-photos"
): Promise<void> {
  const supabase = createClient();

  // Extract path from URL
  const urlParts = url.split(`${bucket}/`);
  if (urlParts.length < 2) {
    throw new Error("Invalid photo URL");
  }

  const path = urlParts[1];

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(error.message);
  }
}
