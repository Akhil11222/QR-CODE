"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ComplianceStrip from "@/components/ComplianceStrip";
import HowItWorks from "@/components/HowItWorks";
import IndustryUseCases from "@/components/IndustryUseCases";
import WizardForm from "@/components/WizardForm";
import OutputScreen from "@/components/OutputScreen";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { FormData, SAMPLE_CLIENT_DATA } from "@/types";
import { QrCode, Sparkles, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const builderSectionRef = useRef<HTMLDivElement>(null);

  const scrollToBuilder = () => {
    if (builderSectionRef.current) {
      builderSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleStartBuilder = () => {
    setIsCompleted(false);
    setTimeout(scrollToBuilder, 50);
  };

  const handleLoadSampleClient = () => {
    setFormData(SAMPLE_CLIENT_DATA);
    setIsCompleted(false);
    setTimeout(scrollToBuilder, 50);
  };

  const handlePreviewClient = () => {
    setFormData(SAMPLE_CLIENT_DATA);
    setIsCompleted(false);
    setTimeout(scrollToBuilder, 50);
  };

  const handleFormComplete = (data: FormData) => {
    setFormData(data);
    setIsCompleted(true);
    setTimeout(scrollToBuilder, 50);
  };

  const handleEdit = () => {
    setIsCompleted(false);
    setTimeout(scrollToBuilder, 50);
  };

  const handleReset = () => {
    setFormData(null);
    setIsCompleted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* 1. Top Regulatory Announcement Bar & Sticky Header */}
      <Header
        onStartBuilder={handleStartBuilder}
        onLoadSampleClient={handleLoadSampleClient}
      />

      {/* 2. Enterprise Hero Section with Dual Mockup Showcase */}
      <HeroSection
        onStartBuilder={handleStartBuilder}
        onPreviewClient={handlePreviewClient}
      />

      {/* 3. Compliance & Industry Standards Strip */}
      <ComplianceStrip />

      {/* 4. "How It Works" Section */}
      <HowItWorks onStartBuilder={handleStartBuilder} />

      {/* 5. Interactive 5-Step Product & Compliance QR Builder Studio */}
      <section
        ref={builderSectionRef}
        id="qr-builder-section"
        className="py-16 lg:py-24 bg-slate-100/70 border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3">
              <QrCode className="w-3.5 h-3.5 text-emerald-700" />
              <span>Interactive Compliance Studio</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {isCompleted ? "Your Verified Product Passport is Ready" : "Generate Product QR & Official Dossier"}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {isCompleted
                ? "Download print-ready QR stickers for packaging or the official auto-branded compliance PDF."
                : "Fill in the statutory packaging details below or load our real client example to test the full flow in 1-click."}
            </p>
          </div>

          {/* Builder or Output Screen */}
          {isCompleted && formData ? (
            <OutputScreen
              formData={formData}
              onEdit={handleEdit}
              onReset={handleReset}
            />
          ) : (
            <WizardForm
              onComplete={handleFormComplete}
              initialData={formData}
            />
          )}
        </div>
      </section>

      {/* 6. Industry Use-Cases Section */}
      <IndustryUseCases onLoadSample={handleLoadSampleClient} />

      {/* 7. Corporate FAQ Section */}
      <FAQSection />

      {/* 8. Full Corporate Multi-Column Footer */}
      <Footer />
    </div>
  );
}
