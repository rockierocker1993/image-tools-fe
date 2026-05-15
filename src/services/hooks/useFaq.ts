'use client';

import { faqApi } from '@/services/api/faq.api';
import { useFaqStore } from '@/services/store/faq.store';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const CATEGORY = {
    REMBG: 'REMBG',
    UPSCALER: 'UPSCALE',
} as const;

export const useFaq = () => {
    const { setFaqsRembg, setFaqsUpscale } = useFaqStore();
    const getFaqRembg = useMutation({
        mutationFn: () => faqApi.faq(CATEGORY.REMBG),
        onSuccess: (response) => {
            setFaqsRembg(response.data ?? []);
        },
        onError: (error: Error) => {
            console.error('Failed to fetch FAQ:', error);
            toast.error('Failed to fetch FAQ. Please try again.');
        },
    });

    const getFaqUpscaler = useMutation({
        mutationFn: () => faqApi.faq(CATEGORY.UPSCALER),
        onSuccess: (response) => {
            setFaqsUpscale(response.data ?? []);
        },
        onError: (error: Error) => {
            console.error('Failed to fetch FAQ:', error);
            toast.error('Failed to fetch FAQ. Please try again.');
        },
    });

    return {
        getFaqRembg: getFaqRembg.mutate,
        getFaqUpscaler: getFaqUpscaler.mutate,
    };
}