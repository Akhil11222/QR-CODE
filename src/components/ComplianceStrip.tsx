"use client";

import {
  ShieldCheck,
  Barcode,
  FlaskConical,
  Palette,
  QrCode,
  FileCheck2,
} from "lucide-react";

export default function ComplianceStrip() {
  const standards = [
    {
      icon: ShieldCheck,
      title: "FSSAI Registration & FoSCoS",
      desc: "Mandatory 14-digit licence display, licence validity, and registered firm address compliance.",
    },
    {
      icon: Barcode,
      title: "GS1-Style 13-Digit GTIN",
      desc: "Standardized EAN-13 / GTIN product barcode identification for retail & export distribution.",
    },
    {
      icon: FlaskConical,
      title: "ISO 9001 & NABL Lab Reports",
      desc: "Detailed nutritional tables, adulteration absence tests, and food safety quality parameters.",
    },
    {
      icon: Palette,
      title: "Auto Brand-Color PDF Dossier",
      desc: "Dynamic color extraction from firm logo into an official executive regulatory certificate.",
    },
    {
      icon: QrCode,
      title: "High-DPI Packaging QR Stickers",
      desc: "Print-ready SVG & 800DPI PNG stickers engineered for cardboard, pouches, and tin jars.",
    },
  ];

  return (
    <section id="compliance-standards" className="bg-slate-50 border-b border-slate-200 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>National Regulatory Alignment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Built for Indian Statutory Packaging Directives
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Seamlessly meets Food Safety and Standards (Labelling and Display) Regulations, 2020 and Legal Metrology (Packaged Commodities) Rules.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {standards.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-emerald-600 hover:shadow-sm transition group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-emerald-800 group-hover:text-white transition">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
