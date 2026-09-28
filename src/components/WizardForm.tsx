"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Building2, Phone, Image as ImageIcon, FlaskConical,
  ChevronRight, ChevronLeft, CheckCircle, AlertCircle,
  Sparkles
} from "lucide-react";
import { FormData, WizardStep, DEFAULT_BRAND_COLORS, BrandColors } from "@/types";
import { createTinyThumbnail } from "@/lib/imageUtils";
import FileUpload from "./FileUpload";
import IngredientsInput from "./IngredientsInput";

interface WizardFormProps {
  onComplete: (data: FormData) => void;
}

type StepErrors = Partial<Record<keyof FormData, string>>;

const STEPS = [
  { id: 1, title: "Firm Identity", icon: Building2, description: "Company & licence details" },
  { id: 2, title: "Contact Details", icon: Phone, description: "Mobile & email" },
  { id: 3, title: "Visual Assets", icon: ImageIcon, description: "Images & brand theming" },
  { id: 4, title: "Composition", icon: FlaskConical, description: "Product ingredients" },
];

function validateStep(step: WizardStep, data: FormData): StepErrors {
  const errors: StepErrors = {};

  if (step === 1) {
    if (!data.firmName.trim()) errors.firmName = "Firm name is required";
    else if (data.firmName.trim().length < 2) errors.firmName = "Firm name is too short";
    if (!data.firmAddress.trim()) errors.firmAddress = "Registered address is required";
    else if (data.firmAddress.trim().length < 10) errors.firmAddress = "Please enter a complete address";
    if (!data.licenceNumber.trim()) errors.licenceNumber = "Licence number is required";
  }

  if (step === 2) {
    if (!data.mobile.trim()) errors.mobile = "Mobile number is required";
    else if (!/^[+]?[\d\s\-().]{7,20}$/.test(data.mobile.trim()))
      errors.mobile = "Please enter a valid mobile number";
    if (!data.email.trim()) errors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      errors.email = "Please enter a valid email address";
  }

  if (step === 3) {
    if (!data.productImageDataUrl) errors.productImageDataUrl = "Product image is required";
  }

  if (step === 4) {
    if (data.ingredients.length === 0) errors.ingredients = "Please add at least one ingredient";
  }

  return errors;
}

export default function WizardForm({ onComplete }: WizardFormProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [errors, setErrors] = useState<StepErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [brandExtracted, setBrandExtracted] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firmName: "",
    firmAddress: "",
    licenceNumber: "",
    mobile: "",
    email: "",
    ingredients: [],
    productImageDataUrl: null,
    logoDataUrl: null,
    brandColors: DEFAULT_BRAND_COLORS,
  });

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const handleNext = useCallback(() => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
      setErrors({});
    }
  }, [currentStep, formData]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
      setErrors({});
    }
  }, [currentStep]);

  const handleComplete = useCallback(async () => {
    const stepErrors = validateStep(4, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsProcessing(true);
    try {
      // Create tiny thumbnails for QR URL embedding
      const finalData = { ...formData };

      if (formData.productImageDataUrl) {
        finalData.productImageDataUrl = await createTinyThumbnail(formData.productImageDataUrl, 80);
      }
      if (formData.logoDataUrl) {
        finalData.logoDataUrl = await createTinyThumbnail(formData.logoDataUrl, 60);
      }

      onComplete(finalData);
    } catch {
      setIsProcessing(false);
    }
  }, [formData, onComplete]);

  const handleColorsExtracted = useCallback((colors: BrandColors) => {
    updateField("brandColors", colors);
    setBrandExtracted(true);
  }, [updateField]);

  // Progress percentage
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      {/* Step Indicators */}
      <div style={{ marginBottom: 32 }}>
        {/* Progress Bar */}
        <div className="progress-bar-track" style={{ marginBottom: 20 }}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Step dots */}
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          {/* Connector line */}
          <div
            style={{
              position: "absolute",
              top: 15,
              left: 16,
              right: 16,
              height: 1,
              background: "rgba(255,255,255,0.06)",
            }}
          />
          {STEPS.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 1 }}
              >
                <div
                  className={`step-dot ${isActive ? "active" : isCompleted ? "completed" : "inactive"}`}
                >
                  {isCompleted ? <CheckCircle size={15} /> : <Icon size={14} />}
                </div>
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: isActive ? "#818cf8" : isCompleted ? "#10b981" : "var(--text-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="glass-card animate-slide-in" style={{ padding: "28px 28px 24px" }} key={currentStep}>
        {/* Step Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(99,102,241,0.3)",
              }}
            >
              {(() => {
                const Icon = STEPS[currentStep - 1].icon;
                return <Icon size={18} color="#818cf8" />;
              })()}
            </div>
            <div>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                Step {currentStep} of {STEPS.length}
              </p>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
                {STEPS[currentStep - 1].title}
              </h2>
            </div>
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            {STEPS[currentStep - 1].description}
          </p>
        </div>

        {/* ─── STEP 1: FIRM IDENTITY ─── */}
        {currentStep === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label className="label" htmlFor="firmName">
                Firm / Company Name <span style={{ color: "#f87171" }}>*</span>
              </label>
              <input
                id="firmName"
                className={`input-field ${errors.firmName ? "error" : ""}`}
                type="text"
                placeholder="e.g. Sunrise Foods Pvt. Ltd."
                value={formData.firmName}
                onChange={(e) => updateField("firmName", e.target.value)}
                maxLength={100}
                autoFocus
              />
              {errors.firmName && (
                <p className="error-text">
                  <AlertCircle size={12} />
                  {errors.firmName}
                </p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="firmAddress">
                Registered Address <span style={{ color: "#f87171" }}>*</span>
              </label>
              <textarea
                id="firmAddress"
                className={`input-field ${errors.firmAddress ? "error" : ""}`}
                placeholder="Full registered business address including city, state, PIN code..."
                value={formData.firmAddress}
                onChange={(e) => updateField("firmAddress", e.target.value)}
                rows={3}
                maxLength={300}
                style={{ resize: "vertical", minHeight: 90 }}
              />
              {errors.firmAddress && (
                <p className="error-text">
                  <AlertCircle size={12} />
                  {errors.firmAddress}
                </p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="licenceNumber">
                Licence / Registration Number <span style={{ color: "#f87171" }}>*</span>
              </label>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 8 }}>
                FSSAI, ISO, GST, Trade Licence, or any official registration number
              </p>
              <input
                id="licenceNumber"
                className={`input-field ${errors.licenceNumber ? "error" : ""}`}
                type="text"
                placeholder="e.g. FSSAI: 12345678901234"
                value={formData.licenceNumber}
                onChange={(e) => updateField("licenceNumber", e.target.value)}
                maxLength={80}
              />
              {errors.licenceNumber && (
                <p className="error-text">
                  <AlertCircle size={12} />
                  {errors.licenceNumber}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─── STEP 2: CONTACT DETAILS ─── */}
        {currentStep === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label className="label" htmlFor="mobile">
                Mobile Number <span style={{ color: "#f87171" }}>*</span>
              </label>
              <input
                id="mobile"
                className={`input-field ${errors.mobile ? "error" : ""}`}
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.mobile}
                onChange={(e) => updateField("mobile", e.target.value)}
                maxLength={25}
                autoFocus
              />
              {errors.mobile && (
                <p className="error-text">
                  <AlertCircle size={12} />
                  {errors.mobile}
                </p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="email">
                Email Address <span style={{ color: "#f87171" }}>*</span>
              </label>
              <input
                id="email"
                className={`input-field ${errors.email ? "error" : ""}`}
                type="email"
                placeholder="contact@yourfirm.com"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                maxLength={100}
              />
              {errors.email && (
                <p className="error-text">
                  <AlertCircle size={12} />
                  {errors.email}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─── STEP 3: VISUAL ASSETS ─── */}
        {currentStep === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <FileUpload
              label="Product Image"
              required
              hint="Primary image of your product (shown in the PDF dossier)"
              onFileAccepted={(url) => updateField("productImageDataUrl", url)}
              onRemove={() => updateField("productImageDataUrl", null)}
              currentFile={formData.productImageDataUrl}
            />
            {errors.productImageDataUrl && (
              <p className="error-text" style={{ marginTop: -16 }}>
                <AlertCircle size={12} />
                {errors.productImageDataUrl}
              </p>
            )}

            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                margin: "0 -4px",
              }}
            />

            <FileUpload
              label="Firm Logo (Optional)"
              hint="Upload your logo to auto-extract brand colors for your PDF theme"
              onFileAccepted={(url) => updateField("logoDataUrl", url)}
              onRemove={() => {
                updateField("logoDataUrl", null);
                updateField("brandColors", DEFAULT_BRAND_COLORS);
                setBrandExtracted(false);
              }}
              currentFile={formData.logoDataUrl}
              onColorsExtracted={handleColorsExtracted}
              showColorExtraction
            />

            {brandExtracted && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  background: "rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  borderRadius: 10,
                }}
              >
                <Sparkles size={16} color="#c084fc" />
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#c084fc" }}>
                    Brand colors extracted!
                  </p>
                  <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                    {[
                      formData.brandColors.primary,
                      formData.brandColors.secondary,
                      formData.brandColors.tint,
                    ].map((color, i) => (
                      <div
                        key={i}
                        title={color}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          background: color,
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      />
                    ))}
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "center" }}>
                      Your PDF will be themed with these colors
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 4: INGREDIENTS ─── */}
        {currentStep === 4 && (
          <IngredientsInput
            ingredients={formData.ingredients}
            onChange={(ingredients) => updateField("ingredients", ingredients)}
            error={errors.ingredients}
          />
        )}

        {/* Navigation Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 28,
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={handleBack}
            className="btn-secondary"
            style={{ visibility: currentStep === 1 ? "hidden" : "visible" }}
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {currentStep < 4 ? (
            <button type="button" onClick={handleNext} className="btn-primary">
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="btn-primary"
              disabled={isProcessing}
              style={{ background: isProcessing ? undefined : "linear-gradient(135deg, #10b981, #059669)" }}
            >
              {isProcessing ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Create Official PDF &amp; QR
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
