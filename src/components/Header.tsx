"use client";

import { useState } from "react";
import {
  ShieldCheck,
  QrCode,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  FileCheck,
  Building2,
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onStartBuilder: () => void;
  onLoadSampleClient: () => void;
}

export default function Header({ onStartBuilder, onLoadSampleClient }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Top Regulatory Announcement Bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <p className="font-medium tracking-wide truncate">
              Standardized Digital Product Passport & Smart QR Compliance System for Indian Manufacturers & FBOs (FSSAI / GS1 / ISO Ready)
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-slate-300 text-[11px] font-mono shrink-0">
            <span>FSSAI FoSCoS Aligned</span>
            <span>•</span>
            <span>Legal Metrology Act</span>
            <span>•</span>
            <span>GS1 India Standard</span>
          </div>
        </div>
      </div>

      {/* Sticky Corporate Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                  VeriPack
                </span>
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  India
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Digital Product Passport Suite
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <button
              onClick={() => scrollTo("how-it-works")}
              className="hover:text-emerald-700 transition cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("compliance-standards")}
              className="hover:text-emerald-700 transition cursor-pointer"
            >
              Compliance Standards
            </button>
            <button
              onClick={() => scrollTo("client-demo")}
              className="hover:text-emerald-700 transition cursor-pointer"
            >
              Live Client Demo
            </button>
            <button
              onClick={() => scrollTo("industry-use-cases")}
              className="hover:text-emerald-700 transition cursor-pointer"
            >
              Industry Solutions
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="hover:text-emerald-700 transition cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onLoadSampleClient}
              id="header-load-sample-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 hover:bg-amber-100 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Load Sample (Royal Ghee)</span>
            </button>

            <button
              onClick={onStartBuilder}
              id="header-create-qr-btn"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-xs transition active:scale-98 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-300" />
              <span>Create Product QR</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-3 text-base font-semibold text-slate-800">
              <button
                onClick={() => scrollTo("how-it-works")}
                className="text-left py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>How It Works</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => scrollTo("compliance-standards")}
                className="text-left py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Compliance Standards</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => scrollTo("client-demo")}
                className="text-left py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Live Client Demo (Royal Ghee)</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => scrollTo("industry-use-cases")}
                className="text-left py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Industry Solutions</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => scrollTo("faq")}
                className="text-left py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>FAQ & FSSAI Guidelines</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <div className="pt-3 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLoadSampleClient();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-amber-900 bg-amber-50 border border-amber-300"
                >
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  Load Real Client Example (Royal Ghee)
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onStartBuilder();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-sm"
                >
                  <QrCode className="w-4 h-4 text-emerald-300" />
                  Create Product QR Now
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
