"use client";

import { QrCode, ArrowLeft, Plus } from "lucide-react";

interface HeaderProps {
  onCreateClick: () => void;
  onResetClick: () => void;
  isWizardActive: boolean;
}

export default function Header({
  onCreateClick,
  onResetClick,
  isWizardActive,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Software Brand Logo */}
        <button
          type="button"
          onClick={onResetClick}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display text-base sm:text-lg font-bold text-slate-900 tracking-tight block leading-none">
              DocuQR <span className="text-indigo-600">Studio</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
              Product PDF &amp; QR Software
            </span>
          </div>
        </button>

        {/* Single Clean Action Button */}
        <div>
          {!isWizardActive ? (
            <button
              type="button"
              onClick={onCreateClick}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create QR</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onResetClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
