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
    <div className="w-full">
      <label className="form-label">
        Ingredients / Product Composition
        <span className="text-red-600 ml-1">*</span>
      </label>
      <p className="form-hint mb-2">
        Type an ingredient and press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[11px]">Enter</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[11px]">,</kbd>. You can also paste a comma-separated list.
      </p>

      {/* Tags Container */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`min-h-[100px] p-2.5 bg-white border rounded-xl cursor-text transition ${
          error ? "border-red-500 bg-red-50/20" : "border-slate-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20"
        }`}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {ingredients.map((ing, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-medium"
            >
              <Tag className="w-3 h-3 text-slate-400" />
              <span>{ing}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeIngredient(idx);
                }}
                className="hover:text-red-600 ml-0.5 text-slate-400 cursor-pointer"
                aria-label={`Remove ${ing}`}
              >
                <X className="w-3.5 h-3.5" />
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
            placeholder={ingredients.length === 0 ? "e.g., Clarified Butter, Preservatives..." : "Add more..."}
            className="flex-1 min-w-[160px] bg-transparent border-none outline-none text-xs sm:text-sm text-slate-900 py-1 px-1 placeholder:text-slate-400"
            id="ingredients-input"
          />
        </div>
      </div>

      {inputValue && (
        <button
          type="button"
          onClick={() => addIngredient(inputValue)}
          className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add &quot;{inputValue}&quot;
        </button>
      )}

      {error && (
        <p className="text-xs font-semibold text-red-600 mt-1.5 flex items-center gap-1">
          <X className="w-3.5 h-3.5" />
          {error}
        </p>
      )}

      {ingredients.length > 0 && (
        <p className="text-[11px] text-slate-500 mt-2 font-medium">
          {ingredients.length} item{ingredients.length !== 1 ? "s" : ""} declared in product passport
        </p>
      )}
    </div>
  );
}
