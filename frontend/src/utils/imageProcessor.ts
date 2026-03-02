const MAX_RAW_SIZE = 5 * 1024 * 1024; // 5MB
const OUTPUT_SIZE = 600;
const JPEG_QUALITY = 0.85;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface ProcessedImage {
  bytes: Uint8Array<ArrayBuffer>;
  previewUrl: string;
  name: string;
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, and WebP images are supported";
  }
  if (file.size > MAX_RAW_SIZE) {
    return "Image must be under 5MB";
  }
  return null;
}

export async function processImage(file: File): Promise<ProcessedImage> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d")!;

  // Center-crop to square
  const size = Math.min(img.width, img.height);
  const sx = (img.width - size) / 2;
  const sy = (img.height - size) / 2;
  ctx.drawImage(img, sx, sy, size, size, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to export image"))),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });

  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const previewUrl = URL.createObjectURL(blob);

  // Strip extension for display name
  const name = file.name.replace(/\.[^.]+$/, "").slice(0, 50);

  return { bytes, previewUrl, name };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });
}
