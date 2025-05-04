"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Upload, X, ImageIcon } from "lucide-react";

/**
 * ImageUpload Component
 *
 * A component for uploading images to Supabase Storage with preview functionality.
 *
 * @param {Function} onUploadComplete - Callback when upload is successful
 * @param {string} storageBucket - Supabase storage bucket name (default: "project-images")
 * @param {string} className - Additional CSS classes
 * @param {string} initialImage - Initial image URL to display
 */
export function ImageUpload({
  onUploadComplete,
  storageBucket = "project-images",
  className,
  initialImage,
}) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialImage || null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const supabase = createClient();

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Basic file validation
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Create a preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from(storageBucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(storageBucket).getPublicUrl(filePath);

      onUploadComplete?.(publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onUploadComplete?.(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-foreground rounded-full" />
              Uploading...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Image
            </span>
          )}
        </Button>

        {previewUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {previewUrl && (
        <div className="relative w-full h-48 rounded-lg border border-border overflow-hidden">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {!previewUrl && !uploading && (
        <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg bg-muted/30">
          <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No image uploaded yet</p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
