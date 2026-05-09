export const APP_CONFIG = {
  MAX_FILE_SIZE_MB: 20,
  MAX_FILE_SIZE_BYTES: 20 * 1024 * 1024,
  ACCEPTED_IMAGE_TYPES: ['image/png', 'image/jpeg', 'image/webp'],
  ACCEPTED_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.webp'],
  UPLOAD_TIMEOUT_MS: 60000,
  WS_RECONNECT_ATTEMPTS: 5,
  WS_RECONNECT_DELAY_MS: 1000,
  API_TIMEOUT_MS: 30000,
  API_RETRY_ATTEMPTS: 3,
} as const;
