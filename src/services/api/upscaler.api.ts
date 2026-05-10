import { apiClient } from '@/lib/axios';
import { BaseResponse } from '@/types/baseResponse.types';
import type { CreateJobUpscalerResponse } from '@/types/job.types';

export const upscalerApi = {
  createJob: async (image: File, scaleFactor: 2 | 4 = 2): Promise<BaseResponse<CreateJobUpscalerResponse>> => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('scale', String(scaleFactor));
    const response = await apiClient.post<BaseResponse<CreateJobUpscalerResponse>>(
      '/job/create-job/upscale',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },
  warmingUp: async (): Promise<BaseResponse<string>> => {
    const response = await apiClient.get<BaseResponse<string>>(
      '/job/warming-up/upscale',
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  }
};
