import { FormData } from "@/types";

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 30, g: 41, b: 59 };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsPDF = any;

/**
 * Dynamically imports jsPDF only in browser context to avoid SSR bundling issues
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getJsPDF(): Promise<any> {
  const mod = await import("jspdf");
  return mod.jsPDF;
}

export async function generatePDF(formData: FormData): Promise<JsPDF> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const colors = formData.brandColors;
  const primary = hexToRgb(colors.primary);
  const secondary = hexToRgb(colors.secondary);
  const tint = hexToRgb(colors.tint);
  const textOnPrimary = hexToRgb(colors.text);

  const pageW = 210;
  const pageH = 297;
  const margin = 14;
  const contentW = pageW - margin * 2;

  // --- HEADER BACKGROUND ---
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.rect(0, 0, pageW, 52, "F");

  // Accent stripe
  doc.setFillColor(secondary.r, secondary.g, secondary.b);
  doc.rect(0, 48, pageW, 4, "F");

  // --- LOGO (if available) ---
  let headerTextX = margin + 4;
  if (formData.logoDataUrl) {
    try {
      const logoSize = 30;
      doc.addImage(formData.logoDataUrl, "JPEG", margin, 10, logoSize, logoSize);
      headerTextX = margin + logoSize + 6;
    } catch {
      // Logo failed to embed, skip
    }
  }

  // --- FIRM NAME ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  const firmNameLines = doc.splitTextToSize(formData.firmName, contentW - (headerTextX - margin));
  doc.text(firmNameLines, headerTextX, 20);

  // --- OFFICIAL PRODUCT DOSSIER subtitle ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(
    Math.min(textOnPrimary.r + 60, 255),
    Math.min(textOnPrimary.g + 60, 255),
    Math.min(textOnPrimary.b + 60, 255)
  );
  doc.text("OFFICIAL PRODUCT DOSSIER", headerTextX, 20 + firmNameLines.length * 7 + 2);

  // --- LICENCE BADGE ---
  const badgeY = 38;
  doc.setFillColor(
    Math.min(secondary.r + 20, 255),
    Math.min(secondary.g + 20, 255),
    Math.min(secondary.b + 20, 255)
  );
  const licBadgeW = Math.min(doc.getStringUnitWidth(formData.licenceNumber) * 3.5 + 20, 120);
  doc.roundedRect(headerTextX, badgeY - 4, licBadgeW, 8, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  doc.text(`LICENCE: ${formData.licenceNumber}`, headerTextX + 4, badgeY + 0.5);

  // --- GENERATED DATE ---
  const now = new Date();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  const dateStr = `Generated: ${now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`;
  doc.text(dateStr, pageW - margin - doc.getStringUnitWidth(dateStr) * 2.5, 10);

  // --- CONTENT AREA ---
  let y = 60;

  // --- PRODUCT IMAGE (if available) ---
  if (formData.productImageDataUrl) {
    try {
      const imgMaxW = 82;
      const imgMaxH = 70;
      doc.setFillColor(tint.r, tint.g, tint.b);
      doc.roundedRect(margin, y - 2, imgMaxW + 4, imgMaxH + 8, 3, 3, "F");
      doc.setDrawColor(primary.r, primary.g, primary.b);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, y - 2, imgMaxW + 4, imgMaxH + 8, 3, 3, "S");
      doc.addImage(formData.productImageDataUrl, "JPEG", margin + 2, y, imgMaxW, imgMaxH);

      // Product label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setFillColor(primary.r, primary.g, primary.b);
      doc.rect(margin, y + imgMaxH + 1, imgMaxW + 4, 5, "F");
      doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
      doc.text("PRODUCT IMAGE", margin + 2, y + imgMaxH + 4.5);

      // Right side contact info
      const rightX = margin + imgMaxW + 8;
      const rightW = contentW - imgMaxW - 8;

      // Contact section box
      doc.setFillColor(tint.r, tint.g, tint.b);
      doc.roundedRect(rightX, y - 2, rightW, 78, 3, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(primary.r, primary.g, primary.b);
      doc.text("FIRM DETAILS", rightX + 4, y + 7);

      // Divider
      doc.setDrawColor(primary.r, primary.g, primary.b);
      doc.setLineWidth(0.3);
      doc.line(rightX + 2, y + 10, rightX + rightW - 2, y + 10);

      // Address
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      doc.text("REGISTERED ADDRESS", rightX + 4, y + 16);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(30, 30, 30);
      const addrLines = doc.splitTextToSize(formData.firmAddress, rightW - 8);
      doc.text(addrLines, rightX + 4, y + 21);

      let contactY = y + 21 + Math.min(addrLines.length, 4) * 4 + 4;

      // Mobile
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      doc.text("MOBILE", rightX + 4, contactY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(30, 30, 30);
      doc.text(formData.mobile, rightX + 4, contactY + 5);
      contactY += 12;

      // Email
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      doc.text("EMAIL", rightX + 4, contactY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(30, 30, 30);
      const emailLines = doc.splitTextToSize(formData.email, rightW - 8);
      doc.text(emailLines, rightX + 4, contactY + 5);

      y += 82;
    } catch {
      // Image failed, skip
      y += 4;
    }
  } else {
    // No image - full-width firm details
    const boxH = 50;
    doc.setFillColor(tint.r, tint.g, tint.b);
    doc.roundedRect(margin, y, contentW, boxH, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(primary.r, primary.g, primary.b);
    doc.text("FIRM DETAILS", margin + 4, y + 8);

    doc.setDrawColor(primary.r, primary.g, primary.b);
    doc.setLineWidth(0.3);
    doc.line(margin + 2, y + 11, margin + contentW - 2, y + 11);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("ADDRESS", margin + 4, y + 17);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    const addrLines = doc.splitTextToSize(formData.firmAddress, (contentW / 2) - 8);
    doc.text(addrLines, margin + 4, y + 23);

    // Contact right side
    const midX = margin + contentW / 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("MOBILE", midX + 4, y + 17);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    doc.text(formData.mobile, midX + 4, y + 23);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("EMAIL", midX + 4, y + 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    const emailLines = doc.splitTextToSize(formData.email, contentW / 2 - 8);
    doc.text(emailLines, midX + 4, y + 38);

    y += boxH + 6;
  }

  y += 6;

  // --- INGREDIENTS SECTION ---
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.roundedRect(margin, y, contentW, 9, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  doc.text("PRODUCT COMPOSITION & INGREDIENTS", margin + 4, y + 6);
  y += 12;

  // Ingredients grid
  const ingredients = formData.ingredients;
  const colW = (contentW - 4) / 3;
  const rowH = 7;

  doc.setFillColor(tint.r, tint.g, tint.b);
  const totalRows = Math.ceil(ingredients.length / 3);
  const ingredientBoxH = Math.max(totalRows * rowH + 6, 20);

  // Ensure we have space
  if (y + ingredientBoxH < pageH - 25) {
    doc.roundedRect(margin, y, contentW, ingredientBoxH, 2, 2, "F");

    ingredients.forEach((ingredient, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const cellX = margin + 2 + col * colW;
      const cellY = y + 4 + row * rowH;

      // Bullet
      doc.setFillColor(primary.r, primary.g, primary.b);
      doc.circle(cellX + 2, cellY - 0.5, 1, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(30, 30, 30);
      const ingredientText = doc.splitTextToSize(ingredient.trim(), colW - 8);
      doc.text(ingredientText[0] || ingredient.trim(), cellX + 5, cellY);
    });

    y += ingredientBoxH + 8;
  }

  // --- FOOTER ---
  const footerY = pageH - 18;
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.rect(0, footerY - 2, pageW, 20, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(textOnPrimary.r, textOnPrimary.g, textOnPrimary.b);
  doc.text("VERIFIED PRODUCT PASSPORT", margin, footerY + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("This document is digitally generated and contains authentic product information.", margin, footerY + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("1 of 1", pageW - margin - 8, footerY + 5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("VeriPack QR", pageW - margin - 20, footerY + 10);

  void y; // suppress unused var warning

  return doc;
}

export function downloadPDF(doc: JsPDF, firmName: string): void {
  const filename = `VeriPack_${firmName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30)}_Product_Dossier.pdf`;
  doc.save(filename);
}
