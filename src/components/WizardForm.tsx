"use client";

import { useState } from "react";
import {
  Building2,
  Phone,
  Image as ImageIcon,
  ListChecks,
  ArrowRight,
  ArrowLeft,
  Check,
  Palette,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";
import {
  FormData,
  WizardStep,
  BrandColors,
  DEFAULT_BRAND_COLORS,
  EXECUTIVE_COLOR_PRESETS,
  LabParameter,
} from "@/types";
import FileUpload from "./FileUpload";
import IngredientsInput from "./IngredientsInput";

interface WizardFormProps {
  onComplete: (data: FormData) => void;
}

const STEPS: Array<{ step: WizardStep; title: string; icon: typeof Building2 }> = [
  { step: 1, title: "Firm & Licence", icon: Building2 },
  { step: 2, title: "Contact & Product", icon: Phone },
  { step: 3, title: "Product Image & Logo", icon: ImageIcon },
  { step: 4, title: "Ingredients", icon: ListChecks },
];

function generateRandomId(): string {
  return "890" + Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

export default function WizardForm({ onComplete }: WizardFormProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1
  const [firmName, setFirmName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [firmAddress, setFirmAddress] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [licenceType, setLicenceType] = useState("FSSAI / Trade Licence");
  const [licenceValidUpto, setLicenceValidUpto] = useState("");

  // Step 2
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState(() => generateRandomId());
  const [netQuantity, setNetQuantity] = useState("");
  const [mrp, setMrp] = useState("");
  const [dietaryMark, setDietaryMark] = useState<"veg" | "non-veg" | "general">("veg");
  const [batchAndDate, setBatchAndDate] = useState("");

  // Step 3
  const [productImageDataUrl, setProductImageDataUrl] = useState<string | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [brandColors, setBrandColors] = useState<BrandColors>(DEFAULT_BRAND_COLORS);

  // Step 4
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [storageInstructions, setStorageInstructions] = useState("");
  const [showLabTable, setShowLabTable] = useState(false);
  const [labParameters, setLabParameters] = useState<LabParameter[]>([]);

  const validateStep = (step: WizardStep): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!firmName.trim()) newErrors.firmName = "Firm Name is required";
      if (!firmAddress.trim()) newErrors.firmAddress = "Firm Address is required";
      if (!licenceNumber.trim()) newErrors.licenceNumber = "Licence Number is required";
    } else if (step === 2) {
      if (!mobile.trim()) newErrors.mobile = "Mobile Number is required";
      if (!email.trim() || !email.includes("@"))
        newErrors.email = "Valid Email Address is required";
    } else if (step === 3) {
      if (!productImageDataUrl)
        newErrors.productImage = "Please upload a Product Image";
    } else if (step === 4) {
      if (ingredients.length === 0)
        newErrors.ingredients = "Please add at least one ingredient";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    if (!validateStep(4)) return;

    // Cache high-res images in localStorage for instant same-device preview
    if (typeof window !== "undefined" && productId) {
      try {
        if (productImageDataUrl) {
          localStorage.setItem(`vp_prod_${productId}`, productImageDataUrl);
        }
        if (logoDataUrl) {
          localStorage.setItem(`vp_logo_${productId}`, logoDataUrl);
        }
      } catch {
        // ignore quota errors
      }
    }

    onComplete({
      firmName: firmName.trim(),
      brandName: (brandName || firmName).trim(),
      firmAddress: firmAddress.trim(),
      licenceNumber: licenceNumber.trim(),
      licenceType: licenceType.trim(),
      licenceValidUpto: licenceValidUpto.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      productName: (productName || brandName || firmName).trim(),
      productId: productId.trim(),
      netQuantity: netQuantity.trim(),
      mrp: mrp.trim(),
      dietaryMark,
      batchAndDate: batchAndDate.trim(),
      productImageDataUrl,
      logoDataUrl,
      brandColors,
      ingredients,
      storageInstructions: storageInstructions.trim(),
      labParameters: labParameters.filter((p) => p.parameter.trim() && p.value.trim()),
    });
  };

  const addLabRow = () => {
    setLabParameters([...labParameters, { parameter: "", unit: "per 100g", value: "" }]);
  };

  const updateLabRow = (idx: number, field: keyof LabParameter, val: string) => {
    const next = [...labParameters];
    next[idx] = { ...next[idx], [field]: val };
    setLabParameters(next);
  };

  const removeLabRow = (idx: number) => {
    setLabParameters(labParameters.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Responsive Step Indicator Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 mb-5 shadow-2xs">
        <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;

            return (
              <div
                key={s.step}
                className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5 p-2 sm:px-3 sm:py-2.5 rounded-xl border transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : isDone
                    ? "bg-indigo-50 text-indigo-900 border-indigo-200"
                    : "bg-slate-50 text-slate-400 border-slate-200/80"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isDone
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <div className="text-center sm:text-left min-w-0">
                  <div className="text-[10px] font-semibold opacity-80 leading-none">
                    Step {s.step}
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold truncate mt-0.5">
                    {s.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm">
        {/* STEP 1: FIRM & LICENCE */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step 1 of 4
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                Firm Name, Address &amp; Licence Number
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                  Firm Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  placeholder="Enter registered firm name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-900"
                />
                {errors.firmName && (
                  <p className="text-xs font-semibold text-rose-600 mt-1">{errors.firmName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                  Brand Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter brand name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                Firm Address <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={3}
                value={firmAddress}
                onChange={(e) => setFirmAddress(e.target.value)}
                placeholder="Enter complete firm address with city, state & pin code"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-900 resize-none"
              />
              {errors.firmAddress && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.firmAddress}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                  Licence Type
                </label>
                <select
                  value={licenceType}
                  onChange={(e) => setLicenceType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 outline-none text-sm text-slate-900 bg-white"
                >
                  <option value="FSSAI Lic No">FSSAI Licence</option>
                  <option value="FSSAI Reg No">FSSAI Registration</option>
                  <option value="ISO Certified">ISO Certification</option>
                  <option value="Trade / GST Lic">Trade / GST Licence</option>
                  <option value="Licence No">Other Licence</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                  Licence Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={licenceNumber}
                  onChange={(e) => setLicenceNumber(e.target.value)}
                  placeholder="e.g. 14-digit FSSAI / Lic No."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-900"
                />
                {errors.licenceNumber && (
                  <p className="text-xs font-semibold text-rose-600 mt-1">
                    {errors.licenceNumber}
                  </p>
                )}
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                  Valid Upto <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={licenceValidUpto}
                  onChange={(e) => setLicenceValidUpto(e.target.value)}
                  placeholder="e.g. 31-12-2030"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CONTACT & PRODUCT DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step 2 of 4
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                Mobile, Email &amp; Product Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                  Mobile Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter mobile / helpline number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-900"
                />
                {errors.mobile && (
                  <p className="text-xs font-semibold text-rose-600 mt-1">{errors.mobile}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter official email address"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-900"
                />
                {errors.email && (
                  <p className="text-xs font-semibold text-rose-600 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-3">
                Product Commercial Details (Displayed on Mobile Scan &amp; PDF)
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                    Product Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 outline-none text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                    Product ID / Barcode No.
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      placeholder="Product ID"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 outline-none text-sm text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setProductId(generateRandomId())}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0 cursor-pointer"
                      title="Generate new ID"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                    Pack Size / Net Quantity{" "}
                    <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={netQuantity}
                    onChange={(e) => setNetQuantity(e.target.value)}
                    placeholder="e.g. 500 ml, 250g, 1 Kg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 outline-none text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                    Product MRP <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    placeholder="e.g. 250 INR"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 outline-none text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PRODUCT IMAGE & OPTIONAL LOGO (AUTO COLOR EXTRACTION) */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step 3 of 4
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                Product Image &amp; Brand Logo (Auto-Color PDF)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FileUpload
                  label="Product Image"
                  required
                  hint="Upload photo of the product or packaging"
                  currentFile={productImageDataUrl}
                  onFileAccepted={(url) => {
                    setProductImageDataUrl(url);
                    setErrors((prev) => ({ ...prev, productImage: "" }));
                  }}
                  onRemove={() => setProductImageDataUrl(null)}
                />
                {errors.productImage && (
                  <p className="text-xs font-semibold text-rose-600 mt-1.5">
                    {errors.productImage}
                  </p>
                )}
              </div>

              <div>
                <FileUpload
                  label="Firm Logo (Optional)"
                  hint="Colors from your logo will automatically theme the PDF"
                  currentFile={logoDataUrl}
                  showColorExtraction
                  onColorsExtracted={(extracted) => setBrandColors(extracted)}
                  onFileAccepted={(url) => setLogoDataUrl(url)}
                  onRemove={() => {
                    setLogoDataUrl(null);
                    setBrandColors(DEFAULT_BRAND_COLORS);
                  }}
                />
              </div>
            </div>

            {/* PDF Color Palette Preview / Selector */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">
                    {logoDataUrl
                      ? "PDF Theme Colors Picked from Your Logo"
                      : "Select PDF Color Theme"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: brandColors.primary }}
                    title={`Primary: ${brandColors.primary}`}
                  />
                  <span
                    className="w-6 h-6 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: brandColors.secondary }}
                    title={`Secondary: ${brandColors.secondary}`}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {EXECUTIVE_COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setBrandColors(preset.colors)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      brandColors.primary === preset.colors.primary
                        ? "bg-white border-indigo-600 text-slate-900 shadow-2xs"
                        : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: preset.colors.primary }}
                    />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: INGREDIENTS & OPTIONAL QUALITY PARAMETERS */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step 4 of 4
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                Ingredients &amp; Finalize PDF
              </h2>
            </div>

            <IngredientsInput
              ingredients={ingredients}
              onChange={(list) => {
                setIngredients(list);
                if (list.length > 0) {
                  setErrors((prev) => ({ ...prev, ingredients: "" }));
                }
              }}
              error={errors.ingredients}
            />

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                Storage / Usage Instructions{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={storageInstructions}
                onChange={(e) => setStorageInstructions(e.target.value)}
                placeholder="e.g. Store in a cool and dry place"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 outline-none text-sm text-slate-900"
              />
            </div>

            {/* Optional Nutritional / Test Parameters */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Nutritional / Quality Table (Optional)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowLabTable(!showLabTable);
                    if (!showLabTable && labParameters.length === 0) {
                      setLabParameters([
                        { parameter: "Energy", unit: "Kcal / 100g", value: "" },
                        { parameter: "Total Fat", unit: "g / 100g", value: "" },
                        { parameter: "Protein", unit: "g / 100g", value: "" },
                      ]);
                    }
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  {showLabTable ? "Hide Table" : "+ Add Nutritional / Test Parameters"}
                </button>
              </div>

              {showLabTable && (
                <div className="mt-3 space-y-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  {labParameters.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Parameter (e.g. Energy)"
                        value={row.parameter}
                        onChange={(e) => updateLabRow(idx, "parameter", e.target.value)}
                        className="col-span-5 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Unit (e.g. 100g)"
                        value={row.unit}
                        onChange={(e) => updateLabRow(idx, "unit", e.target.value)}
                        className="col-span-3 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={row.value}
                        onChange={(e) => updateLabRow(idx, "value", e.target.value)}
                        className="col-span-3 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeLabRow(idx)}
                        className="col-span-1 flex justify-center text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addLabRow}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 pt-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer (Back / Next / Create) */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Create PDF &amp; Generate QR</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
