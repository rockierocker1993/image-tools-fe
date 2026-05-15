import { apiClient } from '@/lib/axios';
import type { FaqResponse } from '@/types/job.types';
import type { BaseResponse } from '@/types/baseResponse.types';

export const faqApi = {
    faq: async (category: string): Promise<BaseResponse<FaqResponse[]>> => {
        const response = await apiClient.get<BaseResponse<FaqResponse[]>>(`/faq/category/${category}`);
        return response.data;
    },
};