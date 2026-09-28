"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { validateImageFile, readFileAsDataUrl, resizeImageDataUrl } from "@/lib/imageUtils";
import { extractBrandColors } from "@/lib/colorExtractor";
import { BrandColors } from "@/types";
import Image from "next/image";

interface FileUploadProps {
  label: string;
  required?: boolean;
  hint?: string;
  onFileAccepted: (dataUrl: string) => void;
  onRemove: () => void;
  currentFile: string | null;
  onColorsExtracted?: (colors: BrandColors) => void;
  showColorExtraction?: boolean;
  maxSizeMb?: number;
  accept?: string;
}

export default function FileUpload({
  label,
  required,
  hint,
  onFileAccepted,
  onRemove,
  currentFile,
  onColorsExtracted,
  showColorExtraction = false,
  maxSizeMb = 8,
  accept = "image/*",
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [colorsExtracted, setColorsExtracted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      const validation = validateImageFile(file, maxSizeMb);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      setLoading(true);
      try {
        const dataUrl = await readFileAsDataUrl(file);
        // Resize to reasonable max dimensions (800x800) for display
        const resized = await resizeImageDataUrl(dataUrl, 800, 800, 0.82);
        onFileAccepted(resized);

        // Extract colors if it's a logo
        if (showColorExtraction && onColorsExtracted) {
          const colors = await extractBrandColors(resized);
          onColorsExtracted(colors);
          setColorsExtracted(true);
        }
      } catch {
        setError("Failed to process image. Please try another file.");
      } finally {
        setLoading(false);
      }
    },
    [maxSizeMb, onFileAccepted, onColorsExtracted, showColorExtraction]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="w-full">
      <label className="form-label">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {hint && <p className="form-hint mb-2">{hint}</p>}

      {currentFile ? (
        <div className="border border-emerald-300 bg-emerald-50/40 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
              <Image
                src={currentFile}
                alt="Uploaded preview"
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Asset uploaded successfully</span>
              </div>
              {showColorExtraction && colorsExtracted && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Auto-extracted brand palette</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onRemove();
              setColorsExtracted(false);
              setError(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
            aria-label="Remove uploaded image"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
            dragOver
              ? "border-emerald-600 bg-emerald-50/50"
              : "border-slate-300 hover:border-emerald-600 bg-slate-50/50 hover:bg-slate-50"
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-2 text-slate-600">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-700 mb-2" />
              <span className="text-xs font-semibold">Processing image &amp; compressing...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-2.5">
                {dragOver ? (
                  <Upload className="w-5 h-5 text-emerald-700" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                {dragOver ? "Drop image now" : "Click to browse or drag & drop"}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                JPG, PNG, or WEBP • Client compressed under {maxSizeMb}MB
              </p>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
            id={`upload-${label.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`}
          />
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-red-600 mt-1.5 flex items-center gap-1">
          <X className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
