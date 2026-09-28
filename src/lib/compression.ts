import LZString from "lz-string";
import { CompressedPayload, FormData, DEFAULT_BRAND_COLORS } from "@/types";

export function compressFormData(formData: FormData): string {
  const payload: CompressedPayload = {
    fn: formData.firmName,
    bn: formData.brandName,
    fa: formData.firmAddress,
    ln: formData.licenceNumber,
    lt: formData.licenceType,
    lu: formData.licenceValidUpto || "",
    pn: formData.productName,
    pi: formData.productId,
    nq: formData.netQuantity,
    mr: formData.mrp,
    dm: formData.dietaryMark,
    bd: formData.batchAndDate || "",
    mb: formData.mobile,
    em: formData.email,
    ig: formData.ingredients.join("|"),
    si: formData.storageInstructions || "",
    lp: formData.labParameters && formData.labParameters.length > 0
      ? JSON.stringify(formData.labParameters)
      : "",
    bc: formData.brandColors,
    img: formData.productImageDataUrl?.startsWith("/")
      ? formData.productImageDataUrl
      : "",
  };

  const json = JSON.stringify(payload);
  return LZString.compressToEncodedURIComponent(json);
}

export function decompressFormData(compressed: string): FormData | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    const p: CompressedPayload = JSON.parse(json);

    let labParameters = undefined;
    if (p.lp) {
      try {
        labParameters = JSON.parse(p.lp);
      } catch {
        labParameters = undefined;
      }
    }

    // Fallback image for Hari Sharnam sample or if specified
    const productImage = p.img || (p.pi === "8939137480046" ? "/images/royal-ghee-product.jpg" : null);

    return {
      firmName: p.fn || "",
      brandName: p.bn || p.fn || "",
      firmAddress: p.fa || "",
      licenceNumber: p.ln || "",
      licenceType: p.lt || "FSSAI Registration",
      licenceValidUpto: p.lu || "",
      productName: p.pn || "Standard Packaged Product",
      productId: p.pi || "8939137480046",
      netQuantity: p.nq || "Standard Unit",
      mrp: p.mr || "MRP (Inclusive of all taxes)",
      dietaryMark: p.dm || "veg",
      batchAndDate: p.bd || "",
      mobile: p.mb || "",
      email: p.em || "",
      ingredients: p.ig ? p.ig.split("|").filter(Boolean) : [],
      storageInstructions: p.si || "",
      labParameters: labParameters,
      productImageDataUrl: productImage,
      logoDataUrl: null,
      brandColors: p.bc || DEFAULT_BRAND_COLORS,
    };
  } catch {
    return null;
  }
}

/**
 * Estimate QR payload size (base URL + compressed data)
 * Keep total URL under 1600 chars for reliable instant camera scanning
 */
export function estimatePayloadSize(compressed: string, baseUrl: string): number {
  return (baseUrl + "?v=" + compressed).length;
}
