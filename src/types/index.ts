export interface BrandColors {
  primary: string;   // hex e.g. "#3730A3"
  secondary: string; // hex e.g. "#4F46E5"
  tint: string;      // hex e.g. "#EEF2FF"
  text: string;      // hex for text on primary bg ("#FFFFFF")
}

export interface LabParameter {
  parameter: string;
  unit: string;
  value: string;
}

export interface FormData {
  // Step 1: Firm & Licence Info
  firmName: string;
  brandName: string;
  firmAddress: string;
  licenceNumber: string;
  licenceType: string;
  licenceValidUpto?: string;

  // Step 2: Contact & Product Info
  mobile: string;
  email: string;
  productName: string;
  productId: string;
  netQuantity: string;
  mrp: string;
  dietaryMark: "veg" | "non-veg" | "general";
  batchAndDate?: string;

  // Step 3: Product Image & Optional Logo
  productImageDataUrl: string | null;
  logoDataUrl: string | null;
  brandColors: BrandColors;

  // Step 4: Ingredients & Quality Parameters
  ingredients: string[];
  storageInstructions?: string;
  labParameters?: LabParameter[];
}

export type WizardStep = 1 | 2 | 3 | 4;

export interface CompressedPayload {
  fn: string;  // firmName
  bn?: string; // brandName
  fa: string;  // firmAddress
  ln: string;  // licenceNumber
  lt?: string; // licenceType
  lu?: string; // licenceValidUpto
  pn?: string; // productName
  pi?: string; // productId
  nq?: string; // netQuantity
  mr?: string; // mrp
  dm?: "veg" | "non-veg" | "general";
  bd?: string; // batchAndDate
  mb: string;  // mobile
  em: string;  // email
  ig: string;  // ingredients joined by |
  si?: string; // storageInstructions
  lp?: string; // serialized labParameters
  bc: BrandColors; // brandColors
  pt?: string; // micro product thumbnail data URL if fits in QR
  lg?: string; // micro logo thumbnail data URL if fits in QR
}

export const EXECUTIVE_COLOR_PRESETS: Array<{ name: string; colors: BrandColors }> = [
  {
    name: "Royal Indigo & Blue",
    colors: {
      primary: "#312E81",
      secondary: "#4F46E5",
      tint: "#EEF2FF",
      text: "#FFFFFF",
    },
  },
  {
    name: "Executive Navy & Cobalt",
    colors: {
      primary: "#0F172A",
      secondary: "#2563EB",
      tint: "#EFF6FF",
      text: "#FFFFFF",
    },
  },
  {
    name: "Crimson & Amber Gold",
    colors: {
      primary: "#991B1B",
      secondary: "#D97706",
      tint: "#FEF3C7",
      text: "#FFFFFF",
    },
  },
  {
    name: "Warm Bronze & Amber",
    colors: {
      primary: "#78350F",
      secondary: "#D97706",
      tint: "#FFFBEB",
      text: "#FFFFFF",
    },
  },
  {
    name: "Charcoal & Slate",
    colors: {
      primary: "#1E293B",
      secondary: "#475569",
      tint: "#F8FAFC",
      text: "#FFFFFF",
    },
  },
];

export const DEFAULT_BRAND_COLORS: BrandColors = EXECUTIVE_COLOR_PRESETS[0].colors;
