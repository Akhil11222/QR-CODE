"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle, Sparkles } from "lucide-react";
import { validateImageFile, readFileAsDataUrl, resizeImageDataUrl } from "@/lib/imageUtils";
import { extractBrandColors } from "@/lib/colorExtractor";
import { BrandColors } from "@/types";

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
    <div>
      <label className="label">
        {label}
        {required && <span style={{ color: "#f87171", marginLeft: 4 }}>*</span>}
      </label>
      {hint && (
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 10 }}>
          {hint}
        </p>
      )}

      {currentFile ? (
        <div
          className="drop-zone has-file"
          style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 8,
              overflow: "hidden",
              flexShrink: 0,
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentFile}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle size={15} color="#10b981" />
              <span style={{ fontSize: "0.88rem", color: "#10b981", fontWeight: 600 }}>
                Image uploaded
              </span>
            </div>
            {showColorExtraction && colorsExtracted && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 4,
                  fontSize: "0.78rem",
                  color: "#c084fc",
                }}
              >
                <Sparkles size={12} />
                Brand colors extracted from your logo!
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onRemove();
              setColorsExtracted(false);
              setError(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8,
              padding: "6px 8px",
              cursor: "pointer",
              color: "#f87171",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`drop-zone ${dragOver ? "drag-over" : ""}`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          aria-label={`Upload ${label}`}
        >
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: "3px solid rgba(99,102,241,0.3)",
                  borderTop: "3px solid #6366f1",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Processing image...
              </span>
            </div>
          ) : (
            <>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(99,102,241,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                {dragOver ? <Upload size={22} color="#818cf8" /> : <ImageIcon size={22} color="#818cf8" />}
              </div>
              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                {dragOver ? "Drop image here" : "Drag & drop or click to upload"}
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>
                JPG, PNG, WEBP • Max {maxSizeMb}MB
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            style={{ display: "none" }}
            id={`file-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
          />
        </div>
      )}

      {error && (
        <p className="error-text" style={{ marginTop: 8 }}>
          <X size={12} />
          {error}
        </p>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
