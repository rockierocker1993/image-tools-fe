'use client';

import { jobApi } from '@/services/api/job.api';
import { useRembgStore, useUpscalerStore } from '@/services/store/upload.store';
import { createImagePreviewUrl, validateImageFile } from '@/utils/file.utils';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useJob = () => {
    const rembgStore = useRembgStore();
    const upscalerStore = useUpscalerStore();
    const createJobRembg = useMutation({
        mutationFn: (file: File) => jobApi.createJobRembg(file),
        onMutate: (file) => {
            const previewUrl = createImagePreviewUrl(file);
            const itemId = rembgStore.addItem(previewUrl);
            rembgStore.setStatus('uploading');
            return { itemId };
        },
        onSuccess: (job, _variables, context) => {
            if (context?.itemId) {
                rembgStore.setItemRequestId(context.itemId, job.data?.image_id ?? null);
            }
            rembgStore.setStatus('success');
        },
        onError: (error: Error) => {
            rembgStore.setError(error.message);
            toast.error('Failed to remove background. Please try again.');
        },
    });

    const warmingUpRembg = useMutation({
        mutationFn: () => jobApi.warmingUpRembg(),
        onSuccess: (data) => {
            console.log('Warming up successful:', data);
        },
        onError: (err) => {
            console.error('Warming up error:', err);
        },
    });

    const createJobUpscaler = useMutation({
        mutationFn: (file: File) => jobApi.createJobUpscaler(file),
        onMutate: (file) => {
            const previewUrl = createImagePreviewUrl(file);
            const itemId = upscalerStore.addItem(previewUrl);
            upscalerStore.setStatus('uploading');
            return { itemId };
        },
        onSuccess: (job, _variables, context) => {
            if (context?.itemId) {
                upscalerStore.setItemRequestId(context.itemId, job.data?.image_id ?? null);
            }
            upscalerStore.setStatus('success');
        },
        onError: (error: Error) => {
            upscalerStore.setError(error.message);
            toast.error('Failed to upscale image. Please try again.');
        },
    });


    const warmingUpUpscaler = useMutation({
        mutationFn: () => jobApi.warmingUpUpscaler(),
        onSuccess: (data) => {
            console.log('Warming up successful:', data);
        },
        onError: (err) => {
            console.error('Warming up error:', err);
        },
    });

    const handleFileDropRembg = (files: File[]) => {
        const file = files[0];
        if (!file) return;
        const validation = validateImageFile(file);
        if (!validation.valid) {
            toast.error(validation.error);
            return;
        }
        createJobRembg.mutate(file);
    };

    const handleFileDropUpscaler = (files: File[]) => {
        const file = files[0];
        if (!file) return;
        const validation = validateImageFile(file);
        if (!validation.valid) {
            toast.error(validation.error);
            return;
        }
        createJobUpscaler.mutate(file);
    };

    return {
        createJobRembg: createJobRembg.mutate,
        createJobUpscaler: createJobUpscaler.mutate,
        handleFileDropRembg,
        handleFileDropUpscaler,
        isPendingRembg: createJobRembg.isPending,
        isPendingUpscaler: createJobUpscaler.isPending,
        warmingUpRembg: warmingUpRembg.mutate,
        warmingUpUpscaler: warmingUpUpscaler.mutate,
        warmingUpAll: () => {
            warmingUpRembg.mutate();
            warmingUpUpscaler.mutate();
        }
    };
};