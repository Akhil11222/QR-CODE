"use client";

import { useState, useRef } from "react";
import { QrCode, Zap } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import WizardForm from "@/components/WizardForm";
import OutputScreen from "@/components/OutputScreen";
import { FormData } from "@/types";

type AppState = "hero" | "wizard" | "output";

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("hero");
  const [completedData, setCompletedData] = useState<FormData | null>(null);
  const wizardSectionRef = useRef<HTMLDivElement>(null);

  const scrollToWizard = () => {
    wizardSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleGetStarted = () => {
    setAppState("wizard");
    setTimeout(scrollToWizard, 100);
  };

  const handleFormComplete = (data: FormData) => {
    setCompletedData(data);
    setAppState("output");
    setTimeout(scrollToWizard, 100);
  };

  const handleReset = () => {
    setCompletedData(null);
    setAppState("hero");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Sticky Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(2, 6, 23, 0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <QrCode size={17} color="white" />
          </div>
          <span
            className="font-display"
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #fff, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            VeriPack QR
          </span>
        </div>

        {/* Nav CTA */}
        {appState !== "wizard" && appState !== "output" && (
          <button
            onClick={handleGetStarted}
            className="btn-primary"
            style={{ padding: "8px 18px", fontSize: "0.85rem", borderRadius: 8 }}
            id="nav-create-btn"
          >
            <Zap size={14} />
            Create QR
          </button>
        )}

        {(appState === "wizard" || appState === "output") && (
          <button
            onClick={handleReset}
            className="btn-secondary"
            style={{ padding: "7px 14px", fontSize: "0.82rem" }}
          >
            ← Home
          </button>
        )}
      </nav>

      {/* Hero Section */}
      {appState === "hero" && (
        <HeroSection onGetStarted={handleGetStarted} />
      )}

      {/* Wizard / Output Section */}
      {(appState === "wizard" || appState === "output") && (
        <div
          ref={wizardSectionRef}
          style={{
            minHeight: "100vh",
            paddingTop: 80,
            paddingBottom: 60,
            padding: "80px 24px 60px",
          }}
        >
          {/* Section Header */}
          {appState === "wizard" && (
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 14px",
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 99,
                  marginBottom: 16,
                }}
              >
                <Zap size={13} color="#818cf8" />
                <span style={{ fontSize: "0.78rem", color: "#a5b4fc", fontWeight: 600 }}>
                  4-Step Guided Wizard
                </span>
              </div>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                  fontWeight: 800,
                  marginBottom: 10,
                  letterSpacing: "-0.02em",
                }}
              >
                Create Your <span className="text-gradient">Product Passport</span>
              </h2>
              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto" }}>
                Fill in the details below. We&apos;ll auto-generate a branded PDF dossier and a scannable QR code.
              </p>
            </div>
          )}

          {appState === "wizard" && (
            <WizardForm onComplete={handleFormComplete} />
          )}

          {appState === "output" && completedData && (
            <OutputScreen formData={completedData} onReset={handleReset} />
          )}
        </div>
      )}
    </div>
  );
}
