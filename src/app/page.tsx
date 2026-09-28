"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WizardForm from "@/components/WizardForm";
import OutputScreen from "@/components/OutputScreen";
import Footer from "@/components/Footer";
import { FormData } from "@/types";

type AppMode = "home" | "wizard" | "output";

export default function HomePage() {
  const [mode, setMode] = useState<AppMode>("home");
  const [completedData, setCompletedData] = useState<FormData | null>(null);

  const handleStartWizard = () => {
    setMode("wizard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormComplete = (data: FormData) => {
    setCompletedData(data);
    setMode("output");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setCompletedData(null);
    setMode("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        onCreateClick={handleStartWizard}
        onResetClick={handleReset}
        isWizardActive={mode !== "home"}
      />

      <main className="flex-1 flex flex-col justify-center">
        {mode === "home" && <HeroSection onGetStarted={handleStartWizard} />}

        {mode === "wizard" && (
          <section className="w-full py-6 sm:py-10 px-4 sm:px-6">
            <WizardForm onComplete={handleFormComplete} />
          </section>
        )}

        {mode === "output" && completedData && (
          <section className="w-full py-6 sm:py-10 px-4 sm:px-6">
            <OutputScreen formData={completedData} onReset={handleReset} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
