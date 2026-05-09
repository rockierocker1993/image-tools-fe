export const WEBSOCKET_EVENTS = {
  REMOVE_BACKGROUND_PROCESSING: 'remove-background:processing',
  REMOVE_BACKGROUND_COMPLETED: 'remove-background:completed',
  REMOVE_BACKGROUND_FAILED: 'remove-background:failed',

  UPSCALER_PROCESSING: 'upscaler:processing',
  UPSCALER_COMPLETED: 'upscaler:completed',
  UPSCALER_FAILED: 'upscaler:failed',
} as const;

export const JOB_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;
