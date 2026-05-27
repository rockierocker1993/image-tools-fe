import { apiClient } from '@/lib/axios';
import type { CreateJobRembgResponse, CreateJobUpscalerResponse, FaqResponse } from '@/types/job.types';
import type { BaseResponse } from '@/types/baseResponse.types';

const PATH = {
    CREATE_JOB_REMOVEBG: '/tools/job/create-job/rembg',
    WARMING_UP_REMOVEBG: '/tools/job/warming-up/rembg',
    CREATE_JOB_UPSCALER: '/tools/job/create-job/upscale',
    WARMING_UP_UPSCALER: '/tools/job/warming-up/upscale',
};

export const jobApi = {
    createJobRembg: async (image: File): Promise<BaseResponse<CreateJobRembgResponse>> => {
        const formData = new FormData();
        formData.append('file', image);
        const response = await apiClient.post<BaseResponse<CreateJobRembgResponse>>(
            PATH.CREATE_JOB_REMOVEBG,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    },
    warmingUpRembg: async (): Promise<BaseResponse<string>> => {
        const response = await apiClient.get<BaseResponse<string>>(
            PATH.WARMING_UP_REMOVEBG,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    },
    createJobUpscaler: async (image: File, scaleFactor: 2 | 4 = 2): Promise<BaseResponse<CreateJobUpscalerResponse>> => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('scale', String(scaleFactor));
        const response = await apiClient.post<BaseResponse<CreateJobUpscalerResponse>>(
            PATH.CREATE_JOB_UPSCALER,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    },
    warmingUpUpscaler: async (): Promise<BaseResponse<string>> => {
        const response = await apiClient.get<BaseResponse<string>>(
            PATH.WARMING_UP_UPSCALER,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    }
};
