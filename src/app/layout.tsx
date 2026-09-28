import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocuQR Studio — Product PDF & QR Code Software",
  description:
    "Create structured product specification PDFs and permanent scannable QR codes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
