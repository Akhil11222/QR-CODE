# VeriPack QR — Digital Product Passport & PDF QR Generator

> Turn your firm & product details into an **official auto-branded PDF dossier with a scannable QR code** in 60 seconds.

![VeriPack QR](https://veripack-qr.vercel.app/og.png)

## 🚀 Live Demo

**[https://veripack-qr.vercel.app](https://veripack-qr.vercel.app)**

---

## ✨ Features

| Feature | Description |
|---|---|
| **4-Step Guided Wizard** | Firm Identity → Contact → Visual Assets → Composition |
| **Auto Brand Color Extraction** | Upload logo → Canvas k-means color extraction → PDF themed automatically |
| **Official A4 PDF Dossier** | jsPDF-generated, vector-text, print-ready with logo, product image, licence badge |
| **Scannable QR Code** | Any smartphone camera opens the PDF instantly (no app needed) |
| **Zero Backend / 100K+ Users** | All processing is client-side. QR payload encoded with LZ-String |
| **Mobile-First** | Fully responsive from 320px to 4K. Touch-friendly 44px+ targets |
| **PNG + SVG QR Export** | High-DPI exports for packaging and printing |

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + Vanilla CSS (glassmorphism design system)
- **PDF**: `jspdf` with dynamic RGB brand color theming
- **QR Code**: `qrcode` library (PNG + SVG output)
- **Compression**: `lz-string` (encodes all form data into QR URL)
- **Icons**: `lucide-react`
- **Fonts**: Inter + Plus Jakarta Sans (Google Fonts)

---

## 🎨 How the QR Works (Zero Backend Architecture)

```
User fills wizard → formData compressed with lz-string → QR URL = /view?v=<compressed>
                                                                         ↓
                                    Scanned QR → Opens /view?v=... → Decompresses → Renders PDF → Auto-Download
```

All form data (firm name, address, licence, contact, ingredients, brand colors, tiny image thumbnails) is compressed into the QR URL using `lz-string.compressToEncodedURIComponent`. No database needed. Works forever on Vercel.

---

## 📋 What's in the Generated PDF

1. ✅ Firm Name & Logo
2. ✅ Licence Number Badge (FSSAI / ISO / GST / Trade)
3. ✅ Registered Address
4. ✅ Mobile & Email
5. ✅ Product Image
6. ✅ Full Ingredients/Composition Table
7. ✅ Dynamic brand colors extracted from logo
8. ✅ Generation date & verification footer

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

---

## 🌐 Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect the GitHub repo to Vercel dashboard for automatic deployments on push.

**Environment Variables**: None required! This is a fully client-side application.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Main page (Hero + Wizard + Output)
│   ├── globals.css         # Design system CSS
│   └── view/
│       └── page.tsx        # QR scan landing page
├── components/
│   ├── HeroSection.tsx     # Landing hero with animated orbs
│   ├── WizardForm.tsx      # 4-step multi-step wizard
│   ├── OutputScreen.tsx    # PDF + QR download screen
│   ├── FileUpload.tsx      # Drag-and-drop with color extraction
│   └── IngredientsInput.tsx # Tag-based ingredient input
└── lib/
    ├── colorExtractor.ts   # Canvas k-means color extraction
    ├── pdfGenerator.ts     # jsPDF branded PDF builder
    ├── qrGenerator.ts      # QR code PNG/SVG generation
    ├── compression.ts      # LZ-String encode/decode
    └── imageUtils.ts       # Resize, thumbnail, file reading
```

---

## 📱 QR Code Scanning

When a smartphone scans the QR code:
1. Opens `/view?v=<compressed_payload>` on our Vercel deployment
2. Decodes the LZ-String payload in the browser
3. Reconstructs the full branded PDF client-side
4. Shows the product passport card with one-tap **Download PDF** button

**No backend calls. No database. Works for 100,000+ simultaneous scans.**

---

## 🔒 Security & Privacy

- All data is processed entirely in the browser
- No user data is ever stored on any server
- Product information is embedded in the QR URL itself (encrypted via LZ-String encoding)

---

*Built with ❤️ using VeriPack QR — The Official Digital Product Passport Platform*
