import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeriPack QR — Digital Product Passport & PDF QR Generator",
  description:
    "Turn your firm & product details into an official, auto-branded PDF dossier with a scannable QR code in 60 seconds. Enterprise-grade digital product passport for manufacturers and brands.",
  keywords: [
    "product passport",
    "QR code generator",
    "PDF generator",
    "brand compliance",
    "FSSAI",
    "ISO",
    "product ingredients",
    "digital passport",
  ],
  openGraph: {
    title: "VeriPack QR — Digital Product Passport",
    description: "Official branded PDF dossiers with scannable QR codes for your products.",
    type: "website",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
