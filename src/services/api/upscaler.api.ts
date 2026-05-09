import { apiClient } from '@/lib/axios';
import type { UpscalerJob } from '@/types/job.types';
import type { PaginatedResponse } from '@/types/api.types';

export const upscalerApi = {
  createJob: async (image: File, scaleFactor: 2 | 4 = 2): Promise<UpscalerJob> => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('scaleFactor', String(scaleFactor));
    const response = await apiClient.post<UpscalerJob>(
      '/upscaler/jobs',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  getJob: async (jobId: string): Promise<UpscalerJob> => {
    const response = await apiClient.get<UpscalerJob>(`/upscaler/jobs/${jobId}`);
    return response.data;
  },

  getJobs: async (page = 1, limit = 20): Promise<PaginatedResponse<UpscalerJob>> => {
    const response = await apiClient.get<PaginatedResponse<UpscalerJob>>(
      '/upscaler/jobs',
      { params: { page, limit } }
    );
    return response.data;
  },

  deleteJob: async (jobId: string): Promise<void> => {
    await apiClient.delete(`/upscaler/jobs/${jobId}`);
  },
};
