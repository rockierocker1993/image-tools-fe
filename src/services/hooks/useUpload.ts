'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { useUploadStore } from '@/services/store/upload.store';
import { validateImageFile, createImagePreviewUrl } from '@/utils/file.utils';

interface UseUploadOptions {
  onUpload: (file: File) => Promise<string>;
}

export const useUpload = ({ onUpload }: UseUploadOptions) => {
  const { addItem, setItemRequestId, setStatus, setError, reset } = useUploadStore();

  const handleFileSelect = useCallback(
    async (file: File) => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }

      const previewUrl = createImagePreviewUrl(file);
      const itemId = addItem(previewUrl);
      setStatus('uploading');

      try {
        const jobId = await onUpload(file);
        setItemRequestId(itemId, jobId);
        setStatus('success');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed.';
        setError(message);
        toast.error(message);
      }
    },
    [onUpload, addItem, setItemRequestId, setStatus, setError]
  );

  const handleDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  return { handleFileSelect, handleDrop, reset };
};

