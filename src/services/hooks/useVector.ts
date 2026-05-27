'use client';

import { svgVectorApi } from '@/services/api/tools/svgvector.api';
import { useVectorStore } from '@/services/store/vector.store';
import { createImagePreviewUrl, validateImageFile } from '@/utils/file.utils';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useVector = () => {
    const vectorStore = useVectorStore();
    const traceVector = useMutation({
        mutationFn: (file: File) => svgVectorApi.trace(file),
        onMutate: (file) => {
            const previewUrl = createImagePreviewUrl(file);
            const itemId = vectorStore.addItem(previewUrl);
            vectorStore.setStatus('uploading');
            return { itemId };
        },
        onSuccess: (response, _variables, context) => {
            if (context?.itemId) {
                vectorStore.setItemRequestId(
                    context.itemId,
                    response.data?.image_id ?? null,
                    response.data?.svg ?? null,
                    response.data?.regions ?? null,
                );
            }
            vectorStore.setStatus('success');
        },
        onError: (error: Error) => {
            vectorStore.setError(error.message);
            toast.error('Failed to trace vector.');
        },
    });

    const handleFileDrop = (files: File[]) => {
        const file = files[0];
        if (!file) return;
        const validation = validateImageFile(file);
        if (!validation.valid) {
            toast.error(validation.error);
            return;
        }
        traceVector.mutate(file);
    };

    return {
        traceVector: traceVector.mutate,
        handleFileDrop,
        isPending: traceVector.isPending,
    };
};