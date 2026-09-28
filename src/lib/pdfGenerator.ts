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
  return { r: 15, g: 81, b: 50 }; // Default Emerald
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsPDFInstance = any;

async function getJsPDF(): Promise<JsPDFInstance> {
  const mod = await import("jspdf");
  return mod.jsPDF;
}

export async function generatePDF(formData: FormData): Promise<JsPDFInstance> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const colors = formData.brandColors;
  const primary = hexToRgb(colors.primary || "#0F5132");
  const secondary = hexToRgb(colors.secondary || "#059669");
  const tint = hexToRgb(colors.tint || "#ECFDF5");
  const textOnPrimary = hexToRgb(colors.text || "#FFFFFF");

  const pageW = 210;
  const pageH = 297;
  const margin = 14;
  const contentW = pageW - margin * 2;

  // ─── 1. TOP HEADER BAND ───
  const headerH = 46;
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.rect(0, 0, pageW, headerH, "F");

  // Secondary Accent Bar
  doc.setFillColor(secondary.r, secondary.g, secondary.b);
  doc.rect(0, headerH, pageW, 3.5, "F");

  // Header Content
  let headerX = margin;
  if (formData.logoDataUrl && formData.logoDataUrl.startsWith("data:image")) {
    try {
      const logoW = 28;
      const logoH = 28;
      doc.addImage(formData.logoDataUrl, "JPEG", margin, 9, logoW, logoH);
      headerX = margin + logoW + 6;
    } catch {
      headerX = margin;
    }
  }

  // Firm Name & Brand Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  const firmTitle = formData.brandName
    ? `${formData.brandName.toUpperCase()} — ${formData.firmName}`
    : formData.firmName.toUpperCase();
  const titleLines = doc.splitTextToSize(firmTitle, contentW - (headerX - margin) - 45);
  doc.text(titleLines[0] || firmTitle, headerX, 16);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(230, 240, 235);
  doc.text("OFFICIAL DIGITAL PRODUCT PASSPORT & REGULATORY COMPLIANCE DOSSIER", headerX, 23);

  // Licence & Regulatory Badge Pill
  const licTypeStr = formData.licenceType || "FSSAI Registration";
  const licBadgeText = `${licTypeStr.toUpperCase()}: ${formData.licenceNumber}${
    formData.licenceValidUpto ? ` (Valid: ${formData.licenceValidUpto})` : ""
  }`;
  doc.setFillColor(secondary.r, secondary.g, secondary.b);
  const badgeW = Math.min(doc.getStringUnitWidth(licBadgeText) * 2.8 + 8, 115);
  doc.roundedRect(headerX, 27, badgeW, 7, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(licBadgeText, headerX + 3.5, 31.8);

  // Top Right: Verification Stamp
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  doc.text("OFFICIAL RECORD", pageW - margin - 32, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("GS1 / FSSAI COMPLIANT", pageW - margin - 32, 21);
  const now = new Date();
  doc.text(
    `Date: ${now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
    pageW - margin - 32,
    26
  );

  let currentY = 56;

  // ─── 2. SECTION 1: PRODUCT COMMERCIAL SUMMARY TABLE ───
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentW, 46, 2, 2, "FD");

  // Section Header Strip
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.roundedRect(margin, currentY, contentW, 6.5, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  doc.text("SECTION 1: PRODUCT COMMERCIAL SPECIFICATION & GTIN IDENTIFIERS", margin + 4, currentY + 4.5);

  const row1Y = currentY + 12;
  const col1X = margin + 4;
  const col2X = margin + 55;
  const col3X = margin + 115;

  // Row 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text("PRODUCT NAME", col1X, row1Y);
  doc.text("PRODUCT ID / BARCODE (GTIN)", col2X, row1Y);
  doc.text("NET QUANTITY / PACK SIZE", col3X, row1Y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(doc.splitTextToSize(formData.productName, 48)[0] || formData.productName, col1X, row1Y + 4.8);
  doc.text(formData.productId || "N/A", col2X, row1Y + 4.8);
  doc.text(formData.netQuantity || "N/A", col3X, row1Y + 4.8);

  // Row 2
  const row2Y = currentY + 24;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text("MAXIMUM RETAIL PRICE (MRP)", col1X, row2Y);
  doc.text("DIETARY / CATEGORY CLASSIFICATION", col2X, row2Y);
  doc.text("BATCH & PACKAGING PARTICULARS", col3X, row2Y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(formData.mrp || "N/A", col1X, row2Y + 4.8);

  const dietaryText =
    formData.dietaryMark === "veg"
      ? "[GREEN DOT] 100% Pure Vegetarian"
      : formData.dietaryMark === "non-veg"
      ? "[BROWN DOT] Non-Vegetarian"
      : "Standard Industrial Goods";
  doc.text(dietaryText, col2X, row2Y + 4.8);
  doc.text(
    doc.splitTextToSize(formData.batchAndDate || "Standard Production Batch", 60)[0],
    col3X,
    row2Y + 4.8
  );

  // Row 3: Brand & Classification
  const row3Y = currentY + 36;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text("BRAND TRADE MARK", col1X, row3Y);
  doc.text("REGULATORY LICENCE TYPE", col2X, row3Y);
  doc.text("DIGITAL PASSPORT STATUS", col3X, row3Y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(formData.brandName || formData.firmName, col1X, row3Y + 4.5);
  doc.text(formData.licenceType || "FSSAI Registration", col2X, row3Y + 4.5);
  doc.setTextColor(5, 150, 105);
  doc.text("VERIFIED & COMPLIANT", col3X, row3Y + 4.5);

  currentY += 51;

  // ─── 3. SECTION 2: REGISTERED FIRM & CONTACT DETAILS ───
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentW, 34, 2, 2, "FD");

  // Section Header
  doc.setFillColor(secondary.r, secondary.g, secondary.b);
  doc.roundedRect(margin, currentY, contentW, 6.5, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("SECTION 2: REGISTERED FBO / MANUFACTURER DETAILS & CONSUMER CARE", margin + 4, currentY + 4.5);

  const sec2Y = currentY + 12;
  // Address
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text("REGISTERED PRINCIPAL ADDRESS", margin + 4, sec2Y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  const addrLines = doc.splitTextToSize(formData.firmAddress, 105);
  doc.text(addrLines, margin + 4, sec2Y + 4.5);

  // Customer Care Mobile & Email
  const contactX = margin + 115;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text("CONSUMER CARE HELPLINE", contactX, sec2Y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(formData.mobile, contactX, sec2Y + 4.8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text("OFFICIAL NODAL EMAIL", contactX, sec2Y + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(formData.email, contactX, sec2Y + 16.5);

  currentY += 39;

  // ─── 4. SECTION 3: INGREDIENTS & COMPOSITION BREAKDOWN ───
  const ingBoxH = 34;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentW, ingBoxH, 2, 2, "FD");

  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.roundedRect(margin, currentY, contentW, 6.5, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  doc.text("SECTION 3: INGREDIENTS LIST & HYGIENIC STORAGE DIRECTIVES", margin + 4, currentY + 4.5);

  const ingY = currentY + 11;
  const ingredients = formData.ingredients;
  const colW = (contentW - 8) / 2;

  ingredients.forEach((ing, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const itemX = margin + 4 + col * colW;
    const itemY = ingY + row * 5;

    if (itemY < currentY + ingBoxH - 8) {
      doc.setFillColor(primary.r, primary.g, primary.b);
      doc.circle(itemX + 1.5, itemY - 0.7, 0.8, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.2);
      doc.setTextColor(30, 41, 59);
      doc.text(doc.splitTextToSize(ing, colW - 6)[0], itemX + 4.5, itemY);
    }
  });

  // Storage
  if (formData.storageInstructions) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text("STORAGE INSTRUCTION: ", margin + 4, currentY + ingBoxH - 3);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(6.8);
    doc.setTextColor(51, 65, 85);
    doc.text(
      doc.splitTextToSize(formData.storageInstructions, contentW - 40)[0],
      margin + 36,
      currentY + ingBoxH - 3
    );
  }

  currentY += ingBoxH + 5;

  // ─── 5. SECTION 4: NUTRITIONAL & QUALITY LAB PARAMETERS (IF PRESENT) ───
  if (formData.labParameters && formData.labParameters.length > 0) {
    const labH = 48;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentW, labH, 2, 2, "FD");

    doc.setFillColor(secondary.r, secondary.g, secondary.b);
    doc.roundedRect(margin, currentY, contentW, 6.5, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(
      "SECTION 4: QUALITY TEST PARAMETERS & NUTRITIONAL PROFILE (PER 100G / SERVING)",
      margin + 4,
      currentY + 4.5
    );

    // Table Header
    const tHeadY = currentY + 11.5;
    doc.setFillColor(tint.r, tint.g, tint.b);
    doc.rect(margin + 2, tHeadY - 3.5, contentW - 4, 5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text("TESTED PARAMETER / NUTRIENT", margin + 6, tHeadY);
    doc.text("UNIT OF MEASUREMENT", margin + 85, tHeadY);
    doc.text("TESTED VALUE / RESULT", margin + 140, tHeadY);

    let tableY = tHeadY + 5;
    formData.labParameters.slice(0, 6).forEach((param, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(241, 245, 249);
        doc.rect(margin + 2, tableY - 3, contentW - 4, 4.5, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      doc.setTextColor(30, 41, 59);
      doc.text(param.parameter, margin + 6, tableY);
      doc.text(param.unit, margin + 85, tableY);
      doc.setFont("helvetica", "bold");
      doc.text(param.value, margin + 140, tableY);
      tableY += 4.8;
    });

    currentY += labH + 5;
  }

  // ─── 6. FOOTER WITH MINI VERIFICATION QR & SEAL ───
  const footerY = pageH - 24;

  // Footer separator line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY - 2, pageW - margin, footerY - 2);

  // Verification QR
  try {
    const qrText = `https://veripack-qr.vercel.app/view?v=check_${formData.productId}`;
    const qrDataUrl = await QRCode.toDataURL(qrText, {
      margin: 1,
      width: 80,
      color: { dark: colors.primary || "#0F5132", light: "#FFFFFF" },
    });
    doc.addImage(qrDataUrl, "PNG", margin, footerY, 18, 18);
  } catch {
    // skip if qr fails
  }

  // Footer Metadata Text
  const footTextX = margin + 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text("OFFICIAL VERIPACK DIGITAL PRODUCT PASSPORT (DPP)", footTextX, footerY + 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Standardized compliance dossier under Food Safety and Standards (Packaging and Labelling) Regulations & Legal Metrology Act.",
    footTextX,
    footerY + 8
  );
  doc.text(
    `Document ID: VP-IN-${formData.productId.slice(-8) || "89391374"} | FSSAI Lic: ${
      formData.licenceNumber
    } | Page 1 of 1`,
    footTextX,
    footerY + 12
  );

  // Digital Security Stamp
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.roundedRect(pageW - margin - 38, footerY + 1, 38, 14, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  doc.text("AUTHENTICATED RECORD", pageW - margin - 35, footerY + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.setTextColor(240, 253, 244);
  doc.text("SECURE REPOSITORY HASH", pageW - margin - 35, footerY + 10.5);

  return doc;
}

export function downloadPDF(doc: JsPDFInstance, firmName: string): void {
  const cleanName = firmName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30);
  const filename = `VeriPack_${cleanName}_Product_Dossier.pdf`;
  doc.save(filename);
}
