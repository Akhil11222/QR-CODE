"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Download,
  Phone,
  Mail,
  Building2,
  Award,
  ListChecks,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { decompressFormData } from "@/lib/compression";
import { generatePDF, downloadPDF } from "@/lib/pdfGenerator";
import { FormData } from "@/types";
import Image from "next/image";
import Link from "next/link";

function ViewPassportContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<FormData | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const raw = searchParams.get("v") || searchParams.get("d");
    if (!raw) {
      setError(true);
      setLoading(false);
      return;
    }

    const decoded = decompressFormData(raw);
    if (!decoded) {
      setError(true);
      setLoading(false);
      return;
    }

    setData(decoded);

    // Immediately build PDF and open/trigger it
    async function buildAndOpenPdf() {
      try {
        const currentHref =
          typeof window !== "undefined" ? window.location.href : "";
        const doc = await generatePDF(decoded!, currentHref);
        const blob = doc.output("blob");
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);

        // Auto-trigger PDF download/open so scanning the QR immediately gives the PDF
        downloadPDF(doc, decoded!.firmName);
      } catch (err) {
        console.error("Failed to generate PDF on scan:", err);
      } finally {
        setLoading(false);
      }
    }

    buildAndOpenPdf();
  }, [searchParams]);

  const handleManualDownload = async () => {
    if (!data) return;
    const doc = await generatePDF(
      data,
      typeof window !== "undefined" ? window.location.href : ""
    );
    downloadPDF(doc, data.firmName);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <h1 className="font-display text-lg font-bold text-slate-900">
          Opening Official Product PDF...
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Preparing structured PDF document from QR code
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h1 className="font-display text-lg font-bold text-slate-900">
            Invalid or Expired QR Link
          </h1>
          <p className="text-xs text-slate-500">
            Could not decode product details from this QR link.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Create New Product QR
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Top Action Bar: Instant PDF Open & Download */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: data.brandColors.primary || "#312E81" }}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-sm sm:text-base font-bold text-slate-900">
                {data.firmName} — Official Product PDF
              </h1>
              <p className="text-xs text-slate-500">
                Your PDF document is ready to view or download
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {pdfBlobUrl && (
              <a
                href={pdfBlobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open PDF</span>
              </a>
            )}
            <button
              type="button"
              onClick={handleManualDownload}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-sm transition cursor-pointer"
              style={{ backgroundColor: data.brandColors.primary || "#4F46E5" }}
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Inline PDF Viewer (Desktop/Supported Browsers) */}
        {pdfBlobUrl && (
          <div className="hidden sm:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <iframe
              src={pdfBlobUrl}
              title="Official Product PDF Document"
              className="w-full h-[560px] border-0"
            />
          </div>
        )}

        {/* Clean Mobile-Friendly Product Details Card */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          {/* Dynamic Brand Header */}
          <div
            className="p-5 text-white flex items-center justify-between gap-4"
            style={{ backgroundColor: data.brandColors.primary || "#312E81" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              {data.logoDataUrl && (
                <div className="relative w-12 h-12 rounded-lg bg-white p-1 shrink-0 overflow-hidden">
                  <Image
                    src={data.logoDataUrl}
                    alt="Logo"
                    fill
                    className="object-contain p-0.5"
                    unoptimized
                  />
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-semibold opacity-85 uppercase tracking-wider">
                  Product Details
                </div>
                <h2 className="font-display text-base sm:text-lg font-extrabold truncate">
                  {data.brandName && data.brandName !== data.firmName
                    ? `${data.brandName} — ${data.firmName}`
                    : data.firmName}
                </h2>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/15 text-[11px] font-semibold mt-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>
                    {data.licenceType}: {data.licenceNumber}
                  </span>
                </div>
              </div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-white/90 shrink-0" />
          </div>

          {/* Product Details Rows (Clean Key-Value Structure) */}
          <div className="p-5 space-y-5 text-xs sm:text-sm">
            {data.productImageDataUrl && (
              <div className="flex justify-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="relative w-36 h-36 rounded-lg overflow-hidden bg-white border border-slate-200">
                  <Image
                    src={data.productImageDataUrl}
                    alt="Product Image"
                    fill
                    className="object-contain p-1.5"
                    unoptimized
                  />
                </div>
              </div>
            )}

            <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
              {data.productId && (
                <div className="py-3 grid grid-cols-12 gap-2">
                  <span className="col-span-5 font-semibold text-slate-500">
                    Product ID
                  </span>
                  <span className="col-span-7 font-bold text-slate-900">
                    {data.productId}
                  </span>
                </div>
              )}
              <div className="py-3 grid grid-cols-12 gap-2">
                <span className="col-span-5 font-semibold text-slate-500">
                  Firm Name &amp; Address
                </span>
                <span className="col-span-7 font-medium text-slate-900">
                  <strong className="block font-bold">{data.firmName}</strong>
                  {data.firmAddress}
                </span>
              </div>
              {data.brandName && (
                <div className="py-3 grid grid-cols-12 gap-2">
                  <span className="col-span-5 font-semibold text-slate-500">
                    Brand Name
                  </span>
                  <span className="col-span-7 font-bold text-slate-900">
                    {data.brandName}
                  </span>
                </div>
              )}
              {data.productName && (
                <div className="py-3 grid grid-cols-12 gap-2">
                  <span className="col-span-5 font-semibold text-slate-500">
                    Product Name
                  </span>
                  <span className="col-span-7 font-bold text-slate-900">
                    {data.productName}
                  </span>
                </div>
              )}
              {data.netQuantity && (
                <div className="py-3 grid grid-cols-12 gap-2">
                  <span className="col-span-5 font-semibold text-slate-500">
                    Pack Size / Description
                  </span>
                  <span className="col-span-7 font-bold text-slate-900">
                    {data.netQuantity}
                  </span>
                </div>
              )}
              {data.mrp && (
                <div className="py-3 grid grid-cols-12 gap-2">
                  <span className="col-span-5 font-semibold text-slate-500">
                    Product MRP
                  </span>
                  <span className="col-span-7 font-bold text-slate-900">
                    {data.mrp}
                  </span>
                </div>
              )}
              <div className="py-3 grid grid-cols-12 gap-2">
                <span className="col-span-5 font-semibold text-slate-500">
                  Licence Number
                </span>
                <span className="col-span-7 font-bold text-indigo-700">
                  {data.licenceNumber}
                  {data.licenceValidUpto
                    ? ` (Valid Upto: ${data.licenceValidUpto})`
                    : ""}
                </span>
              </div>
              <div className="py-3 grid grid-cols-12 gap-2">
                <span className="col-span-5 font-semibold text-slate-500">
                  Contact Details
                </span>
                <div className="col-span-7 space-y-1 font-medium text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <a href={`tel:${data.mobile}`} className="hover:underline">
                      {data.mobile}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 break-all">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <a
                      href={`mailto:${data.email}`}
                      className="hover:underline"
                    >
                      {data.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
                <ListChecks className="w-4 h-4 text-indigo-600" />
                <span>Ingredients</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-medium text-xs"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Nutritional / Lab Parameters Table if present */}
            {data.labParameters && data.labParameters.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-500 uppercase">
                  Nutritional &amp; Quality Specifications
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="py-2 px-3 font-bold">Parameter</th>
                        <th className="py-2 px-3 font-bold">Unit</th>
                        <th className="py-2 px-3 font-bold">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {data.labParameters.map((row, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 text-slate-800">
                            {row.parameter}
                          </td>
                          <td className="py-2 px-3 text-slate-500">
                            {row.unit}
                          </td>
                          <td className="py-2 px-3 font-bold text-slate-900">
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs text-slate-500">
          Loading PDF Document...
        </div>
      }
    >
      <ViewPassportContent />
    </Suspense>
  );
}
