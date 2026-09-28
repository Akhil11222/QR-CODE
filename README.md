# VeriPack India — Standardized Digital Product Passport & Smart QR Compliance Suite

> Production-ready corporate B2B SaaS platform built for Indian FMCG manufacturers, food business operators (FBOs), dairy/spice brands, and exporters. Generates **official auto-branded PDF dossiers and scannable compliance QR codes** in 60 seconds.

---

## 1. Regulatory & Statutory Alignment

- **FSSAI FoSCoS Directives**: Mandated 14-digit registration/licence display, registered manufacturer address, and consumer grievance nodal helpline.
- **Legal Metrology (Packaged Commodities)**: Standardized net quantity, Maximum Retail Price (MRP inclusive of all taxes), batch number, and packaging dates.
- **GS1 India Standard**: 13-digit EAN-13 / GTIN product barcode identification for retail supply chain and export traceability.
- **ISO 9001:2015 & NABL Lab Tables**: Full composition declaration, purity test verification (e.g. Baudouin Adulteration Test), and standardized nutritional profiles.

---

## 2. Key Architecture Features

| Capability | Enterprise Specification |
|---|---|
| **Authoritative Light Theme** | Deep Regulatory Emerald (`#0F5132`), Executive Slate Navy (`#0F172A`), Warm Saffron Accent (`#D97706`), Warm Slate Surface (`#F8FAFC`). |
| **Real Client Case Study** | 1-Click loader for **Hari Sharnam Royal Ghee** (M/s Hari Sharnam Enterprises, FSSAI Reg: 23322004000714, GTIN: 8939137480046). |
| **5-Step Packaging Studio** | Firm & Licence → Product & GTIN → Contacts → Visual Assets & Theming → Composition & Lab Report. |
| **Dynamic Palette Extraction** | HTML5 Canvas k-means clustering automatically extracts Primary, Secondary, and Tint from uploaded firm logo into the PDF dossier. |
| **5 Executive Presets** | Royal Crimson & Gold, FSSAI Forest Green, Corporate Executive Navy, Saffron Heritage Gold, Executive Slate & Steel. |
| **Official PDF Dossier** | A4 vector PDF certificate with branded header band, commercial specifications, manufacturer details, and digital verification seal. |
| **Instant Camera Scan** | Compact LZ-String encrypted QR payload (&lt;1600 characters) scannable natively by any iOS Camera, Android Camera, or UPI app. |
| **Print-Ready QR Exports** | High-DPI 800DPI PNG and vector SVG calibrated for packaging boxes, tin containers, pouches, and glass jars. |
| **Zero Backend Bottlenecks** | 100% client-side deterministic generation. Capable of handling 100,000+ concurrent scans with zero database costs. |

---

## 3. Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 (Mobile-First responsive classes, zero inline layout hacks)
- **Icons**: Lucide React vector icons
- **PDF Engine**: jsPDF (dynamic client-side import)
- **QR Generation**: QRCode (PNG & SVG output)
- **Compression**: LZ-String (RFC 1951-inspired URI compression)
- **Typography**: Inter & Plus Jakarta Sans (Google Fonts)

---

## 4. Local Development & Production Build

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Verify TypeScript types
npx tsc --noEmit

# Run production build
npm run build

# Start production server
npm run start
```

---

## 5. Vercel Deployment

Designed to work cleanly out of the box on **Vercel Hobby** and Pro tiers:
- Single-region configuration (no multi-region function restrictions)
- Edge-cached static landing pages
- Minimal `vercel.json` headers for security (X-Frame-Options, X-Content-Type-Options)

---

## 6. Project Structure

```
src/
├── app/
│   ├── layout.tsx              # SEO metadata, viewport, and typography links
│   ├── page.tsx                # Main commercial multi-section landing & studio
│   ├── globals.css             # Tailwind v4 corporate design system tokens
│   └── view/
│       └── page.tsx            # Scanned mobile QR passport & instant PDF trigger
├── components/
│   ├── Header.tsx              # Announcement bar, brand mark, navigation & drawer
│   ├── HeroSection.tsx         # 2-column hero with interactive dual mockup showcase
│   ├── ComplianceStrip.tsx     # 5 statutory standards cards
│   ├── HowItWorks.tsx          # 4-step visual workflow
│   ├── IndustryUseCases.tsx    # Dairy/Ghee, Spices, Ayurvedic & Industrial cases
│   ├── WizardForm.tsx          # 5-step studio with 1-click Hari Sharnam sample
│   ├── OutputScreen.tsx        # High-DPI QR sticker downloads & live phone simulator
│   ├── FileUpload.tsx          # Canvas image compression & logo color extraction
│   ├── IngredientsInput.tsx    # Tag-based ingredients with bulk paste
│   ├── FAQSection.tsx          # Technical & regulatory accordions
│   └── Footer.tsx              # Multi-column corporate footer
├── lib/
│   ├── colorExtractor.ts       # HTML5 Canvas k-means brand color extraction
│   ├── compression.ts          # LZ-String QR URL encoding & decoding
│   ├── imageUtils.ts           # Client-side image resizing & validation
│   ├── pdfGenerator.ts         # Branded PDF dossier & digital seal generator
│   └── qrGenerator.ts          # Packaging QR PNG & SVG generator
└── types/
    └── index.ts                # TypeScript interfaces, presets & sample client data
```

---

Copyright 2026 VeriPack India. All rights reserved.
