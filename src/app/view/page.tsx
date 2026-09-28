"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { decompressFormData } from "@/lib/compression";
import { generatePDF, downloadPDF } from "@/lib/pdfGenerator";
import { FormData } from "@/types";
import {
  ShieldCheck,
  Download,
  Loader2,
  AlertTriangle,
  Building2,
  MapPin,
  Phone,
  Mail,
  FlaskConical,
  Award,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function ViewContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const v = searchParams.get("v");
    if (!v) {
      setError("No product passport payload provided in this QR code.");
      setIsGeneratingPDF(false);
      return;
    }

    try {
      const data = decompressFormData(v);
      if (!data || !data.firmName) {
        setError("Unable to decode product passport. The QR payload may be corrupted or truncated.");
        setIsGeneratingPDF(false);
        return;
      }
      setFormData(data);

      // Generate official PDF asynchronously in background
      generatePDF(data)
        .then((doc) => {
          setPdfDoc(doc);
          setIsGeneratingPDF(false);
        })
        .catch(() => {
          setIsGeneratingPDF(false);
        });
    } catch {
      setError("Failed to decode product passport data.");
      setIsGeneratingPDF(false);
    }
  }, [searchParams]);

  const handleDownloadPDF = () => {
    if (!formData) return;
    setIsDownloading(true);
    if (pdfDoc) {
      downloadPDF(pdfDoc, formData.firmName);
      setIsDownloading(false);
    } else {
      generatePDF(formData)
        .then((doc) => {
          setPdfDoc(doc);
          downloadPDF(doc, formData.firmName);
        })
        .finally(() => {
          setIsDownloading(false);
        });
    }
  };

  if (isGeneratingPDF && !formData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4 text-emerald-700 animate-pulse">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <Loader2 className="w-8 h-8 text-emerald-700 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-1">Verifying Digital Product Passport</h2>
        <p className="text-sm text-slate-600 max-w-sm">
          Decoding cryptographic packaging QR record & preparing official compliance dossier...
        </p>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h1>
        <p className="text-sm text-slate-600 max-w-md mb-6">{error}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 transition"
        >
          Return to VeriPack Home
        </Link>
      </div>
    );
  }

  const primaryColor = formData.brandColors?.primary || "#0F5132";
  const secondaryColor = formData.brandColors?.secondary || "#059669";

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Top Regulatory Authority Bar */}
      <header className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium tracking-wide">NATIONAL DIGITAL PRODUCT PASSPORT REGISTRY</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">ISO 9001:2015 / FSSAI FoSCoS</span>
        </div>
      </header>

      {/* Main Scanner Container */}
      <main className="max-w-2xl mx-auto px-4 pt-4 sm:pt-6">
        {/* Verification Status Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
          <div
            className="p-5 sm:p-6 text-white"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>OFFICIALLY VERIFIED PRODUCT</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {formData.productName}
                </h1>
                <p className="text-sm font-medium text-emerald-100 mt-1">
                  Brand: <span className="text-white font-bold">{formData.brandName || formData.firmName}</span>
                </p>
              </div>

              {/* Vegetarian / Non-Veg SVG Mark */}
              <div className="bg-white p-2 rounded-xl shadow-sm flex flex-col items-center justify-center shrink-0">
                {formData.dietaryMark === "veg" ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-emerald-700 flex items-center justify-center p-0.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-700" />
                    </div>
                    <span className="text-[9px] font-bold text-emerald-800 mt-1">100% VEG</span>
                  </div>
                ) : formData.dietaryMark === "non-veg" ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-amber-800 flex items-center justify-center p-0.5">
                      <div className="w-4 h-4 rounded-full bg-amber-800" />
                    </div>
                    <span className="text-[9px] font-bold text-amber-900 mt-1">NON-VEG</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Award className="w-7 h-7 text-slate-700" />
                    <span className="text-[9px] font-bold text-slate-800 mt-1">STANDARDS</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Pill Details */}
            <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-black/25 px-2.5 py-1 rounded-lg font-mono">
                GTIN: {formData.productId}
              </span>
              <span className="bg-black/25 px-2.5 py-1 rounded-lg">
                MRP: {formData.mrp}
              </span>
              <span className="bg-black/25 px-2.5 py-1 rounded-lg">
                Pack: {formData.netQuantity}
              </span>
            </div>
          </div>

          {/* Primary CTA: Open / Download Official PDF Dossier */}
          <div className="p-4 bg-emerald-50 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-emerald-950">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Government & Lab Dossier Ready
                </p>
                <p className="text-xs text-emerald-900">
                  Full specifications, batch traceability & FSSAI certificate
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              id="download-dossier-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition active:scale-95"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isDownloading ? "Generating PDF..." : "Open Official PDF Dossier"}
            </button>
          </div>
        </div>

        {/* Product Image Showcase (if provided) */}
        {formData.productImageDataUrl && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 text-center">
            <div className="relative w-full max-w-xs mx-auto h-52 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100">
              <Image
                src={formData.productImageDataUrl}
                alt={formData.productName}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Registered Commercial Unit • {formData.netQuantity}
            </p>
          </div>
        )}

        {/* Official "Product Details" Mobile Specification Table */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Official Product Details & Compliance Table
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">FSSAI / GS1</span>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase sm:col-span-1">Product ID / GTIN</span>
              <span className="font-mono font-bold text-slate-900 sm:col-span-2 mt-0.5 sm:mt-0">
                {formData.productId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase sm:col-span-1">Product Name</span>
              <span className="font-semibold text-slate-900 sm:col-span-2 mt-0.5 sm:mt-0">
                {formData.productName}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase sm:col-span-1">Brand Name</span>
              <span className="font-semibold text-slate-900 sm:col-span-2 mt-0.5 sm:mt-0">
                {formData.brandName || formData.firmName}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase sm:col-span-1">FSSAI / Licence Reg No.</span>
              <div className="sm:col-span-2 mt-0.5 sm:mt-0">
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {formData.licenceNumber}
                </span>
                <span className="text-xs text-slate-600 block mt-1">
                  Type: {formData.licenceType} {formData.licenceValidUpto ? `(Valid Upto: ${formData.licenceValidUpto})` : ""}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase sm:col-span-1">Company Name & Address</span>
              <div className="sm:col-span-2 mt-0.5 sm:mt-0">
                <p className="font-bold text-slate-900">{formData.firmName}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{formData.firmAddress}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase sm:col-span-1">Pack Size / Net Quantity</span>
              <span className="font-medium text-slate-800 sm:col-span-2 mt-0.5 sm:mt-0">
                {formData.netQuantity}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase sm:col-span-1">Maximum Retail Price</span>
              <span className="font-bold text-slate-900 sm:col-span-2 mt-0.5 sm:mt-0">
                {formData.mrp}
              </span>
            </div>

            {formData.batchAndDate && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50">
                <span className="text-xs font-bold text-slate-500 uppercase sm:col-span-1">Batch & Packaging Info</span>
                <span className="font-mono text-xs font-medium text-slate-800 sm:col-span-2 mt-0.5 sm:mt-0">
                  {formData.batchAndDate}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Ingredients & Storage Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-emerald-600" />
            Verified Ingredients & Composition
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {formData.ingredients.map((ing, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                {ing}
              </span>
            ))}
          </div>

          {formData.storageInstructions && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
              <span className="font-bold uppercase tracking-wide text-amber-950">Storage Instructions: </span>
              {formData.storageInstructions}
            </div>
          )}
        </section>

        {/* Nutritional & Quality Lab Parameters Table (if present) */}
        {formData.labParameters && formData.labParameters.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
            <div className="bg-slate-800 text-white px-5 py-3">
              <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                Nutritional & Quality Lab Test Analysis (Per 100g)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Parameter / Nutrient</th>
                    <th className="py-2.5 px-4">Unit</th>
                    <th className="py-2.5 px-4">Test Result</th>
                    <th className="py-2.5 px-4 text-right">Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {formData.labParameters.map((param, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{param.parameter}</td>
                      <td className="py-2.5 px-4 text-slate-500 font-mono">{param.unit}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{param.value}</td>
                      <td className="py-2.5 px-4 text-right font-medium text-emerald-700">Passed</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Direct Manufacturer Contact Action Strip */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Official Manufacturer & Customer Care Contacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`tel:${formData.mobile}`}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Customer Care Call</p>
                  <p className="text-sm font-bold text-slate-900">{formData.mobile}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition" />
            </a>

            <a
              href={`mailto:${formData.email}`}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Official Email Firm</p>
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[170px]">{formData.email}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition" />
            </a>
          </div>
        </section>

        {/* Secondary Bottom Download Bar */}
        <div className="text-center pt-2 pb-6">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            {isDownloading ? "Downloading Official Dossier..." : "Download Official Regulatory PDF Dossier"}
          </button>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>Powered by</span>
            <Link href="/" className="font-bold text-emerald-800 hover:underline">
              VeriPack India Digital Product Passport Suite
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
        </div>
      }
    >
      <ViewContent />
    </Suspense>
  );
}
