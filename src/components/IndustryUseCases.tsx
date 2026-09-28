"use client";

import {
  Sparkles,
  Award,
  Layers,
  FlaskConical,
  PackageCheck,
  CheckCircle2,
} from "lucide-react";

export default function IndustryUseCases({ onLoadSample }: { onLoadSample: () => void }) {
  const cases = [
    {
      sector: "Dairy, Ghee & Edible Oils",
      headline: "Hari Sharnam Royal Ghee & Pure Milk FBOs",
      summary:
        "Displays mandatory FSSAI registration, Bilona churned verification, milk fat percentage (99.8%), moisture levels, and Baudouin adulteration purity results on mobile scan.",
      badge: "Real Client Demo",
      features: [
        "100% Pure Vegetarian Green Dot display",
        "Adulteration & Baudouin Test reporting",
        "Auto-Crimson & Gold packaging theme",
      ],
      hasAction: true,
    },
    {
      sector: "Packaged Spices & FMCG Staples",
      headline: "Masala Blends, Flour & Packaged Pulses",
      summary:
        "Fulfills mandatory Legal Metrology declaration of net weight, MRP, batch number, AGMARK grading, best before dates, and moisture analysis.",
      badge: "Retail Packaged Goods",
      features: [
        "13-Digit GTIN retail barcode alignment",
        "Allergen & natural preservative disclosure",
        "Storage & hygienic handling guidelines",
      ],
      hasAction: false,
    },
    {
      sector: "Organic & Ayurvedic Wellness",
      headline: "Herbal Supplements & AYUSH Formulations",
      summary:
        "Communicates organic provenance, botanical source names, chemical-free processing, and certified batch analysis directly to conscious consumers.",
      badge: "AYUSH & Organic",
      features: [
        "Standardized herbal constituent tables",
        "Safe dosage & therapeutic usage instructions",
        "Organic certification credential link",
      ],
      hasAction: false,
    },
    {
      sector: "Industrial & Packaged Consumer Goods",
      headline: "Chemicals, Hardware & Consumer Electronics",
      summary:
        "Replaces bulky printed instruction manuals with instant digital warranty certificates, BIS/ISI standards, hazardous materials handling, and authorized service centers.",
      badge: "BIS / Non-Food Goods",
      features: [
        "Digital warranty & batch traceability",
        "Manufacturer nodal customer care hotline",
        "Downloadable technical specification PDF",
      ],
      hasAction: false,
    },
  ];

  return (
    <section id="industry-use-cases" className="bg-slate-50 border-b border-slate-200 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3">
            <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Multi-Sector Applicability</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Every Packaging Vertical
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Whether you are packaging pure A2 Desi Ghee in Delhi or exporting whole spices globally, VeriPack QR guarantees complete statutory alignment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    {item.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Case #0{idx + 1}</span>
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {item.sector}
                </h3>
                <h4 className="text-lg font-bold text-slate-900 mb-3">
                  {item.headline}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  {item.summary}
                </p>

                <div className="space-y-2 mb-6">
                  {item.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {item.hasAction && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Live Client Data Available</span>
                  <button
                    onClick={onLoadSample}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 hover:bg-amber-100 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Load This Case Study
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
