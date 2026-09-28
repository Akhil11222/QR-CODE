"use client";

import { useRef } from "react";
import {
  Zap, Shield, QrCode, FileText, Sparkles,
  ChevronDown, ArrowRight, Star, Globe, CheckCircle
} from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "80px 24px 60px",
      }}
    >
      {/* Background Orbs */}
      <div
        className="orb"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          top: -200,
          left: -200,
          animationDelay: "0s",
        }}
      />
      <div
        className="orb"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
          bottom: -150,
          right: -150,
          animationDelay: "3s",
        }}
      />
      <div
        className="orb"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
          top: "40%",
          right: "10%",
          animationDelay: "6s",
        }}
      />

      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Badge */}
      <div
        className="animate-fade-in-up"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 16px 6px 8px",
          background: "rgba(99,102,241,0.12)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 99,
          marginBottom: 28,
          animationDelay: "0.1s",
        }}
      >
        <span
          style={{
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            padding: "3px 8px",
            borderRadius: 99,
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "white",
            letterSpacing: "0.06em",
          }}
        >
          NEW
        </span>
        <span style={{ fontSize: "0.82rem", color: "#a5b4fc" }}>
          Digital Product Passport for Manufacturers
        </span>
        <Star size={12} color="#fbbf24" fill="#fbbf24" />
      </div>

      {/* Main Headline */}
      <h1
        className="font-display animate-fade-in-up"
        style={{
          fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
          fontWeight: 900,
          textAlign: "center",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          maxWidth: 800,
          marginBottom: 20,
          animationDelay: "0.2s",
        }}
      >
        Turn Your Firm Details Into an
        <br />
        <span className="text-gradient">Official Scannable PDF QR</span>
        <br />
        <span style={{ color: "var(--text-secondary)", fontWeight: 700 }}>In 60 Seconds.</span>
      </h1>

      {/* Subheadline */}
      <p
        className="animate-fade-in-up"
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          color: "var(--text-secondary)",
          textAlign: "center",
          maxWidth: 560,
          lineHeight: 1.6,
          marginBottom: 36,
          animationDelay: "0.3s",
        }}
      >
        Auto-branded PDF dossiers with a QR code that any smartphone can scan to instantly access your official product documentation — forever.
      </p>

      {/* CTA Button */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.4s", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <button
          onClick={onGetStarted}
          className="btn-primary"
          style={{
            fontSize: "1.05rem",
            padding: "16px 36px",
            borderRadius: 14,
            boxShadow: "0 8px 40px rgba(99,102,241,0.45), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
          id="create-qr-btn"
        >
          <Zap size={18} />
          Create Product QR Now
          <ArrowRight size={18} />
        </button>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Free • No account required • Instant download
        </p>
      </div>

      {/* Stats */}
      <div
        className="animate-fade-in-up"
        style={{
          display: "flex",
          gap: 28,
          marginTop: 48,
          marginBottom: 60,
          animationDelay: "0.5s",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { value: "100K+", label: "Concurrent Users" },
          { value: "< 60s", label: "Generation Time" },
          { value: "∞", label: "QR Scans Supported" },
          { value: "A4", label: "Print-Ready PDF" },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <p
              className="font-display"
              style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}
            >
              {stat.value}
            </p>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div
        className="animate-fade-in-up"
        style={{
          width: "100%",
          maxWidth: 860,
          animationDelay: "0.6s",
        }}
        id="how-it-works"
      >
        <p
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--text-muted)",
            marginBottom: 24,
          }}
        >
          How It Works
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              step: "01",
              icon: FileText,
              title: "Fill Your Details",
              description: "Enter firm name, licence number, contact info, and product ingredients in our guided wizard.",
              color: "#3b82f6",
            },
            {
              step: "02",
              icon: Sparkles,
              title: "Auto-Generate Branded PDF",
              description: "We extract brand colors from your logo and create a stunning, official A4 product dossier automatically.",
              color: "#8b5cf6",
            },
            {
              step: "03",
              icon: QrCode,
              title: "Download PDF & QR Code",
              description: "Get your branded PDF + a scannable QR that opens the PDF on anyone's smartphone, forever.",
              color: "#10b981",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: "22px 20px",
                  position: "relative",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px rgba(0,0,0,0.3), 0 0 0 1px ${item.color}25`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 14,
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    color: `${item.color}60`,
                    letterSpacing: "0.1em",
                  }}
                >
                  {item.step}
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${item.color}18`,
                    border: `1px solid ${item.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  <Icon size={20} color={item.color} />
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 8 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          opacity: 0.4,
          animation: "bounce 2s ease-in-out infinite",
        }}
      >
        <ChevronDown size={20} color="var(--text-secondary)" />
      </div>

      {/* Trust indicators */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 24px",
          display: "flex",
          gap: 20,
          justifyContent: "center",
          flexWrap: "wrap",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {[
          { icon: Shield, text: "FSSAI Compliant" },
          { icon: Globe, text: "Works Globally" },
          { icon: CheckCircle, text: "Zero Backend" },
        ].map(({ icon: Icon, text }, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon size={13} color="var(--text-muted)" />
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{text}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </section>
  );
}
