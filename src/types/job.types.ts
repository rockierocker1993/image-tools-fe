
export interface CreateJobRembgResponse {
  image_id: string | null;
}

//unused file, will be used in the future when we implement job management features
import type { JOB_STATUS } from '@/constants/events';

export type JobStatus = keyof typeof JOB_STATUS;

export interface Job {
  id: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface RemoveBackgroundJob extends Job {
  type: 'remove-background';
  inputImageUrl: string;
  resultImageUrl?: string;
  thumbnailUrl?: string;
}

export interface UpscalerJob extends Job {
  type: 'upscaler';
  inputImageUrl: string;
  resultImageUrl?: string;
  scaleFactor: 2 | 4;
  originalWidth?: number;
  originalHeight?: number;
  resultWidth?: number;
  resultHeight?: number;
}

export interface CreateRemoveBackgroundJobRequest {
  image: File;
}

export interface CreateUpscalerJobRequest {
  image: File;
  scaleFactor: 2 | 4;
}

export interface WebSocketJobEvent {
  jobId: string;
  status: JobStatus;
  resultImageUrl?: string;
  errorMessage?: string;
  progress?: number;
}
