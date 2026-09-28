"use client";

import { useState, useEffect } from "react";
import {
  Download,
  QrCode,
  FileText,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Building2,
  Phone,
  Mail,
  MapPin,
  Award,
  ListChecks,
} from "lucide-react";
import { FormData } from "@/types";
import { compressFormData } from "@/lib/compression";
import { createTinyThumbnail } from "@/lib/imageUtils";
import { generatePDF, downloadPDF } from "@/lib/pdfGenerator";
import {
  generateQRCodeDataUrl,
  generateQRCodeSvg,
  generateStickerCanvas,
  downloadDataUrl,
  downloadSvgString,
} from "@/lib/qrGenerator";
import Image from "next/image";

interface OutputScreenProps {
  formData: FormData;
  onReset: () => void;
}

export default function OutputScreen({ formData, onReset }: OutputScreenProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrSvg, setQrSvg] = useState<string>("");
  const [scanUrl, setScanUrl] = useState<string>("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function buildQrAndAssets() {
      try {
        let prodThumb: string | undefined = undefined;
        let logoThumb: string | undefined = undefined;

        if (formData.productImageDataUrl) {
          try {
            prodThumb = await createTinyThumbnail(formData.productImageDataUrl, 48);
          } catch {
            prodThumb = undefined;
          }
        }
        if (formData.logoDataUrl) {
          try {
            logoThumb = await createTinyThumbnail(formData.logoDataUrl, 40);
          } catch {
            logoThumb = undefined;
          }
        }

        const compressed = compressFormData(formData, prodThumb, logoThumb);
        const origin =
          typeof window !== "undefined"
            ? window.location.origin
            : "https://veripack-dusky.vercel.app";
        const fullUrl = `${origin}/view?v=${compressed}`;

        if (!mounted) return;
        setScanUrl(fullUrl);

        const pngUrl = await generateQRCodeDataUrl(fullUrl, formData.brandColors);
        const svgStr = await generateQRCodeSvg(fullUrl, formData.brandColors);

        if (!mounted) return;
        setQrDataUrl(pngUrl);
        setQrSvg(svgStr);
      } catch (err) {
        console.error("Error generating QR:", err);
      }
    }

    buildQrAndAssets();
    return () => {
      mounted = false;
    };
  }, [formData]);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = await generatePDF(formData, scanUrl);
      downloadPDF(doc, formData.firmName);
      setPdfDownloaded(true);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const clean = (formData.firmName || "Product").replace(/[^a-zA-Z0-9]/g, "_");
    downloadDataUrl(qrDataUrl, `${clean}_QR_Code.png`);
  };

  const handleDownloadQrSvg = () => {
    if (!qrSvg) return;
    const clean = (formData.firmName || "Product").replace(/[^a-zA-Z0-9]/g, "_");
    downloadSvgString(qrSvg, `${clean}_QR_Vector.svg`);
  };

  const handleDownloadSticker = async () => {
    if (!qrDataUrl) return;
    const stickerUrl = await generateStickerCanvas(
      qrDataUrl,
      formData.firmName,
      formData.licenceNumber,
      formData.brandColors
    );
    const clean = (formData.firmName || "Product").replace(/[^a-zA-Z0-9]/g, "_");
    downloadDataUrl(stickerUrl, `${clean}_Printable_QR_Label.png`);
  };

  const handleCopyLink = () => {
    if (!scanUrl) return;
    navigator.clipboard.writeText(scanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Completion Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-base sm:text-xl font-bold text-slate-900">
              Your Product PDF &amp; QR Code Are Ready
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Download your branded PDF document and scannable QR code below.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Create Another QR</span>
        </button>
      </div>

      {/* Main 2-Column Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 Cols): Structured PDF Preview & Download */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Action Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Structured Product PDF Document
                </h3>
                <p className="text-[11px] text-slate-500">
                  Themed with your brand colors ({formData.brandColors.primary})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>
                {isGeneratingPdf
                  ? "Building PDF..."
                  : pdfDownloaded
                  ? "Download PDF Again"
                  : "Download PDF"}
              </span>
            </button>
          </div>

          {/* Live Structured PDF Sheet Preview */}
          <div className="p-4 sm:p-6">
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-xs bg-white">
              {/* Dynamic Brand Header */}
              <div
                className="p-4 sm:p-5 text-white flex items-center justify-between gap-4"
                style={{ backgroundColor: formData.brandColors.primary }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {formData.logoDataUrl && (
                    <div className="relative w-12 h-12 rounded-lg bg-white p-1 shrink-0 overflow-hidden">
                      <Image
                        src={formData.logoDataUrl}
                        alt="Logo"
                        fill
                        className="object-contain p-0.5"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-extrabold truncate">
                      {formData.brandName &&
                      formData.brandName !== formData.firmName
                        ? `${formData.brandName} — ${formData.firmName}`
                        : formData.firmName}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/15 text-[11px] font-semibold mt-1">
                      <Award className="w-3 h-3" />
                      <span>
                        {formData.licenceType}: {formData.licenceNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF Sheet Content Preview */}
              <div className="p-4 sm:p-5 space-y-4 text-xs">
                {/* Product Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  {formData.productImageDataUrl && (
                    <div className="sm:col-span-4 flex justify-center">
                      <div className="relative w-24 h-24 rounded-lg bg-white border border-slate-200 overflow-hidden">
                        <Image
                          src={formData.productImageDataUrl}
                          alt="Product"
                          fill
                          className="object-contain p-1"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={`${
                      formData.productImageDataUrl
                        ? "sm:col-span-8"
                        : "sm:col-span-12"
                    } grid grid-cols-2 gap-2.5`}
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                        Product Name
                      </span>
                      <span className="font-bold text-slate-800">
                        {formData.productName || formData.firmName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                        Product ID
                      </span>
                      <span className="font-bold text-slate-800">
                        {formData.productId}
                      </span>
                    </div>
                    {formData.netQuantity && (
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                          Net Quantity
                        </span>
                        <span className="font-bold text-slate-800">
                          {formData.netQuantity}
                        </span>
                      </div>
                    )}
                    {formData.mrp && (
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                          MRP
                        </span>
                        <span className="font-bold text-slate-800">
                          {formData.mrp}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Firm & Contact Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                      <Building2 className="w-3 h-3 text-indigo-600" />
                      <span>Firm Address</span>
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {formData.firmAddress}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{formData.mobile}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold break-all">
                      <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{formData.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Lic: {formData.licenceNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Ingredients Row */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                    <ListChecks className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Ingredients ({formData.ingredients.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium text-[11px]"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols): Scannable QR Code & Download Options */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <QrCode className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Scannable Product QR Code
              </h3>
              <p className="text-[11px] text-slate-500">
                Scanning this QR opens your Product PDF on any phone
              </p>
            </div>
          </div>

          {/* QR Image Display */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-200">
            {qrDataUrl ? (
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <Image
                  src={qrDataUrl}
                  alt="Generated Product QR Code"
                  width={210}
                  height={210}
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                Generating QR Code...
              </div>
            )}
            <span className="text-xs font-bold text-slate-700 mt-3">
              {formData.firmName}
            </span>
            <span className="text-[11px] text-slate-500">
              Scan to open PDF document
            </span>
          </div>

          {/* QR Download Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleDownloadQrPng}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download QR Code (PNG)</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleDownloadQrSvg}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Vector SVG</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSticker}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>QR Sticker Card</span>
              </button>
            </div>
          </div>

          {/* Direct Scan Link & Test Button */}
          {scanUrl && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  Direct QR Scan Link
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Link
                      </>
                    )}
                  </button>
                  <a
                    href={scanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-indigo-600"
                  >
                    <span>Test Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
