"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Download, QrCode, FileText, RefreshCcw, Share2,
  CheckCircle, Loader2, Building2, Mail, Phone,
  MapPin, Shield, AlertTriangle, ExternalLink
} from "lucide-react";
import { FormData } from "@/types";
import { generatePDF, downloadPDF } from "@/lib/pdfGenerator";
import { generateQRDataUrl, downloadQRPng, downloadQRSvg, checkQRLength } from "@/lib/qrGenerator";
import { compressFormData } from "@/lib/compression";


interface OutputScreenProps {
  formData: FormData;
  onReset: () => void;
}

export default function OutputScreen({ formData, onReset }: OutputScreenProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [qrWarning, setQrWarning] = useState<string | null>(null);
  const [generating, setGenerating] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingQr, setDownloadingQr] = useState(false);
  const [copied, setCopied] = useState(false);


  useEffect(() => {
    async function generate() {
      try {
        // Generate PDF
        const doc = await generatePDF(formData);
        setPdfDoc(doc);

        // Build QR URL
        const baseUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/view`
            : "https://veripack-qr.vercel.app/view";
        const compressed = compressFormData(formData);
        const fullUrl = `${baseUrl}?v=${compressed}`;
        setQrUrl(fullUrl);

        // Check QR length
        const check = checkQRLength(fullUrl);
        if (!check.ok) setQrWarning(check.warning || null);

        // Generate QR code image
        const qrImg = await generateQRDataUrl(fullUrl, {
          color: formData.brandColors.primary,
          size: 400,
        });
        setQrDataUrl(qrImg);
      } catch (err) {
        console.error("Generation error:", err);
      } finally {
        setGenerating(false);
      }
    }

    generate();
  }, [formData]);

  const handleDownloadPdf = useCallback(async () => {
    if (!pdfDoc) return;
    setDownloadingPdf(true);
    try {
      downloadPDF(pdfDoc, formData.firmName);
    } finally {
      setDownloadingPdf(false);
    }
  }, [pdfDoc, formData.firmName]);

  const handleDownloadQrPng = useCallback(async () => {
    if (!qrUrl) return;
    setDownloadingQr(true);
    try {
      await downloadQRPng(qrUrl, formData.firmName, formData.brandColors.primary);
    } finally {
      setDownloadingQr(false);
    }
  }, [qrUrl, formData.firmName, formData.brandColors.primary]);

  const handleDownloadQrSvg = useCallback(async () => {
    if (!qrUrl) return;
    await downloadQRSvg(qrUrl, formData.firmName, formData.brandColors.primary);
  }, [qrUrl, formData.firmName, formData.brandColors.primary]);

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  }, [qrUrl]);

  if (generating) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 320,
          gap: 20,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: `3px solid ${formData.brandColors.primary}40`,
            borderTop: `3px solid ${formData.brandColors.primary}`,
            animation: "spin 0.9s linear infinite",
          }}
        />
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Generating your Official Dossier...
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
            Applying brand colors & building PDF
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }} className="animate-fade-in-up">
      {/* Success Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
            boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
          }}
        >
          <CheckCircle size={28} color="white" />
        </div>
        <h2
          className="font-display"
          style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, marginBottom: 8 }}
        >
          Your{" "}
          <span className="text-gradient">Official Product Passport</span> is Ready!
        </h2>
        <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
          Download the PDF dossier and QR code below. Anyone scanning the QR code will get the PDF instantly.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* ─── LEFT: PDF Section ─── */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(239,68,68,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={18} color="#f87171" />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Official PDF Dossier</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                A4 print-ready, branded document
              </p>
            </div>
          </div>

          {/* PDF Info Preview */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 10,
              padding: 16,
              marginBottom: 16,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                paddingBottom: 8,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: formData.brandColors.primary,
                }}
              />
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  wordBreak: "break-word",
                }}
              >
                {formData.firmName}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { icon: Shield, text: formData.licenceNumber },
                { icon: MapPin, text: formData.firmAddress.substring(0, 60) + (formData.firmAddress.length > 60 ? "..." : "") },
                { icon: Phone, text: formData.mobile },
                { icon: Mail, text: formData.email },
                { icon: Building2, text: `${formData.ingredients.length} ingredients listed` },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                  <Icon size={11} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                      wordBreak: "break-word",
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Colors Preview */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Brand Theme:</span>
            {[formData.brandColors.primary, formData.brandColors.secondary, formData.brandColors.tint].map(
              (c, i) => (
                <div
                  key={i}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    background: c,
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                  title={c}
                />
              )
            )}
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={!pdfDoc || downloadingPdf}
            className="btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${formData.brandColors.primary}, ${formData.brandColors.secondary})`,
            }}
            id="download-pdf-btn"
          >
            {downloadingPdf ? (
              <Loader2 size={16} style={{ animation: "spin 0.7s linear infinite" }} />
            ) : (
              <Download size={16} />
            )}
            Download Official PDF
          </button>
        </div>

        {/* ─── RIGHT: QR Code Section ─── */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(99,102,241,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <QrCode size={18} color="#818cf8" />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Scannable QR Code</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Opens PDF on any smartphone
              </p>
            </div>
          </div>

          {/* QR Code Display */}
          {qrDataUrl ? (
            <div
              className="qr-card"
              style={{ marginBottom: 14, padding: 16, position: "relative" }}
            >
              {/* Firm name label */}
              <div
                style={{
                  background: formData.brandColors.primary,
                  color: formData.brandColors.text,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "99px",
                  display: "inline-block",
                  marginBottom: 10,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {formData.firmName.substring(0, 30)}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt={`QR Code for ${formData.firmName}`}
                style={{ width: "100%", maxWidth: 200, height: "auto", margin: "0 auto", display: "block" }}
              />
              <p
                style={{
                  fontSize: "0.65rem",
                  color: "#64748b",
                  marginTop: 8,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Scan for Product Info &amp; PDF
              </p>
            </div>
          ) : (
            <div
              style={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 10,
                marginBottom: 14,
              }}
            >
              <Loader2 size={24} color="var(--text-muted)" style={{ animation: "spin 0.7s linear infinite" }} />
            </div>
          )}

          {/* QR Warning */}
          {qrWarning && (
            <div
              style={{
                display: "flex",
                gap: 8,
                padding: "10px 12px",
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.25)",
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <AlertTriangle size={14} color="#fbbf24" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: "0.75rem", color: "#fbbf24" }}>{qrWarning}</p>
            </div>
          )}

          {/* URL length indicator */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                marginBottom: 5,
              }}
            >
              <span>QR payload size</span>
              <span style={{ color: qrUrl.length > 1800 ? "#f87171" : "#10b981" }}>
                {qrUrl.length} / 1800 chars
              </span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min((qrUrl.length / 1800) * 100, 100)}%`,
                  background:
                    qrUrl.length > 1800
                      ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                      : "linear-gradient(90deg, #10b981, #3b82f6)",
                }}
              />
            </div>
          </div>

          {/* Download Buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button
              onClick={handleDownloadQrPng}
              disabled={!qrDataUrl || downloadingQr}
              className="btn-primary"
              style={{ flex: 1, justifyContent: "center", fontSize: "0.82rem", padding: "10px 12px" }}
              id="download-qr-png-btn"
            >
              {downloadingQr ? <Loader2 size={14} style={{ animation: "spin 0.7s linear infinite" }} /> : <Download size={14} />}
              PNG
            </button>
            <button
              onClick={handleDownloadQrSvg}
              disabled={!qrDataUrl}
              className="btn-secondary"
              style={{ flex: 1, justifyContent: "center", fontSize: "0.82rem", padding: "10px 12px" }}
              id="download-qr-svg-btn"
            >
              <Download size={14} />
              SVG
            </button>
          </div>

          {/* Copy URL */}
          <button
            onClick={handleCopyUrl}
            className="btn-secondary"
            style={{ width: "100%", justifyContent: "center", fontSize: "0.82rem" }}
            id="copy-url-btn"
          >
            {copied ? (
              <>
                <CheckCircle size={14} color="#10b981" />
                <span style={{ color: "#10b981" }}>Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                Copy QR Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Test QR Link */}
      {qrUrl && (
        <div
          className="glass-card"
          style={{ marginTop: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}
        >
          <ExternalLink size={14} color="var(--text-muted)" />
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", flex: 1 }}>
            Test your QR link:
            <a
              href={qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#818cf8",
                marginLeft: 6,
                wordBreak: "break-all",
                textDecoration: "none",
                fontSize: "0.75rem",
              }}
            >
              {qrUrl.substring(0, 80)}...
            </a>
          </p>
        </div>
      )}

      {/* Start Over */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button onClick={onReset} className="btn-secondary" id="start-over-btn">
          <RefreshCcw size={15} />
          Create Another Product Passport
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
