const PUBLIC_IMAGE_ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
]);

const PUBLIC_IMAGE_ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

const PUBLIC_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

const hasAllowedExtension = (fileName: string): boolean => {
  const lowerName = fileName.toLowerCase();
  return PUBLIC_IMAGE_ALLOWED_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
};

export const validatePublicImageFile = (file: File): void => {
  const hasValidMimeType = PUBLIC_IMAGE_ALLOWED_MIME_TYPES.has(file.type);
  const hasValidExtension = hasAllowedExtension(file.name);

  if (!hasValidMimeType && !hasValidExtension) {
    throw new Error("storage.upload.error.invalidFormat");
  }

  if (file.size > PUBLIC_IMAGE_MAX_SIZE_BYTES) {
    throw new Error("storage.upload.error.fileTooLarge");
  }
};

export { PUBLIC_IMAGE_ALLOWED_EXTENSIONS, PUBLIC_IMAGE_ALLOWED_MIME_TYPES, PUBLIC_IMAGE_MAX_SIZE_BYTES };
