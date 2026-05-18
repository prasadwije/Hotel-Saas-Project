import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2 } from "lucide-react";

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  hotelId: string;
  uploadType: string;
  placeholder?: string;
  className?: string;
}

export function ImageUploadInput({
  value,
  onChange,
  hotelId,
  uploadType,
  placeholder = "https://...",
  className = "",
}: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Always keep a ref to the latest onChange so async callbacks never use
  // a stale closure captured at render time.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("hotelId", hotelId);
      formData.append("uploadType", uploadType);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      if (data.url) {
        // Use the ref so we always call the *current* onChange, not the
        // stale one captured when this handler was first created.
        onChangeRef.current(data.url);
      }
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset the hidden file input so the same file can be re-selected.
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Input
          placeholder={placeholder}
          value={value}
          // Every keystroke (including clearing) immediately dispatches the
          // state update so the live preview re-renders without delay.
          onChange={(e) => onChangeRef.current(e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="shrink-0"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload
            </>
          )}
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
