/**
 * Resize an image data URL to specified max dimensions
 * Returns a new data URL with the resized image
 */
export function resizeImageDataUrl(
  dataUrl: string,
  maxWidth: number,
  maxHeight: number,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Create a tiny thumbnail (very small) for URL embedding in QR code payload
 * Keeps file size tiny for URL compressibility
 */
export function createTinyThumbnail(
  dataUrl: string,
  size = 60
): Promise<string> {
  return resizeImageDataUrl(dataUrl, size, size, 0.5);
}

/**
 * Read a File as a data URL
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file type and size
 */
export function validateImageFile(
  file: File,
  maxSizeMb = 10
): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Please upload a JPG, PNG, WEBP, or GIF image." };
  }
  if (file.size > maxSizeMb * 1024 * 1024) {
    return { valid: false, error: `Image must be under ${maxSizeMb}MB.` };
  }
  return { valid: true };
}
