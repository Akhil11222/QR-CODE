"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does VeriPack QR comply with FSSAI (Labelling and Display) Regulations, 2020?",
      a: "Under FSSAI mandate F. No. 1-94/FSSAI/SP(L&C/A)/2020, food business operators (FBOs) are encouraged to provide comprehensive product declarations digitally. VeriPack QR encodes your 14-digit FSSAI licence, registered manufacturer address, consumer helpline, complete ingredients breakdown, and nutritional parameters into an accessible Digital Product Passport that instantly opens upon scanning.",
    },
    {
      q: "Will this QR code scan instantaneously on all Android and iPhone devices without an app?",
      a: "Yes, 100%. The QR payload is compressed using advanced LZ-string encoding to keep the total URL length under 1600 characters (well below maximum smartphone camera limits). Any standard native camera app (iOS Camera, Google Lens, Samsung Camera) or UPI app scanner (Paytm, PhonePe) can read and launch the product passport instantly.",
    },
    {
      q: "How does the system support GS1 13-Digit GTIN barcodes and retail supply chains?",
      a: "VeriPack QR supports standard EAN-13 / GTIN barcodes (such as 8939137480046). In Step 2, you can enter your official GS1 registered GTIN or use our 1-click Auto-Generator to generate a valid 13-digit identification code compliant with GS1 Digital Link best practices.",
    },
    {
      q: "How does the automatic brand color palette extraction work from our firm logo?",
      a: "When you upload your company logo in Step 4, an HTML5 Canvas algorithm samples the logo pixels, executes a k-means clustering analysis, and extracts your Primary Brand Color, Secondary Accent, and Background Tint. These exact brand colors are automatically applied to the header band, table borders, and verification badge of your official PDF dossier.",
    },
    {
      q: "Can we include ISO 9001 and NABL accredited lab test certificates and nutritional tables?",
      a: "Yes. Step 5 features an optional Quality Test & Nutritional Profile section with 1-click presets for Dairy/Ghee purity tests (Milk Fat, Saturated Fat, Moisture, Baudouin Adulteration Test) and standard Nutritional Information tables. You can also customize, add, or remove parameter rows.",
    },
    {
      q: "Where is the data stored and will the QR code expire or stop working?",
      a: "VeriPack QR is built with a zero-bottleneck client-side stateless architecture. All essential product compliance data is encrypted directly into the URL payload. This means the QR code will NEVER expire and does not rely on a brittle third-party database server.",
    },
  ];

  return (
    <section id="faq" className="bg-white border-b border-slate-200 py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Regulatory &amp; Technical Clarifications
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Answers to common questions from FMCG manufacturers, dairy operators, and packaging managers.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIdx === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-emerald-700" : "text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
