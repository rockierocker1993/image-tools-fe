'use client';

import { removeBackgroundApi } from '@/services/api/remove-background.api';
import { upscalerApi } from '@/services/api/upscaler.api';
import { useMutation } from '@tanstack/react-query';

export const useWarmingUp = () => {
    const warmingUpRemoveBackground = useMutation({
        mutationFn: () => removeBackgroundApi.warmingUp(),
        onSuccess: (data) => {
            console.log('Warming up successful:', data);
        },
        onError: (err) => {
            console.error('Warming up error:', err);
        },
    });
    const warmingUpUpscaler = useMutation({
        mutationFn: () => upscalerApi.warmingUp(),
        onSuccess: (data) => {
            console.log('Warming up successful:', data);
        },
        onError: (err) => {
            console.error('Warming up error:', err);
        },
    });

    return {
        warmingUpRemoveBackground: warmingUpRemoveBackground.mutate,
        warmingUpUpscaler: warmingUpUpscaler.mutate,
        warmingUpAll: () => {
            warmingUpRemoveBackground.mutate();
            warmingUpUpscaler.mutate();
        }
    };
};
