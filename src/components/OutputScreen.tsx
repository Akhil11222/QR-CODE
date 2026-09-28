"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  RefreshCw,
  QrCode,
  FileText,
  Printer,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Award,
} from "lucide-react";
import { FormData } from "@/types";
import { compressFormData } from "@/lib/compression";
import { generateQRDataUrl, downloadQRPng, downloadQRSvg } from "@/lib/qrGenerator";
import { generatePDF, downloadPDF } from "@/lib/pdfGenerator";
import Image from "next/image";

interface OutputScreenProps {
  formData: FormData;
  onEdit: () => void;
  onReset: () => void;
}

export default function OutputScreen({ formData, onEdit, onReset }: OutputScreenProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [scanUrl, setScanUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingPNG, setIsDownloadingPNG] = useState(false);
  const [isDownloadingSVG, setIsDownloadingSVG] = useState(false);

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://veripack-qr.vercel.app";
    const compressed = compressFormData(formData);
    const fullUrl = `${origin}/view?v=${compressed}`;
    setScanUrl(fullUrl);

    generateQRDataUrl(fullUrl, {
      color: formData.brandColors.primary || "#0F5132",
      size: 600,
    }).then(setQrDataUrl);
  }, [formData]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(scanUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      const doc = await generatePDF(formData);
      downloadPDF(doc, formData.firmName);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleDownloadPNG = async () => {
    setIsDownloadingPNG(true);
    try {
      await downloadQRPng(scanUrl, formData.firmName, formData.brandColors.primary);
    } finally {
      setIsDownloadingPNG(false);
    }
  };

  const handleDownloadSVG = async () => {
    setIsDownloadingSVG(true);
    try {
      await downloadQRSvg(scanUrl, formData.firmName, formData.brandColors.primary);
    } finally {
      setIsDownloadingSVG(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Success Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-7 h-7 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Generated Successfully
              </span>
              <span className="text-xs font-mono text-slate-500">GTIN: {formData.productId}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {formData.productName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Official Digital Product Passport &amp; Scannable Packaging QR are ready for industrial printing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onEdit}
            className="flex-1 md:flex-none btn-outline-corporate text-xs font-bold cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Details</span>
          </button>
          <button
            onClick={onReset}
            className="flex-1 md:flex-none btn-outline-corporate text-xs font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Product</span>
          </button>
        </div>
      </div>

      {/* Main Grid: QR Downloads & Live Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: QR Sticker & Downloads (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Packaging Sticker Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Print-Ready Packaging QR Sticker
                </h3>
                <p className="text-xs text-slate-500">
                  High-DPI format calibrated for corrugated boxes, pouches, labels &amp; jars.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                100% Scannable
              </span>
            </div>

            {/* Sticker Preview Box */}
            <div className="max-w-xs mx-auto bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 text-center shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                  {formData.brandName || formData.firmName}
                </span>
                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  FSSAI COMPLIANT
                </span>
              </div>

              {/* QR Image */}
              <div className="relative w-48 h-48 mx-auto bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center my-3">
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt="Packaging QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrCode className="w-20 h-20 text-slate-300 animate-pulse" />
                )}
              </div>

              <p className="text-[11px] font-bold text-slate-900 tracking-tight uppercase">
                Scan to Verify Product Details
              </p>
              <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                FSSAI Reg: {formData.licenceNumber}
              </p>
            </div>

            {/* Download Buttons Bar */}
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleDownloadPNG}
                disabled={isDownloadingPNG || !qrDataUrl}
                className="btn-navy text-xs font-bold py-3 cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download 800DPI PNG</span>
              </button>

              <button
                onClick={handleDownloadSVG}
                disabled={isDownloadingSVG || !qrDataUrl}
                className="btn-outline-corporate text-xs font-bold py-3 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Download Vector SVG</span>
              </button>
            </div>
          </div>

          {/* Official PDF Dossier Download Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-xs"
                style={{ backgroundColor: formData.brandColors.primary || "#0F5132" }}
              >
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Official Regulatory Certificate
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-semibold text-emerald-800">Branded Theme</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Auto-Branded Official PDF Dossier
                </h3>
                <p className="text-xs text-slate-500">
                  Formatted A4 compliance certificate with structured tables &amp; verification seal.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPDF}
              className="w-full sm:w-auto btn-emerald text-xs font-bold py-3.5 px-6 whitespace-nowrap cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-200" />
              <span>{isDownloadingPDF ? "Generating PDF..." : "Download Official PDF"}</span>
            </button>
          </div>

          {/* Scan URL & Direct Testing Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Encrypted Mobile Scan URL
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {scanUrl.length} chars (Instant Camera Scan)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={scanUrl}
                className="flex-1 form-input text-xs font-mono bg-white py-2 px-3 text-slate-700 select-all"
              />
              <button
                onClick={handleCopy}
                className="btn-outline-corporate text-xs font-bold py-2 px-3.5 whitespace-nowrap cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Anyone scanning the QR is routed to this secure passport screen.</span>
              <a
                href={scanUrl}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1 hover:underline"
              >
                <span>Test Scan in Browser</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Live Mobile Phone Scan Simulator (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 p-3 rounded-3xl shadow-xl border border-slate-800">
            <div className="flex items-center justify-between text-white text-xs px-3 py-1 mb-2 font-mono">
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">Consumer Phone Scan Simulation</span>
              </div>
              <span className="text-[10px] text-slate-400">iOS / Android Ready</span>
            </div>

            {/* Mobile Frame */}
            <div className="bg-slate-100 rounded-2xl overflow-hidden text-xs max-h-[680px] overflow-y-auto">
              {/* Phone Header Banner */}
              <div
                className="p-4 text-white"
                style={{
                  background: `linear-gradient(135deg, ${
                    formData.brandColors.primary || "#0F5132"
                  }, ${formData.brandColors.secondary || "#059669"})`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded">
                    Verified Product
                  </span>
                  <div className="w-5 h-5 bg-white border border-white flex items-center justify-center p-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                  </div>
                </div>

                <h4 className="text-base font-extrabold">{formData.productName}</h4>
                <p className="text-[11px] text-white/80">
                  {formData.brandName} • {formData.firmName}
                </p>
              </div>

              {/* Scanned Details Table in phone */}
              <div className="p-4 space-y-3">
                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-[11px]">
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500 font-bold uppercase text-[9px]">Product Id</span>
                    <span className="font-mono font-bold text-slate-900">{formData.productId}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500 font-bold uppercase text-[9px]">Pack Size</span>
                    <span className="font-medium text-slate-900">{formData.netQuantity}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500 font-bold uppercase text-[9px]">MRP</span>
                    <span className="font-bold text-slate-900">{formData.mrp}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500 font-bold uppercase text-[9px]">FSSAI Lic No.</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {formData.licenceNumber}
                    </span>
                  </div>
                  <div className="p-2.5">
                    <span className="text-slate-500 font-bold uppercase text-[9px] block">Company Address</span>
                    <span className="text-slate-800 text-[10px] leading-tight block mt-0.5">
                      {formData.firmAddress}
                    </span>
                  </div>
                </div>

                {/* Composition */}
                <div className="bg-white rounded-xl border border-slate-200 p-3">
                  <span className="text-slate-500 font-bold uppercase text-[9px] block mb-1.5">
                    Ingredients Declared
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {formData.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded text-[10px]"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Button inside phone */}
                <a
                  href={scanUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full block text-center py-2.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-xs text-xs"
                >
                  Open Full Mobile Scan Page &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
