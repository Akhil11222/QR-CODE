export interface BrandColors {
  primary: string;   // hex e.g. "#1A237E"
  secondary: string; // hex e.g. "#283593"
  tint: string;      // hex e.g. "#E8EAF6"
  text: string;      // hex for text on primary bg
}

export const DEFAULT_BRAND_COLORS: BrandColors = {
  primary: "#1E293B",
  secondary: "#334155",
  tint: "#F1F5F9",
  text: "#FFFFFF",
};

export interface FormData {
  firmName: string;
  firmAddress: string;
  licenceNumber: string;
  mobile: string;
  email: string;
  ingredients: string[];
  productImageDataUrl: string | null;
  logoDataUrl: string | null;
  brandColors: BrandColors;
}

export type WizardStep = 1 | 2 | 3 | 4;

export interface CompressedPayload {
  fn: string;  // firmName
  fa: string;  // firmAddress
  ln: string;  // licenceNumber
  mb: string;  // mobile
  em: string;  // email
  ig: string;  // ingredients (joined by |)
  pi: string;  // productImageDataUrl (tiny thumbnail or empty)
  lo: string;  // logoDataUrl (tiny thumbnail or empty)
  bc: BrandColors; // brandColors
}
