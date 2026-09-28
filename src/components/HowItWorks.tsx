"use client";

import {
  Building2,
  Image as ImageIcon,
  FlaskConical,
  QrCode,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function HowItWorks({ onStartBuilder }: { onStartBuilder: () => void }) {
  const steps = [
    {
      stepNumber: "01",
      icon: Building2,
      title: "Firm & Regulatory Licence Details",
      desc: "Enter your registered company name, brand name, official address, and 14-digit FSSAI registration number.",
      tag: "Statutory Verification",
    },
    {
      stepNumber: "02",
      icon: ImageIcon,
      title: "Visual Assets & Auto-Theming",
      desc: "Upload product imagery and brand logo. Our algorithm instantly extracts your brand colors for the PDF dossier.",
      tag: "Dynamic Palette",
    },
    {
      stepNumber: "03",
      icon: FlaskConical,
      title: "Ingredients & Lab Parameters",
      desc: "Specify exact composition, storage directions, and optional ISO/NABL certified nutritional or quality parameters.",
      tag: "1-Click Presets",
    },
    {
      stepNumber: "04",
      icon: QrCode,
      title: "Download QR & Branded PDF Dossier",
      desc: "Receive print-ready vector QR stickers and official digital product passport. Scannable on any phone camera forever.",
      tag: "Zero Server Bottlenecks",
    },
  ];

  return (
    <section id="how-it-works" className="bg-white border-b border-slate-200 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Simple 4-Step Commercial Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From Raw Compliance Data to Print-Ready QR
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md mt-4 md:mt-0">
            No complex developer integration, no monthly database maintenance. A lightweight, client-side digital product passport system built for Indian business realities.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:bg-white hover:border-emerald-600 hover:shadow-md transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-emerald-800 transition">
                      {item.stepNumber}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-white transition shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center text-xs font-bold text-slate-500 group-hover:text-emerald-800 transition">
                  <span>Step {index + 1} of 4</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-emerald-950">
              Ready to generate your first compliant packaging passport?
            </h3>
            <p className="text-xs text-emerald-800 mt-1">
              Test it out with pre-filled FMCG sample data or enter your firm particulars directly.
            </p>
          </div>
          <button
            onClick={onStartBuilder}
            className="w-full sm:w-auto btn-emerald text-sm whitespace-nowrap cursor-pointer"
          >
            Launch Builder Studio
          </button>
        </div>
      </div>
    </section>
  );
}
