import QRCode from "qrcode";
import { BrandColors } from "@/types";

export async function generateQRCodeDataUrl(
  url: string,
  brandColors?: BrandColors
): Promise<string> {
  const darkColor = brandColors?.primary || "#312E81";
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 600,
    color: {
      dark: darkColor,
      light: "#FFFFFF",
    },
  });
}

export async function generateQRCodeSvg(
  url: string,
  brandColors?: BrandColors
): Promise<string> {
  const darkColor = brandColors?.primary || "#312E81";
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    color: {
      dark: darkColor,
      light: "#FFFFFF",
    },
  });
}

export async function generateStickerCanvas(
  qrDataUrl: string,
  firmName: string,
  licenceNumber: string,
  brandColors?: BrandColors
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const w = 600;
    const h = 760;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(qrDataUrl);
      return;
    }

    const primary = brandColors?.primary || "#312E81";

    // Card Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, w, h);

    // Top Header Band
    ctx.fillStyle = primary;
    ctx.fillRect(0, 0, w, 120);

    // Firm Name in Header
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(firmName.toUpperCase().slice(0, 28), w / 2, 55);

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#E0E7FF";
    ctx.fillText(`Lic No: ${licenceNumber}`, w / 2, 90);

    // Draw QR Image
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 90, 155, 420, 420);

      // Bottom Caption
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("SCAN FOR PRODUCT DETAILS PDF", w / 2, 630);

      ctx.fillStyle = "#64748B";
      ctx.font = "16px sans-serif";
      ctx.fillText("Point your mobile camera at the QR code", w / 2, 665);

      // Border
      ctx.strokeStyle = primary;
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, w - 8, h - 8);

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(qrDataUrl);
    img.src = qrDataUrl;
  });
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export function downloadSvgString(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(blobUrl);
}
