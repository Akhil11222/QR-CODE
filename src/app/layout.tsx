import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "VeriPack India — Standardized Digital Product Passport & Smart QR Compliance Suite",
  description:
    "National compliance QR code and auto-branded PDF dossier generator for Indian FMCG manufacturers, food businesses (FBOs), dairy/spice brands, and exporters. FSSAI FoSCoS, GS1 GTIN, and Legal Metrology compliant.",
  keywords: [
    "FSSAI QR code",
    "Digital Product Passport India",
    "FMCG packaging compliance",
    "GS1 GTIN barcode",
    "Hari Sharnam Royal Ghee",
    "FBO packaging QR",
    "Legal Metrology packaged commodities",
    "Lab report QR code",
  ],
  authors: [{ name: "VeriPack India Regulatory Compliance Team" }],
  openGraph: {
    title: "VeriPack India — Digital Product Passport & Smart QR Compliance Suite",
    description:
      "Official digital product passports, scannable compliance QR codes, and auto-branded PDF dossiers for Indian brands.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
