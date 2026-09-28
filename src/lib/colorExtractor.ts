import { BrandColors, DEFAULT_BRAND_COLORS } from "@/types";

interface RGB {
  r: number;
  g: number;
  b: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, "0"))
      .join("")
  );
}

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 30, g: 41, b: 59 };
}

function colorDistance(a: RGB, b: RGB): number {
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) +
      Math.pow(a.g - b.g, 2) +
      Math.pow(a.b - b.b, 2)
  );
}

function kMeans(pixels: RGB[], k: number, iterations = 15): RGB[] {
  if (pixels.length === 0) return [];

  // Initialize centroids by picking evenly spaced pixels
  let centroids: RGB[] = [];
  const step = Math.floor(pixels.length / k);
  for (let i = 0; i < k; i++) {
    centroids.push({ ...pixels[i * step] });
  }

  for (let iter = 0; iter < iterations; iter++) {
    const clusters: RGB[][] = Array.from({ length: k }, () => []);

    // Assign each pixel to nearest centroid
    for (const px of pixels) {
      let minDist = Infinity;
      let minIdx = 0;
      for (let i = 0; i < k; i++) {
        const dist = colorDistance(px, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          minIdx = i;
        }
      }
      clusters[minIdx].push(px);
    }

    // Recompute centroids
    const newCentroids: RGB[] = centroids.map((c, i) => {
      if (clusters[i].length === 0) return c;
      const sum = clusters[i].reduce(
        (acc, px) => ({ r: acc.r + px.r, g: acc.g + px.g, b: acc.b + px.b }),
        { r: 0, g: 0, b: 0 }
      );
      return {
        r: sum.r / clusters[i].length,
        g: sum.g / clusters[i].length,
        b: sum.b / clusters[i].length,
      };
    });

    centroids = newCentroids;
  }

  return centroids;
}

function getLuminance(rgb: RGB): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
}

function isNearWhiteOrBlack(rgb: RGB, threshold = 30): boolean {
  const nearWhite =
    rgb.r > 255 - threshold && rgb.g > 255 - threshold && rgb.b > 255 - threshold;
  const nearBlack = rgb.r < threshold && rgb.g < threshold && rgb.b < threshold;
  return nearWhite || nearBlack;
}

function lightenColor(hex: string, amount = 0.85): string {
  const rgb = hexToRgb(hex);
  return rgbToHex(
    Math.round(rgb.r + (255 - rgb.r) * amount),
    Math.round(rgb.g + (255 - rgb.g) * amount),
    Math.round(rgb.b + (255 - rgb.b) * amount)
  );
}

function darkenColor(hex: string, amount = 0.2): string {
  const rgb = hexToRgb(hex);
  return rgbToHex(
    Math.round(rgb.r * (1 - amount)),
    Math.round(rgb.g * (1 - amount)),
    Math.round(rgb.b * (1 - amount))
  );
}

export async function extractBrandColors(imageDataUrl: string): Promise<BrandColors> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const SIZE = 80; // Downsample for speed
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(DEFAULT_BRAND_COLORS);
          return;
        }

        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
        const data = imageData.data;

        // Collect non-transparent pixels
        const pixels: RGB[] = [];
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 128) continue; // Skip transparent
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const rgb = { r, g, b };
          if (!isNearWhiteOrBlack(rgb, 20)) {
            pixels.push(rgb);
          }
        }

        if (pixels.length < 10) {
          resolve(DEFAULT_BRAND_COLORS);
          return;
        }

        // Sample for performance
        const sampled = pixels.filter((_, i) => i % 3 === 0);
        const clusters = kMeans(sampled, 3, 12);

        // Sort by luminance – darkest first as primary
        const sorted = [...clusters].sort(
          (a, b) => getLuminance(a) - getLuminance(b)
        );

        const primaryRgb = sorted[0];
        const primaryHex = rgbToHex(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        const secondaryHex = darkenColor(primaryHex, 0.15);
        const tintHex = lightenColor(primaryHex, 0.88);

        // Determine text color based on luminance
        const lum = getLuminance(primaryRgb);
        const textHex = lum > 0.35 ? "#1E293B" : "#FFFFFF";

        resolve({
          primary: primaryHex,
          secondary: secondaryHex,
          tint: tintHex,
          text: textHex,
        });
      } catch {
        resolve(DEFAULT_BRAND_COLORS);
      }
    };

    img.onerror = () => resolve(DEFAULT_BRAND_COLORS);
    img.src = imageDataUrl;
  });
}
