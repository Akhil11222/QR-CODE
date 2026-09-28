export interface BrandColors {
  primary: string;   // hex e.g. "#0F5132" or "#991B1B"
  secondary: string; // hex e.g. "#059669" or "#D97706"
  tint: string;      // hex e.g. "#ECFDF5" or "#FEF3C7"
  text: string;      // hex for text on primary bg ("#FFFFFF" or "#0F172A")
}

export interface LabParameter {
  parameter: string;
  unit: string;
  value: string;
}

export interface FormData {
  // Step 1: Firm & Regulatory Licence Details
  firmName: string;
  brandName: string;
  firmAddress: string;
  licenceNumber: string;
  licenceType: string;
  licenceValidUpto?: string;

  // Step 2: Product Commercial Details
  productName: string;
  productId: string;
  netQuantity: string;
  mrp: string;
  dietaryMark: "veg" | "non-veg" | "general";
  batchAndDate?: string;

  // Step 3: Official Firm Contact Details
  mobile: string;
  email: string;

  // Step 4: Product Image & Optional Logo
  productImageDataUrl: string | null;
  logoDataUrl: string | null;
  brandColors: BrandColors;

  // Step 5: Ingredients & Optional Lab/Nutritional Parameters
  ingredients: string[];
  storageInstructions?: string;
  labParameters?: LabParameter[];
}

export type WizardStep = 1 | 2 | 3 | 4 | 5;

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
  lp?: string; // serialized labParameters (compact JSON)
  bc: BrandColors; // brandColors
  img?: string; // short indicator or thumbnail
}

export const EXECUTIVE_COLOR_PRESETS: Array<{ name: string; colors: BrandColors }> = [
  {
    name: "Royal Crimson & Gold",
    colors: {
      primary: "#991B1B",
      secondary: "#D97706",
      tint: "#FEF3C7",
      text: "#FFFFFF",
    },
  },
  {
    name: "FSSAI Forest Green",
    colors: {
      primary: "#0F5132",
      secondary: "#059669",
      tint: "#ECFDF5",
      text: "#FFFFFF",
    },
  },
  {
    name: "Corporate Executive Navy",
    colors: {
      primary: "#0F172A",
      secondary: "#1E3A8A",
      tint: "#EFF6FF",
      text: "#FFFFFF",
    },
  },
  {
    name: "Saffron Heritage Gold",
    colors: {
      primary: "#B45309",
      secondary: "#D97706",
      tint: "#FFFBEB",
      text: "#FFFFFF",
    },
  },
  {
    name: "Executive Slate & Steel",
    colors: {
      primary: "#334155",
      secondary: "#475569",
      tint: "#F8FAFC",
      text: "#FFFFFF",
    },
  },
];

export const DEFAULT_BRAND_COLORS: BrandColors = EXECUTIVE_COLOR_PRESETS[1].colors; // FSSAI Forest Green

export const SAMPLE_CLIENT_DATA: FormData = {
  firmName: "M/s Hari Sharnam Enterprises",
  brandName: "Hari Sharnam",
  firmAddress: "C-1/97 Welcome Seelampur, Garhi Mindo, North East, Delhi - 110053",
  licenceNumber: "23322004000714",
  licenceType: "FSSAI Registration",
  licenceValidUpto: "23-09-2030",
  productName: "Royal Ghee Premium (Pooja Ghee)",
  productId: "8939137480046",
  netQuantity: "500 ml, 450 grams (Pure Cow & Buffalo Ghee)",
  mrp: "290 INR (Incl. of all taxes)",
  dietaryMark: "veg",
  batchAndDate: "Batch #HS-0925 | Pkg: 15/09/2025 | Best Before 12 Months",
  mobile: "+91-9899705937",
  email: "info.harisharnam@gmail.com",
  productImageDataUrl: "/images/royal-ghee-product.jpg",
  logoDataUrl: null,
  brandColors: EXECUTIVE_COLOR_PRESETS[0].colors, // Royal Crimson & Gold
  ingredients: [
    "Clarified Butter (Milk Fat 99.8%)",
    "No Added Preservatives",
    "No Artificial Flavouring or Synthetic Colours",
    "Traditional Bilona Churned",
  ],
  storageInstructions: "Store in a cool, dry & hygienic place away from direct sunlight. Do not refrigerate.",
  labParameters: [
    { parameter: "Energy Value", unit: "Kcal / 100g", value: "899.1" },
    { parameter: "Milk Fat", unit: "g / 100g", value: "99.8" },
    { parameter: "Saturated Fatty Acids", unit: "g / 100g", value: "61.14" },
    { parameter: "Cholesterol", unit: "mg / 100g", value: "240.0" },
    { parameter: "Moisture Content", unit: "% by wt.", value: "0.18" },
    { parameter: "Baudouin Adulteration Test", unit: "Qualitative", value: "Absent (Pure)" },
  ],
};
