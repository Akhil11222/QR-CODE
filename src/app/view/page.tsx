"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { decompressFormData } from "@/lib/compression";
import { generatePDF } from "@/lib/pdfGenerator";
import { FormData } from "@/types";
import {
  CheckCircle, Download, Loader2, AlertTriangle,
  Building2, MapPin, Phone, Mail, Shield, FlaskConical, QrCode
} from "lucide-react";
import type { jsPDF } from "jspdf";

function ViewContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<jsPDF | null>(null);
  const [generating, setGenerating] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const v = searchParams.get("v");
    if (!v) {
      setError("Invalid or missing product passport data.");
      setGenerating(false);
      return;
    }

    try {
      const data = decompressFormData(v);
      if (!data || !data.firmName) {
        setError("Unable to decode product passport. The QR code may be corrupted or incomplete.");
        setGenerating(false);
        return;
      }
      setFormData(data);

      // Generate PDF
      generatePDF(data)
        .then((doc) => {
          setPdfDoc(doc);
          setGenerating(false);
        })
        .catch(() => {
          setError("Failed to generate PDF. Please try again.");
          setGenerating(false);
        });
    } catch {
      setError("Failed to decode product passport data.");
      setGenerating(false);
    }
  }, [searchParams]);

  const handleDownload = () => {
    if (!pdfDoc || !formData) return;
    setDownloading(true);
    try {
      const filename = `VeriPack_${formData.firmName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30)}_Product_Dossier.pdf`;
      pdfDoc.save(filename);
    } finally {
      setDownloading(false);
    }
  };

  if (generating) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-deep)",
          gap: 20,
          padding: 24,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <QrCode size={32} color="#818cf8" />
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid rgba(99,102,241,0.3)",
            borderTop: "3px solid #6366f1",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
            Loading Product Passport...
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Decoding QR data &amp; generating official dossier
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-deep)",
          gap: 16,
          padding: 24,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(239,68,68,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AlertTriangle size={28} color="#f87171" />
        </div>
        <h1 style={{ fontSize: "1.3rem", fontWeight: 700, textAlign: "center", color: "var(--text-primary)" }}>
          Invalid Product Passport
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", textAlign: "center", maxWidth: 360 }}>
          {error}
        </p>
        <a href="/" style={{ color: "#818cf8", fontSize: "0.9rem" }}>
          ← Go to VeriPack QR
        </a>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-deep)",
        padding: "24px 16px 48px",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          paddingTop: 16,
        }}
      >
        {/* VeriPack Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <QrCode size={14} color="white" />
          </div>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "-0.01em" }}>
            VeriPack QR — Verified Product Passport
          </span>
        </div>

        {/* ─── PASSPORT CARD ─── */}
        <div
          className="glass-card animate-fade-in-up"
          style={{ overflow: "hidden", marginBottom: 16 }}
        >
          {/* Colored Header */}
          <div
            style={{
              background: formData.brandColors.primary,
              padding: "20px 20px 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              {formData.logoDataUrl && (
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 10,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.1)",
                    flexShrink: 0,
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.logoDataUrl}
                    alt="Firm logo"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1
                  className="font-display"
                  style={{
                    fontSize: "clamp(1.1rem, 5vw, 1.4rem)",
                    fontWeight: 800,
                    color: formData.brandColors.text,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  {formData.firmName}
                </h1>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    marginTop: 8,
                    padding: "3px 10px",
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 99,
                  }}
                >
                  <Shield size={10} color="rgba(255,255,255,0.8)" />
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(255,255,255,0.85)",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {formData.licenceNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Image */}
          {formData.productImageDataUrl && (
            <div style={{ background: formData.brandColors.tint, padding: "12px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.productImageDataUrl}
                alt="Product"
                style={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "contain",
                  borderRadius: 8,
                  background: "white",
                }}
              />
            </div>
          )}

          {/* Details Section */}
          <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: MapPin, label: "Registered Address", value: formData.firmAddress },
                { icon: Phone, label: "Mobile", value: formData.mobile },
                { icon: Mail, label: "Email", value: formData.email },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: "flex", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: `${formData.brandColors.primary}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={15} color={formData.brandColors.primary} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--text-muted)",
                        marginBottom: 2,
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: "var(--text-primary)",
                        wordBreak: "break-word",
                        lineHeight: 1.4,
                      }}
                    >
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                margin: "18px 0",
              }}
            />

            {/* Ingredients */}
            {formData.ingredients.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <FlaskConical size={15} color={formData.brandColors.primary} />
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--text-muted)",
                    }}
                  >
                    Ingredients & Composition
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {formData.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "4px 10px",
                        background: `${formData.brandColors.primary}14`,
                        border: `1px solid ${formData.brandColors.primary}30`,
                        borderRadius: 99,
                        fontSize: "0.78rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Download PDF Button */}
        <button
          onClick={handleDownload}
          disabled={!pdfDoc || downloading}
          className="btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            fontSize: "1rem",
            padding: "16px",
            background: `linear-gradient(135deg, ${formData.brandColors.primary}, ${formData.brandColors.secondary})`,
            boxShadow: `0 8px 32px ${formData.brandColors.primary}50`,
          }}
          id="view-download-pdf-btn"
        >
          {downloading ? (
            <Loader2 size={18} style={{ animation: "spin 0.7s linear infinite" }} />
          ) : (
            <Download size={18} />
          )}
          {downloading ? "Downloading..." : "Download Official PDF Dossier"}
        </button>

        {/* Verified Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginTop: 14,
          }}
        >
          <CheckCircle size={14} color="#10b981" />
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Verified via VeriPack QR • Authentic product documentation
          </span>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <a href="/" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "none" }}>
            Create your own Product Passport at{" "}
            <span style={{ color: "#818cf8" }}>VeriPack QR</span>
          </a>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ViewPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-deep)",
          }}
        >
          <Loader2 size={32} color="#6366f1" style={{ animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      }
    >
      <ViewContent />
    </Suspense>
  );
}
