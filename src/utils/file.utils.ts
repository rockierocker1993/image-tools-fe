import { APP_CONFIG } from '@/constants/config';

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!(APP_CONFIG.ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return { valid: false, error: 'Only PNG, JPG, and WEBP files are supported.' };
  }
  if (file.size > APP_CONFIG.MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size must be less than ${APP_CONFIG.MAX_FILE_SIZE_MB}MB.`,
    };
  }
  return { valid: true };
};

export const createImagePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const revokeImagePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() ?? '';
};
