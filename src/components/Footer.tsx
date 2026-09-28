"use client";

import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, Award } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Regulatory Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight font-display">
                  VeriPack India
                </span>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Digital Product Passport Infrastructure
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Standardized B2B compliance QR and dynamic digital product dossier generation platform designed specifically for Indian food business operators (FBOs), dairy manufacturers, and packaged goods exporters.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>100% Stateless • Zero Server Vulnerability</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => scrollTo("how-it-works")}
                  className="hover:text-white transition cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("compliance-standards")}
                  className="hover:text-white transition cursor-pointer"
                >
                  Compliance Standards
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("client-demo")}
                  className="hover:text-white transition cursor-pointer"
                >
                  Live Client Demo
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("industry-use-cases")}
                  className="hover:text-white transition cursor-pointer"
                >
                  Industry Use Cases
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("faq")}
                  className="hover:text-white transition cursor-pointer"
                >
                  FAQ &amp; Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Supported Compliance Formats (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Supported Compliance
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span>FSSAI FoSCoS 14-Digit Licence Number</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span>GS1 13-Digit GTIN Barcode Standards</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span>Legal Metrology (Packaged Commodities)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span>ISO 9001:2015 Lab Test Nutritional Tables</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span>Green Vegetarian [Green Dot] Statutory Mark</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate Nodal Support (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Corporate Support
            </h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@veripack.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 9899705937 (Toll-Free Helpline)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">
                  National Capital Region (NCR), New Delhi, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {currentYear} VeriPack India. All rights reserved. Built for Indian FMCG &amp; Food Manufacturing.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400">Privacy Policy</span>
            <span className="hover:text-slate-400">Terms of Compliance</span>
            <span className="hover:text-slate-400">FSSAI FoSCoS Directives</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
