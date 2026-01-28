"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Plus, ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ImageInputProps {
  value: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

export function ImageInput({ value, onChange, error }: ImageInputProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const addImage = () => {
    if (value.length < 4) {
      onChange([...value, ""]);
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    const newErrors = { ...imageErrors };
    delete newErrors[index];
    setImageErrors(newErrors);
    const newUploading = { ...uploading };
    delete newUploading[index];
    setUploading(newUploading);
  };

  const updateImage = (index: number, path: string) => {
    const newImages = [...value];
    newImages[index] = path;
    onChange(newImages);

    // Clear error for this image when updating
    if (imageErrors[index]) {
      const newErrors = { ...imageErrors };
      delete newErrors[index];
      setImageErrors(newErrors);
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors({ ...imageErrors, [index]: true });
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading({ ...uploading, [index]: true });

    try {
      // Convert image to base64 data URL for local storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        // Generate a unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
        const imagePath = `/products/${fileName}`;

        // For now, we'll store the base64 data URL directly
        // In a real app, you'd upload to a server or cloud storage
        updateImage(index, base64String);
        setUploading({ ...uploading, [index]: false });
        toast.success("Image uploaded successfully");
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
        setUploading({ ...uploading, [index]: false });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      setUploading({ ...uploading, [index]: false });
    }
  };

  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Product Images (1-4)</Label>
        {value.length < 4 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addImage}
            className="gap-2"
          >
            <Plus className="size-4" />
            Add Image
          </Button>
        )}
      </div>

      {value.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 p-8">
          <ImageIcon className="mb-2 size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No images added</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImage}
            className="mt-2"
          >
            Add your first image
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {value.map((image, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
          >
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs text-muted-foreground">
                  Image {index + 1}
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => triggerFileInput(index)}
                  disabled={uploading[index]}
                  className="h-7 gap-1 text-xs"
                >
                  <Upload className="size-3" />
                  {uploading[index] ? "Uploading..." : "Upload"}
                </Button>
                <input
                  ref={(el) => {
                    fileInputRefs.current[index] = el;
                  }}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(index, file);
                    }
                  }}
                  className="hidden"
                />
              </div>
              <Input
                value={image}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder="/products/image.png or paste image URL"
                className="font-mono text-sm"
              />
              {image && !image.startsWith("/products/") && !image.startsWith("data:") && !image.startsWith("http") && (
                <p className="text-xs text-yellow-600 dark:text-yellow-500">
                  Image path should start with /products/ or be a valid URL
                </p>
              )}
            </div>

            {image && (
              <div className="relative size-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                {!imageErrors[index] ? (
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    onError={() => handleImageError(index)}
                    unoptimized={image.startsWith("data:")}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <ImageIcon className="size-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeImage(index)}
              className="size-8 shrink-0 text-destructive hover:text-destructive"
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <p className="text-xs text-muted-foreground">
        Upload images directly or enter paths relative to the public directory (e.g., /products/image-1.png). Uploaded images are stored as base64 data URLs.
      </p>
    </div>
  );
}
