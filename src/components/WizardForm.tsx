"use client";

import { useState, useCallback } from "react";
import {
  Building2,
  Package,
  Phone,
  Image as ImageIcon,
  FlaskConical,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Barcode,
  Palette,
  Plus,
  Trash2,
  FileCheck2,
} from "lucide-react";
import {
  FormData,
  WizardStep,
  DEFAULT_BRAND_COLORS,
  EXECUTIVE_COLOR_PRESETS,
  SAMPLE_CLIENT_DATA,
  LabParameter,
  BrandColors,
} from "@/types";
import FileUpload from "./FileUpload";
import IngredientsInput from "./IngredientsInput";

interface WizardFormProps {
  onComplete: (data: FormData) => void;
  initialData?: FormData | null;
}

type StepErrors = Partial<Record<string, string>>;

const STEPS = [
  { id: 1, title: "Firm & Licence", icon: Building2, desc: "FSSAI & Registered Address" },
  { id: 2, title: "Product & GTIN", icon: Package, desc: "Barcode, MRP & Pack Size" },
  { id: 3, title: "Contact Details", icon: Phone, desc: "Helpline & Nodal Email" },
  { id: 4, title: "Images & Palette", icon: ImageIcon, desc: "Product Photo & Brand Theme" },
  { id: 5, title: "Composition & Lab", icon: FlaskConical, desc: "Ingredients & Test Report" },
];

function validateStep(step: WizardStep, data: FormData): StepErrors {
  const errors: StepErrors = {};

  if (step === 1) {
    if (!data.firmName.trim()) errors.firmName = "Firm name is required";
    if (!data.brandName.trim()) errors.brandName = "Brand trade mark is required";
    if (!data.firmAddress.trim()) errors.firmAddress = "Registered address is required";
    if (!data.licenceNumber.trim()) errors.licenceNumber = "Licence / Registration number is required";
  }

  if (step === 2) {
    if (!data.productName.trim()) errors.productName = "Product name is required";
    if (!data.productId.trim()) errors.productId = "13-digit Product ID / GTIN is required";
    if (!data.netQuantity.trim()) errors.netQuantity = "Pack size / net quantity is required";
    if (!data.mrp.trim()) errors.mrp = "Product MRP is required";
  }

  if (step === 3) {
    if (!data.mobile.trim()) errors.mobile = "Customer care mobile number is required";
    if (!data.email.trim()) errors.email = "Official email address is required";
  }

  if (step === 4) {
    if (!data.productImageDataUrl) {
      errors.productImageDataUrl = "Please upload a product packaging image (or load the sample client)";
    }
  }

  if (step === 5) {
    if (data.ingredients.length === 0) {
      errors.ingredients = "Please enter at least one ingredient / material";
    }
  }

  return errors;
}

export default function WizardForm({ onComplete, initialData }: WizardFormProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [errors, setErrors] = useState<StepErrors>({});
  const [enableLabParameters, setEnableLabParameters] = useState(
    initialData?.labParameters && initialData.labParameters.length > 0 ? true : true
  );

  const [formData, setFormData] = useState<FormData>(
    initialData || {
      firmName: "",
      brandName: "",
      firmAddress: "",
      licenceNumber: "",
      licenceType: "FSSAI Registration",
      licenceValidUpto: "",
      productName: "",
      productId: "8939137480046",
      netQuantity: "",
      mrp: "",
      dietaryMark: "veg",
      batchAndDate: "",
      mobile: "",
      email: "",
      productImageDataUrl: null,
      logoDataUrl: null,
      brandColors: DEFAULT_BRAND_COLORS,
      ingredients: [],
      storageInstructions: "",
      labParameters: [],
    }
  );

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const handleLoadSample = () => {
    setFormData(SAMPLE_CLIENT_DATA);
    setErrors({});
    setEnableLabParameters(true);
  };

  const handleGenerateBarcode = () => {
    // Generate valid 13-digit Indian GS1 barcode format: 890 + 10 digits
    const random10 = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    updateField("productId", `890${random10}`);
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    onComplete(formData);
  };

  const handleSetPresetColors = (colors: BrandColors) => {
    updateField("brandColors", colors);
  };

  // Lab Parameter Helpers
  const addLabRow = () => {
    const current = formData.labParameters || [];
    updateField("labParameters", [
      ...current,
      { parameter: "New Parameter", unit: "g / 100g", value: "0.0" },
    ]);
  };

  const removeLabRow = (idx: number) => {
    const current = formData.labParameters || [];
    updateField(
      "labParameters",
      current.filter((_, i) => i !== idx)
    );
  };

  const updateLabRow = (idx: number, field: keyof LabParameter, val: string) => {
    const current = formData.labParameters ? [...formData.labParameters] : [];
    if (current[idx]) {
      current[idx] = { ...current[idx], [field]: val };
      updateField("labParameters", current);
    }
  };

  const loadDairyPreset = () => {
    updateField("labParameters", [
      { parameter: "Energy Value", unit: "Kcal / 100g", value: "899.1" },
      { parameter: "Milk Fat", unit: "g / 100g", value: "99.8" },
      { parameter: "Saturated Fatty Acids", unit: "g / 100g", value: "61.14" },
      { parameter: "Cholesterol", unit: "mg / 100g", value: "240.0" },
      { parameter: "Moisture Content", unit: "% by wt.", value: "0.18" },
      { parameter: "Baudouin Adulteration Test", unit: "Qualitative", value: "Absent (Pure)" },
    ]);
  };

  const loadFoodNutritionPreset = () => {
    updateField("labParameters", [
      { parameter: "Energy Value", unit: "Kcal / 100g", value: "365.0" },
      { parameter: "Protein", unit: "g / 100g", value: "11.2" },
      { parameter: "Total Carbohydrates", unit: "g / 100g", value: "72.4" },
      { parameter: "Dietary Fiber", unit: "g / 100g", value: "4.8" },
      { parameter: "Total Fat", unit: "g / 100g", value: "2.1" },
      { parameter: "Sodium", unit: "mg / 100g", value: "15.0" },
    ]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto" id="qr-builder">
      {/* 1-Click Client Sample Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-950">
              Want to see a real Indian FMCG packaging example?
            </h3>
            <p className="text-xs text-amber-800">
              Populate all 5 steps instantly with authentic data from Hari Sharnam Royal Ghee.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          id="wizard-load-sample-btn"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-amber-950 bg-amber-200 hover:bg-amber-300 border border-amber-400 transition cursor-pointer shadow-2xs whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-amber-800" />
          Load Real Client Example (Hari Sharnam Royal Ghee)
        </button>
      </div>

      {/* Main Studio Container */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {/* Step Indicator Header */}
        <div className="bg-slate-900 px-4 sm:px-8 py-5 border-b border-slate-800">
          <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-0 gap-3">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isCurrent = currentStep === s.id;
              const isCompleted = currentStep > s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    // Allow navigating to visited steps
                    if (s.id < currentStep) setCurrentStep(s.id as WizardStep);
                  }}
                  className={`flex items-center gap-2.5 shrink-0 text-left transition ${
                    isCurrent
                      ? "text-white"
                      : isCompleted
                      ? "text-emerald-400 hover:text-emerald-300 cursor-pointer"
                      : "text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition ${
                      isCurrent
                        ? "bg-emerald-600 text-white ring-2 ring-emerald-400/40"
                        : isCompleted
                        ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-bold tracking-tight">{s.title}</p>
                    <p className="text-[10px] text-slate-400">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Form Content */}
        <div className="p-6 sm:p-10">
          {/* STEP 1: Firm & Regulatory Licence Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Step 1 of 5
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  Firm &amp; Regulatory Licence Identity
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Mandatory information required under FSSAI FoSCoS and Indian Legal Metrology regulations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">
                    Firm / Company Registered Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firmName}
                    onChange={(e) => updateField("firmName", e.target.value)}
                    placeholder="e.g., M/s Hari Sharnam Enterprises"
                    className={`form-input ${errors.firmName ? "form-input-error" : ""}`}
                  />
                  {errors.firmName && (
                    <p className="text-xs font-semibold text-red-600 mt-1">{errors.firmName}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    Brand Name / Trade Mark <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => updateField("brandName", e.target.value)}
                    placeholder="e.g., Hari Sharnam"
                    className={`form-input ${errors.brandName ? "form-input-error" : ""}`}
                  />
                  {errors.brandName && (
                    <p className="text-xs font-semibold text-red-600 mt-1">{errors.brandName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">
                  Registered Manufacturing / Head Office Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.firmAddress}
                  onChange={(e) => updateField("firmAddress", e.target.value)}
                  placeholder="e.g., C-1/97 Welcome Seelampur, Garhi Mindo, North East, Delhi - 110053"
                  className={`form-input ${errors.firmAddress ? "form-input-error" : ""}`}
                />
                {errors.firmAddress && (
                  <p className="text-xs font-semibold text-red-600 mt-1">{errors.firmAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-1">
                  <label className="form-label">Regulatory Licence Type</label>
                  <select
                    value={formData.licenceType}
                    onChange={(e) => updateField("licenceType", e.target.value)}
                    className="form-input bg-white"
                  >
                    <option value="FSSAI Registration">FSSAI Registration</option>
                    <option value="FSSAI State/Central Licence">FSSAI State/Central Licence</option>
                    <option value="ISO 9001:2015 Certified">ISO 9001:2015 Certified</option>
                    <option value="AGMARK / BIS">AGMARK / BIS</option>
                    <option value="Trade / GST Licence">Trade / GST Licence</option>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="form-label">
                    Licence / Registration No. <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.licenceNumber}
                    onChange={(e) => updateField("licenceNumber", e.target.value)}
                    placeholder="e.g., 23322004000714"
                    className={`form-input font-mono ${errors.licenceNumber ? "form-input-error" : ""}`}
                  />
                  {errors.licenceNumber && (
                    <p className="text-xs font-semibold text-red-600 mt-1">{errors.licenceNumber}</p>
                  )}
                </div>

                <div className="sm:col-span-1">
                  <label className="form-label">Licence Valid Upto (Optional)</label>
                  <input
                    type="text"
                    value={formData.licenceValidUpto || ""}
                    onChange={(e) => updateField("licenceValidUpto", e.target.value)}
                    placeholder="e.g., 23-09-2030"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Product Commercial Details */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Step 2 of 5
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  Product Commercial Specification
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  These fields populate the instant mobile scan screen and digital certificate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">
                    Product Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => updateField("productName", e.target.value)}
                    placeholder="e.g., Royal Ghee Premium (Pooja Ghee)"
                    className={`form-input ${errors.productName ? "form-input-error" : ""}`}
                  />
                  {errors.productName && (
                    <p className="text-xs font-semibold text-red-600 mt-1">{errors.productName}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="form-label mb-0">
                      Product ID / GTIN (13-Digit) <span className="text-red-600">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateBarcode}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1 cursor-pointer"
                    >
                      <Barcode className="w-3 h-3" />
                      Auto-Generate ID
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.productId}
                    onChange={(e) => updateField("productId", e.target.value)}
                    placeholder="e.g., 8939137480046"
                    className={`form-input font-mono ${errors.productId ? "form-input-error" : ""}`}
                  />
                  {errors.productId && (
                    <p className="text-xs font-semibold text-red-600 mt-1">{errors.productId}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="form-label">
                    Net Quantity / Pack Size <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.netQuantity}
                    onChange={(e) => updateField("netQuantity", e.target.value)}
                    placeholder="e.g., 500 ml, 450 grams"
                    className={`form-input ${errors.netQuantity ? "form-input-error" : ""}`}
                  />
                  {errors.netQuantity && (
                    <p className="text-xs font-semibold text-red-600 mt-1">{errors.netQuantity}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    Product MRP (₹) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.mrp}
                    onChange={(e) => updateField("mrp", e.target.value)}
                    placeholder="e.g., 290 INR (Incl. of all taxes)"
                    className={`form-input ${errors.mrp ? "form-input-error" : ""}`}
                  />
                  {errors.mrp && (
                    <p className="text-xs font-semibold text-red-600 mt-1">{errors.mrp}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Dietary / Statutory Classification</label>
                  <select
                    value={formData.dietaryMark}
                    onChange={(e) =>
                      updateField("dietaryMark", e.target.value as "veg" | "non-veg" | "general")
                    }
                    className="form-input bg-white"
                  >
                    <option value="veg">[Green Dot] 100% Pure Vegetarian</option>
                    <option value="non-veg">[Brown Dot] Non-Vegetarian</option>
                    <option value="general">Industrial / General Goods</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Batch Number &amp; Packaging Date (Optional)</label>
                <input
                  type="text"
                  value={formData.batchAndDate || ""}
                  onChange={(e) => updateField("batchAndDate", e.target.value)}
                  placeholder="e.g., Batch #HS-0925 | Pkg: 15/09/2025 | Best Before 12 Months"
                  className="form-input"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Official Firm Contact Details */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Step 3 of 5
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  Official Consumer Care &amp; Nodal Contacts
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Enables 1-click &quot;Call Customer Care&quot; and &quot;Email Firm&quot; buttons on the scanned mobile screen.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">
                    Customer Care Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => updateField("mobile", e.target.value)}
                    placeholder="e.g., +91-9899705937"
                    className={`form-input ${errors.mobile ? "form-input-error" : ""}`}
                  />
                  {errors.mobile && (
                    <p className="text-xs font-semibold text-red-600 mt-1">{errors.mobile}</p>
                  )}
                  <p className="form-hint">Format with country code for direct tel: link capability.</p>
                </div>

                <div>
                  <label className="form-label">
                    Official Support / Nodal Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="e.g., info.harisharnam@gmail.com"
                    className={`form-input ${errors.email ? "form-input-error" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-xs font-semibold text-red-600 mt-1">{errors.email}</p>
                  )}
                  <p className="form-hint">Used for consumer grievance redressal &amp; corporate inquiries.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Product Image & Optional Logo */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Step 4 of 5
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  Visual Assets &amp; Brand Color Palette
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Upload packaging images. Uploading a firm logo automatically extracts your corporate color scheme into the PDF!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <FileUpload
                    label="Product Packaging Photo"
                    required
                    hint="Displayed on the scan screen and embedded in the official PDF."
                    currentFile={formData.productImageDataUrl}
                    onFileAccepted={(url) => updateField("productImageDataUrl", url)}
                    onRemove={() => updateField("productImageDataUrl", null)}
                  />
                  {errors.productImageDataUrl && (
                    <p className="text-xs font-semibold text-red-600 mt-1">
                      {errors.productImageDataUrl}
                    </p>
                  )}
                </div>

                <div>
                  <FileUpload
                    label="Firm / Brand Logo (Optional)"
                    hint="Auto-extracts primary and secondary palette for your PDF dossier."
                    currentFile={formData.logoDataUrl}
                    showColorExtraction
                    onColorsExtracted={(colors) => updateField("brandColors", colors)}
                    onFileAccepted={(url) => updateField("logoDataUrl", url)}
                    onRemove={() => updateField("logoDataUrl", null)}
                  />
                </div>
              </div>

              {/* 5 Executive Color Presets */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Executive Brand Color Presets (Or Extracted From Logo)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {EXECUTIVE_COLOR_PRESETS.map((preset, pIdx) => {
                    const isSelected =
                      formData.brandColors.primary.toLowerCase() ===
                      preset.colors.primary.toLowerCase();
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleSetPresetColors(preset.colors)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: preset.colors.primary }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: preset.colors.secondary }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Ingredients & Optional Lab / Nutritional Parameters */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Step 5 of 5
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  Composition &amp; Quality Lab Parameters
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Add ingredient declarations and optional laboratory test results (e.g. Dairy Purity, Nutrition).
                </p>
              </div>

              <div>
                <IngredientsInput
                  ingredients={formData.ingredients}
                  onChange={(ing) => updateField("ingredients", ing)}
                  error={errors.ingredients}
                />
              </div>

              <div>
                <label className="form-label">Storage &amp; Hygienic Handling Directions (Optional)</label>
                <input
                  type="text"
                  value={formData.storageInstructions || ""}
                  onChange={(e) => updateField("storageInstructions", e.target.value)}
                  placeholder="e.g., Store in a cool, dry & hygienic place away from direct sunlight. Do not refrigerate."
                  className="form-input"
                />
              </div>

              {/* Lab Parameters Section */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enable-lab-toggle"
                      checked={enableLabParameters}
                      onChange={(e) => setEnableLabParameters(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label
                      htmlFor="enable-lab-toggle"
                      className="text-xs font-bold uppercase tracking-wider text-slate-800 cursor-pointer"
                    >
                      Include ISO / FSSAI Quality Test &amp; Nutritional Table
                    </label>
                  </div>

                  {enableLabParameters && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={loadDairyPreset}
                        className="text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200 transition cursor-pointer"
                      >
                        Dairy/Ghee Lab Preset
                      </button>
                      <button
                        type="button"
                        onClick={loadFoodNutritionPreset}
                        className="text-[11px] font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded border border-slate-200 transition cursor-pointer"
                      >
                        Nutrition Table Preset
                      </button>
                    </div>
                  )}
                </div>

                {enableLabParameters && (
                  <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="grid grid-cols-12 gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
                      <span className="col-span-5">Parameter / Nutrient</span>
                      <span className="col-span-3">Unit</span>
                      <span className="col-span-3">Tested Value</span>
                      <span className="col-span-1 text-center">Action</span>
                    </div>

                    {(formData.labParameters || []).map((row, rIdx) => (
                      <div key={rIdx} className="grid grid-cols-12 gap-2 items-center">
                        <input
                          type="text"
                          value={row.parameter}
                          onChange={(e) => updateLabRow(rIdx, "parameter", e.target.value)}
                          className="col-span-5 form-input py-1.5 px-2.5 text-xs bg-white"
                          placeholder="e.g. Milk Fat"
                        />
                        <input
                          type="text"
                          value={row.unit}
                          onChange={(e) => updateLabRow(rIdx, "unit", e.target.value)}
                          className="col-span-3 form-input py-1.5 px-2.5 text-xs bg-white font-mono"
                          placeholder="e.g. g / 100g"
                        />
                        <input
                          type="text"
                          value={row.value}
                          onChange={(e) => updateLabRow(rIdx, "value", e.target.value)}
                          className="col-span-3 form-input py-1.5 px-2.5 text-xs bg-white font-bold"
                          placeholder="e.g. 99.8"
                        />
                        <button
                          type="button"
                          onClick={() => removeLabRow(rIdx)}
                          className="col-span-1 p-2 text-slate-400 hover:text-red-600 flex justify-center cursor-pointer"
                          aria-label="Delete row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addLabRow}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-2xs transition cursor-pointer mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Parameter Row
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Action Navigation Bar */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="btn-outline-corporate px-5 py-3 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-navy px-7 py-3 cursor-pointer"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                id="generate-passport-btn"
                className="btn-emerald px-8 py-3.5 text-base shadow-lg cursor-pointer"
              >
                <FileCheck2 className="w-5 h-5 text-emerald-200" />
                <span>Generate Official QR &amp; PDF Passport</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
