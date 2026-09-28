import { FormData } from "@/types";
import QRCode from "qrcode";

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex, 16);
  if (cleanHex.length === 6 && !isNaN(num)) {
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }
  return { r: 49, g: 46, b: 129 }; // Default Royal Indigo (#312E81)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsPDFInstance = any;

async function getJsPDF(): Promise<JsPDFInstance> {
  const mod = await import("jspdf");
  return mod.jsPDF;
}

export async function generatePDF(formData: FormData, qrUrl?: string): Promise<JsPDFInstance> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const colors = formData.brandColors;
  const primary = hexToRgb(colors.primary || "#312E81");
  const secondary = hexToRgb(colors.secondary || "#4F46E5");
  const tint = hexToRgb(colors.tint || "#EEF2FF");
  const textOnPrimary = hexToRgb(colors.text || "#FFFFFF");

  const pageW = 210;
  const pageH = 297;
  const margin = 14;
  const contentW = pageW - margin * 2;

  // ─── 1. TOP HEADER BAND (Uses Extracted Logo Brand Colors) ───
  const headerH = 44;
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.rect(0, 0, pageW, headerH, "F");

  // Secondary Accent Bar
  doc.setFillColor(secondary.r, secondary.g, secondary.b);
  doc.rect(0, headerH, pageW, 3, "F");

  // Optional Logo in Header
  let headerX = margin;
  if (formData.logoDataUrl && formData.logoDataUrl.startsWith("data:image")) {
    try {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, 8, 28, 28, 2, 2, "F");
      doc.addImage(formData.logoDataUrl, "JPEG", margin + 1.5, 9.5, 25, 25);
      headerX = margin + 33;
    } catch {
      headerX = margin;
    }
  }

  // Firm Name & Brand Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  const firmTitle = formData.brandName && formData.brandName.toLowerCase() !== formData.firmName.toLowerCase()
    ? `${formData.brandName.toUpperCase()} — ${formData.firmName}`
    : formData.firmName.toUpperCase();
  const titleLines = doc.splitTextToSize(firmTitle, contentW - (headerX - margin) - 38);
  doc.text(titleLines[0] || firmTitle, headerX, 16);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text("OFFICIAL PRODUCT INFORMATION & COMPLIANCE DOSSIER", headerX, 22.5);

  // Licence Badge Pill
  const licTypeStr = formData.licenceType || "Licence No";
  const licBadgeText = `${licTypeStr.toUpperCase()}: ${formData.licenceNumber}${
    formData.licenceValidUpto ? ` | Valid Upto: ${formData.licenceValidUpto}` : ""
  }`;
  doc.setFillColor(secondary.r, secondary.g, secondary.b);
  const badgeW = Math.min(doc.getStringUnitWidth(licBadgeText) * 2.75 + 8, 118);
  doc.roundedRect(headerX, 26.5, badgeW, 7, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(licBadgeText, headerX + 3.5, 31.2);

  // Top Right Date Stamp
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  doc.text("VERIFIED RECORD", pageW - margin - 30, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  const now = new Date();
  doc.text(
    `Issued: ${now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
    pageW - margin - 30,
    20.5
  );

  let currentY = 53;

  // ─── 2. SECTION 1: PRODUCT DETAILS + PRODUCT IMAGE SHOWCASE ───
  const sec1H = 52;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentW, sec1H, 2, 2, "FD");

  // Section Header Strip
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.roundedRect(margin, currentY, contentW, 6.5, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  doc.text("1. PRODUCT SPECIFICATION & VISUAL IDENTIFICATION", margin + 4, currentY + 4.5);

  // Product Image Frame on Left (if available)
  let detailsStartX = margin + 5;
  const imgBoxY = currentY + 9.5;
  const imgBoxSize = 39;

  if (formData.productImageDataUrl && formData.productImageDataUrl.startsWith("data:image")) {
    try {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin + 4, imgBoxY, imgBoxSize, imgBoxSize, 2, 2, "FD");
      doc.addImage(formData.productImageDataUrl, "JPEG", margin + 5.5, imgBoxY + 1.5, imgBoxSize - 3, imgBoxSize - 3);
      detailsStartX = margin + imgBoxSize + 9;
    } catch {
      detailsStartX = margin + 5;
    }
  }

  const colSpan = (contentW - (detailsStartX - margin) - 4) / 2;
  const col1X = detailsStartX;
  const col2X = detailsStartX + colSpan;

  // Row 1
  const r1Y = currentY + 13.5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("PRODUCT NAME", col1X, r1Y);
  doc.text("PRODUCT ID / SKU / BARCODE", col2X, r1Y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    doc.splitTextToSize(formData.productName || formData.brandName || formData.firmName, colSpan - 4)[0],
    col1X,
    r1Y + 4.5
  );
  doc.text(formData.productId || "STANDARD-SKU", col2X, r1Y + 4.5);

  // Row 2
  const r2Y = currentY + 25.5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("NET QUANTITY / DESCRIPTION", col1X, r2Y);
  doc.text("MAXIMUM RETAIL PRICE (MRP)", col2X, r2Y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(15, 23, 42);
  doc.text(
    doc.splitTextToSize(formData.netQuantity || "Standard Pack", colSpan - 4)[0],
    col1X,
    r2Y + 4.5
  );
  doc.text(formData.mrp || "As per pack", col2X, r2Y + 4.5);

  // Row 3
  const r3Y = currentY + 37.5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("BRAND NAME", col1X, r3Y);
  doc.text("BATCH / CATEGORY DETAILS", col2X, r3Y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(
    doc.splitTextToSize(formData.brandName || formData.firmName, colSpan - 4)[0],
    col1X,
    r3Y + 4.5
  );
  const catLabel =
    formData.dietaryMark === "veg"
      ? "Pure Vegetarian"
      : formData.dietaryMark === "non-veg"
      ? "Non-Vegetarian"
      : "General Goods";
  const batchStr = formData.batchAndDate ? `${catLabel} | ${formData.batchAndDate}` : catLabel;
  doc.text(doc.splitTextToSize(batchStr, colSpan - 4)[0], col2X, r3Y + 4.5);

  currentY += sec1H + 5;

  // ─── 3. SECTION 2: FIRM NAME, ADDRESS, LICENCE, MOBILE & EMAIL ───
  const sec2H = 38;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentW, sec2H, 2, 2, "FD");

  doc.setFillColor(secondary.r, secondary.g, secondary.b);
  doc.roundedRect(margin, currentY, contentW, 6.5, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("2. REGISTERED FIRM DETAILS, ADDRESS & OFFICIAL CONTACT", margin + 4, currentY + 4.5);

  const s2Y = currentY + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("REGISTERED FIRM NAME & ADDRESS", margin + 4, s2Y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(doc.splitTextToSize(formData.firmName, 106)[0], margin + 4, s2Y + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(51, 65, 85);
  const addrLines = doc.splitTextToSize(formData.firmAddress, 106);
  doc.text(addrLines.slice(0, 3), margin + 4, s2Y + 9.5);

  // Right Column of Section 2: Mobile, Email, Licence
  const contactX = margin + 114;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("MOBILE / HELPLINE", contactX, s2Y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(15, 23, 42);
  doc.text(formData.mobile, contactX, s2Y + 4.2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("EMAIL ADDRESS", contactX, s2Y + 10.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text(doc.splitTextToSize(formData.email, 64)[0], contactX, s2Y + 14.7);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("LICENCE NUMBER", contactX, s2Y + 20.2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(primary.r, primary.g, primary.b);
  doc.text(formData.licenceNumber, contactX, s2Y + 24.2);

  currentY += sec2H + 5;

  // ─── 4. SECTION 3: INGREDIENTS & STORAGE DETAILS ───
  const ingCount = Math.max(formData.ingredients.length, 1);
  const ingRows = Math.ceil(ingCount / 2);
  const ingBoxH = Math.min(Math.max(28, 16 + ingRows * 5.2 + (formData.storageInstructions ? 6 : 0)), 52);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentW, ingBoxH, 2, 2, "FD");

  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.roundedRect(margin, currentY, contentW, 6.5, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  doc.text("3. INGREDIENTS & COMPOSITION DETAILS", margin + 4, currentY + 4.5);

  const ingY = currentY + 11.5;
  const colW = (contentW - 8) / 2;

  formData.ingredients.forEach((ing, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const itemX = margin + 4 + col * colW;
    const itemY = ingY + row * 5;

    if (itemY < currentY + ingBoxH - (formData.storageInstructions ? 7 : 3)) {
      doc.setFillColor(primary.r, primary.g, primary.b);
      doc.circle(itemX + 1.5, itemY - 0.8, 0.8, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text(doc.splitTextToSize(ing, colW - 6)[0], itemX + 4.5, itemY);
    }
  });

  if (formData.storageInstructions) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text("STORAGE:", margin + 4, currentY + ingBoxH - 3);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text(
      doc.splitTextToSize(formData.storageInstructions, contentW - 26)[0],
      margin + 22,
      currentY + ingBoxH - 3
    );
  }

  currentY += ingBoxH + 5;

  // ─── 5. SECTION 4: QUALITY / NUTRITIONAL TABLE (OPTIONAL) ───
  if (formData.labParameters && formData.labParameters.length > 0) {
    const rowsToShow = formData.labParameters.slice(0, 7);
    const labH = 16 + rowsToShow.length * 4.8;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentW, labH, 2, 2, "FD");

    doc.setFillColor(secondary.r, secondary.g, secondary.b);
    doc.roundedRect(margin, currentY, contentW, 6.5, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text("4. NUTRITIONAL & QUALITY SPECIFICATIONS", margin + 4, currentY + 4.5);

    const tHeadY = currentY + 11.5;
    doc.setFillColor(tint.r, tint.g, tint.b);
    doc.rect(margin + 2, tHeadY - 3.5, contentW - 4, 5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text("PARAMETER", margin + 6, tHeadY);
    doc.text("UNIT", margin + 95, tHeadY);
    doc.text("VALUE / RESULT", margin + 140, tHeadY);

    let tableY = tHeadY + 5;
    rowsToShow.forEach((param, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(241, 245, 249);
        doc.rect(margin + 2, tableY - 3.2, contentW - 4, 4.5, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(30, 41, 59);
      doc.text(doc.splitTextToSize(param.parameter, 85)[0], margin + 6, tableY);
      doc.text(doc.splitTextToSize(param.unit, 40)[0], margin + 95, tableY);
      doc.setFont("helvetica", "bold");
      doc.text(doc.splitTextToSize(param.value, 40)[0], margin + 140, tableY);
      tableY += 4.8;
    });
  }

  // ─── 6. FOOTER WITH EMBEDDED VERIFICATION QR CODE ───
  const footerY = pageH - 25;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY - 2, pageW - margin, footerY - 2);

  try {
    const targetQrText =
      qrUrl ||
      (typeof window !== "undefined" ? window.location.href : "https://veripack-dusky.vercel.app");
    const qrDataUrl = await QRCode.toDataURL(targetQrText, {
      margin: 1,
      width: 90,
      color: { dark: colors.primary || "#312E81", light: "#FFFFFF" },
    });
    doc.addImage(qrDataUrl, "PNG", margin, footerY, 18, 18);
  } catch {
    // ignore qr error
  }

  const footTextX = margin + 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text(`${formData.firmName.toUpperCase()} — DIGITAL PRODUCT RECORD`, footTextX, footerY + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Scan the QR code with any smartphone camera to verify product & compliance details online.",
    footTextX,
    footerY + 9
  );
  doc.text(
    `Licence No: ${formData.licenceNumber} | Contact: ${formData.mobile} | ${formData.email}`,
    footTextX,
    footerY + 13.5
  );

  // Right Badge
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.roundedRect(pageW - margin - 34, footerY + 2, 34, 13, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  doc.text("VERIFIED PDF", pageW - margin - 29.5, footerY + 7.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text("DIGITAL DOSSIER", pageW - margin - 30, footerY + 11.5);

  return doc;
}

export function downloadPDF(doc: JsPDFInstance, firmName: string): void {
  const cleanName = (firmName || "Product").replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30);
  doc.save(`${cleanName}_Product_Details.pdf`);
}
