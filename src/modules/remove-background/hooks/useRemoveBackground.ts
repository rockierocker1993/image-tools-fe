'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { removeBackgroundApi } from '@/services/api/remove-background.api';
import { useUploadStore } from '@/store/upload.store';
import { validateImageFile, createImagePreviewUrl } from '@/utils/file.utils';

export const useRemoveBackground = () => {
  const { addItem, setItemRequestId, setStatus, setError } = useUploadStore();

  const mutation = useMutation({
    mutationFn: (file: File) => removeBackgroundApi.createJob(file),
    onMutate: (file) => {
      const previewUrl = createImagePreviewUrl(file);
      const itemId = addItem(previewUrl);
      setStatus('uploading');
      return { itemId };
    },
    onSuccess: (job, _variables, context) => {
      if (context?.itemId) {
        setItemRequestId(context.itemId, job.data?.image_id ?? null);
      }
      setStatus('success');
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error('Failed to remove background. Please try again.');
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
    mutation.mutate(file);
  };

  return {
    handleFileDrop,
    isPending: mutation.isPending,
  };
};
