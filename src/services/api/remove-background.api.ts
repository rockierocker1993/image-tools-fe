import { apiClient } from '@/lib/axios';
import type { CreateJobRembgResponse } from '@/types/job.types';
import type { BaseResponse } from '@/types/baseResponse.types';


export const removeBackgroundApi = {
  createJob: async (image: File): Promise<BaseResponse<CreateJobRembgResponse>> => {
    const formData = new FormData();
    formData.append('file', image);
    const response = await apiClient.post<BaseResponse<CreateJobRembgResponse>>(
      `/job/create-job/rembg`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },
  warmingUp: async (): Promise<BaseResponse<string>> => {
    const response = await apiClient.get<BaseResponse<string>>(
      '/job/warming-up/rembg',
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  }
};
