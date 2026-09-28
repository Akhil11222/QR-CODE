"use client";

import { QrCode } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <QrCode className="w-3.5 h-3.5" />
          </div>
          <span className="font-display text-sm font-bold text-slate-800">
            DocuQR Studio
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Smart Product Specification PDF &amp; Dynamic QR Code Generator
        </p>
      </div>
    </footer>
  );
}
