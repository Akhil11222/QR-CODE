import LZString from "lz-string";
import { CompressedPayload, FormData } from "@/types";

export function compressFormData(formData: FormData): string {
  const payload: CompressedPayload = {
    fn: formData.firmName,
    fa: formData.firmAddress,
    ln: formData.licenceNumber,
    mb: formData.mobile,
    em: formData.email,
    ig: formData.ingredients.join("|"),
    pi: formData.productImageDataUrl || "",
    lo: formData.logoDataUrl || "",
    bc: formData.brandColors,
  };

  const json = JSON.stringify(payload);
  return LZString.compressToEncodedURIComponent(json);
}

export function decompressFormData(compressed: string): FormData | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    const payload: CompressedPayload = JSON.parse(json);
    return {
      firmName: payload.fn || "",
      firmAddress: payload.fa || "",
      licenceNumber: payload.ln || "",
      mobile: payload.mb || "",
      email: payload.em || "",
      ingredients: payload.ig ? payload.ig.split("|").filter(Boolean) : [],
      productImageDataUrl: payload.pi || null,
      logoDataUrl: payload.lo || null,
      brandColors: payload.bc,
    };
  } catch {
    return null;
  }
}

/**
 * Estimate QR payload size (base URL + compressed data)
 * Keep total URL under 1800 chars for reliable QR scanning
 */
export function estimatePayloadSize(compressed: string, baseUrl: string): number {
  return (baseUrl + "?v=" + compressed).length;
}
