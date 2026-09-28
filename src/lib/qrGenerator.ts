import QRCode from "qrcode";

export interface QROptions {
  url: string;
  firmName?: string;
  color?: string;
}

/**
 * Generate QR code as a PNG Data URL
 */
export async function generateQRDataUrl(
  url: string,
  options?: { color?: string; size?: number }
): Promise<string> {
  const color = options?.color || "#1E293B";
  const size = options?.size || 400;

  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: size,
    color: {
      dark: color,
      light: "#FFFFFF",
    },
  });
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRSvg(
  url: string,
  options?: { color?: string }
): Promise<string> {
  const color = options?.color || "#1E293B";

  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    color: {
      dark: color,
      light: "#FFFFFF",
    },
  });
}

/**
 * Download QR code as PNG
 */
export async function downloadQRPng(url: string, firmName: string, color?: string): Promise<void> {
  const dataUrl = await generateQRDataUrl(url, { color, size: 800 });
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `VeriPack_QR_${firmName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30)}.png`;
  link.click();
}

/**
 * Download QR code as SVG
 */
export async function downloadQRSvg(url: string, firmName: string, color?: string): Promise<void> {
  const svg = await generateQRSvg(url, { color });
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = `VeriPack_QR_${firmName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30)}.svg`;
  link.click();
  URL.revokeObjectURL(blobUrl);
}

/**
 * Estimate QR code density - warn if URL too long
 */
export function checkQRLength(url: string): {
  length: number;
  ok: boolean;
  warning?: string;
} {
  const length = url.length;
  if (length > 1800) {
    return {
      length,
      ok: false,
      warning: `URL is ${length} chars — QR may be dense. Try using a shorter ingredients list or reduce image quality.`,
    };
  }
  return { length, ok: true };
}
