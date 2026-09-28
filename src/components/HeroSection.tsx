"use client";

import { useState, useEffect } from "react";
import {
  QrCode,
  FileText,
  ArrowRight,
  Building2,
  MapPin,
  Phone,
  Mail,
  Image as ImageIcon,
  Palette,
  Award,
  ListChecks,
  Play,
  Pause,
  Download,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const INCLUDED_FIELDS = [
  { icon: Building2, label: "Firm Name" },
  { icon: MapPin, label: "Firm Address" },
  { icon: Phone, label: "Mobile Number" },
  { icon: Mail, label: "Email Address" },
  { icon: ImageIcon, label: "Product Image" },
  { icon: Palette, label: "Logo (Auto-Color PDF)" },
  { icon: Award, label: "Licence Number" },
  { icon: ListChecks, label: "Ingredients & Specs" },
];

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [activeScene, setActiveScene] = useState<0 | 1 | 2>(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveScene((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <section className="w-full py-8 sm:py-14 lg:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Clean Software Intro & Get Started */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <QrCode className="w-3.5 h-3.5" />
            <span>Smart Product PDF &amp; QR Software</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 leading-[1.18] tracking-tight">
            Create Structured{" "}
            <span className="text-indigo-600">Product PDF</span> &amp;{" "}
            <span className="text-indigo-600">Scannable QR Code</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
            Enter your firm and product details step-by-step. The software
            automatically picks colors from your logo, builds a structured PDF
            document, and generates a permanent QR code that opens your PDF
            whenever scanned.
          </p>

          {/* Included Fields Pills */}
          <div className="pt-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Included Details in PDF &amp; QR
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {INCLUDED_FIELDS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-medium text-slate-700"
                  >
                    <Icon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Get Started — Create QR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Auto-Playing Interactive Software Workflow Player */}
        <div className="lg:col-span-6 w-full">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            {/* Window Top Bar */}
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span className="text-xs font-semibold text-slate-300 ml-1.5">
                  Live Software Workflow Preview
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200 transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3 text-indigo-400" />
                    <span>Playing</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-indigo-400" />
                    <span>Paused</span>
                  </>
                )}
              </button>
            </div>

            {/* Scene Selector Tabs */}
            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50">
              {[
                { id: 0, label: "1. Enter Details" },
                { id: 1, label: "2. Logo Theme PDF" },
                { id: 2, label: "3. Scan to Open PDF" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveScene(tab.id as 0 | 1 | 2);
                    setIsPlaying(false);
                  }}
                  className={`py-2.5 px-2 text-xs font-semibold transition-all border-b-2 cursor-pointer ${
                    activeScene === tab.id
                      ? "border-indigo-600 text-indigo-600 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Animated Stage Container */}
            <div className="p-5 sm:p-6 min-h-[310px] sm:min-h-[340px] flex flex-col justify-between bg-gradient-to-b from-white to-slate-50">
              {/* SCENE 0: Step-by-Step Form Input Simulation */}
              {activeScene === 0 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Step-by-Step Wizard Form
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      Step 1 to 4
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">
                        Firm Name &amp; Licence
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                        Apex Consumer Goods Pvt. Ltd.
                      </div>
                      <div className="text-[11px] text-indigo-600 font-medium mt-0.5">
                        Lic: #21409820001421
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">
                        Contact &amp; Address
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                        Plot 42, Industrial Area, Phase II
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                        +91 98000 12345 • info@apexfirm.in
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <ListChecks className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900">
                          Product Image, Logo &amp; Ingredients
                        </div>
                        <div className="text-[11px] text-slate-600 truncate">
                          Upload images &amp; add structured ingredients list
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shrink-0">
                      Next →
                    </span>
                  </div>
                </div>
              )}

              {/* SCENE 1: Automatic Logo Color Extraction & PDF Build */}
              {activeScene === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Auto Brand-Color PDF Builder
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      Dynamic Palette
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-indigo-900 text-white font-bold text-xs flex items-center justify-center">
                          LOGO
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            Colors Extracted from Uploaded Logo
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Automatically themes the generated PDF document
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-900 border border-white shadow-xs" />
                        <span className="w-5 h-5 rounded-full bg-indigo-600 border border-white shadow-xs" />
                        <span className="w-5 h-5 rounded-full bg-indigo-100 border border-slate-200 shadow-xs" />
                      </div>
                    </div>

                    {/* Mini PDF Preview Sheet */}
                    <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                      <div className="bg-indigo-900 text-white px-3 py-2 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-bold">
                            OFFICIAL PRODUCT DOSSIER PDF
                          </div>
                          <div className="text-[9px] text-indigo-200">
                            Firm Details • Licence • Product Image • Ingredients
                          </div>
                        </div>
                        <FileText className="w-4 h-4 text-indigo-200" />
                      </div>
                      <div className="p-2.5 grid grid-cols-3 gap-2 text-[10px]">
                        <div className="bg-white p-2 rounded border border-slate-200">
                          <span className="text-slate-400 block">Firm &amp; Lic</span>
                          <span className="font-bold text-slate-800">Verified</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-200">
                          <span className="text-slate-400 block">Product Photo</span>
                          <span className="font-bold text-slate-800">Embedded</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-200">
                          <span className="text-slate-400 block">Ingredients</span>
                          <span className="font-bold text-slate-800">Structured</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 2: QR Code Scan Opens PDF Anywhere */}
              {activeScene === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Permanent Scan-to-PDF QR Code
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      Instant Mobile Open
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    {/* Animated Scanner Box */}
                    <div className="relative p-4 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center">
                      <div className="relative w-28 h-28 rounded-xl border-2 border-indigo-600 p-2 flex items-center justify-center bg-white overflow-hidden">
                        <QrCode className="w-20 h-20 text-slate-900" />
                        <div className="absolute left-1 right-1 h-0.5 bg-indigo-600 shadow-[0_0_8px_#4f46e5] animate-scan-line" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 mt-2">
                        Scan with Any Smartphone
                      </span>
                    </div>

                    {/* Result on Phone */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5">
                      <div className="flex items-center gap-2 text-indigo-600">
                        <Smartphone className="w-4 h-4" />
                        <span className="text-xs font-bold">
                          Opens Product PDF Automatically
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Whenever anyone scans the downloaded QR code, the
                        structured PDF with all firm &amp; product details opens
                        immediately on their phone.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                          <Download className="w-3 h-3" /> PDF Download
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-indigo-600" /> QR PNG/SVG
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Progress Bar */}
              <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveScene(idx as 0 | 1 | 2)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeScene === idx
                          ? "w-7 bg-indigo-600"
                          : "w-2 bg-slate-300"
                      }`}
                      aria-label={`Scene ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Start Creating Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
