import LZString from "lz-string";
import { CompressedPayload, FormData, DEFAULT_BRAND_COLORS } from "@/types";

export function compressFormData(formData: FormData, microProductThumb?: string, microLogoThumb?: string): string {
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
    pt: microProductThumb || undefined,
    lg: microLogoThumb || undefined,
  };

  const json = JSON.stringify(payload);
  let compressed = LZString.compressToEncodedURIComponent(json);

  // Ensure QR payload stays well below camera scan limit (~1800 chars)
  if (compressed.length > 1750 && (payload.pt || payload.lg)) {
    delete payload.lg;
    compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));
  }
  if (compressed.length > 1750 && payload.pt) {
    delete payload.pt;
    compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));
  }

  return compressed;
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

    // Try localStorage cache on the same device first for full resolution images
    let cachedProductImg: string | null = p.pt || null;
    let cachedLogoImg: string | null = p.lg || null;
    if (typeof window !== "undefined" && p.pi) {
      try {
        const localProd = localStorage.getItem(`vp_prod_${p.pi}`);
        const localLogo = localStorage.getItem(`vp_logo_${p.pi}`);
        if (localProd) cachedProductImg = localProd;
        if (localLogo) cachedLogoImg = localLogo;
      } catch {
        // ignore storage errors
      }
    }

    return {
      firmName: p.fn || "",
      brandName: p.bn || p.fn || "",
      firmAddress: p.fa || "",
      licenceNumber: p.ln || "",
      licenceType: p.lt || "FSSAI / Regulatory Licence",
      licenceValidUpto: p.lu || "",
      productName: p.pn || p.bn || p.fn || "Registered Product",
      productId: p.pi || "",
      netQuantity: p.nq || "",
      mrp: p.mr || "",
      dietaryMark: p.dm || "veg",
      batchAndDate: p.bd || "",
      mobile: p.mb || "",
      email: p.em || "",
      ingredients: p.ig ? p.ig.split("|").filter(Boolean) : [],
      storageInstructions: p.si || "",
      labParameters: labParameters,
      productImageDataUrl: cachedProductImg,
      logoDataUrl: cachedLogoImg,
      brandColors: p.bc || DEFAULT_BRAND_COLORS,
    };
  } catch {
    return null;
  }
}

export function estimatePayloadSize(compressed: string, baseUrl: string): number {
  return (baseUrl + "?v=" + compressed).length;
}
