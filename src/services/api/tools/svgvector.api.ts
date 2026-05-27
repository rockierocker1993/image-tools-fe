import { apiClient } from '@/lib/axios';
import type { TraceSvgResponse } from '@/types/job.types';
import type { BaseResponse } from '@/types/baseResponse.types';

const PATH = {
    TRACE: '/tools/svg-vector/trace',
};

export const svgVectorApi = {
    trace: async (image: File): Promise<BaseResponse<TraceSvgResponse>> => {
        const formData = new FormData();
        formData.append('file', image);
        const response = await apiClient.post<BaseResponse<TraceSvgResponse>>(
            PATH.TRACE,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    }
};
