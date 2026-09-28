"use client";

import { useState, KeyboardEvent, useRef } from "react";
import { X, Plus, Tag } from "lucide-react";

interface IngredientsInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
  error?: string | null;
}

export default function IngredientsInput({ ingredients, onChange, error }: IngredientsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addIngredient = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // Support comma-separated input
    const parts = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
    const newIngredients = [...ingredients];
    for (const part of parts) {
      if (!newIngredients.includes(part)) {
        newIngredients.push(part);
      }
    }
    onChange(newIngredients);
    setInputValue("");
  };

  const removeIngredient = (idx: number) => {
    onChange(ingredients.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient(inputValue);
    }
    if (e.key === "Backspace" && inputValue === "" && ingredients.length > 0) {
      removeIngredient(ingredients.length - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (pasted.includes(",") || pasted.includes("\n")) {
      e.preventDefault();
      const parts = pasted
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const newIngredients = [...ingredients];
      for (const part of parts) {
        if (!newIngredients.includes(part)) newIngredients.push(part);
      }
      onChange(newIngredients);
    }
  };

  return (
    <div>
      <label className="label">
        Ingredients / Composition
        <span style={{ color: "#f87171", marginLeft: 4 }}>*</span>
      </label>
      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 10 }}>
        Type each ingredient and press <kbd style={{ padding: "1px 5px", background: "rgba(255,255,255,0.08)", borderRadius: 4, fontSize: "0.75rem" }}>Enter</kbd> or <kbd style={{ padding: "1px 5px", background: "rgba(255,255,255,0.08)", borderRadius: 4, fontSize: "0.75rem" }}>,</kbd>. Paste a comma-separated list to bulk add.
      </p>

      {/* Tags Container */}
      <div
        style={{
          minHeight: 120,
          padding: "10px 12px",
          background: "rgba(255,255,255,0.03)",
          border: `1.5px solid ${error ? "#ef4444" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 10,
          cursor: "text",
          transition: "border-color 0.2s",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          {ingredients.map((ing, idx) => (
            <span key={idx} className="ingredient-tag">
              <Tag size={10} />
              {ing}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeIngredient(idx); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
                aria-label={`Remove ${ing}`}
              >
                <X size={12} color="currentColor" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={() => inputValue && addIngredient(inputValue)}
            placeholder={ingredients.length === 0 ? "e.g. Water, Sugar, Salt, Citric Acid..." : "Add more..."}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.92rem",
              minWidth: 180,
              flex: 1,
              padding: "3px 2px",
            }}
            id="ingredients-input"
          />
        </div>
      </div>

      {/* Quick Add Button */}
      {inputValue && (
        <button
          type="button"
          onClick={() => addIngredient(inputValue)}
          className="btn-secondary"
          style={{ marginTop: 8, padding: "8px 14px", fontSize: "0.82rem" }}
        >
          <Plus size={14} />
          Add &quot;{inputValue}&quot;
        </button>
      )}

      {error && (
        <p className="error-text" style={{ marginTop: 6 }}>
          <X size={12} />
          {error}
        </p>
      )}

      {ingredients.length > 0 && (
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 8 }}>
          {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""} added
          {ingredients.length >= 5 && " — great! Looking comprehensive."}
        </p>
      )}
    </div>
  );
}
