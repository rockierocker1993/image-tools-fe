
export interface CreateJobRembgResponse {
  image_id: string | null;
}

export interface CreateJobUpscalerResponse {
  image_id: string | null;
}

export interface FaqResponse {
  question: string | null;
  answer: string | null;
}

export interface TraceSvgRegion {
  id: string;
  color: string;
  element_ids: string[];
  neighbors: string[];
}

export interface TraceSvgResponse {
  image_id: string | null;
  svg: string | null;
  regions: TraceSvgRegion[] | null;
}

export interface WebSocketJobEvent {
  requestId: string;
  status: boolean;
  webpUrl?: string;
  module?: string;
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



export interface CreateRemoveBackgroundJobRequest {
  image: File;
}

export interface CreateUpscalerJobRequest {
  image: File;
  scaleFactor: 2 | 4;
}