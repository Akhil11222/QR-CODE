"use client";

import { useState } from "react";
import {
  ShieldCheck,
  QrCode,
  FileText,
  Smartphone,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Download,
  Building2,
  Award,
  Layers,
  Phone,
  Mail,
  FlaskConical,
} from "lucide-react";
import Image from "next/image";

interface HeroSectionProps {
  onStartBuilder: () => void;
  onPreviewClient: () => void;
}

export default function HeroSection({ onStartBuilder, onPreviewClient }: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState<"packaging" | "mobile" | "pdf">("packaging");

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Commercial Pitch */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>FSSAI FoSCoS &amp; GS1 India Compliant Architecture</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5">
              Official Digital Product Passports &amp;{" "}
              <span className="text-emerald-800 underline decoration-emerald-500/40 underline-offset-8">
                Scannable Compliance PDFs
              </span>{" "}
              for Leading Brands
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              Turn mandatory FSSAI licence numbers, packaging declarations, GTIN barcodes, and nutritional lab reports into smart, instant smartphone-scannable QR codes and auto-branded PDF dossiers in 60 seconds.
            </p>

            {/* Dual CTAs */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <button
                onClick={onStartBuilder}
                id="hero-create-btn"
                className="btn-emerald py-3.5 px-7 text-base shadow-md cursor-pointer"
              >
                <QrCode className="w-5 h-5 text-emerald-200" />
                <span>Create Product QR Now</span>
              </button>

              <button
                onClick={onPreviewClient}
                id="hero-preview-sample-btn"
                className="btn-outline-corporate py-3.5 px-6 text-sm font-bold bg-white text-slate-800 border-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Preview Hari Sharnam Live Demo</span>
              </button>
            </div>

            {/* Key Metrics / Highlights Strip */}
            <div className="w-full grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 font-display">100%</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Native Camera Scannable (No App Needed)
                </p>
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-800 font-display">Auto-Theme</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Logo Color Palette Dynamic PDF Dossier
                </p>
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 font-display">FSSAI / GS1</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Legal Metrology &amp; Lab Report Ready
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dual Mockup Showcase */}
          <div className="lg:col-span-6" id="client-demo">
            <div className="corporate-card overflow-hidden bg-slate-50 border-slate-300">
              {/* Tab Selector */}
              <div className="bg-slate-900 p-2 sm:p-2.5 flex items-center justify-between text-white border-b border-slate-800">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("packaging")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      activeTab === "packaging"
                        ? "bg-emerald-700 text-white shadow-xs"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>1. Commercial Pack</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("mobile")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      activeTab === "mobile"
                        ? "bg-emerald-700 text-white shadow-xs"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>2. Scanned Screen</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("pdf")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      activeTab === "pdf"
                        ? "bg-emerald-700 text-white shadow-xs"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>3. Branded PDF Dossier</span>
                  </button>
                </div>

                <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-400 font-bold pr-2">
                  Hari Sharnam Royal Ghee
                </span>
              </div>

              {/* Showcase Body */}
              <div className="p-4 sm:p-6 bg-slate-100/70">
                {/* TAB 1: Real Product Packaging + Scannable QR */}
                {activeTab === "packaging" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                      <div className="relative h-64 sm:h-80 w-full bg-slate-900">
                        <Image
                          src="/images/fmcg-smart-packaging.jpg"
                          alt="Hari Sharnam Royal Ghee Packaging with Scannable QR"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Client Case Study
                            </span>
                            <span className="text-xs font-mono text-slate-500">GTIN: 8939137480046</span>
                          </div>
                          <h2 className="text-base font-bold text-slate-900 mt-1">
                            Hari Sharnam Royal Ghee (500 ml Pack)
                          </h2>
                          <p className="text-xs text-slate-600">
                            M/s Hari Sharnam Enterprises • FSSAI Lic: 23322004000714
                          </p>
                        </div>

                        <button
                          onClick={() => setActiveTab("mobile")}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                        >
                          <span>View Scan Screen</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Mobile Phone Verification Frame */}
                {activeTab === "mobile" && (
                  <div className="flex justify-center animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-white rounded-3xl border-4 border-slate-800 shadow-xl overflow-hidden">
                      {/* Mobile Top Notch/Speaker Bar */}
                      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-white text-[10px] font-mono">
                        <span>9:41</span>
                        <div className="w-12 h-2.5 bg-slate-700 rounded-full" />
                        <span>5G 100%</span>
                      </div>

                      {/* Header inside phone */}
                      <div className="bg-gradient-to-r from-red-800 to-amber-700 p-4 text-white">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded">
                            Verified Passport
                          </span>
                          <div className="w-5 h-5 border border-white flex items-center justify-center p-0.5 bg-white">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                          </div>
                        </div>
                        <h3 className="text-lg font-black mt-2">Royal Ghee Premium</h3>
                        <p className="text-xs text-amber-100">Hari Sharnam Enterprises</p>
                      </div>

                      {/* Scanned Table in phone */}
                      <div className="p-3.5 text-xs divide-y divide-slate-100 space-y-2">
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-500 font-bold uppercase text-[10px]">Product Id</span>
                          <span className="font-mono font-bold text-slate-900">8939137480046</span>
                        </div>
                        <div className="flex justify-between pt-2">
                          <span className="text-slate-500 font-bold uppercase text-[10px]">Brand Name</span>
                          <span className="font-semibold text-slate-900">Hari Sharnam</span>
                        </div>
                        <div className="flex justify-between pt-2">
                          <span className="text-slate-500 font-bold uppercase text-[10px]">Pack Size</span>
                          <span className="font-medium text-slate-900">500 ml, 450g</span>
                        </div>
                        <div className="flex justify-between pt-2">
                          <span className="text-slate-500 font-bold uppercase text-[10px]">Product MRP</span>
                          <span className="font-bold text-slate-900">290 INR</span>
                        </div>
                        <div className="flex justify-between pt-2">
                          <span className="text-slate-500 font-bold uppercase text-[10px]">FSSAI Reg No.</span>
                          <span className="font-mono font-bold text-emerald-700">23322004000714</span>
                        </div>
                        <div className="pt-2">
                          <span className="text-slate-500 font-bold uppercase text-[10px] block">Company Address</span>
                          <span className="text-[11px] text-slate-700 leading-tight block mt-0.5">
                            C-1/97 Welcome Seelampur, Delhi-110053
                          </span>
                        </div>
                      </div>

                      {/* PDF Action in phone */}
                      <div className="p-3 bg-slate-50 border-t border-slate-200">
                        <button
                          onClick={() => setActiveTab("pdf")}
                          className="w-full py-2 bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-200" />
                          Open Official Dossier PDF
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: Auto-Branded Official PDF Dossier Preview */}
                {activeTab === "pdf" && (
                  <div className="bg-white rounded-xl border border-slate-300 shadow-md p-4 text-xs animate-in fade-in duration-200">
                    {/* PDF Header Band */}
                    <div className="bg-red-900 text-white p-3 rounded-lg flex items-center justify-between mb-3 border-b-2 border-amber-500">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm tracking-wide">
                            HARI SHARNAM ENTERPRISES
                          </span>
                          <span className="bg-amber-500 text-red-950 font-bold px-1.5 py-0.5 text-[9px] rounded">
                            OFFICIAL DOSSIER
                          </span>
                        </div>
                        <p className="text-[10px] text-red-200">
                          FSSAI Registration No: 23322004000714 (Valid Upto: 23-09-2030)
                        </p>
                      </div>
                      <Award className="w-6 h-6 text-amber-400" />
                    </div>

                    {/* Section 1 in PDF */}
                    <div className="border border-slate-200 rounded-md p-2.5 mb-2.5 bg-slate-50">
                      <p className="font-bold text-slate-900 text-[11px] border-b border-slate-200 pb-1 mb-1.5 flex items-center justify-between">
                        <span>SECTION 1: PRODUCT SPECIFICATION &amp; COMMERCIAL IDENTIFIERS</span>
                        <span className="text-[9px] font-mono text-emerald-700">GS1 VERIFIED</span>
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div>
                          <span className="text-slate-500 block font-semibold">Product Name</span>
                          <span className="font-bold text-slate-900">Royal Ghee Premium</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block font-semibold">GTIN / Product ID</span>
                          <span className="font-mono font-bold text-slate-900">8939137480046</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block font-semibold">Net Qty / Pack Size</span>
                          <span className="font-medium text-slate-900">500 ml, 450g</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 4 in PDF: Lab Report */}
                    <div className="border border-slate-200 rounded-md p-2.5 mb-2.5 bg-slate-50">
                      <p className="font-bold text-slate-900 text-[11px] border-b border-slate-200 pb-1 mb-1.5 flex items-center justify-between">
                        <span>SECTION 4: ISO/FSSAI LAB REPORT NUTRITIONAL PROFILE</span>
                        <span className="text-[9px] text-slate-500 font-mono">100g SERVING</span>
                      </p>
                      <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-800">
                        <div className="bg-white p-1 rounded border border-slate-200">
                          <span className="text-slate-500 block text-[9px]">Energy Value</span>
                          <span className="font-bold">899.1 Kcal</span>
                        </div>
                        <div className="bg-white p-1 rounded border border-slate-200">
                          <span className="text-slate-500 block text-[9px]">Milk Fat</span>
                          <span className="font-bold">99.8 g</span>
                        </div>
                        <div className="bg-white p-1 rounded border border-slate-200">
                          <span className="text-slate-500 block text-[9px]">Baudouin Test</span>
                          <span className="font-bold text-emerald-700">Absent (Pure)</span>
                        </div>
                      </div>
                    </div>

                    {/* PDF Footer simulation */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-slate-700" />
                        <span>VP-IN-89391374 | Authenticated Passport</span>
                      </div>
                      <span className="text-emerald-700 font-bold">100% Meets FSSAI Standards</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Client Testimonial Bar */}
              <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  Tested with authentic packaging data from Hari Sharnam Enterprises
                </span>
                <button
                  onClick={onPreviewClient}
                  className="font-bold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
                >
                  Load into Studio &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
